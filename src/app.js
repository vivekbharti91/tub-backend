import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser())

export { app }



/*
cors()

This is the CORS (Cross-Origin Resource Sharing) middleware.
It decides which frontend(s) are allowed to talk to your backend.
origin: process.env.CORS_ORIGIN
origin means → which domain(s) are allowed.
You’re setting it from an environment variable (CORS_ORIGIN).

credentials: true

This allows cookies, sessions, or Authorization headers to be sent across origins.
Example: If your frontend uses fetch or axios with { withCredentials: true }, then cookies will be included in the request.
Without credentials: true, cookies will not work across different origins.

json() → for JSON requests
urlencoded() → for form submissions
static() → for serving files (images, CSS, JS)
*/