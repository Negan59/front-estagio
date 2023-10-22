import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import ModalParoquiano from './ModalParoquiano';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button } from 'react-bootstrap';
import '../../styles/tabela.css'; // Certifique-se de incluir suas estilos personalizados

const TabelaParoquianos = () => {
  const [paroquianos, setParoquianos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paroquianoSelecionado, setParoquianoSelecionado] = useState(null);
  const [erro, setErro] = useState('');

  const handleAlterarClick = (paroquiano) => {
    setParoquianoSelecionado(paroquiano);
    setShowModal(true);
  };

  const Erro = ({ mensagem, sucesso }) => {
    const estilo = sucesso ? 'alert alert-success' : 'alert alert-danger';
    return <div className={estilo}>{mensagem}</div>;
  };

  const handleAlterarSubmit = (dadosParoquiano) => {
    // Fechar o modal
    buscarParoquianos();
    setShowModal(false);
  };

  const buscarParoquianos = async () => {
    try {
      const response = await axios.get('https://estagio-guilherme.azurewebsites.net/api/paroquiano');
      setParoquianos(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados dos paroquianos:', error);
      // Tratar o erro de acordo com as necessidades do seu aplicativo
    }
  };

  const deletaParoquiano = async (id) => {
    try {
      if (window.confirm('Tem certeza que deseja excluir este paroquiano?')) {
        await axios.delete(`https://estagio-guilherme.azurewebsites.net/api/paroquiano/${id}`);
        setErro({ mensagem: 'Paroquiano deletado com sucesso.', sucesso: true });
        buscarParoquianos();
      }
    } catch (error) {
      setErro({ mensagem: 'Erro ao deletar o paroquiano. Por favor, tente novamente.', sucesso: false });
      // Tratar o erro de acordo com as necessidades do seu aplicativo
    }
  };

  useEffect(() => {
    buscarParoquianos();
  }, []);

  return (
    <div className="container mt-4">
      {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Foto</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Senha</th>
            <th>Excluir</th>
            <th>Alterar</th>
          </tr>
        </thead>
        <tbody>
          {paroquianos.map((paroquiano) => (
            <tr key={paroquiano.id}>
              <td>{paroquiano.id}</td>
              <td>{paroquiano.nome}</td>
              <td>{paroquiano.foto}</td>
              <td>{paroquiano.telefone}</td>
              <td>{paroquiano.email}</td>
              <td>{paroquiano.senha}</td>
              <td>
                <Button className="btn-excluir" onClick={() => deletaParoquiano(paroquiano.id)}>
                  <FiTrash2 size={20} color="#FF0000" />
                </Button>
              </td>
              <td>
                <Button className="btn-editar" onClick={() => handleAlterarClick(paroquiano)}>
                  <FiEdit size={20} color="#00FF00" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && paroquianoSelecionado && (
        <ModalParoquiano
          paroquiano={paroquianoSelecionado}
          onClose={() => setShowModal(false)}
          onSubmit={handleAlterarSubmit}
        />
      )}
    </div>
  );
};

export default TabelaParoquianos;