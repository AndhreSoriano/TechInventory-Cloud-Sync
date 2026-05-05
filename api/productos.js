import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // GET /api/productos
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('productos').select('*')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // POST /api/productos
  if (req.method === 'POST') {
    const { nombre, categoria, precio, stock } = req.body
    if (!nombre || !categoria || precio === undefined)
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    const { data, error } = await supabase
      .from('productos').insert([{ nombre, categoria, precio, stock: stock || 0 }]).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  // PUT /api/productos/:id  → Vercel pasa el path en req.query
  if (req.method === 'PUT') {
    const id = req.url.split('/').pop()
    const { nombre, categoria, precio, stock } = req.body
    const updates = {}
    if (nombre !== undefined) updates.nombre = nombre
    if (categoria !== undefined) updates.categoria = categoria
    if (precio !== undefined) updates.precio = precio
    if (stock !== undefined) updates.stock = stock
    const { data, error } = await supabase
      .from('productos').update(updates).eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // DELETE /api/productos/:id
  if (req.method === 'DELETE') {
    const id = req.url.split('/').pop()
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
