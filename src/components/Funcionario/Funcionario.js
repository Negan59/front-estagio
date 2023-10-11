import React, { useState } from 'react';
import ModalFuncionario from './ModalFuncionario';
import '../../styles/formulario.css';
import TabelaFuncionarios from './TabelaFuncionario';

const Funcionario = () => {
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
        Adicionar Funcionario
      </button>
      {showModal && <ModalFuncionario onClose={handleModalToggle} />}
      <div className="tabela-container">
        <h2>Funcionários cadastrados</h2>
        <TabelaFuncionarios key={reloadKey} />
      </div>
    </div>
  );
};

export default Funcionario;
