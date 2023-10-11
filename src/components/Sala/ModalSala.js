import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FiSave, FiX } from 'react-icons/fi';

const ModalSala = ({ sala, onSubmit, onClose }) => {
  const [id, setId] = useState('');
  const [numeroSala, setNumeroSala] = useState(1);
  const [descricaoSala, setDescricaoSala] = useState('');
  const [erros, setErros] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sala) {
      setId(sala.id);
      setNumeroSala(sala.numerosala);
      setDescricaoSala(sala.descricaosala);
    }
    setShow(true);
  }, [sala]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErros({}); // Limpa os erros antes de validar novamente

    const novosErros = {};

    if (numeroSala === '') {
      novosErros.numeroSala = 'Campo obrigatório';
    }

    if (descricaoSala === '') {
      novosErros.descricaoSala = 'Campo obrigatório';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    let data = {
      numerosala: numeroSala,
      descricaosala: descricaoSala,
    };

    if (id) {
      data.id = id;

      axios
        .put(`https://estagio-guilherme.azurewebsites.net/api/sala`, data)
        .then((response) => {
          console.log('Dados atualizados com sucesso:', response.data);
          onSubmit(response.data);
          setId('');
          setNumeroSala('');
          setDescricaoSala('');
          setErros({});
          onClose();
        })
        .catch((error) => {
          console.error('Erro ao atualizar os dados:', error);
          setErros({ erroGeral: 'Erro ao atualizar a sala. Por favor, tente novamente.' });
        });
    } else {
      axios
        .post('https://estagio-guilherme.azurewebsites.net/api/sala', data)
        .then((response) => {
          console.log(response.data, response.data.status);
          if (response.data.status === 200) {
            setId('');
            setNumeroSala('');
            setDescricaoSala('');
            setErros({});
            onClose();
          } else {
            setErros({ erroGeral: 'Erro ao adicionar a sala. Por favor, tente novamente.' });
          }
        })
        .catch((error) => {
          console.error(error);
          setErros({ erroGeral: 'Erro ao adicionar a sala. Por favor, tente novamente.' });
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
        <Modal.Title>{id ? 'Editar Sala' : 'Inserir Sala'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {erros.erroGeral && <Alert variant="danger">{erros.erroGeral}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNumeroSala">
            <Form.Label>Número da Sala:</Form.Label>
            <Form.Control
              type="number"
              value={numeroSala}
              onChange={(e) => setNumeroSala(e.target.value)}
              isInvalid={!!erros.numeroSala}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.numeroSala}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formDescricaoSala">
            <Form.Label>Descrição da Sala:</Form.Label>
            <Form.Control
              type="text"
              value={descricaoSala}
              onChange={(e) => setDescricaoSala(e.target.value)}
              isInvalid={!!erros.descricaoSala}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.descricaoSala}</Form.Control.Feedback>
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

export default ModalSala;
