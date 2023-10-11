import React, { useState } from 'react';
import TabelaParoquiano from './TabelaParoquiano';
import ModalParoquiano from './ModalParoquiano';
import '../../styles/formulario.css';

const Paroquiano = () => {
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
        Adicionar Paroquiano
      </button>
      {showModal && (
        <ModalParoquiano
          onClose={handleModalToggle}
          backdrop="static"
          keyboard={false}
        />
      )}
      <div className="tabela-container">
        <h2>Paroquianos cadastrados</h2>
        <TabelaParoquiano key={reloadKey} />
      </div>
    </div>
  );
};

export default Paroquiano;
