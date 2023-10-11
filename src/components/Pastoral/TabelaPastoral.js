import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Table, Button, Tabs, Tab } from 'react-bootstrap';
import ModalPastoral from './ModalPastoral';

const TabelaPastorais = () => {
  const [pastorais, setPastorais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pastoralSelecionada, setPastoralSelecionada] = useState(null);
  const [erro, setErro] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('ativos'); // Aba padrão: ativos

  const handleAlterarClick = (pastoral) => {
    setPastoralSelecionada(pastoral);
    setShowModal(true);
  };

  const Erro = ({ mensagem, sucesso }) => {
    const estilo = sucesso ? 'alert alert-success' : 'alert alert-danger';
    return <div className={estilo}>{mensagem}</div>;
  };

  const handleAlterarSubmit = (dadosPastoral) => {
    // Fechar o modal
    buscarPastorais();
    setShowModal(false);
  };

  const buscarPastorais = async () => {
    try {
      console.log(`https://estagio-guilherme.azurewebsites.net/api/pastoral/${abaAtiva}`)
      const response = await axios.get(`https://estagio-guilherme.azurewebsites.net/api/pastoral/${abaAtiva}`);
      console.log(response.data)
      setPastorais(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados das pastorais:', error);
      setErro({ mensagem: 'Erro ao buscar as pastorais. Por favor, tente novamente.', sucesso: false });
    }
  };

  const deletaPastoral = async (id) => {
    try {
      if (window.confirm('Tem certeza que deseja excluir esta pastoral?')) {
        await axios.delete(`https://estagio-guilherme.azurewebsites.net/api/pastoral/${abaAtiva}/${id}`);
        setErro({ mensagem: 'Pastoral desativada com sucesso.', sucesso: true });
        buscarPastorais();
      }
    } catch (error) {
      setErro({ mensagem: 'Erro ao deletar a pastoral. Por favor, tente novamente.', sucesso: false });
      console.error('Erro ao deletar a pastoral:', error);
    }
  };

  useEffect(() => {
    buscarPastorais();
  }, [abaAtiva]); // Atualiza quando a aba ativa muda

  return (
    <div className="container mt-4">
      {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
      <Tabs activeKey={abaAtiva} onSelect={(key) => setAbaAtiva(key)}>
        <Tab eventKey="ativos" title="Ativas">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nome da Pastoral</th>
                <th>Descrição</th>
                <th>Coordenador</th>
                <th>Data de Criação</th>
                <th>Data de Encerramento</th>
                <th>Excluir</th>
                <th>Alterar</th>
              </tr>
            </thead>
            <tbody>
              {pastorais.map((pastoral) => (
                <tr key={pastoral.id}>
                  <td>{pastoral.nomepastoral}</td>
                  <td>{pastoral.descricaopastoral}</td>
                  <td>{pastoral.coordenador.nome}</td>
                  <td>{pastoral.datacriacao}</td>
                  <td>{pastoral.dataencerramento}</td>
                  <td>
                    <Button variant="danger" onClick={() => deletaPastoral(pastoral.id)}>
                      <FiTrash2 size={20} />
                    </Button>
                  </td>
                  <td>
                    <Button variant="success" onClick={() => handleAlterarClick(pastoral)}>
                      <FiEdit size={20} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="inativos" title="Inativas">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nome da Pastoral</th>
                <th>Descrição</th>
                <th>Coordenador</th>
                <th>Data de Criação</th>
                <th>Data de Encerramento</th>
                <th>Excluir</th>
                <th>Alterar</th>
              </tr>
            </thead>
            <tbody>
              {pastorais.map((pastoral) => (
                <tr key={pastoral.id}>
                  <td>{pastoral.nomepastoral}</td>
                  <td>{pastoral.descricaopastoral}</td>
                  <td>{pastoral.coordenador.nome}</td>
                  <td>{pastoral.datacriacao}</td>
                  <td>{pastoral.dataencerramento}</td>
                  <td>
                    <Button variant="danger" onClick={() => deletaPastoral(pastoral.id)}>
                      <FiTrash2 size={20} />
                    </Button>
                  </td>
                  <td>
                    <Button variant="success" onClick={() => handleAlterarClick(pastoral)}>
                      <FiEdit size={20} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {showModal && pastoralSelecionada && (
        <ModalPastoral
          pastoral={pastoralSelecionada}
          onClose={() => setShowModal(false)}
          onSubmit={handleAlterarSubmit}
        />
      )}
    </div>
  );
};

export default TabelaPastorais;
