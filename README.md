# ☠️ Cyber API

> Backend-powered encryption & hashing toolkit.  
> **The logic runs on the server** — not in the browser.

---

## 🔐 Why a Backend?

Your first cyber-toolkit runs everything in the browser (JavaScript). Anyone can view the source and see how it works.

This project fixes that:

| Tool | Where logic runs | Can users see the code? |
|------|-----------------|----------------------|
| cyber-toolkit | Browser (frontend) | ✅ Yes — open DevTools |
| **cyber-api** | Server (Node.js) | ❌ No — only the API |

The browser only sends/receives data — the actual encryption, decryption, and hashing happen server-side.

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with a secret key
cp .env.example .env

# 3. Edit .env — change ENCRYPTION_KEY to a random 64-char hex string
#    You can generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Start the server
npm start
```

Then open **http://localhost:3000** in your browser.

---

## 📡 API Endpoints

| Endpoint | Method | What it does |
|----------|--------|-------------|
| `/api/encrypt` | POST | AES-256-CBC encrypt text |
| `/api/decrypt` | POST | Decrypt text |
| `/api/hash` | POST | Generate SHA-256, SHA-512, or MD5 hash |
| `/api/status` | GET | Check if server is running |

### Example

```bash
curl -X POST http://localhost:3000/api/encrypt \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World"}'
```

Response:
```json
{
  "success": true,
  "result": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4:7b8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9"
}
```

---

## 🛡️ Security Features

- **Encryption key in `.env`** — never exposed to frontend
- **AES-256-CBC** — industry standard encryption
- **Random IV** — every encryption produces different output
- **`.gitignore` ignores `.env`** — your key stays local
- **Server-side only** — hashing/encryption logic never reaches the browser

---

## 📁 Project Structure

```
cyber-api/
├── server.js          # Express backend (all the real logic)
├── package.json
├── .env.example       # Template for your secret key
├── .gitignore
├── public/
│   ├── index.html     # Frontend UI
│   ├── style.css      # Dark cyber theme
│   └── script.js      # API calls (no sensitive logic)
└── README.md
---

## 🙋‍♂️ About

Built by [AdhiHub](https://github.com/AdhiHub)  
Web Developer · Cyber Enthusiast