import { updateProducto, deleteProducto } from '../../backend/controllers/productosController.js'

export default async function handler(req, res) {
  try {
    const { method } = req
    req.params = { id: req.query.id }

    if (method === 'PUT') {
      await updateProducto(req, res)
    } else if (method === 'DELETE') {
      await deleteProducto(req, res)
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE'])
      res.status(405).json({ error: `Method ${method} not allowed` })
    }
  } catch (error) {
    console.error('API handler error:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
