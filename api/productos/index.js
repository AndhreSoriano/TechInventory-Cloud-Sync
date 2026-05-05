import { getProductos, createProducto } from '../../backend/controllers/productosController.js'

export default async function handler(req, res) {
  try {
    const { method } = req

    if (method === 'GET') {
      await getProductos(req, res)
    } else if (method === 'POST') {
      await createProducto(req, res)
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ error: `Method ${method} not allowed` })
    }
  } catch (error) {
    console.error('API handler error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
