import { supabase } from '../../backend/config/supabase.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query

  try {
    if (req.method === 'PUT') {
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

    if (req.method === 'DELETE') {
      const { error } = await supabase.from('productos').delete().eq('id', id)
      if (error) throw error
      return res.status(204).send()
    }

    res.setHeader('Allow', ['PUT', 'DELETE'])
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: error.message || 'Error interno del servidor' })
  }
}
