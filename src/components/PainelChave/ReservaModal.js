import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Modal, Button, DatePicker, TimePicker, Select } from 'antd';

const { Option } = Select;

const ReservaModal = ({ visible, onCancel, selectedDate, fetchReservas }) => {
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
    setData(selectedDate);
    const fetchPastorais = async () => {
      try {
        const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/pastoral/ativos');
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
        const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/sala');
        const data = await response.json();
        setSalas(data);
      } catch (error) {
        console.error('Erro ao buscar as salas:', error);
      }
    };

    fetchSalas();
  }, []);

  const fetchParoquianos = async (pastoral) => {
    console.log("entrou?", pastoral)
    if (pastoral) {
      try {
        const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/paroquianov2/' + pastoral);
        const data = await response.json();
        console.log(data)
        setParoquianos(data);
      } catch (error) {
        console.error('Erro ao buscar os paroquianos:', error);
      }
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleOk = async () => {
    console.log("buscando")
    let objPastoral = await buscaPastoralId(pastoral)
    let objParoquiano = await buscaParoquianoId(paroquiano)
    let objSala = await buscaSalaId(sala)
    console.log(paroquiano)
    let obj = {
      data: data.format('YYYY-MM-DD'),
      horainicio: horainicio.format('HH:mm'),
      horafim: horafim.format('HH:mm'),
      pastoral: objPastoral,
      paroquiano: objParoquiano,
      sala: objSala
    }
    console.log(obj)
    try {
      const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/reserva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });
      const responseData = await response.json();
      alert('Reserva salva com sucesso!');
      handleCancel();
      setData(moment(selectedDate));
      setHoraInicio(null);
      setHoraFim(null);
      setPastoral(null);
      setParoquiano(null);
      setSala(null);
      fetchReservas();
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
      // Adicione um alerta ou uma notificação para o usuário saber se houve algum erro durante o processo
      alert('Erro ao salvar reserva!');
    }
  };

  const buscaPastoralId = async (id) => {
    try {
      const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/pastoral/' + id);
      const data = await response.json();
      return data
    } catch (error) {
      console.error('Erro ao buscar as pastorais:', error);
    }
  }

  const buscaParoquianoId = async (id) => {
    try {
      const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/paroquiano/' + id);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar as pastorais:', error);
    }
  }

  const buscaSalaId = async (id) => {
    try {
      const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/sala/' + id);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar as pastorais:', error);
    }
  }

  return (
    <Modal
      title="Agendamento"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel} style={{ color: 'red' }}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Salvar
        </Button>,
      ]}
      closeIcon={<span className="close-icon" onClick={handleCancel}>&times;</span>}
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
        onChange={(value) => { setPastoral(value); fetchParoquianos(value); }}
      >
        {pastorais.map((pastoral) => (
          <Option key={pastoral.id} value={pastoral.id}>
            {pastoral.nomepastoral}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Selecione um paroquiano"
        style={{ marginBottom: 20, width: '100%' }}
        onChange={(value) => setParoquiano(value)}
        disabled={!pastoral}
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
            {sala.descricaosala}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default ReservaModal;
