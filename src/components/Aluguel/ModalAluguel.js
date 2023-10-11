import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../../styles/formulario.css';

const ModalAluguel = ({ aluguel, onSubmit, onClose }) => {
  const [id, setId] = useState('');
  const [nomeAluguel, setNomeAluguel] = useState('');
  const [documento, setDocumento] = useState('');
  const [valor, setValor] = useState(0);
  const [valorAdicional, setValorAdicional] = useState(0);
  const [data, setData] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (aluguel) {
      setId(aluguel.id);
      setNomeAluguel(aluguel.nomealuguel);
      setDocumento(aluguel.documento);
      setValor(aluguel.valor);
      setValorAdicional(aluguel.valoradicional);
      setData(aluguel.data);
      setTelefone(aluguel.telefone);
    }
  }, [aluguel]);

  const Erro = ({ mensagem, sucesso }) => {
    const estilo = sucesso ? 'mensagem-sucesso' : 'mensagem-fracasso';
    return <div className={estilo}>{mensagem}</div>;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (nomeAluguel === '') {
      setErro({ mensagem: 'Campo obrigatório: Nome do Aluguel', sucesso: false });
      return;
    }

    if (documento === '') {
      setErro({ mensagem: 'Campo obrigatório: Documento', sucesso: false });
      return;
    }

    if (valor === '') {
      setErro({ mensagem: 'Campo obrigatório: Valor', sucesso: false });
      return;
    }

    if (valorAdicional === '') {
      setErro({ mensagem: 'Campo obrigatório: Valor Adicional', sucesso: false });
      return;
    }

    if (data === '') {
      setErro({ mensagem: 'Campo obrigatório: Data', sucesso: false });
      return;
    }

    if (telefone === '') {
      setErro({ mensagem: 'Campo obrigatório: Telefone', sucesso: false });
      return;
    }

    let data = {};

    if (id) {
      data = {
        id: id,
        nomealuguel: nomeAluguel,
        documento: documento,
        valor: valor,
        valoradicional: valorAdicional,
        data: data,
        telefone: telefone,
      };

      // Atualização (Editar)
      axios
        .put(`https://estagio-guilherme.azurewebsites.net/api/aluguel`, data)
        .then((response) => {
          console.log('Dados atualizados com sucesso:', response.data);
          onSubmit(response.data);
          setId('');
          setNomeAluguel('');
          setDocumento('');
          setValor(0);
          setValorAdicional(0);
          setData('');
          setTelefone('');
          setErro('');
          onClose();
        })
        .catch((error) => {
          console.error('Erro ao atualizar os dados:', error);
          setErro({ mensagem: 'Erro ao atualizar o aluguel. Por favor, tente novamente.', sucesso: false });
        });
    } else {
      data = {
        nomealuguel: nomeAluguel,
        documento: documento,
        valor: valor,
        valoradicional: valorAdicional,
        data: data,
        telefone: telefone,
      };

      // Inserção (Salvar)
      axios
        .post('https://estagio-guilherme.azurewebsites.net/api/aluguel', data)
        .then((response) => {
          console.log(response.data, response.data.status);
          if (response.data.status === 200) {
            setId('');
            setNomeAluguel('');
            setDocumento('');
            setValor(0);
            setValorAdicional(0);
            setData('');
            setTelefone('');
            setErro('');
            onClose();
          } else {
            setErro({ mensagem: 'Erro ao adicionar o aluguel. Por favor, tente novamente.', sucesso: false });
          }
        })
        .catch((error) => {
          console.error('Erro ao salvar os dados:', error);
          setErro({ mensagem: 'Erro ao adicionar o aluguel. Por favor, tente novamente.', sucesso: false });
        });
    }
  };

  const handleModalContentClick = (event) => {
    // Impede a propagação do evento de clique para o contêiner do modal
    event.stopPropagation();
  };

  const handleModalClose = () => {
    setErro('');
    onClose();
  };

  return (
    <div className="modal" onClick={handleModalClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <h2>{id ? 'Editar Aluguel' : 'Inserir Aluguel'}</h2>
        {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
        <form onSubmit={handleSubmit} className="aluguel-form">
          <div className="form-group">
            <label htmlFor="id">ID:</label>
            <input type="number" id="id" value={id} onChange={(e) => setId(e.target.value)} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="nomeAluguel">Nome do Aluguel:{' '}
              {nomeAluguel === '' && <span className="campo-obrigatorio">* Obrigatório</span>}
            </label>
            <input
              type="text"
              id="nomeAluguel"
              value={nomeAluguel}
              onChange={(e) => setNomeAluguel(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="documento">Documento:{' '}
              {documento === '' && <span className="campo-obrigatorio">* Obrigatório</span>}
            </label>
            <input
              type="text"
              id="documento"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="valor">Valor:{' '}
              {valor === '' && <span className="campo-obrigatorio">* Obrigatório</span>}
            </label>
            <input
              type="number"
              id="valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              min={0}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="valorAdicional">Valor Adicional:{' '}
              {valorAdicional === '' && <span className="campo-obrigatorio">* Obrigatório</span>}
            </label>
            <input
              type="number"
              id="valorAdicional"
              value={valorAdicional}
              onChange={(e) => setValorAdicional(e.target.value)}
              min={0}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="data">Data:{' '}
              {data === '' && <span className="campo-obrigatorio">* Obrigatório</span>}
            </label>
            <input
              type="date"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefone">Telefone:{' '}
              {telefone === '' && <span className="campo-obrigatorio">* Obrigatório</span>}
            </label>
            <input
              type="text"
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="btn-salvar" id="btn-salvar">
              {id ? 'Atualizar' : 'Salvar'}
            </button>
            <button type="button" className="btn-fechar" onClick={handleModalClose}>
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAluguel;
