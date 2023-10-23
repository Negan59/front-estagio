import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FiSave, FiX } from 'react-icons/fi';

const ModalChave = ({ chave, onSubmit, onClose, onErro, onSucesso }) => {
  const [nome, setNome] = useState('');
  const [salaId, setSalaId] = useState('');
  const [salas, setSalas] = useState([]); // Array para armazenar as salas
  const [erros, setErros] = useState({});
  const [show, setShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Função para buscar as salas ao abrir o modal
    fetchSalas();

    if (chave) {
      setNome(chave.nome);
      setSalaId(chave.sala.id); // Defina a sala selecionada
    }
    setShow(true);
  }, [chave]);

  const fetchSalas = async () => {
    try {
      const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/sala');
      if (response.ok) {
        const data = await response.json();
        setSalas(data);
      } else {
        console.error('Erro ao buscar os dados das salas:', response.statusText);
        // Tratar o erro de acordo com as necessidades do seu aplicativo
      }
    } catch (error) {
      console.error('Erro ao buscar os dados das salas:', error);
      // Tratar o erro de acordo com as necessidades do seu aplicativo
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErros({}); // Limpa os erros antes de validar novamente
    const novosErros = {};

    if (nome === '') {
      novosErros.nome = 'Campo obrigatório';
    }

    if (salaId === '') {
      novosErros.salaId = 'Selecione uma sala';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    let sala = salas.find((sala) => sala.id == salaId);
    let data = {
      nome,
      sala,
    };

    fetch('https://estagio-guilherme.azurewebsites.net/api/chave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccessMessage('Chave adicionada com sucesso!');
          onSucesso('Chave adicionada com sucesso!'); // Chama a função de sucesso do pai
          setNome('');
          setSalaId('');
          setErros({});
          onClose();
        } else {
          throw new Error('Erro ao adicionar a chave.');
        }
      })
      .catch((error) => {
        console.error('Erro ao adicionar a chave:', error.message);
        setErros({ erroGeral: 'Erro ao adicionar a chave. Por favor, tente novamente.' });
        onErro('Erro ao adicionar a chave. Por favor, tente novamente.'); // Chama a função de erro do pai
      });
  };

  const handleModalClose = () => {
    setErros({});
    setSuccessMessage(''); // Limpa a mensagem de sucesso ao fechar o modal
    setShow(false);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{chave ? 'Editar Chave' : 'Inserir Chave'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {erros.erroGeral && <Alert variant="danger">{erros.erroGeral}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNome">
            <Form.Label>Nome da Chave:</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              isInvalid={!!erros.nome}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.nome}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formSala">
            <Form.Label>Sala:</Form.Label>
            <Form.Control
              as="select"
              value={salaId}
              onChange={(e) => setSalaId(e.target.value)}
              isInvalid={!!erros.salaId}
              required
            >
              <option value="">Selecione uma sala</option>
              {salas.map((sala) => (
                <option key={sala.id} value={sala.id}>
                  {sala.descricaosala}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">{erros.salaId}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" type="submit" onClick={handleSubmit}>
          <FiSave /> {chave ? 'Atualizar' : 'Salvar'}
        </Button>
        <Button variant="danger" onClick={handleModalClose}>
          <FiX /> Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalChave;
