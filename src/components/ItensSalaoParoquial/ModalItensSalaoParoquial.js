import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FiSave, FiX } from 'react-icons/fi';

const ModalItensSalaoParoquial = ({ itemsalao, onSubmit, onClose }) => {
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [erros, setErros] = useState({});

    useEffect(() => {
        if (itemsalao) {
            setId(itemsalao.id);
            setNome(itemsalao.nome);
        }
    }, [itemsalao]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setErros({}); // Limpa os erros antes de validar novamente

        const novosErros = {};

        if (nome === '') {
            novosErros.nome = 'Campo obrigatório';
        }

        if (Object.keys(novosErros).length > 0) {
            setErros(novosErros);
            return;
        }

        let data = {
            nome: nome,
        };

        if (id) {
            data.id = id;

            axios
                .put(`https://estagio-guilherme.azurewebsites.net/api/itemsalao`, data)
                .then((response) => {
                    console.log('Dados atualizados com sucesso:', response.data);
                    onSubmit(response.data);
                    setId('');
                    setNome('');
                    setErros({});
                    onClose();
                })
                .catch((error) => {
                    console.error('Erro ao atualizar os dados:', error);
                    setErros({ erroGeral: 'Erro ao atualizar Item do salão . Por favor, tente novamente.' });
                });
        } else {
            axios
                .post('https://estagio-guilherme.azurewebsites.net/api/itemsalao', data)
                .then((response) => {
                    console.log(response.data, response.data.status);
                    if (response.data.status === 200) {
                        setId('');
                        setNome('');
                        onClose();
                    } else {
                        setErros({ erroGeral: 'Erro ao adicionar Item do salão. Por favor, tente novamente.' });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setErros({ erroGeral: 'Erro ao adicionar Item do salão. Por favor, tente novamente.' });
                });
        }
    };


    const handleModalClose = () => {
        setErros({});
        onClose();
    };

    const handleInputClick = (inputName) => {
        const novosErros = { ...erros };
        delete novosErros[inputName];
        setErros(novosErros);
    };

    return (
        <Modal show={true} onHide={handleModalClose} centered dialogClassName="transparent-modal">
            <Modal.Header closeButton>
                <Modal.Title>{id ? 'Editar ItensSalaoParoquial' : 'Inserir ItensSalaoParoquial'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {erros.erroGeral && <Alert variant="danger">{erros.erroGeral}</Alert>}
                <Form onSubmit={handleSubmit} className="itemsalao-form">
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
                        <Form.Text className="text-muted">* Campo obrigatório</Form.Text>
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

export default ModalItensSalaoParoquial;
