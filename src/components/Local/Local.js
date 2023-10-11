import React, { useState } from 'react';
import TabelaLocal from './TabelaLocal';
import ModalLocal from './ModalLocal';
import '../../styles/formulario.css';

const Local = () => {
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
        Adicionar Local
      </button>
      {showModal && <ModalLocal onClose={handleModalToggle} />}
      <div className="tabela-container">
        <h2>Locais cadastrados</h2>
        <TabelaLocal key={reloadKey} />
      </div>
    </div>
  );
};

export default Local;
