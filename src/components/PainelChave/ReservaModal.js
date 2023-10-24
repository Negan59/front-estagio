import React, { useState } from 'react';
import { Modal, Button, DatePicker, TimePicker, Select } from 'antd';

const { Option } = Select;

const ReservaModal = ({ visible, onCancel, selectedDate }) => {
  const [data, setData] = useState(selectedDate);
  const [horainicio, setHoraInicio] = useState(null);
  const [horafim, setHoraFim] = useState(null);
  const [pastoral, setPastoral] = useState(null);
  const [paroquiano, setParoquiano] = useState(null);
  const [sala, setSala] = useState(null);

  const handleOk = () => {
    // Implemente a lógica para salvar os dados
    console.log({
      data,
      horainicio,
      horafim,
      pastoral,
      paroquiano,
      sala,
    });
  };

  return (
    <Modal
      title="Agendamento"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Salvar
        </Button>,
      ]}
    >
      <DatePicker
        value={data}
        onChange={(value) => setData(value)}
        style={{ marginBottom: 20, width: '100%' }}
      />
      <TimePicker.RangePicker
        value={[horainicio, horafim]}
        onChange={(value) => {
          setHoraInicio(value[0]);
          setHoraFim(value[1]);
        }}
        style={{ marginBottom: 20, width: '100%' }}
      />
      <Select
        placeholder="Selecione uma pastoral"
        style={{ marginBottom: 20, width: '100%' }}
        onChange={(value) => setPastoral(value)}
      >
        {/* Opções de pastoral */}
      </Select>
      <Select
        placeholder="Selecione um paroquiano"
        style={{ marginBottom: 20, width: '100%' }}
        onChange={(value) => setParoquiano(value)}
      >
        {/* Opções de paroquiano */}
      </Select>
      <Select
        placeholder="Selecione uma sala"
        style={{ marginBottom: 20, width: '100%' }}
        onChange={(value) => setSala(value)}
      >
        {/* Opções de sala */}
      </Select>
    </Modal>
  );
};

export default ReservaModal;