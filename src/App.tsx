import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Test } from './pages/Test';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Layout>
      {(currentPage) => {
        switch (currentPage) {
          case 'dashboard':
            return <Dashboard />;
          case 'test':
            return <Test />;
          case 'settings':
            return <Settings />;
          default:
            return <Dashboard />;
        }
      }}
    </Layout>
  );
}

export default App;
