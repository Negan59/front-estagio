import React from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  PlusSquareOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  BarsOutlined,
  UnorderedListOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import './Styles/app.css';

const { Sider } = Layout;

class MyMenu extends React.Component {
  state = {
    collapsed: false,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.toggleCollapsed}
        theme="dark"
        className={`custom-sider ${this.state.collapsed ? 'collapsed' : ''}`}
      >
        <div className="container logo-container mb-4">
          {/* ... */}
        </div>
        <Menu
          theme="dark"
          mode="vertical"
          defaultSelectedKeys={['home']}
          inlineCollapsed={this.state.collapsed}
        >
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.SubMenu
            key="cadastros"
            title="Cadastros"
            icon={<PlusSquareOutlined />}
          >
            <Menu.Item key="aluguel" icon={<CalendarOutlined />}>
              <Link to="/aluguel">Aluguel</Link>
            </Menu.Item>
            <Menu.Item key="chave" icon={<KeyOutlined />}>
              <Link to="/chave">Chave</Link>
            </Menu.Item>
            <Menu.Item key="evento" icon={<CalendarOutlined />}>
              <Link to="/evento">Evento</Link>
            </Menu.Item>
            <Menu.Item key="funcionario" icon={<UserOutlined />}>
              <Link to="/funcionario">Funcionário</Link>
            </Menu.Item>
            <Menu.Item key="itemsalao" icon={<UnorderedListOutlined />}>
              <Link to="/itemsalao">Item do Salão Paroquial</Link>
            </Menu.Item>
            <Menu.Item key="local" icon={<EnvironmentOutlined />}>
              <Link to="/local">Local</Link>
            </Menu.Item>
            <Menu.Item key="padre" icon={<TeamOutlined />}>
              <Link to="/padre">Padres</Link>
            </Menu.Item>
            <Menu.Item key="paroquiano" icon={<TeamOutlined />}>
              <Link to="/paroquiano">Paroquianos</Link>
            </Menu.Item>
            <Menu.Item key="pastoral" icon={<BarsOutlined />}>
              <Link to="/pastoral">Pastorais</Link>
            </Menu.Item>
            <Menu.Item key="sala" icon={<LogoutOutlined />}>
              <Link to="/sala">Salas</Link>
            </Menu.Item>
            <Menu.Item key="tipoatividade" icon={<UnorderedListOutlined />}>
              <Link to="/tipoatividade">Tipo Atividade</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="gerenciarsalas"
            title="Gerenciar Salas"
            icon={<PlusSquareOutlined />}
          >
          <Menu.Item key="painelchave" icon={<KeyOutlined />}>
              <Link to="/painelchave">Chave</Link>
            </Menu.Item>
            <Menu.Item key="reservar" icon={<CalendarOutlined />}>
              <Link to="/reservarsala">Reservar Sala</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="settings" icon={<LogoutOutlined />}>
            Configurações
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default MyMenu;
