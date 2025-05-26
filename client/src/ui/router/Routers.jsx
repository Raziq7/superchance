import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/credintials/Login';

const Home = lazy(() => import('../pages/home/Home'));
const Lobby = lazy(() => import('../pages/lobby/Lobby'));
const HomeOpt = lazy(() => import('../pages/home/HomeOpt'));

// fallback component
const Loading = () => <div>Loading...</div>;

function Routers() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/game" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/gameop" element={<HomeOpt />} />
      </Routes>
    </Suspense>
  );
}

export default Routers;
