import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Table, Button, Tabs, Tab } from 'react-bootstrap';
import ModalItensSalaoParoquial from './ModalItensSalaoParoquial'; // Certifique-se de importar o Modal correto

const TabelaItensSalaoParoquial = () => {
    const [itenssalao, setItensSalaoParoquial] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [itemsalaoSelecionado, setItensSalaoParoquialSelecionado] = useState(null);
    const [erro, setErro] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('ativos');


    const handleAlterarClick = (itemsalao) => {
        setItensSalaoParoquialSelecionado(itemsalao);
        setShowModal(true);
    };

    const Erro = ({ mensagem, sucesso }) => {
        const estilo = sucesso ? 'alert alert-success' : 'alert alert-danger';
        return <div className={estilo}>{mensagem}</div>;
    };

    const handleAlterarSubmit = (dadosItensSalaoParoquial) => {
        buscarItensSalaoParoquial();
        setShowModal(false);
    };

    const buscarItensSalaoParoquial = async () => {
        try {
            const response = await axios.get(`https://estagio-guilherme.azurewebsites.net/api/itemsalao/${abaAtiva}`);
            setItensSalaoParoquial(response.data);
        } catch (error) {
            console.error('Erro ao buscar os dados dos funcionários:', error);
            setErro({ mensagem: 'Erro ao buscar os funcionários. Por favor, tente novamente.', sucesso: false });
        }
    };

    const deletaItensSalaoParoquial = async (id) => {
        try {
            if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
                await axios.put(`https://estagio-guilherme.azurewebsites.net/api/itemsalao/${abaAtiva}/${id}`);
                setErro({ mensagem: 'ItensSalaoParoquial alterado com sucesso.', sucesso: true });
                buscarItensSalaoParoquial();
            }
        } catch (error) {
            setErro({ mensagem: 'Erro ao deletar o itemsalao. Por favor, tente novamente.', sucesso: false });
            console.error('Erro ao deletar o itemsalao:', error);
        }
    };

    useEffect(() => {
        buscarItensSalaoParoquial();
    }, [abaAtiva]);

    return (
        <div className="container mt-4">
            {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
            <Tabs activeKey={abaAtiva} onSelect={(key) => setAbaAtiva(key)}>
                <Tab eventKey="ativos" title="Ativos">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nome do Item do salão</th>
                                <th>Excluir</th>
                                <th>Alterar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itenssalao.map((itemsalao) => (
                                <tr key={itemsalao.id}>
                                    <td>{itemsalao.nome}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => deletaItensSalaoParoquial(itemsalao.id)}>
                                            <FiTrash2 size={20} />
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="success" onClick={() => handleAlterarClick(itemsalao)}>
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
                                <th>Nome do Item do salão</th>
                                <th>Excluir</th>
                                <th>Alterar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itenssalao.map((itemsalao) => (
                                <tr key={itemsalao.id}>
                                    <td>{itemsalao.nome}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => deletaItensSalaoParoquial(itemsalao.id)}>
                                            <FiTrash2 size={20} />
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="success" onClick={() => handleAlterarClick(itemsalao)}>
                                            <FiEdit size={20} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>

            {showModal && itemsalaoSelecionado && (
                <ModalItensSalaoParoquial
                    itemsalao={itemsalaoSelecionado}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAlterarSubmit}
                />
            )}
        </div>
    );
};

export default TabelaItensSalaoParoquial;
