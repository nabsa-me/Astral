import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import '../styles/index.css';
import { applyTheme } from '../shared/hooks/useTheme';
import { createServices } from './services';
import { ServicesProvider } from './servicesContext';
import App from './App';

applyTheme('light');

const services = createServices();
const container = document.getElementById('root');
if (!container) throw new Error('Root container #root not found');

createRoot(container).render(
  <StrictMode>
    <ServicesProvider services={services}>
      <App />
    </ServicesProvider>
  </StrictMode>,
);
