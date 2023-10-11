import React, { useState } from 'react';
import TabelaEventos from './TabelaEvento';
import ModalEvento from './ModalEvento';
import '../../styles/formulario.css';

const Evento = () => {
  const [showModal, setShowModal] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleModalToggle = () => {
    setShowModal(!showModal);
    recarregarComponente();
  };

  const recarregarComponente = () => {
    // Atualize o estado da chave para forçar o componente a recarregar
    setReloadKey(reloadKey + 1);
  };

  return (
    <div className="container">
      <button className="botao" onClick={handleModalToggle}>
        Adicionar Evento
      </button>
      {showModal && <ModalEvento onClose={handleModalToggle} />}
      <div className="tabela-container">
        <h2>Eventos cadastrados</h2>
        <TabelaEventos key={reloadKey} />
      </div>
    </div>
  );
};

export default Evento;
