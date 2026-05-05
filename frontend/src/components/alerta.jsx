import { useState, useCallback } from 'react';

export default function InputConAlerta() {
  const [valor, setValor] = useState('');
  
  // Ejemplo: solo letras (may/min), números y espacios
  const regexPermitido = /^[a-zA-Z0-9\s]*$/;

  const handleChange = useCallback((e) => {
    const nuevoValor = e.target.value;

    if (regexPermitido.test(nuevoValor)) {
      setValor(nuevoValor); // ✅ Válido → actualizamos estado
    } else {
      // ❌ Contiene carácter bloqueado
      alert('⚠️ Solo se permiten letras, números y espacios.');
      // No llamamos a setValor → React mantiene el valor anterior
    }
  }, []);

  // Opcional: evitar que peguen texto con caracteres inválidos
  const handlePaste = useCallback((e) => {
    const textoPegado = e.clipboardData.getData('text');
    if (!regexPermitido.test(textoPegado)) {
      e.preventDefault();
      alert('⚠️ No puedes pegar texto con caracteres no permitidos.');
    }
  }, []);

  return (
    <input
      type="text"
      value={valor}
      onChange={handleChange}
      onPaste={handlePaste}
      placeholder="Escribe solo letras y números..."
      style={{ padding: '8px', fontSize: '16px' }}
    />
  );
}