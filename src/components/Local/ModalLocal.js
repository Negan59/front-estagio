import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FiSave, FiX } from 'react-icons/fi';
import InputMask from 'react-input-mask';

const ModalLocal = ({ local, onSubmit, onClose }) => {
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [telefoneErro, setTelefoneErro] = useState(false);
  const [cepErro, setCepErro] = useState(false);
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (local) {
      setId(local.id);
      setNome(local.nome);
      setEndereco(local.endereco);
      setTelefone(local.telefone);
      setBairro(local.bairro);
      setCep(local.cep);
    }
  }, [local]);

  const validateTelefone = (value) => {
    const telefoneDigits = value.replace(/\D/g, ''); // Remover caracteres não numéricos
    const telefoneLength = telefoneDigits.length;

    // No Brasil, os números de telefone fixo têm 10 dígitos e os celulares têm 11 dígitos
    return telefoneLength === 12 || telefoneLength === 13;
  };

  const validateCep = (value) => {
    const cepRegex = /^\d{5}-\d{3}$/;
    return cepRegex.test(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErros({}); // Limpa os erros antes de validar novamente

    const novosErros = {};

    if (nome === '') {
      novosErros.nome = 'Campo obrigatório';
    }

    if (endereco === '') {
      novosErros.endereco = 'Campo obrigatório';
    }

    if (!validateTelefone(telefone)) {
      novosErros.telefone = 'Telefone inválido';
    }

    if (!validateCep(cep)) {
      novosErros.cep = 'CEP inválido';
    }

    if (bairro === '') {
      novosErros.bairro = 'Campo obrigatório';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    let data = {
      nome: nome,
      endereco: endereco,
      telefone: telefone,
      bairro: bairro,
      cep: cep,
    };

    if (id) {
      data.id = id;

      axios
        .put(`https://estagio-guilherme.azurewebsites.net/api/local`, data)
        .then((response) => {
          console.log('Dados atualizados com sucesso:', response.data);
          onSubmit(response.data);
          setId('');
          setNome('');
          setEndereco('');
          setTelefone('');
          setBairro('');
          setCep('');
          setErros({});
          onClose();
        })
        .catch((error) => {
          console.error('Erro ao atualizar os dados:', error);
          setErros({ erroGeral: 'Erro ao atualizar o local. Por favor, tente novamente.' });
        });
    } else {
      axios
        .post('https://estagio-guilherme.azurewebsites.net/api/local', data)
        .then((response) => {
          console.log(response.data, response.data.status);
          if (response.data.status === 200) {
            setId('');
            setNome('');
            setEndereco('');
            setTelefone('');
            setBairro('');
            setCep('');
            setErros({});
            onClose();
          } else {
            setErros({ erroGeral: 'Erro ao adicionar o local. Por favor, tente novamente.' });
          }
        })
        .catch((error) => {
          console.error(error);
          setErros({ erroGeral: 'Erro ao adicionar o local. Por favor, tente novamente.' });
        });
    }
  };

  const handleModalClose = () => {
    setErros({});
    onClose();
  };

  return (
    <Modal show={true} onHide={handleModalClose} centered dialogClassName="transparent-modal">
      <Modal.Header closeButton>
        <Modal.Title>{id ? 'Editar Local' : 'Inserir Local'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {erros.erroGeral && <Alert variant="danger">{erros.erroGeral}</Alert>}
        <Form onSubmit={handleSubmit} className="local-form">
          <Form.Group controlId="formNome">
            <Form.Label>Nome:</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              isInvalid={!!erros.nome}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.nome}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formEndereco">
            <Form.Label>Endereço:</Form.Label>
            <Form.Control
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              isInvalid={!!erros.endereco}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.endereco}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formTelefone">
            <Form.Label>Telefone:</Form.Label>
            <PhoneInput
              defaultCountry="BR"
              placeholder="Insira o número de telefone"
              value={telefone}
              onChange={setTelefone}
              onBlur={() => setTelefoneErro(!validateTelefone(telefone))}
              isInvalid={!!erros.telefone || (telefoneErro && telefone !== '')}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.telefone}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formBairro">
            <Form.Label>Bairro:</Form.Label>
            <Form.Control
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              isInvalid={!!erros.bairro}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.bairro}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formCep">
            <Form.Label>CEP:</Form.Label>
            <Form.Control
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={() => setCepErro(!validateCep(cep))}
              isInvalid={!!erros.cep || (cepErro && cep !== '')}
              required
              placeholder="12345-678"
            />
            <Form.Control.Feedback type="invalid">{erros.cep}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" type="submit" onClick={handleSubmit}>
          <FiSave /> {id ? 'Atualizar' : 'Salvar'}
        </Button>
        <Button variant="danger" onClick={handleModalClose}>
          <FiX /> Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalLocal;
