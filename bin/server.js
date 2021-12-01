import app from '../app.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// import connectDB from '../config/db.js'

dotenv.config()
const { PORT, DB_URL, NODE_ENV } = process.env

async function main() {
  await mongoose.connect(DB_URL)
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT} in ${NODE_ENV} mode`.cyan.bold)
  })
}
mongoose.connection.on('connected', () => {
  console.log('Database connection successful!'.yellow.bold)
})

main().catch((err) => {
  console.log(`Failed to connect to database! Error: ${err.message}`.red.bold)
  process.exit(1)
})
