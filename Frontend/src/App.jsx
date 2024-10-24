import {Routes, Route} from "react-router-dom";
import PrimaryLayout from "./layouts/PrimaryLayout";
import Employees from "./pages/Employees";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PrimaryLayout />}>
        <Route index element={<Employees />} />
      </Route>
    </Routes>
  )
}

export default App
