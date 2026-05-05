export default async function handler(req, res) {
  res.status(200).json({ status: 'ok', env: { SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'MISSING' } })
}
