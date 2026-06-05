require("dotenv").config()
const express = require("express")
const cors = require("cors")
const crypto = require("crypto")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const PORT = process.env.PORT || 3000
const KEY = process.env.ENCRYPTION_KEY

if (!KEY || KEY === "your-32-character-hex-key-here-change-me") {
  console.warn("⚠️  WARNING: Using a default encryption key!")
  console.warn("   Set ENCRYPTION_KEY in .env for real security")
}

function getKey() {
  const k = KEY || crypto.randomBytes(32).toString("hex")
  return Buffer.from(k.padStart(64, "0").slice(0, 64), "hex")
}

const IV_LENGTH = 16

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return iv.toString("hex") + ":" + encrypted
}

function decrypt(text) {
  const parts = text.split(":")
  const iv = Buffer.from(parts.shift(), "hex")
  const encrypted = parts.join(":")
  const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), iv)
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

app.post("/api/encrypt", (req, res) => {
  try {
    const { text } = req.body
    if (!text) return res.status(400).json({ error: "Text is required" })
    const result = encrypt(text)
    res.json({ success: true, result })
  } catch (e) {
    res.status(500).json({ error: "Encryption failed" })
  }
})

app.post("/api/decrypt", (req, res) => {
  try {
    const { text } = req.body
    if (!text) return res.status(400).json({ error: "Text is required" })
    const result = decrypt(text)
    res.json({ success: true, result })
  } catch (e) {
    res.status(500).json({ error: "Decryption failed - invalid data" })
  }
})

app.post("/api/hash", (req, res) => {
  try {
    const { text, algorithm = "sha256" } = req.body
    if (!text) return res.status(400).json({ error: "Text is required" })
    const algos = ["sha256", "sha512", "md5"]
    if (!algos.includes(algorithm)) return res.status(400).json({ error: "Invalid algorithm" })
    const hash = crypto.createHash(algorithm).update(text).digest("hex")
    res.json({ success: true, algorithm, result: hash })
  } catch (e) {
    res.status(500).json({ error: "Hashing failed" })
  }
})

app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    encrypted: KEY && KEY !== "your-32-character-hex-key-here-change-me",
    endpoints: ["/api/encrypt", "/api/decrypt", "/api/hash", "/api/status"]
  })
})

app.listen(PORT, () => {
  console.log(`☠️  Cyber API running on http://localhost:${PORT}`)
})