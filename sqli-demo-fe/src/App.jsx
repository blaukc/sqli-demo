import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home'
import Classic from './Classic'
import BlindContent from "./BlindContent";
import BlindTime from "./BlindTime";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="classic" element={<Classic />} />
        <Route path="blind-content" element={<BlindContent />} />
        <Route path="blind-time" element={<BlindTime />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;