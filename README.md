# Treino de Tênis de Mesa — PWA

App pessoal de treino (robô iPong V300, aulas, saque, táticas, análise de execução e campeonato).
React + Vite + Dexie (IndexedDB) + PWA instalável no celular.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço que aparecer (ex.: `http://localhost:5173`).
Para testar no **celular na mesma rede Wi-Fi**, use o endereço "Network" que o Vite mostra
(ex.: `http://192.168.0.10:5173`).

## Build de produção

```bash
npm run build      # gera a pasta dist/
npm run preview    # serve o build localmente para conferir
npm run check      # valida imports/sintaxe rodando o build
```

## Instalar como app no celular

1. Publique a pasta `dist/` (Netlify, Vercel, GitHub Pages — qualquer um serve HTTPS).
2. Abra o site no navegador do celular.
3. "Adicionar à tela de início". Pronto: abre em tela cheia, funciona offline.

## Estrutura

```
src/
  main.jsx                     # entrada
  App.jsx                      # casca: navegação (4 grupos) + timer global
  styles.css                   # todo o CSS
  lib/
    db.js                      # Dexie (IndexedDB). storage.get/set compatível + repositórios
    helpers.jsx                # yt(), timers, beep()
  components/
    ui.jsx                     # componentes reutilizáveis (Hero, Spark, RobotPanel, etc.)
  data/                        # conteúdo estático (sem lógica de tela)
    schedule.jsx               # cronograma semanal, sessões, dias
    serves.js                  # 8 saques, zonas, disfarce
    strokes.js                 # biblioteca de golpes
    tactics.js                 # combos, adversários, regras
    analysis.js                # protocolo e rubricas
    tournament.js              # lógica de campeonato (grupos + mata-mata)
  tabs/                        # uma aba por arquivo
    WeekTab.jsx
    ServeTab.jsx
    StrokesTacticsEvolution.jsx
    AnalysisTab.jsx
    TournamentTab.jsx
```

## Dados (Dexie / IndexedDB)

`src/lib/db.js` expõe `storage` com a mesma API do protótipo antigo
(`get`/`set`/`delete`/`list`), então tudo continua funcionando.
Para telas novas, prefira os repositórios (`serveRepo`, `matchRepo`) e o hook
`useLiveTable` — eles atualizam a tela sozinhos quando o banco muda.

## Navegação

Quatro grupos, por intenção — não por assunto:

| Grupo | Seções |
| --- | --- |
| **Hoje** | o treino do dia |
| **Técnica** | Golpes · Saque · Táticas |
| **Progresso** | Evolução · Análise |
| **Jogos** | campeonato, placar ao vivo e histórico |

## Publicar no Netlify

`netlify.toml` já traz build, redirect de SPA e cache. Basta ligar o repositório
no Netlify ("Add new site" → "Import an existing project") — ele lê o arquivo e publica.

## Identidade visual

| Token | Hex | Uso |
| --- | --- | --- |
| `--court-900` | `#0F2E27` | verde-mesa, fundo dos painéis escuros |
| `--ball` | `#FF7A29` | laranja da bola, cor de destaque |
| `--teal-600` | `#1C6F63` | apoio |
| `--green` | `#2FA36B` | confirmação / concluído |

Tipografia: **Oswald** (títulos), **Inter** (texto), **JetBrains Mono** (números e rótulos).

### Trocar os ícones

`public/icon-192.png` e `public/icon-512.png` são placeholders.
Gere os seus (fundo `#0F2E27`, bola `#FF7A29`) e substitua.
