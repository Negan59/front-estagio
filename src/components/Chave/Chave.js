import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import TabelaChave from './TabelaChave';
import ModalChave from './ModalChave';
import '../../styles/formulario.css';

const Chave = () => {
  const [showModal, setShowModal] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleModalToggle = () => {
    setShowModal(!showModal);
    recarregarComponente();
  };

  const recarregarComponente = () => {
    setReloadKey(reloadKey + 1);
  };

  const handleErro = (mensagem) => {
    setError(mensagem);
    setSuccess(null);
  };

  const handleSucesso = (mensagem) => {
    setSuccess(mensagem);
    setError(null);
  };

  const renderErrorCard = () => {
    return (
      <Alert variant="danger" onClose={() => setError(null)} dismissible>
        {error}
      </Alert>
    );
  };

  const renderSuccessCard = () => {
    return (
      <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
        {success}
      </Alert>
    );
  };

  return (
    <div className="container">
      <button className="botao" onClick={handleModalToggle}>
        Adicionar Chave
      </button>
      {showModal && <ModalChave onClose={handleModalToggle} onErro={handleErro} onSucesso={handleSucesso} />}
      <div className="tabela-container">
        <h2>Chaves cadastradas</h2>
        {error && renderErrorCard()}
        {success && renderSuccessCard()}
        <TabelaChave key={reloadKey} onErro={handleErro} onSucesso={handleSucesso} />
      </div>
    </div>
  );
};

export default Chave;
