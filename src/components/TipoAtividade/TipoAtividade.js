import React, { useState } from 'react';
import ModalTipoAtividade from './ModalTipoAtividade';
import '../../styles/formulario.css';
import TabelaTipoAtividades from './TabelaTipoAtividade';

const TipoAtividade = () => {
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
        Adicionar Tipo de Atividade
      </button>
      {showModal && <ModalTipoAtividade onClose={handleModalToggle} />}
      <div className="tabela-container">
        <h2>Tipo de Atividades cadastrados</h2>
        <TabelaTipoAtividades key={reloadKey} />
      </div>
    </div>
  );
};

export default TipoAtividade;
