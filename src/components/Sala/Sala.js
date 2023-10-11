import React, { useState } from 'react';
import TabelaSala from './TabelaSala';
import ModalSala from './ModalSala';
import '../../styles/formulario.css'

const Sala = () => {
    const [showModal, setShowModal] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
  
    const handleModalToggle = () => {
      setShowModal(!showModal);
      recarregarComponente()
    };

    const recarregarComponente = () => {
      // Atualize o estado da chave para forçar o componente a recarregar
      setReloadKey(reloadKey + 1);
    };
  
    return (
      <div className="container">
        <button className='botao' onClick={handleModalToggle}>Adicionar Sala</button>
        {showModal && <ModalSala onClose={handleModalToggle} />}
        <div className="tabela-container">
            <h2>Salas cadastradas</h2>
            <TabelaSala key={reloadKey}/>
        </div>
      </div>
    );
  };
  
  export default Sala;