import {Routes, Route} from "react-router-dom";
import PrimaryLayout from "./layouts/PrimaryLayout";
import Employees from "./pages/Employees";
import { ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';   
function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<PrimaryLayout />}>
        <Route index element={<Employees />} />
      </Route>
      
    </Routes>
    <ToastContainer />
    </>
  )
}

export default App
