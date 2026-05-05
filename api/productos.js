import { supabase } from '../../backend/config/supabase.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const { method } = req

    if (method === 'GET') {
      const { categoria, limite, orden } = req.query
      let query = supabase.from('productos').select('*')

      if (categoria) query = query.eq('categoria', categoria)
      if (orden) query = query.order('created_at', { ascending: orden === 'asc' })
      if (limite) query = query.limit(parseInt(limite))

      const { data, error } = await query
      if (error) throw error

      return res.status(200).json(data)
    }

    if (method === 'POST') {
      const { nombre, categoria, precio, stock } = req.body

      if (!nombre || !categoria || precio === undefined) {
        return res.status(400).json({ error: 'Faltan campos requeridos (nombre, categoria, precio)' })
      }

      const { data, error } = await supabase
        .from('productos')
        .insert([{ nombre, categoria, precio, stock: stock || 0 }])
        .select()
        .single()

      if (error) throw error
      return res.status(201).json(data)
    }

    if (method === 'PUT') {
      const id = req.query.id
      if (!id) return res.status(400).json({ error: 'ID requerido' })

      const allowedFields = ['nombre', 'categoria', 'precio', 'stock']
      const updates = {}
      for (const key of Object.keys(req.body)) {
        if (allowedFields.includes(key)) updates[key] = req.body[key]
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No hay campos válidos para actualizar' })
      }

      const { data, error } = await supabase
        .from('productos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return res.status(200).json(data)
    }

    if (method === 'DELETE') {
      const id = req.query.id
      if (!id) return res.status(400).json({ error: 'ID requerido' })

      const { error } = await supabase.from('productos').delete().eq('id', id)
      if (error) throw error
      return res.status(204).send()
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: error.message || 'Error interno del servidor' })
  }
}
