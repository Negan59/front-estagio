import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import ModalLocal from './ModalLocal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button } from 'react-bootstrap';
import '../../styles/tabela.css'; // Certifique-se de incluir seus estilos personalizados

const TabelaLocal = () => {
  const [locais, setLocais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [erro, setErro] = useState('');

  const handleAlterarClick = (local) => {
    setLocalSelecionado(local);
    setShowModal(true);
  };

  const Erro = ({ mensagem, sucesso }) => {
    const estilo = sucesso ? 'alert alert-success' : 'alert alert-danger';
    return <div className={estilo}>{mensagem}</div>;
  };

  const handleAlterarSubmit = (dadosLocal) => {
    // Fechar o modal
    buscarLocais();
    setShowModal(false);
  };

  const buscarLocais = async () => {
    try {
      const response = await axios.get('https://estagio-guilherme.azurewebsites.net/api/local');
      setLocais(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados dos locais:', error);
      // Tratar o erro de acordo com as necessidades do seu aplicativo
    }
  };

  const deletaLocal = async (id) => {
    try {
      if (window.confirm('Tem certeza que deseja excluir este local?')) {
        await axios.delete(`https://estagio-guilherme.azurewebsites.net/api/local/${id}`);
        setErro({ mensagem: 'Local deletado com sucesso.', sucesso: true });
        buscarLocais();
      }
    } catch (error) {
      setErro({ mensagem: 'Erro ao deletar o local. Por favor, tente novamente.', sucesso: false });
      // Tratar o erro de acordo com as necessidades do seu aplicativo
    }
  };

  useEffect(() => {
    buscarLocais();
  }, []);

  return (
    <div className="container mt-4">
      {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Endereço</th>
            <th>Telefone</th>
            <th>Bairro</th>
            <th>CEP</th>
            <th>Excluir</th>
            <th>Alterar</th>
          </tr>
        </thead>
        <tbody>
          {locais.map((local) => (
            <tr key={local.id}>
              <td>{local.nome}</td>
              <td>{local.endereco}</td>
              <td>{local.telefone}</td>
              <td>{local.bairro}</td>
              <td>{local.cep}</td>
              <td>
                <Button variant="danger" onClick={() => deletaLocal(local.id)}>
                  <FiTrash2 size={20} />
                </Button>
              </td>
              <td>
                <Button variant="success" onClick={() => handleAlterarClick(local)}>
                  <FiEdit size={20} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && localSelecionado && (
        <ModalLocal
          local={localSelecionado}
          onClose={() => setShowModal(false)}
          onSubmit={handleAlterarSubmit}
        />
      )}
    </div>
  );
};

export default TabelaLocal;
