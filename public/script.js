const API = ""

async function api(path, data) {
  const res = await fetch(API + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return res.json()
}

// Server status
async function checkStatus() {
  const el = document.getElementById("status")
  try {
    const res = await fetch(API + "/api/status")
    const data = await res.json()
    el.textContent = "☠️ Server online — " + data.endpoints.length + " endpoints available"
    el.className = "status online"
  } catch {
    el.textContent = "⚠️ Server offline — run 'node server.js' to start"
    el.className = "status offline"
  }
}
checkStatus()

// Tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"))
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"))
    tab.classList.add("active")
    document.getElementById(tab.dataset.tab).classList.add("active")
  })
})

// Encrypt
document.getElementById("encryptBtn").addEventListener("click", async () => {
  const text = document.getElementById("encryptInput").value
  const el = document.getElementById("encryptResult")
  if (!text) { el.textContent = "Enter some text first"; el.className = "result-box error"; return }
  el.textContent = "Encrypting..."
  const data = await api("/api/encrypt", { text })
  if (data.success) { el.textContent = data.result; el.className = "result-box" }
  else { el.textContent = "Error: " + data.error; el.className = "result-box error" }
})

// Decrypt
document.getElementById("decryptBtn").addEventListener("click", async () => {
  const text = document.getElementById("decryptInput").value
  const el = document.getElementById("decryptResult")
  if (!text) { el.textContent = "Paste encrypted text first"; el.className = "result-box error"; return }
  el.textContent = "Decrypting..."
  const data = await api("/api/decrypt", { text })
  if (data.success) { el.textContent = data.result; el.className = "result-box" }
  else { el.textContent = "Error: " + data.error; el.className = "result-box error" }
})

// Hash
document.getElementById("hashBtn").addEventListener("click", async () => {
  const text = document.getElementById("hashInput").value
  const algo = document.getElementById("hashAlgo").value
  const el = document.getElementById("hashResult")
  if (!text) { el.textContent = "Enter some text first"; el.className = "result-box error"; return }
  el.textContent = "Hashing..."
  const data = await api("/api/hash", { text, algorithm: algo })
  if (data.success) { el.textContent = "[" + data.algorithm.toUpperCase() + "] " + data.result; el.className = "result-box" }
  else { el.textContent = "Error: " + data.error; el.className = "result-box error" }
})