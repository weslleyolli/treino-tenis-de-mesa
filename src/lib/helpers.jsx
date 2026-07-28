/* Helpers puros — sem dependências de React */
const yt = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
/* ============ Timer helpers ============ */
const parseMin = (t) => { const m = String(t || "").match(/([\d.,]+)/); return m ? Math.round(parseFloat(m[1].replace(",", ".")) * 60) : null; };
const parseRest = (t) => { if (!t || t === "—") return null; const s = String(t).match(/([\d.,]+)\s*s/); if (s) return Math.round(parseFloat(s[1].replace(",", "."))); const m = String(t).match(/([\d.,]+)\s*min/); return m ? Math.round(parseFloat(m[1].replace(",", ".")) * 60) : null; };
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
function beep() { try { const a = new (window.AudioContext || window.webkitAudioContext)(); const o = a.createOscillator(); const g = a.createGain(); o.connect(g); g.connect(a.destination); o.type = "sine"; o.frequency.value = 880; g.gain.value = .12; o.start(); setTimeout(() => { o.frequency.value = 640; }, 180); setTimeout(() => { o.stop(); a.close(); }, 430); } catch {} }


export { yt, parseMin, parseRest, fmt, beep };
