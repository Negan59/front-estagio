import React, { useState } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Menu';
import './styles/app.css';
import Header from './components/Header';
import Home from './components/Home';
import Sala from './components/Sala/Sala';
import Paroquiano from './components/Paroquiano/Paroquiano';
import Pastoral from './components/Pastoral/Pastoral';
import Local from './components/Local/Local';
import TipoAtividade from './components/TipoAtividade/TipoAtividade'
import Aluguel from './components/Aluguel/Aluguel';
import Evento from './components/Evento/Evento';
import Funcionario from './components/Funcionario/Funcionario';
import Padre from './components/Padre/Padre';
import ItensSalaoParoquial from './components/ItensSalaoParoquial/ItensSalaoParoquial';
import PainelChave from './components/PainelChave/PainelChave';
import Chave from './components/Chave/Chave';

const { Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh', backgroundColor: 'white' }}> {/* Defina o background como branco */}
        <Sidebar collapsed={collapsed} />
        
        <Layout className="site-layout">
        <Header></Header>
          <Content style={{ margin: '16px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/aluguel" element={<Aluguel />} />
              <Route path="/chave" element={<Chave />} />
              <Route path="/evento" element={<Evento />} />
              <Route path="/funcionario" element={<Funcionario />} />
              <Route path="/itemsalao" element={<ItensSalaoParoquial />} />
              <Route path="/local" element={<Local />} />
              <Route path="/sala" element={<Sala />} />
              <Route path="/padre" element={<Padre />} />
              <Route path="/paroquiano" element={<Paroquiano />} />
              <Route path="/pastoral" element={<Pastoral />} />
              <Route path="/tipoatividade" element={<TipoAtividade />} />
              <Route path="/painelchave" element={<PainelChave />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
