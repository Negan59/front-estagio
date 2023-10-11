import React, { useState } from 'react';
import TabelaChave from './TabelaChave'; // Importe o componente de tabela de chaves
import ModalChave from './ModalChave'; // Importe o componente modal de chaves
import '../../styles/formulario.css';

const Chave = () => {
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
      <button className='botao' onClick={handleModalToggle}>Adicionar Chave</button>
      {showModal && <ModalChave onClose={handleModalToggle} />}
      <div className="tabela-container">
        <h2>Chaves cadastradas</h2>
        <TabelaChave key={reloadKey} />
        {/* Substitua TabelaChave pelo nome do componente de tabela de chaves */}
      </div>
    </div>
  );
};

export default Chave;
