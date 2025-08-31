import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT || 4000
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD || ""