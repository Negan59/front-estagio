import React, { useState, useEffect } from 'react';
import ModalChave from './ModalChave';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Pagination } from 'react-bootstrap';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import '../../styles/tabela.css';

const TabelaChave = () => {
  const [chaves, setChaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [chaveSelecionada, setChaveSelecionada] = useState(null);
  const [erro, setErro] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [chavesPerPage] = useState(10);
  const [totalChaves, setTotalChaves] = useState(0);

  const handleAlterarClick = (chave) => {
    setChaveSelecionada(chave);
    setShowModal(true);
  };

  const Erro = ({ mensagem, sucesso }) => {
    const estilo = sucesso ? 'alert alert-success' : 'alert alert-danger';
    return <div className={estilo}>{mensagem}</div>;
  };

  const handleAlterarSubmit = (dadosChave) => {
    // Fechar o modal
    setShowModal(false);
  };

  const fetchChaves = async () => {
    try {
      const response = await fetch(`https://estagio-guilherme.azurewebsites.net/api/chave/pagina/${currentPage}`);
      const data = await response.json();
      setChaves(data);
    } catch (error) {
      console.error('Erro ao buscar os dados das chaves:', error);
      // Tratar o erro de acordo com as necessidades do seu aplicativo
    }
  };

  const fetchTotalChaves = async () => {
    try {
      const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/chave/quantidade');
      const data = await response.json();
      setTotalChaves(data);
    } catch (error) {
      console.error('Erro ao buscar a quantidade total de chaves:', error);
      // Tratar o erro de acordo com as necessidades do seu aplicativo
    }
  };

  const deletaChave = async (id) => {
    const userConfirmed = window.confirm('Tem certeza que deseja excluir essa chave?');

    if (userConfirmed) {
      try {
        await fetch(`https://estagio-guilherme.azurewebsites.net/api/chave/${id}`, {
          method: 'DELETE',
        });
        setErro({ mensagem: 'Chave deletada com sucesso.', sucesso: true });
        fetchChaves();
      } catch (error) {
        setErro({
          mensagem: 'Erro ao deletar a chave. Por favor, tente novamente.',
          sucesso: false,
        });
        // Tratar o erro de acordo com as necessidades do seu aplicativo
      }
    }
  };

  useEffect(() => {
    fetchChaves();
    fetchTotalChaves();
  }, [currentPage]);


  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalChaves / chavesPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome da Chave</th>
            <th>Sala</th>
            <th>Excluir</th>
            <th>Alterar</th>
          </tr>
        </thead>
        <tbody>
          {chaves.map((chave) => (
            <tr key={chave.id}>
              <td>{chave.nome}</td>
              <td>{chave.sala.descricaosala}</td>
              <td>
                <Button className="btn-excluir" onClick={() => deletaChave(chave.id)}>
                  <FiTrash2 size={20} color="#FF0000" />
                </Button>
              </td>
              <td>
                <Button className="btn-editar" onClick={() => handleAlterarClick(chave)}>
                  <FiEdit size={20} color="#00FF00" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {pageNumbers.map((number) => (
          <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
            {number}
          </Pagination.Item>
        ))}
      </Pagination>

      {showModal && chaveSelecionada && (
        <ModalChave
          chave={chaveSelecionada}
          onClose={() => setShowModal(false)}
          onSubmit={handleAlterarSubmit}
        />
      )}
    </div>
  );
};

export default TabelaChave;
