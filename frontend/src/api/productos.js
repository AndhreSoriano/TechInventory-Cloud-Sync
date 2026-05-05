import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/productos';

export const obtenerProductos = (params = {}) => 
  axios.get(API_URL, { params }).then(res => res.data);

export const crearProducto = (data) => 
  axios.post(API_URL, data).then(res => res.data);

export const actualizarProducto = (id, data) => 
  axios.put(`${API_URL}/${id}`, data).then(res => res.data);

export const eliminarProducto = (id) => 
  axios.delete(`${API_URL}/${id}`).then(res => res.data);