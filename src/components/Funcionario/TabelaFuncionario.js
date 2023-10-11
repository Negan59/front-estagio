import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Table, Button, Tabs, Tab } from 'react-bootstrap';
import ModalFuncionario from './ModalFuncionario'; // Certifique-se de importar o Modal correto

const TabelaFuncionarios = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
    const [erro, setErro] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('ativos');


    const handleAlterarClick = (funcionario) => {
        setFuncionarioSelecionado(funcionario);
        setShowModal(true);
    };

    const Erro = ({ mensagem, sucesso }) => {
        const estilo = sucesso ? 'alert alert-success' : 'alert alert-danger';
        return <div className={estilo}>{mensagem}</div>;
    };

    const handleAlterarSubmit = (dadosFuncionario) => {
        buscarFuncionarios();
        setShowModal(false);
    };

    const buscarFuncionarios = async () => {
        try {
            const response = await axios.get(`https://estagio-guilherme.azurewebsites.net/api/funcionario/${abaAtiva}`);
            setFuncionarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar os dados dos funcionários:', error);
            setErro({ mensagem: 'Erro ao buscar os funcionários. Por favor, tente novamente.', sucesso: false });
        }
    };

    const deletaFuncionario = async (id) => {
        try {
            if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
                await axios.put(`https://estagio-guilherme.azurewebsites.net/api/funcionario/${abaAtiva}/${id}`);
                setErro({ mensagem: 'Funcionário alterado com sucesso.', sucesso: true });
                buscarFuncionarios();
            }
        } catch (error) {
            setErro({ mensagem: 'Erro ao deletar o funcionário. Por favor, tente novamente.', sucesso: false });
            console.error('Erro ao deletar o funcionário:', error);
        }
    };

    useEffect(() => {
        buscarFuncionarios();
    }, [abaAtiva]);

    return (
        <div className="container mt-4">
            {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
            <Tabs activeKey={abaAtiva} onSelect={(key) => setAbaAtiva(key)}>
                <Tab eventKey="ativos" title="Ativos">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nome do Funcionário</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Excluir</th>
                                <th>Alterar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funcionarios.map((funcionario) => (
                                <tr key={funcionario.id}>
                                    <td>{funcionario.nome}</td>
                                    <td>{funcionario.email}</td>
                                    <td>{funcionario.telefone}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => deletaFuncionario(funcionario.id)}>
                                            <FiTrash2 size={20} />
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="success" onClick={() => handleAlterarClick(funcionario)}>
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
                                <th>Nome do Funcionário</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Excluir</th>
                                <th>Alterar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funcionarios.map((funcionario) => (
                                <tr key={funcionario.id}>
                                    <td>{funcionario.nome}</td>
                                    <td>{funcionario.email}</td>
                                    <td>{funcionario.telefone}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => deletaFuncionario(funcionario.id)}>
                                            <FiTrash2 size={20} />
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="success" onClick={() => handleAlterarClick(funcionario)}>
                                            <FiEdit size={20} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>

            {showModal && funcionarioSelecionado && (
                <ModalFuncionario
                    funcionario={funcionarioSelecionado}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAlterarSubmit}
                />
            )}
        </div>
    );
};

export default TabelaFuncionarios;
