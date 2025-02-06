import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/credintials/Login";
import Home from "../pages/home/Home";
import Home2 from "../pages/home/Home2";
function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/game" element={<Home />} />
      {/* <Route path="/game" element={<Home2 />} /> */}
    </Routes>
  );
}

export default Routers;
