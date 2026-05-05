import { supabase } from '../config/supabase.js'

export const getProductos = async (req, res) => {
  try {
    const { categoria, limite, orden } = req.query
    let query = supabase.from('productos').select('*')
    
    if (categoria) query = query.eq('categoria', categoria)
    if (orden) query = query.order('created_at', { ascending: orden === 'asc' })
    if (limite) query = query.limit(parseInt(limite))
    
    const { data, error } = await query
    if (error) throw error
    
    res.status(200).json(data)
  } catch (error) {
    console.error('Error GET productos:', error)
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}

export const createProducto = async (req, res) => {
  try {
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
    res.status(201).json(data)
  } catch (error) {
    console.error('Error POST producto:', error)
    res.status(500).json({ error: error.message })
  }
}

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params
    
    // 🔒 1. Validar que el ID exista
    if (!id) {
      return res.status(400).json({ error: 'ID del producto es requerido' })
    }

    // 🔒 2. Validar formato UUID (evita "undefined", "null", etc.)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ 
        error: 'ID debe ser un UUID válido. Recibido: ' + id 
      })
    }

    // 🔒 3. Filtrar solo campos permitidos
    const allowedFields = ['nombre', 'categoria', 'precio', 'stock']
    const updates = {}
    
    for (const key of Object.keys(req.body)) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key]
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No hay campos válidos para actualizar' })
    }

    // 🔹 Ejecutar UPDATE
    const { data, error } = await supabase
      .from('productos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Producto no encontrado' })
    
    res.status(200).json(data)
  } catch (error) {
    console.error('Error PUT producto:', error)
    res.status(500).json({ error: error.message || 'Error al actualizar producto' })
  }
}

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params
    
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    res.status(204).send() // No content
  } catch (error) {
    console.error('Error DELETE producto:', error)
    res.status(500).json({ error: 'Error al eliminar producto' })
  }
}