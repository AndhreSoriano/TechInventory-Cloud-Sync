import { Link } from "react-router-dom";

export default function Navbar () {
    return (
        <nav className="navbar">
            <h1>TechInventory</h1>
            <div>
                <Link to="/"> Inicio</Link>
                <Link to="/nuevo" className="btn-primary"> Nuevo Producto</Link>
            </div>
        </nav>
    );
}