import { Link } from 'react-router-dom';

export default function ProductCard({ producto, onEliminar }) {
  return (
    <div className='card'>
      <h3>{producto.nombre}</h3>
      <p><strong>Categoría:</strong> {producto.categoria}</p>
      <p><strong>Precio:</strong> ${producto.precio}</p>
      <p><strong>Stock:</strong> {producto.stock} uds</p>
      
      <div className='card-actions'>
        {/*  Faltaba la '/' después de editar */}
        <Link to={`/editar/${producto.id}`} className="btn-secondary"> 
          Editar 
        </Link>
        {/*  onEleminar -> onEliminar (coincide con el prop que pasas) */}
        <button 
          onClick={() => onEliminar(producto.id)} 
          className='btn-danger'
        > 
          Eliminar 
        </button>
      </div>
    </div>
  );
}
