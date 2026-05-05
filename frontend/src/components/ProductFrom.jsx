import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// 🎨 Estilos para el "escándalo" (puedes moverlos a tu CSS)
const styles = {
  inputError: {
    borderColor: '#ff4444',
    boxShadow: '0 0 0 3px rgba(255, 68, 68, 0.3)',
    animation: 'shake 0.3s ease-in-out'
  },
  errorBadge: {
    backgroundColor: '#ff4444',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '6px'
  },
  overlay: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#ff4444',
    color: 'white',
    padding: '14px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    zIndex: 9999,
    animation: 'slideIn 0.3s ease-out',
    fontWeight: '600'
  }
};

// 🎭 Función para crear handler con "escándalo" incluido
const createNumericOnlyHandler = (formik, fieldName, onBlocked) => {
  return (e) => {
    const valorNuevo = e.target.value;
    const regex = /^\d*$/; // ✅ SOLO NÚMEROS, nada más

    if (regex.test(valorNuevo)) {
      formik.setFieldError(fieldName, ''); // Limpia error si corrige
      formik.handleChange(e);
    } else {
      e.preventDefault();
      
      // 🚨 ¡MÁXIMO ESCÁNDALO!
      onBlocked?.(); // Ejecuta la función de "alarma"
      
      // Bloquea el valor: NO actualiza Formik
      // El input se mantiene con el último valor válido
    }
  };
};

export default function ProductForm({ datosIniciales, onSave }) {
  const navigate = useNavigate();
  const [showBlockedAlert, setShowBlockedAlert] = useState(false);
  const [blockedField, setBlockedField] = useState('');

  // 🎯 Función que activa el "escándalo"
  const activarEscandalo = (fieldName) => {
    setBlockedField(fieldName);
    setShowBlockedAlert(true);
    
    // Sonido opcional (descomenta si quieres)
    // new Audio('/sounds/error.mp3')?.play().catch(() => {});
    
    // Ocultar alerta después de 2.5 segundos
    setTimeout(() => setShowBlockedAlert(false), 1000);
  };

  const formik = useFormik({
    initialValues: datosIniciales || { nombre: '', categoria: '', precio: '', stock: '' },
    validationSchema: Yup.object().shape({
      nombre: Yup.string().required('El nombre es obligatorio').min(3, 'Mínimo 3 caracteres'),
      categoria: Yup.string().required('Selecciona una categoría'),
      precio: Yup.number().required('El precio es obligatorio').positive('Debe ser positivo').typeError('Ingresa un número válido'),
      stock: Yup.number().required('El stock es obligatorio').integer('Debe ser entero').min(0, 'No puede ser negativo')
    }),
    onSubmit: (valores) => {
      if (typeof onSave !== 'function') {
        console.error('❌ onSave NO es una función');
        alert('Error interno: No se puede guardar el producto');
        return;
      }
      onSave(valores);
      navigate('/');
    }
  });

  // Handlers con "escándalo" para campos numéricos
  const handlers = {
    precio: createNumericOnlyHandler(formik, 'precio', () => activarEscandalo('precio')),
    stock: createNumericOnlyHandler(formik, 'stock', () => activarEscandalo('stock'))
  };

  return (
    <>
      {/* 🚨 Overlay de alerta dramática */}
      {showBlockedAlert && (
        <div style={styles.overlay}>
          🚫 <strong>¡ALTO!</strong> Solo se permiten números nada más
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="form-container">
        
        {/* 👤 Nombre (sin bloqueo especial) */}
        <label>Nombre:
          <input
            name="nombre"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.nombre && formik.errors.nombre && (
            <span className="error">{formik.errors.nombre}</span>
          )}
        </label>

        {/* 📂 Categoría */}
        <label>Categoría:
          <select
            name="categoria"
            value={formik.values.categoria}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Seleccionar...</option>
            <option value="Laptop">Laptop</option>
            <option value="Periférico">Periférico</option>
            <option value="Monitor">Monitor</option>
          </select>
          {formik.touched.categoria && formik.errors.categoria && (
            <span className="error">{formik.errors.categoria}</span>
          )}
        </label>

        {/* 💰 Precio - ¡CON ESCÁNDALO! */}
        <label>Precio:
          <input
            type="text"
            name="precio"
            value={formik.values.precio}
            onChange={handlers.precio}
            onBlur={formik.handleBlur}
            placeholder="Ej: 1299"
            style={blockedField === 'precio' && showBlockedAlert ? styles.inputError : {}}
          />
          {/* Badge dramático de error */}
          {blockedField === 'precio' && showBlockedAlert && (
            <div style={styles.errorBadge}>
              🔢 Solo se permiten números nada más
            </div>
          )}
          {formik.touched.precio && formik.errors.precio && !showBlockedAlert && (
            <span className="error">{formik.errors.precio}</span>
          )}
        </label>

        {/* 📦 Stock - ¡CON ESCÁNDALO! */}
        <label>Stock:
          <input
            type="text"
            name="stock"
            value={formik.values.stock}
            onChange={handlers.stock}
            onBlur={formik.handleBlur}
            placeholder="Ej: 50"
            style={blockedField === 'stock' && showBlockedAlert ? styles.inputError : {}}
          />
          {blockedField === 'stock' && showBlockedAlert && (
            <div style={styles.errorBadge}>
              🔢 Solo se permiten números nada más
            </div>
          )}
          {formik.touched.stock && formik.errors.stock && !showBlockedAlert && (
            <span className="error">{formik.errors.stock}</span>
          )}
        </label>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Guardando...' : '💾 Guardar'}
        </button>
      </form>

      {/* 🎬 Animaciones CSS (agregralas en tu archivo CSS global) */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes slideIn {
          from { transform: translateX(150px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .form-container input.error {
          border-color: #ff4444 !important;
        }
      `}</style>
    </>
  );
}