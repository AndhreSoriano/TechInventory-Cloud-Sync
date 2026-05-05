import { useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function Home({ productos = [], onEliminar, onBuscar }) {
  const [busqueda, setBusqueda] = useState('');

  const handleBuscar = (e) => {
    e.preventDefault();
    onBuscar({ q: busqueda });
  };

  return (
    <section>
      <h2>Listado de Productos</h2>
      
      <form onSubmit={handleBuscar} className="search-bar">
        <input 
          value={busqueda} 
          onChange={e => setBusqueda(e.target.value)} 
          placeholder="Buscar por nombre..." 
        />
        <button type="submit">🔍</button>
      </form>

      {/* ✅ AQUÍ ESTABA EL PROBLEMA: Falta el .map() */}
      <div className="grid">
        {productos.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
            No hay productos registrados o no coinciden con la búsqueda.
          </p>
        ) : (
          productos.map((producto) => (
            <ProductCard 
              key={producto.id} 
              producto={producto} 
              onEliminar={onEliminar} 
            />
          ))
        )}
      </div>
    </section>
  );
}