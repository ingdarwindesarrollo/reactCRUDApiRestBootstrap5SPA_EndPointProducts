import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from '../pages/Users';
import Products from '../pages/Products';
import Navbar from '../components/Navbar';

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;