import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import '../../styles/tabela.css';
import ModalAluguel from './ModalAluguel';

const TabelaAluguel = () => {
  const [alugueis, setAlugueis] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [aluguelSelecionado, setAluguelSelecionado] = useState(null);
  const [erro, setErro] = useState('');

  const handleAlterarClick = (aluguel) => {
    setAluguelSelecionado(aluguel);
    setShowModal(true);
  };

  const Erro = ({ mensagem, sucesso }) => {
    const estilo = sucesso ? 'mensagem-sucesso' : 'mensagem-fracasso';
    return <div className={estilo}>{mensagem}</div>;
  };

  const handleAlterarSubmit = (dadosAluguel) => {
    // Fechar o modal
    fetchAlugueis();
    setShowModal(false);
  };

  const fetchAlugueis = async () => {
    try {
      const response = await axios.get('https://estagio-guilherme.azurewebsites.net/api/aluguel');
      setAlugueis(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados dos aluguéis:', error);
      // Tratar o erro de acordo com as necessidades do seu aplicativo
    }
  };

  const deletaAluguel = async (id) => {
    try {
      await axios.delete(`https://estagio-guilherme.azurewebsites.net/api/aluguel/${id}`);
      setErro({ mensagem: 'Aluguel deletado com sucesso.', sucesso: true });
      fetchAlugueis();
    } catch (error) {
      setErro({ mensagem: 'Erro ao deletar o aluguel. Por favor, tente novamente.', sucesso: false });
      // Tratar o erro de acordo com as necessidades do seu aplicativo
    }
  };

  useEffect(() => {
    // Função para buscar os dados dos aluguéis

    // Chamar a função de busca dos aluguéis
    fetchAlugueis();
  }, []);

  return (
    <>
      {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
      <br />
      <table>
        <thead>
          <tr>
            <th>Nome do Aluguel</th>
            <th>Documento</th>
            <th>Valor</th>
            <th>Valor Adicional</th>
            <th>Data</th>
            <th>Telefone</th>
            <th>Excluir</th>
            <th>Alterar</th>
          </tr>
        </thead>
        <tbody>
          {alugueis.map((aluguel) => (
            <tr key={aluguel.id}>
              <td>{aluguel.nomealuguel}</td>
              <td>{aluguel.documento}</td>
              <td>{aluguel.valor}</td>
              <td>{aluguel.valoradicional}</td>
              <td>{aluguel.data}</td>
              <td>{aluguel.telefone}</td>
              <td>
                <button className="btn-excluir" onClick={() => deletaAluguel(aluguel.id)}>
                  <FiTrash2 size={20} color="#FF0000" />
                </button>
              </td>
              <td>
                <button className="btn-editar" onClick={() => handleAlterarClick(aluguel)}>
                  <FiEdit size={20} color="#00FF00" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && aluguelSelecionado && (
        <ModalAluguel
          aluguel={aluguelSelecionado}
          onClose={() => setShowModal(false)}
          onSubmit={handleAlterarSubmit}
        />
      )}
    </>
  );
};

export default TabelaAluguel;
