// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Entity from './pages/entity/entity';
import Rule from './pages/rule/rule';
import RuleSet from './pages/ruleSet/ruleset';
import Sidebar from './components/Sidebar/Sidebar';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <Content style={{ margin: '16px' }}>
            <Routes>
              <Route path="/" element={<div>Home Page</div>} />
              <Route path="/entity" element={<Entity />} />
              <Route path="/ruleset" element={<RuleSet />} />
              <Route path="/rule" element={<Rule />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
