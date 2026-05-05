import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productosRoutes from '../backend/routes/productos.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json())

app.use('/productos', productosRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' })
})

app.use((err, req, res, next) => {
  console.error('Error global:', err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

export default app
