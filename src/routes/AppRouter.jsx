import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from '../pages/Users';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;