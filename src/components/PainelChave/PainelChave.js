import React, { useState, useEffect } from 'react';
import { Table, Space, Tag, Tooltip, Row, Col, Card, Modal, Button, Form, Select, message, Pagination } from 'antd';
import { UnlockOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Column } = Table;
const { Option } = Select;

const PainelChave = () => {
  const [salas, setSalas] = useState([]);
  const [chaves, setChaves] = useState([]);
  const [paroquianos, setParoquianos] = useState([]);

  const [form] = Form.useForm();
  const [selectedSala, setSelectedSala] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/sala');
        const data = await response.json();

        const salasComStatusLivre = data.map((sala) => ({
          ...sala,
          estado: 'Livre',
        }));

        setSalas(salasComStatusLivre);
      } catch (error) {
        console.error('Erro ao buscar as salas:', error);
      }
    };

    fetchSalas();
  }, []);

  useEffect(() => {
    const fetchChaves = async (salaId) => {
      try {
        const response = await fetch(`https://estagio-guilherme.azurewebsites.net/api/chave/sala?idSala=${salaId}`);
        const data = await response.json();
        setChaves(data);
      } catch (error) {
        console.error('Erro ao buscar as chaves:', error);
      }
    };

    if (selectedSala) {
      fetchChaves(selectedSala.id);
    }
  }, [selectedSala]);

  useEffect(() => {
    const fetchParoquianos = async () => {
      try {
        const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/paroquiano');
        const data = await response.json();
        setParoquianos(data);
      } catch (error) {
        console.error('Erro ao buscar os paroquianos:', error);
      }
    };

    fetchParoquianos();
  }, []);

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Livre':
        return <UnlockOutlined style={{ color: 'green' }} />;
      case 'Aguardando Confirmação':
        return <ClockCircleOutlined style={{ color: 'orange' }} />;
      case 'Ocupado':
        return <CheckCircleOutlined style={{ color: 'red' }} />;
      default:
        return null;
    }
  };

  const showModal = (sala) => {
    setSelectedSala(sala);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onFinish = (values) => {
    message.success('Retirada cadastrada com sucesso!');
    setModalVisible(false);
    form.resetFields();
  };

  const onChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Row gutter={16}>
        {salas
          .slice((currentPage - 1) * pageSize, currentPage * pageSize)
          .map((sala) => (
            <Col key={sala.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={`Sala ${sala.numerosala} - ${sala.descricaosala}`}
                style={{ marginBottom: '16px', cursor: 'pointer' }}
                onClick={() => showModal(sala)}
              >
                <p>
                  <b>Status da Chave:</b> {' '}
                  {getStatusIcon(sala.estado)}
                  {sala.estado}
                </p>
                <p><b>Paroquiano:</b> {chaves.find((chave) => chave.salaId === sala.id)?.paroquiano}</p>
                <p><b>Reserva:</b> {chaves.find((chave) => chave.salaId === sala.id)?.reserva}</p>
                <p><b>Data de Retirada:</b> {chaves.find((chave) => chave.salaId === sala.id)?.dataRetirada}</p>
                <p><b>Hora de Retirada:</b> {chaves.find((chave) => chave.salaId === sala.id)?.horaRetirada}</p>
                <p><b>Hora de Devolução:</b> {chaves.find((chave) => chave.salaId === sala.id)?.horaDevolucao}</p>
                <p><b>Funcionário Responsável:</b> {chaves.find((chave) => chave.salaId === sala.id)?.funcionarioResponsavel}</p>
              </Card>
            </Col>
          ))}
      </Row>

      <Pagination
        current={currentPage}
        onChange={onChange}
        total={salas.length}
        pageSize={pageSize}
        showSizeChanger={false}
        style={{ marginTop: '16px', textAlign: 'center' }}
      />

      <Modal
        title={`Detalhes da Sala ${selectedSala?.numerosala}`}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="chave"
            label="Chave"
            rules={[
              {
                required: true,
                message: 'Selecione uma chave',
              },
            ]}
          >
            <Select placeholder="Selecione uma chave">
              {chaves
                .filter((chave) => chave.sala.id === selectedSala?.id)
                .map((chave) => (
                  <Option key={chave.id} value={chave.id}>
                    {chave.nome}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="paroquiano"
            label="Paroquiano"
          >
            <Select placeholder="Selecione um paroquiano">
              {paroquianos.map((paroquiano) => (
                <Option key={paroquiano.id} value={paroquiano.id}>
                  {paroquiano.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="reserva"
            label="Reserva"
          >
            <Select placeholder="Selecione uma reserva">
              {/* Adicione mais opções de reservas conforme necessário */}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cadastrar Retirada
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PainelChave;
