import React, { useState, useEffect } from 'react';
import { Table, Space, Tag, Tooltip, Row, Col, Card, Modal, Button, Form, Select, message } from 'antd';
import {
  UnlockOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Column } = Table;
const { Option } = Select;

const PainelChave = () => {
  const [salas, setSalas] = useState([]); // Estado para armazenar as salas
  const [chaves, setChaves] = useState([]);

  const [form] = Form.useForm();
  const [selectedSala, setSelectedSala] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Função para buscar as salas com fetch
    const fetchSalas = async () => {
      try {
        const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/sala'); // Substitua a URL pela sua API de salas
        const data = await response.json();

        // Adicione o status "Livre" para cada sala
        const salasComStatusLivre = data.map((sala) => ({
          ...sala,
          estado: 'Livre',
        }));

        setSalas(salasComStatusLivre);
      } catch (error) {
        console.error('Erro ao buscar as salas:', error);
        // Trate o erro de acordo com as necessidades do seu aplicativo
      }
    };

    fetchSalas(); // Chame a função para buscar as salas quando o componente for montado
  }, []);

  useEffect(() => {
    // Função para buscar as chaves com base no ID da sala selecionada
    const fetchChaves = async (salaId) => {
      try {
        const response = await fetch(`https://estagio-guilherme.azurewebsites.net/api/chave/sala?idSala=${salaId}`); // Substitua a URL pela sua API de chaves
        const data = await response.json();
        console.log(data)
        setChaves(data);
      } catch (error) {
        console.error('Erro ao buscar as chaves:', error);
        // Trate o erro de acordo com as necessidades do seu aplicativo
      }
    };

    if (selectedSala) {
      fetchChaves(selectedSala.id);
    }
  }, [selectedSala]);

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
    // Simulação de cadastro fictício
    message.success('Retirada cadastrada com sucesso!');
    setModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Row gutter={16}>
        {salas.map((sala) => (
          <Col key={sala.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={`Sala ${sala.numerosala} - ${sala.descricaosala}`}
              style={{ marginBottom: '16px', cursor: 'pointer' }}
              onClick={() => showModal(sala)}
            >
              <p>
                <b>Status da Chave:</b> {' '}
                <UnlockOutlined style={{ color: 'green' }}></UnlockOutlined>
                Livre
              </p>
              <p><b>Paroquiano:</b> {chaves.find((chave) => chave.salaId === sala.id)?.paroquiano}</p>
              <p><b>Reserva:</b> {chaves.find((chave) => chave.salaId === sala.id)?.reserva}</p>
            </Card>
          </Col>
        ))}
      </Row>
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
              <Option value="Paroquiano 1">Paroquiano 1</Option>
              <Option value="Paroquiano 2">Paroquiano 2</Option>
              {/* Adicione mais opções de paroquianos conforme necessário */}
            </Select>
          </Form.Item>
          <Form.Item
            name="reserva"
            label="Reserva"
          >
            <Select placeholder="Selecione uma reserva">
              <Option value="Reserva 1">Reserva 1</Option>
              <Option value="Reserva 2">Reserva 2</Option>
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
