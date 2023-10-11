import React, { useState } from 'react';
import TabelaPastorais from './TabelaPastoral';
import ModalPastoral from './ModalPastoral';
import '../../styles/formulario.css';

const Pastoral = () => {
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
        Adicionar Pastoral
      </button>
      {showModal && <ModalPastoral onClose={handleModalToggle} />}
      <div className="tabela-container">
        <h2>Pastorais cadastradas</h2>
        <TabelaPastorais key={reloadKey} />
      </div>
    </div>
  );
};

export default Pastoral;
