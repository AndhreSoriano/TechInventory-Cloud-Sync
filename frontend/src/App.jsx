import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from './api/productos';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import Navbar from './components/Navbar';

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarProductos = async (filtros = {}) => {
    setCargando(true);
    try {
      const data = await obtenerProductos(filtros);
      setProductos(data);
      setError(null);
    } catch (err) {
      setError(' No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarProductos(); }, []);

// App.jsx - handleGuardar corregido
const handleGuardar = async (param1, param2) => {
  try {
    let modo, id, datos;
    
    // Detectar modo automáticamente
    if (param2 && typeof param2 === 'object' && param2.nombre) {
      modo = 'editar';
      id = param1;
      datos = param2;
    } else {
      modo = 'crear';
      datos = param1;
    }

    if (modo === 'crear') {
      await crearProducto(datos);
    } else {
      await actualizarProducto(id, datos);
    }
    
    // ✅ ÚNICO ALERT aquí + recargar datos
    alert(`✅ Producto ${modo === 'crear' ? 'creado' : 'actualizado'}`);
    await cargarProductos(); // Esperar a que termine antes de navegar
    
  } catch (err) {
    console.error('Error al guardar:', err);
    alert('Error: ' + (err.response?.data?.error || err.message));
    throw err; // 🔥 Propagar error para que ProductPage lo maneje si quiere
  }
};

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      await eliminarProducto(id);
      cargarProductos();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        {cargando && <p className="spinner"> Cargando inventario...</p>}
        {error && <p className="error">{error}</p>}
        {!cargando && !error && (
          <Routes>
            <Route path="/" element={<Home productos={productos} onEliminar={handleEliminar} onBuscar={cargarProductos} />} />
            <Route path="/nuevo" element={<ProductPage onSave={handleGuardar} modo="crear" />} />
            <Route path="/editar/:id" element={<ProductPage productos={productos} onSave={handleGuardar} modo="editar" />} />
          </Routes>
        )}
      </main>
    </BrowserRouter>
  );
}

export default App;