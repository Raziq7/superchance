import { Route, Routes } from "react-router-dom";
import Login from "../pages/credintials/Login";
import Home from "../pages/home/Home";
import Lobby from "../pages/lobby/Lobby";

function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/game" element={<Home />} />
      <Route path="/lobby" element={<Lobby />} />
    </Routes>
  );
}

export default Routers;
