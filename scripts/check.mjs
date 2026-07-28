import { execSync } from "node:child_process";
console.log("→ Rodando vite build para validar imports e sintaxe...");
try {
  execSync("npx vite build", { stdio: "inherit" });
  console.log("\n✅ Build OK — todos os módulos e imports estão corretos.");
} catch {
  console.error("\n❌ Build falhou. Veja os erros acima.");
  process.exit(1);
}
