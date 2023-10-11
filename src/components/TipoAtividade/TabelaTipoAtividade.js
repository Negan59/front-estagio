import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Table, Button, Tabs, Tab } from 'react-bootstrap';
import ModalTipoAtividade from './ModalTipoAtividade'; // Certifique-se de importar o Modal correto

const TabelaTipoAtividades = () => {
    const [tipoatividades, setTipoAtividades] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tipoatividadeSelecionado, setTipoAtividadeSelecionado] = useState(null);
    const [erro, setErro] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('ativos');


    const handleAlterarClick = (tipoatividade) => {
        setTipoAtividadeSelecionado(tipoatividade);
        setShowModal(true);
    };

    const Erro = ({ mensagem, sucesso }) => {
        const estilo = sucesso ? 'alert alert-success' : 'alert alert-danger';
        return <div className={estilo}>{mensagem}</div>;
    };

    const handleAlterarSubmit = (dadosTipoAtividade) => {
        buscarTipoAtividades();
        setShowModal(false);
    };

    const buscarTipoAtividades = async () => {
        try {
            const response = await axios.get(`https://estagio-guilherme.azurewebsites.net/api/tipoatividade/${abaAtiva}`);
            setTipoAtividades(response.data);
        } catch (error) {
            console.error('Erro ao buscar os dados dos funcionários:', error);
            setErro({ mensagem: 'Erro ao buscar os funcionários. Por favor, tente novamente.', sucesso: false });
        }
    };

    const deletaTipoAtividade = async (id) => {
        try {
            if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
                await axios.put(`https://estagio-guilherme.azurewebsites.net/api/tipoatividade/${abaAtiva}/${id}`);
                setErro({ mensagem: 'TipoAtividade alterado com sucesso.', sucesso: true });
                buscarTipoAtividades();
            }
        } catch (error) {
            setErro({ mensagem: 'Erro ao deletar o tipoatividade. Por favor, tente novamente.', sucesso: false });
            console.error('Erro ao deletar o tipoatividade:', error);
        }
    };

    useEffect(() => {
        buscarTipoAtividades();
    }, [abaAtiva]);

    return (
        <div className="container mt-4">
            {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
            <Tabs activeKey={abaAtiva} onSelect={(key) => setAbaAtiva(key)}>
                <Tab eventKey="ativos" title="Ativos">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nome do Tipo de Atividade</th>
                                <th>Excluir</th>
                                <th>Alterar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tipoatividades.map((tipoatividade) => (
                                <tr key={tipoatividade.id}>
                                    <td>{tipoatividade.nome}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => deletaTipoAtividade(tipoatividade.id)}>
                                            <FiTrash2 size={20} />
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="success" onClick={() => handleAlterarClick(tipoatividade)}>
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
                                <th>Nome do Tipo de Atividade</th>
                                <th>Excluir</th>
                                <th>Alterar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tipoatividades.map((tipoatividade) => (
                                <tr key={tipoatividade.id}>
                                    <td>{tipoatividade.nome}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => deletaTipoAtividade(tipoatividade.id)}>
                                            <FiTrash2 size={20} />
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="success" onClick={() => handleAlterarClick(tipoatividade)}>
                                            <FiEdit size={20} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>

            {showModal && tipoatividadeSelecionado && (
                <ModalTipoAtividade
                    tipoatividade={tipoatividadeSelecionado}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAlterarSubmit}
                />
            )}
        </div>
    );
};

export default TabelaTipoAtividades;
