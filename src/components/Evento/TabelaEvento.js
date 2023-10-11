import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import '../../styles/tabela.css';
import ModalEvento from './ModalEvento';

const TabelaEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [erro, setErro] = useState('');

  const handleAlterarClick = (evento) => {
    setEventoSelecionado(evento);
    setShowModal(true);
  };

  const Erro = ({ mensagem, sucesso }) => {
    const estilo = sucesso ? 'mensagem-sucesso' : 'mensagem-fracasso';
    return <div className={estilo}>{mensagem}</div>;
  };

  const handleAlterarSubmit = (dadosEvento) => {
    // Fechar o modal
    fetchEventos();
    setShowModal(false);
  };

  const fetchEventos = async () => {
    try {
      const response = await axios.get('https://estagio-guilherme.azurewebsites.net/api/evento');
      setEventos(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados dos eventos:', error);
      // Tratar o erro de acordo com as necessidades do seu aplicativo
    }
  };

  const deletaEvento = async (id) => {
    try {
      await axios.delete(`https://estagio-guilherme.azurewebsites.net/api/evento/${id}`);
      setErro({ mensagem: 'Evento deletado com sucesso.', sucesso: true });
      fetchEventos();
    } catch (error) {
      setErro({ mensagem: 'Erro ao deletar o evento. Por favor, tente novamente.', sucesso: false });
      // Tratar o erro de acordo com as necessidades do seu aplicativo
    }
  };

  useEffect(() => {
    // Função para buscar os dados dos eventos

    // Chamar a função de busca dos eventos
    fetchEventos();
  }, []);

  return (
    <>
      {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
      <br></br>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do Evento</th>
            <th>Data do Evento</th>
            <th>Excluir</th>
            <th>Alterar</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((evento) => (
            <tr key={evento.id}>
              <td>{evento.id}</td>
              <td>{evento.nomeevento}</td>
              <td>{evento.dataevento}</td>
              <td>
                <button className="btn-editar" onClick={() => handleAlterarClick(evento)}>
                  <FiEdit size={20} color="#00FF00" />
                </button>
              </td>
              <td>
                <button className="btn-excluir" onClick={() => deletaEvento(evento.id)}>
                  <FiTrash2 size={20} color="#FF0000" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && eventoSelecionado && (
        <ModalEvento
          evento={eventoSelecionado}
          onClose={() => setShowModal(false)}
          onSubmit={handleAlterarSubmit}
        />
      )}
    </>
  );
};

export default TabelaEventos;
