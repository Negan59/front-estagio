import React, { useState } from 'react';
import ModalItensSalaoParoquial from './ModalItensSalaoParoquial';
import '../../styles/formulario.css';
import TabelaItensSalaoParoquial from './TabelaItensSalaoParoquial';

const ItensSalaoParoquial = () => {
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
        Adicionar Item do salão
      </button>
      {showModal && <ModalItensSalaoParoquial onClose={handleModalToggle} />}
      <div className="tabela-container">
        <h2>Item do salão cadastrados</h2>
        <TabelaItensSalaoParoquial key={reloadKey} />
      </div>
    </div>
  );
};

export default ItensSalaoParoquial;
