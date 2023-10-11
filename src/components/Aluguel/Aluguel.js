import React, { useState } from 'react';
import TabelaAluguel from './TabelaAluguel';
import ModalAluguel from './ModalAluguel';
import '../../styles/formulario.css';

const Aluguel = () => {
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
        Adicionar Aluguel
      </button>
      {showModal && <ModalAluguel onClose={handleModalToggle} />}
      <div className="tabela-container">
        <h2>Aluguéis cadastrados</h2>
        <TabelaAluguel key={reloadKey} />
      </div>
    </div>
  );
};

export default Aluguel;
