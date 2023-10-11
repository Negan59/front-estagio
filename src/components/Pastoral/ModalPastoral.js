import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FiSave, FiX } from 'react-icons/fi';

const ModalPastoral = ({ pastoral, onSubmit, onClose }) => {
  const [id, setId] = useState('');
  const [nomePastoral, setNomePastoral] = useState('');
  const [descricaoPastoral, setDescricaoPastoral] = useState('');
  const [coordenador, setCoordenador] = useState('');
  const [dataCriacao, setDataCriacao] = useState(new Date().toISOString().substr(0, 10));
  const [dataEncerramento, setDataEncerramento] = useState('');
  const [paroquianos, setParoquianos] = useState([]);
  const [erros, setErros] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    buscarParoquianos();
    if (pastoral) {
      setId(pastoral.id);
      setNomePastoral(pastoral.nomepastoral);
      setDescricaoPastoral(pastoral.descricaopastoral);
      setCoordenador(pastoral.coordenador ? pastoral.coordenador.id : '');
      setDataCriacao(pastoral.datacriacao);
      setDataEncerramento(pastoral.dataencerramento);
    }
    setShow(true);
  }, [pastoral]);

  const buscarParoquianos = async () => {
    try {
      const response = await axios.get('https://estagio-guilherme.azurewebsites.net/api/paroquiano');
      setParoquianos(response.data);
    } catch (error) {
      console.error('Erro ao buscar os paroquianos:', error);
    }
  };

  const buscarParoquianoPorId = async (paroquianoId) => {
    try {
      const response = await axios.get(`https://estagio-guilherme.azurewebsites.net/api/paroquiano/${paroquianoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar o paroquiano:', error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErros({});

    const novosErros = {};

    if (nomePastoral === '') {
      novosErros.nomePastoral = 'Campo obrigatório';
    }

    if (descricaoPastoral === '') {
      novosErros.descricaoPastoral = 'Campo obrigatório';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    let coordenadorObj = null;
    if (coordenador !== '') {
      coordenadorObj = await buscarParoquianoPorId(coordenador);
    }

    let data = {
      nomepastoral: nomePastoral,
      descricaopastoral: descricaoPastoral,
      coordenador: coordenadorObj,
      datacriacao: dataCriacao,
      dataencerramento: dataEncerramento,
    };

    if (id) {
      data.id = id;

      try {
        const response = await axios.put('https://estagio-guilherme.azurewebsites.net/api/pastoral', data);
        console.log('Dados atualizados com sucesso:', response.data);
        onSubmit(response.data);
        limparCampos();
        onClose();
      } catch (error) {
        console.error('Erro ao atualizar os dados:', error);
        setErros({
          erroGeral: 'Erro ao atualizar a pastoral. Por favor, tente novamente.',
        });
      }
    } else {
      try {
        const response = await axios.post('https://estagio-guilherme.azurewebsites.net/api/pastoral', data);
        console.log(response.data, response.data.status);
        if (response.data.status === 200) {
          limparCampos();
          onClose();
        } else {
          setErros({
            erroGeral: 'Erro ao adicionar a pastoral. Por favor, tente novamente.',
          });
        }
      } catch (error) {
        console.error('Erro ao salvar os dados:', error);
        setErros({
          erroGeral: 'Erro ao adicionar a pastoral. Por favor, tente novamente.',
        });
      }
    }
  };

  const limparCampos = () => {
    setId('');
    setNomePastoral('');
    setDescricaoPastoral('');
    setCoordenador('');
    setDataCriacao('');
    setDataEncerramento('');
    setErros({});
  };

  const handleModalClose = () => {
    setErros({});
    setShow(false);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{id ? 'Editar Pastoral' : 'Inserir Pastoral'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {erros.erroGeral && <Alert variant="danger">{erros.erroGeral}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNomePastoral">
            <Form.Label>Nome da Pastoral:</Form.Label>
            <Form.Control
              type="text"
              value={nomePastoral}
              onChange={(e) => setNomePastoral(e.target.value)}
              isInvalid={!!erros.nomePastoral}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.nomePastoral}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formDescricaoPastoral">
            <Form.Label>Descrição:</Form.Label>
            <Form.Control
              type="text"
              value={descricaoPastoral}
              onChange={(e) => setDescricaoPastoral(e.target.value)}
              isInvalid={!!erros.descricaoPastoral}
              required
            />
            <Form.Control.Feedback type="invalid">{erros.descricaoPastoral}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formCoordenador">
            <Form.Label>Coordenador:</Form.Label>
            <Form.Control
              as="select"
              value={coordenador}
              onChange={(e) => setCoordenador(e.target.value)}
            >
              <option value="">Selecione um Coordenador</option>
              {paroquianos.map((paroquiano) => (
                <option key={paroquiano.id} value={paroquiano.id}>
                  {paroquiano.nome}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formDataCriacao">
            <Form.Label>Data de Criação:</Form.Label>
            <Form.Control
              type="date"
              value={dataCriacao}
              onChange={(e) => setDataCriacao(e.target.value)}
            />
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

export default ModalPastoral;
