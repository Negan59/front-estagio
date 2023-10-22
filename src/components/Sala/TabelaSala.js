import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import ModalSala from './ModalSala';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button } from 'react-bootstrap';
import '../../styles/tabela.css'; // Certifique-se de incluir seus estilos personalizados

const TabelaSalas = () => {
  const [salas, setSalas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [erro, setErro] = useState('');

  const handleAlterarClick = (sala) => {
    setSalaSelecionada(sala);
    setShowModal(true);
  };

  const Erro = ({ mensagem, sucesso }) => {
    const estilo = sucesso ? 'alert alert-success' : 'alert alert-danger';
    return <div className={estilo}>{mensagem}</div>;
  };

  const handleAlterarSubmit = (dadosSala) => {
    // Fechar o modal
    fetchSalas();
    setShowModal(false);
  };

  const fetchSalas = async () => {
    try {
      const response = await axios.get('https://estagio-guilherme.azurewebsites.net/api/sala');
      setSalas(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados das salas:', error);
      // Tratar o erro de acordo com as necessidades do seu aplicativo
    }
  };

  const deletaSala = async (id) => {
    const userConfirmed = window.confirm('Tem certeza que deseja excluir essa sala?');

    if (userConfirmed) {
      try {
        await axios.delete(`https://estagio-guilherme.azurewebsites.net/api/sala/${id}`);
        setErro({ mensagem: 'Sala deletada com sucesso.', sucesso: true });
        fetchSalas();
      } catch (error) {
        setErro({
          mensagem: 'Erro ao deletar a sala. Por favor, tente novamente.',
          sucesso: false,
        });
        // Tratar o erro de acordo com as necessidades do seu aplicativo
      }
    }
  };

  useEffect(() => {
    // Função para buscar os dados das salas
    fetchSalas();
  }, []);

  return (
    <div className="container mt-4">
      {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Número da sala</th>
            <th>Descrição</th>
            <th>Excluir</th>
            <th>Alterar</th>
          </tr>
        </thead>
        <tbody>
          {salas.map((sala) => (
            <tr key={sala.id}>
              <td>{sala.numerosala}</td>
              <td>{sala.descricaosala}</td>
              <td>
                <Button className="btn-excluir" onClick={() => deletaSala(sala.id)}>
                  <FiTrash2 size={20} color="#FF0000" />
                </Button>
              </td>
              <td>
                <Button className="btn-editar" onClick={() => handleAlterarClick(sala)}>
                  <FiEdit size={20} color="#00FF00" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && salaSelecionada && (
        <ModalSala
          sala={salaSelecionada}
          onClose={() => setShowModal(false)}
          onSubmit={handleAlterarSubmit}
        />
      )}
    </div>
  );
};

export default TabelaSalas;
