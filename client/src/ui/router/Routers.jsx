import { Route, Routes } from "react-router-dom";
import Login from "../pages/credintials/Login";
import Home from "../pages/home/Home";
import Lobby from "../pages/lobby/Lobby";
import HomeOpt from "../pages/home/HomeOpt";

function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/game" element={<Home />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/gameop" element={<HomeOpt />} />
    </Routes>
  );
}

export default Routers;
