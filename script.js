async function getKey(secret) {
  const enc = new TextEncoder()
  const keyData = await crypto.subtle.importKey(
    "raw", enc.encode(secret.padEnd(32, "X").slice(0, 32)),
    { name: "AES-CBC" }, false, ["encrypt", "decrypt"]
  )
  return keyData
}

function toBase64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}
function fromBase64(str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0)).buffer
}

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
  const secret = document.getElementById("encryptKey").value || "default-key"
  const el = document.getElementById("encryptResult")
  if (!text) { el.textContent = "Enter some text first"; el.className = "result-box error"; return }
  try {
    const key = await getKey(secret)
    const iv = crypto.getRandomValues(new Uint8Array(16))
    const enc = new TextEncoder()
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv }, key, enc.encode(text)
    )
    el.textContent = toBase64(iv) + ":" + toBase64(encrypted)
    el.className = "result-box"
  } catch (e) { el.textContent = "Error: " + e.message; el.className = "result-box error" }
})

// Decrypt
document.getElementById("decryptBtn").addEventListener("click", async () => {
  const text = document.getElementById("decryptInput").value
  const secret = document.getElementById("decryptKey").value || "default-key"
  const el = document.getElementById("decryptResult")
  if (!text) { el.textContent = "Paste encrypted text first"; el.className = "result-box error"; return }
  try {
    const parts = text.split(":")
    const key = await getKey(secret)
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: new Uint8Array(fromBase64(parts[0])) },
      key, fromBase64(parts.slice(1).join(":"))
    )
    el.textContent = new TextDecoder().decode(decrypted)
    el.className = "result-box"
  } catch (e) { el.textContent = "Error: Wrong key or invalid data"; el.className = "result-box error" }
})

// Hash
document.getElementById("hashBtn").addEventListener("click", async () => {
  const text = document.getElementById("hashInput").value
  const algo = document.getElementById("hashAlgo").value
  const el = document.getElementById("hashResult")
  if (!text) { el.textContent = "Enter some text first"; el.className = "result-box error"; return }
  try {
    const hash = await crypto.subtle.digest(algo, new TextEncoder().encode(text))
    const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("")
    el.textContent = "[" + algo + "] " + hex
    el.className = "result-box"
  } catch (e) { el.textContent = "Error: " + e.message; el.className = "result-box error" }
})