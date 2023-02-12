import logo from "./logo.svg";
import "./App.css";
import Registration from "./pages/registration";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Massege from "./pages/page massege";
import Chat from "./components/Chat";
function App() {
  return (
    <Routes>
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/massege" element={<Massege />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
