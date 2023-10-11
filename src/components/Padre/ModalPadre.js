import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FiSave, FiX } from 'react-icons/fi';

const ModalPadre = ({ padre, onSubmit, onClose }) => {
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [foto, setFoto] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [paroquia, setParoquia] = useState('');
    const [telefoneErro, setTelefoneErro] = useState(false);
    const [erros, setErros] = useState({});

    useEffect(() => {
        if (padre) {
            setId(padre.id);
            setNome(padre.nome);
            setFoto(padre.foto);
            setTelefone(padre.telefone);
            setEmail(padre.email);
        }
    }, [padre]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setErros({}); // Limpa os erros antes de validar novamente

        const novosErros = {};

        if (nome === '') {
            novosErros.nome = 'Campo obrigatório';
        }

        if (email === '') {
            novosErros.email = 'Campo obrigatório';
        }

        if (!validateTelefone(telefone)) {
            novosErros.telefone = 'Telefone inválido';
        }

        if (paroquia === '' ) {
            novosErros.paroquia = 'Paroquia inválida ';
        }


        if (Object.keys(novosErros).length > 0) {
            setErros(novosErros);
            return;
        }

        let data = {
            nome: nome,
            foto: foto,
            telefone: telefone,
            email: email,
            paroquia: paroquia,
        };

        if (id) {
            data.id = id;

            axios
                .put(`https://estagio-guilherme.azurewebsites.net/api/padre`, data)
                .then((response) => {
                    console.log('Dados atualizados com sucesso:', response.data);
                    onSubmit(response.data);
                    setId('');
                    setNome('');
                    setFoto('');
                    setTelefone('');
                    setEmail('');
                    setParoquia('');
                    setErros({});
                    onClose();
                })
                .catch((error) => {
                    console.error('Erro ao atualizar os dados:', error);
                    setErros({ erroGeral: 'Erro ao atualizar o padre. Por favor, tente novamente.' });
                });
        } else {
            axios
                .post('https://estagio-guilherme.azurewebsites.net/api/padre', data)
                .then((response) => {
                    console.log(response.data, response.data.status);
                    if (response.data.status === 200) {
                        setId('');
                        setNome('');
                        setFoto('');
                        setTelefone('');
                        setEmail('');
                        setParoquia('');
                        setErros({});
                        onClose();
                    } else {
                        setErros({ erroGeral: 'Erro ao adicionar o padre. Por favor, tente novamente.' });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setErros({ erroGeral: 'Erro ao adicionar o padre. Por favor, tente novamente.' });
                });
        }
    };

    const validateTelefone = (value) => {
        const telefoneDigits = value.replace(/\D/g, ''); // Remover caracteres não numéricos
        const telefoneLength = telefoneDigits.length;

        // No Brasil, os números de telefone fixo têm 10 dígitos e os celulares têm 11 dígitos
        return telefoneLength === 12 || telefoneLength === 13;
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
                <Modal.Title>{id ? 'Editar Padre' : 'Inserir Padre'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {erros.erroGeral && <Alert variant="danger">{erros.erroGeral}</Alert>}
                <Form onSubmit={handleSubmit} className="padre-form">
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
                    <Form.Group controlId="formFoto">
                        <Form.Label>Foto:</Form.Label>
                        <Form.Control
                            type="text"
                            value={foto}
                            onChange={(e) => setFoto(e.target.value)}
                            isInvalid={!!erros.foto}
                        />
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
                        {telefone === '' && <Form.Text className="text-danger">* Campo obrigatório</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isInvalid={!!erros.email}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{erros.email}</Form.Control.Feedback>
                        <Form.Text className="text-muted">* Campo obrigatório</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formParoquia">
                        <Form.Label>Paroquia:</Form.Label>
                        <Form.Control
                            type="text"
                            value={paroquia}
                            onChange={(e) => setParoquia(e.target.value)}
                            isInvalid={!!erros.paroquia}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{erros.paroquia}</Form.Control.Feedback>
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

export default ModalPadre;
