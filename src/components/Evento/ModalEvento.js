import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../../styles/formulario.css';

const ModalEvento = ({ evento, onSubmit, onClose }) => {
  const [id, setId] = useState('');
  const [nomeEvento, setNomeEvento] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [horaIniArrumacao, setHoraIniArrumacao] = useState('');
  const [horaFimArrumacao, setHoraFimArrumacao] = useState('');
  const [dataArrumacao, setDataArrumacao] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacao, setObservacao] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (evento) {
      setId(evento.id);
      setNomeEvento(evento.nomeevento);
      setDataEvento(evento.dataevento);
      setHoraInicio(evento.horainicio);
      setHoraFim(evento.horafim);
      setHoraIniArrumacao(evento.horainiarrumacao);
      setHoraFimArrumacao(evento.horafimarrumacao);
      setDataArrumacao(evento.dataarrumacao);
      setTelefone(evento.telefone);
      setObservacao(evento.observacao);
    }
  }, [evento]);

  const Erro = ({ mensagem, sucesso }) => {
    const estilo = sucesso ? 'mensagem-sucesso' : 'mensagem-fracasso';
    return <div className={estilo}>{mensagem}</div>;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (nomeEvento === '') {
      setErro({ mensagem: 'Campo obrigatório: Nome do Evento', sucesso: false });
      return;
    }

    if (dataEvento === '') {
      setErro({ mensagem: 'Campo obrigatório: Data do Evento', sucesso: false });
      return;
    }

    if (horaInicio === '') {
      setErro({ mensagem: 'Campo obrigatório: Hora de Início', sucesso: false });
      return;
    }

    if (horaFim === '') {
      setErro({ mensagem: 'Campo obrigatório: Hora de Fim', sucesso: false });
      return;
    }

    if (horaIniArrumacao === '') {
      setErro({ mensagem: 'Campo obrigatório: Hora de Início de Arrumação', sucesso: false });
      return;
    }

    if (horaFimArrumacao === '') {
      setErro({ mensagem: 'Campo obrigatório: Hora de Fim de Arrumação', sucesso: false });
      return;
    }

    if (dataArrumacao === '') {
      setErro({ mensagem: 'Campo obrigatório: Data de Arrumação', sucesso: false });
      return;
    }

    if (telefone === '') {
      setErro({ mensagem: 'Campo obrigatório: Telefone', sucesso: false });
      return;
    }

    if (observacao === '') {
      setErro({ mensagem: 'Campo obrigatório: Observação', sucesso: false });
      return;
    }

    let data = {};

    if (id) {
      data = {
        id: id,
        nomeevento: nomeEvento,
        dataevento: dataEvento,
        horainicio: horaInicio,
        horafim: horaFim,
        horainiarrumacao: horaIniArrumacao,
        horafimarrumacao: horaFimArrumacao,
        dataarrumacao: dataArrumacao,
        telefone: telefone,
        observacao: observacao,
      };

      axios
        .put(`https://estagio-guilherme.azurewebsites.net/api/evento`, data)
        .then((response) => {
          console.log('Dados atualizados com sucesso:', response.data);
          onSubmit(response.data);
          setId('');
          setNomeEvento('');
          setDataEvento('');
          setHoraInicio('');
          setHoraFim('');
          setHoraIniArrumacao('');
          setHoraFimArrumacao('');
          setDataArrumacao('');
          setTelefone('');
          setObservacao('');
          setErro('');
          onClose();
        })
        .catch((error) => {
          console.error('Erro ao atualizar os dados:', error);
          setErro({ mensagem: 'Erro ao atualizar o evento. Por favor, tente novamente.', sucesso: false });
        });
    } else {
      data = {
        nomeevento: nomeEvento,
        dataevento: dataEvento,
        horainicio: horaInicio,
        horafim: horaFim,
        horainiarrumacao: horaIniArrumacao,
        horafimarrumacao: horaFimArrumacao,
        dataarrumacao: dataArrumacao,
        telefone: telefone,
        observacao: observacao,
      };

      axios
        .post('https://estagio-guilherme.azurewebsites.net/api/evento', data)
        .then((response) => {
          console.log(response.data, response.data.status);
          if (response.data.status === 200) {
            setId('');
            setNomeEvento('');
            setDataEvento('');
            setHoraInicio('');
            setHoraFim('');
            setHoraIniArrumacao('');
            setHoraFimArrumacao('');
            setDataArrumacao('');
            setTelefone('');
            setObservacao('');
            setErro('');
            onClose();
          } else {
            setErro({ mensagem: 'Erro ao adicionar o evento. Por favor, tente novamente.', sucesso: false });
          }
        })
        .catch((error) => {
          console.error('Erro ao salvar os dados:', error);
          setErro({ mensagem: 'Erro ao adicionar o evento. Por favor, tente novamente.', sucesso: false });
        });
    }
  };

  const handleModalContentClick = (event) => {
    event.stopPropagation();
  };

  const handleModalClose = () => {
    setErro('');
    onClose();
  };

  return (
    <div className="modal" onClick={handleModalClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <h2>{id ? 'Editar Evento' : 'Inserir Evento'}</h2>
        {erro && <Erro mensagem={erro.mensagem} sucesso={erro.sucesso} />}
        <form onSubmit={handleSubmit} className="evento-form">
          <div className="form-group">
            <label htmlFor="id">ID:</label>
            <input type="number" id="id" value={id} onChange={(e) => setId(e.target.value)} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="nomeEvento">Nome do Evento:</label>
            <input
              type="text"
              id="nomeEvento"
              value={nomeEvento}
              onChange={(e) => setNomeEvento(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dataEvento">Data do Evento:</label>
            <input
              type="date"
              id="dataEvento"
              value={dataEvento}
              onChange={(e) => setDataEvento(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="horaInicio">Hora de Início:</label>
            <input
              type="time"
              id="horaInicio"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="horaFim">Hora de Fim:</label>
            <input
              type="time"
              id="horaFim"
              value={horaFim}
              onChange={(e) => setHoraFim(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="horaIniArrumacao">Hora de Início de Arrumação:</label>
            <input
              type="time"
              id="horaIniArrumacao"
              value={horaIniArrumacao}
              onChange={(e) => setHoraIniArrumacao(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="horaFimArrumacao">Hora de Fim de Arrumação:</label>
            <input
              type="time"
              id="horaFimArrumacao"
              value={horaFimArrumacao}
              onChange={(e) => setHoraFimArrumacao(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dataArrumacao">Data de Arrumação:</label>
            <input
              type="date"
              id="dataArrumacao"
              value={dataArrumacao}
              onChange={(e) => setDataArrumacao(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefone">Telefone:</label>
            <input
              type="text"
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="observacao">Observação:</label>
            <textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              required
            ></textarea>
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

export default ModalEvento;
