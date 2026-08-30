/* Dispara um build no Netlify pelo build hook.

   O hook é uma URL secreta que SÓ inicia um build — não lê nada, não publica
   nada, não alcança outros sites. Ela vive numa variável de ambiente, nunca no
   repositório: qualquer URL de hook commitada aqui vira pública com o repo.

   Uso:  NETLIFY_BUILD_HOOK="https://api.netlify.com/build_hooks/xxxx" npm run deploy */

const hook = process.env.NETLIFY_BUILD_HOOK;

if (!hook) {
  console.error(`
❌ NETLIFY_BUILD_HOOK não está definida.

Para criar o hook:
  Netlify → o site → Site configuration → Build & deploy → Build hooks
  → Add build hook → branch "main" → copie a URL.

Depois exporte a variável (ou cadastre nas configurações do ambiente):
  export NETLIFY_BUILD_HOOK="https://api.netlify.com/build_hooks/xxxxxxxx"
`);
  process.exit(1);
}

if (!/^https:\/\/api\.netlify\.com\/build_hooks\/[A-Za-z0-9]+$/.test(hook)) {
  console.error("❌ A URL não parece um build hook do Netlify. Confira se copiou inteira.");
  process.exit(1);
}

const r = await fetch(hook, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ trigger_title: "disparado pelo npm run deploy" }),
});

if (!r.ok) {
  console.error(`❌ O Netlify respondeu ${r.status}. Se for 404, o hook foi apagado ou a URL está errada.`);
  process.exit(1);
}

console.log("✅ Build disparado. Leva 1-2 min; confira em https://treino-tenis-de-mesa.netlify.app");
console.log("   O hook só inicia o build — se ele falhar, o motivo está no log de Deploys no painel.");
