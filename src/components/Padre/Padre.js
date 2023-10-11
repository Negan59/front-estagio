import React, { useState } from 'react';
import ModalPadre from './ModalPadre';
import '../../styles/formulario.css';
import TabelaPadres from './TabelaPadre';

const Padre = () => {
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
        Adicionar Padre
      </button>
      {showModal && <ModalPadre onClose={handleModalToggle} />}
      <div className="tabela-container">
        <h2>Padres cadastrados</h2>
        <TabelaPadres key={reloadKey} />
      </div>
    </div>
  );
};

export default Padre;
