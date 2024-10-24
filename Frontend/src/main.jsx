import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import EmployeesProvider from './providers/EmployeesProvider/index.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <EmployeesProvider>
      <App />
    </EmployeesProvider>
  </BrowserRouter>
)
