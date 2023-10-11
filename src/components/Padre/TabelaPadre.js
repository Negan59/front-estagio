import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Table, Button, Tabs, Tab } from 'react-bootstrap';
import ModalPadre from './ModalPadre'; // Certifique-se de importar o Modal correto

const TabelaPadres = () => {
    const [padres, setPadres] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [padreSelecionado, setPadreSelecionado] = useState(null);
    const [erro, setErro] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('ativos');


    const handleAlterarClick = (padre) => {
        setPadreSelecionado(padre);
        setShowModal(true);
    };

    const Erro = ({ mensagem, sucesso }) => {
        const estilo = sucesso ? 'alert alert-success' : 'alert alert-danger';
        return <div className={estilo}>{mensagem}</div>;
    };

    const handleAlterarSubmit = (dadosPadre) => {
        buscarPadres();
        setShowModal(false);
    };

    const buscarPadres = async () => {
        try {
            const response = await axios.get(`https://estagio-guilherme.azurewebsites.net/api/padre/${abaAtiva}`);
            setPadres(response.data);
        } catch (error) {
            console.error('Erro ao buscar os dados dos funcionários:', error);
            setErro({ mensagem: 'Erro ao buscar os funcionários. Por favor, tente novamente.', sucesso: false });
        }
    };

    const deletaPadre = async (id) => {
        try {
            if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
                await axios.put(`https://estagio-guilherme.azurewebsites.net/api/padre/${abaAtiva}/${id}`);
                setErro({ mensagem: 'Padre alterado com sucesso.', sucesso: true });
                buscarPadres();
            }
        } catch (error) {
            setErro({ mensagem: 'Erro ao deletar o padre. Por favor, tente novamente.', sucesso: false });
            console.error('Erro ao deletar o padre:', error);
        }
    };

    useEffect(() => {
        buscarPadres();
    }, [abaAtiva]);

    return (
        <div className="container mt-4">
            {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
            <Tabs activeKey={abaAtiva} onSelect={(key) => setAbaAtiva(key)}>
                <Tab eventKey="ativos" title="Ativos">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nome do Padre</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Paróquia</th>
                                <th>Excluir</th>
                                <th>Alterar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {padres.map((padre) => (
                                <tr key={padre.id}>
                                    <td>{padre.nome}</td>
                                    <td>{padre.email}</td>
                                    <td>{padre.telefone}</td>
                                    <td>{padre.paroquia}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => deletaPadre(padre.id)}>
                                            <FiTrash2 size={20} />
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="success" onClick={() => handleAlterarClick(padre)}>
                                            <FiEdit size={20} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="inativos" title="Inativos">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nome do Padre</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Paróquia</th>
                                <th>Excluir</th>
                                <th>Alterar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {padres.map((padre) => (
                                <tr key={padre.id}>
                                    <td>{padre.nome}</td>
                                    <td>{padre.email}</td>
                                    <td>{padre.telefone}</td>
                                    <td>{padre.paroquia}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => deletaPadre(padre.id)}>
                                            <FiTrash2 size={20} />
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="success" onClick={() => handleAlterarClick(padre)}>
                                            <FiEdit size={20} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>

            {showModal && padreSelecionado && (
                <ModalPadre
                    padre={padreSelecionado}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAlterarSubmit}
                />
            )}
        </div>
    );
};

export default TabelaPadres;
