import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-dark bg-dark px-4 d-flex justify-content-between align-items-center">
            <span className="navbar-brand fw-bold">🛒 MPS App</span>
            <div className="d-flex gap-3">
                <Link className="nav-link text-white" to="/">Usuarios</Link>
                <Link className="nav-link text-white" to="/products">Productos</Link>
            </div>
        </nav>
    );
}

export default Navbar;
