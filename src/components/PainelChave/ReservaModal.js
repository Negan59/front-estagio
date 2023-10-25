import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Modal, Button, DatePicker, TimePicker, Select } from 'antd';

const { Option } = Select;

const ReservaModal = ({ visible, onCancel, selectedDate }) => {
  const [data, setData] = useState(moment(selectedDate));
  const [horainicio, setHoraInicio] = useState(null);
  const [horafim, setHoraFim] = useState(null);
  const [pastoral, setPastoral] = useState(null);
  const [paroquiano, setParoquiano] = useState(null);
  const [sala, setSala] = useState(null);
  const [pastorais, setPastorais] = useState([]);
  const [paroquianos, setParoquianos] = useState([]);
  const [salas, setSalas] = useState([]);
  
  useEffect(() => {
    setData(selectedDate)
    const fetchPastorais = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/pastoral/ativos');
        const data = await response.json();
        setPastorais(data);
      } catch (error) {
        console.error('Erro ao buscar as pastorais:', error);
      }
    };

    fetchPastorais();
  }, []);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/sala');
        const data = await response.json();
        setSalas(data);
      } catch (error) {
        console.error('Erro ao buscar as salas:', error);
      }
    };

    fetchSalas();
  }, []);

  useEffect(() => {
    const fetchParoquianos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/paroquiano');
        const data = await response.json();
        setParoquianos(data);
      } catch (error) {
        console.error('Erro ao buscar os paroquianos:', error);
      }
    };

    fetchParoquianos();
  }, []);

  const handleCancel = () => {
    console.log("vai fechar não caralho")
    onCancel(); // Chame a função onCancel para fechar o modal
  };

  const handleOk = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reserva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: data.format('YYYY-MM-DD'),
          horainicio: horainicio.format('HH:mm'),
          horafim: horafim.format('HH:mm'),
          pastoral,
          paroquiano,
          sala,
        }),
      });
      const responseData = await response.json();
      console.log('Reserva salva com sucesso', responseData);
      handleCancel(); // Fechar o modal após salvar com sucesso
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
    }
  };

  return (
    <Modal
      title="Agendamento"
      visible={visible}
      onCancel={handleCancel} // Chame handleCancel para fechar o modal
      footer={[
        <Button key="back" onClick={handleCancel} style={{ color: 'red' }}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Salvar
        </Button>,
      ]}
      closeIcon={<span className="close-icon" onClick={handleCancel}>&times;</span>} // Use handleCancel no evento onClick
    >
      <DatePicker
        value={data}
        onChange={(value) => setData(value)}
        format="DD-MM-YYYY"
        style={{ marginBottom: 20, width: '100%' }}
      />

      <TimePicker.RangePicker
        value={[horainicio, horafim]}
        onChange={(values) => {
          setHoraInicio(values[0]);
          setHoraFim(values[1]);
        }}
        style={{ marginBottom: 20, width: '100%' }}
      />

      <Select
        placeholder="Selecione uma pastoral"
        style={{ marginBottom: 20, width: '100%' }}
        onChange={(value) => setPastoral(value)}
      >
        {pastorais.map((pastoral) => (
          <Option key={pastoral.id} value={pastoral.id}>
            {pastoral.nome}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Selecione um paroquiano"
        style={{ marginBottom: 20, width: '100%' }}
        onChange={(value) => setParoquiano(value)}
      >
        {paroquianos.map((paroquiano) => (
          <Option key={paroquiano.id} value={paroquiano.id}>
            {paroquiano.nome}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Selecione uma sala"
        style={{ marginBottom: 20, width: '100%' }}
        onChange={(value) => setSala(value)}
      >
        {salas.map((sala) => (
          <Option key={sala.id} value={sala.id}>
            {sala.nome}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default ReservaModal;
