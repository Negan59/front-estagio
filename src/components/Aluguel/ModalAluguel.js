import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FiSave, FiX } from 'react-icons/fi';

const ModalAluguel = ({ aluguel, onSubmit, onClose }) => {
  const [id, setId] = useState('');
  const [nomeAluguel, setNomeAluguel] = useState('');
  const [documento, setDocumento] = useState('');
  const [valor, setValor] = useState(0);
  const [valorAdicional, setValorAdicional] = useState(0);
  const [data, setData] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erros, setErros] = useState({});
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (aluguel) {
      setId(aluguel.id);
      setNomeAluguel(aluguel.nomeAluguel);
      setDocumento(aluguel.documento);
      setValor(aluguel.valor);
      setValorAdicional(aluguel.valorAdicional);
      setData(aluguel.data);
      setTelefone(aluguel.telefone);
    }
  }, [aluguel]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErros({}); // Limpa os erros antes de validar novamente

    const novosErros = {};

    if (nomeAluguel === '') {
      novosErros.nomeAluguel = 'Campo obrigatório';
    }

    if (documento === '') {
      novosErros.documento = 'Campo obrigatório';
    }

    if (valor <= 0) {
      novosErros.valor = 'Valor deve ser maior que zero';
    }

    if (valorAdicional < 0) {
      novosErros.valorAdicional = 'Valor adicional não pode ser negativo';
    }

    if (data === '') {
      novosErros.data = 'Campo obrigatório';
    }

    if (telefone === '') {
      novosErros.telefone = 'Campo obrigatório';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    let aluguelData = {
      nomealuguel: nomeAluguel,
      documento: documento,
      valor: valor,
      valoradicional: valorAdicional,
      data: data,
      telefone: telefone,
    };

    if (id) {
      aluguelData.id = id;

      axios
        .put(`https://estagio-guilherme.azurewebsites.net/api/aluguel`, aluguelData)
        .then((response) => {
          console.log('Dados atualizados com sucesso:', response.data);
          onSubmit(response.data);
          setId('');
          setNomeAluguel('');
          setDocumento('');
          setValor(0);
          setValorAdicional(0);
          setData('');
          setTelefone('');
          setErros({});
          onClose();
        })
        .catch((error) => {
          console.error('Erro ao atualizar os dados:', error);
          setErros({ erroGeral: 'Erro ao atualizar o aluguel. Por favor, tente novamente.' });
        });
    } else {
      axios
        .post('https://estagio-guilherme.azurewebsites.net/api/aluguel', aluguelData)
        .then((response) => {
          console.log(response.data, response.data.status);
          if (response.data.status === 200) {
            setId('');
            setNomeAluguel('');
            setDocumento('');
            setValor(0);
            setValorAdicional(0);
            setData('');
            setTelefone('');
            setErros({});
            onClose();
          } else {
            setErros({ erroGeral: 'Erro ao adicionar o aluguel. Por favor, tente novamente.' });
          }
        })
        .catch((error) => {
          console.error(error);
          setErros({ erroGeral: 'Erro ao adicionar o aluguel. Por favor, tente novamente.' });
        });
    }
  };

  const handleModalClose = () => {
    setErros({});
    setShow(false);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{id ? 'Editar Aluguel' : 'Inserir Aluguel'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {erros.erroGeral && <Alert variant="danger">{erros.erroGeral}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNomeAluguel">
            <Form.Label>Nome do Aluguel:</Form.Label>
            <Form.Control
              type="text"
              value={nomeAluguel}
              onChange={(e) => setNomeAluguel(e.target.value)}
              isInvalid={!!erros.nomeAluguel}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.nomeAluguel}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formDocumento">
            <Form.Label>Documento:</Form.Label>
            <Form.Control
              type="text"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              isInvalid={!!erros.documento}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.documento}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formValor">
            <Form.Label>Valor:</Form.Label>
            <Form.Control
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              isInvalid={!!erros.valor}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.valor}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formValorAdicional">
            <Form.Label>Valor Adicional:</Form.Label>
            <Form.Control
              type="number"
              value={valorAdicional}
              onChange={(e) => setValorAdicional(e.target.value)}
              isInvalid={!!erros.valorAdicional}
            />
            <Form.Control.Feedback type="invalid">{erros.valorAdicional}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formData">
            <Form.Label>Data:</Form.Label>
            <Form.Control
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              isInvalid={!!erros.data}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.data}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formTelefone">
            <Form.Label>Telefone:</Form.Label>
            <Form.Control
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              isInvalid={!!erros.telefone}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.telefone}</Form.Control.Feedback>
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

export default ModalAluguel;
