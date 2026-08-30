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
    strokes.js                 # acervo técnico: 45 técnicas em 7 categorias
    analiseVideo.js            # como filmar + prompt de análise por técnica
    tactics.js                 # combos, adversários, regras
    tournament.js              # lógica de campeonato (grupos + mata-mata)
  tabs/                        # uma aba por arquivo
    WeekTab.jsx
    ServeTab.jsx
    StrokesTacticsEvolution.jsx
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
| **Progresso** | Evolução |
| **Jogos** | campeonato, placar ao vivo e histórico |

## Acervo técnico (aba Técnica › Golpes)

45 técnicas em 7 categorias — Base, Deslocamento, Controle, Ataque, Defesa,
Recepção e Especiais/material. Cada uma traz biomecânica passo a passo, erros
comuns, **exercícios de 3 séries** (168 no total) e uma progressão de três níveis
com critério objetivo para avançar.

Cada técnica em `src/data/strokes.js` tem esta forma:

```js
{
  id, name, level, cat,
  aka,               // nome em inglês — a busca procura nos dois idiomas
  idea, when,        // o que é / quando usar
  steps: [],         // biomecânica passo a passo
  err: [],           // erros comuns
  robot,             // regulagem do iPong V300, ou null quando não dá para simular
  exercicios: [      // { n, nome, tipo, series: 3, repet, montagem, meta, cue }
  ],                 // tipo: sombra | robô | parceiro | multibola | jogo
  progressao: [],    // { nivel, foco, criterio } × 3
  videos: []
}
```

O `id` é a chave do progresso em `mastery:v1` — **não renomeie ids existentes**.
Quando o robô não consegue produzir a bola (efeito lateral, borracha longa), o
campo `robot` diz isso em vez de inventar uma regulagem.

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
