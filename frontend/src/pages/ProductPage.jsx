// ProductPage.jsx - Limpio, sin alerts ni lógica de datos
import { useParams, useNavigate } from "react-router-dom";
import ProductFrom from '../components/ProductFrom';

export default function ProductPage({ productos = [], onSave, modo }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const productoEditar = modo === 'editar'
        ? productos.find(p => p.id === id)
        : null;
    
    const handleGuardar = async (datos) => {
        try {
            if (modo === 'editar' && productoEditar?.id) {
                await onSave(productoEditar.id, datos); // App.jsx muestra alert y recarga
            } else {
                await onSave(datos); // App.jsx muestra alert y recarga
            }
            // ✅ Navegar SOLO después del éxito (el alert ya se mostró en App)
            navigate('/');
        } catch (error) {
            // Opcional: mostrar error específico del formulario
            console.error('❌ Error en formulario:', error);
            // No mostramos alert aquí para evitar duplicados
        }
    };

    return (
        <section>
            <h2>{modo === 'crear' ? 'Registrar Producto' : 'Editar Producto'}</h2>
            <ProductFrom 
                datosIniciales={productoEditar} 
                onSave={handleGuardar}
            />
        </section>
    );
}