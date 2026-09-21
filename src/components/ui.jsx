import React, { useState, useEffect, useRef } from "react";
import {
  Check, ChevronDown, Play, Bot, GraduationCap, Trophy, Zap, Target, Info, RotateCcw, ChevronLeft, ChevronRight, Flame, Clock, Repeat, Timer, Pause, Plus, X, Gauge, Award, StickyNote, CalendarDays, Wind, AlertTriangle, Eye, EyeOff, CircleDot, Layers, TrendingUp, Users, Activity, Trash2, Camera, Minus
} from "lucide-react";
import { parseMin, parseRest, fmt, beep, yt } from "../lib/helpers.jsx";
import { storage as store } from "../lib/db.js";
import { robotFor, KIND_META } from "../data/schedule.jsx";
import { tecnicasPorId } from "../data/strokes.js";
import { DETALHES } from "../data/detalhes.js";

/* ============ COMPONENTES ============ */

/* A REGULAGEM NA LINGUAGEM DO CONTROLE REMOTO
   O V300 tem quatro controles de 1 a 8, e o visor mostra os quatro nesta
   ordem: Frequência · Oscilação · Topspin · Backspin. O app mostrava outra
   coisa (oscilação como liga/desliga, efeito num número só), e quem estava na
   mesa tinha que traduzir de cabeça. Agora a tela é o controle.

   E o efeito não é um número: são duas rodas, e o efeito é a DIFERENÇA entre
   elas. Por isso o painel calcula e escreve o que vai sair. */
const ORDEM_REMOTO = ["Frequência", "Oscilação", "Topspin", "Backspin"];
const naOrdemDoRemoto = (dials) =>
  ORDEM_REMOTO.filter((k) => dials[k] !== undefined).map((k) => [k, dials[k]])
    .concat(Object.entries(dials).filter(([k]) => !ORDEM_REMOTO.includes(k)));

/* O que sai da máquina, em uma frase: é a diferença entre as duas rodas. */
function efeitoDaRegulagem(dials) {
  const t = Number(dials.Topspin), b = Number(dials.Backspin);
  if (!Number.isFinite(t) || !Number.isFinite(b)) return null;
  const dif = t - b;
  if (dif === 0) return { tom: "zero", texto: "Rodas iguais: bola SEM EFEITO" };
  if (dif > 0) return { tom: "top", texto: `Topspin ${dif > 3 ? "forte" : dif > 1 ? "médio" : "leve"} · diferença ${dif}` };
  return { tom: "back", texto: `Backspin ${-dif > 3 ? "forte" : -dif > 1 ? "médio" : "leve"} · diferença ${-dif}` };
}

function Dial({ label, value }) {
  const n = Number(value);
  const desligada = label === "Oscilação" && n === 0;
  return (
    <div className="dial">
      <div className="dial-head"><span className="dial-label">{label}</span>
        <span className={"dial-val" + (desligada ? " off" : "")}>{value}</span></div>
      {/* 0 a 8, que é a escala do controle: 0 só existe na oscilação. */}
      <div className="track">{Array.from({ length: 9 }).map((_, i) =>
        <span key={i} className={"tick" + (i === n ? " active" : i < n ? " past" : "")} />)}</div>
      {desligada && <span className="dial-nota">desligada</span>}
    </div>);
}

/* Regulagem compacta dentro de um bloco da linha do tempo. Um painel inteiro
   por bloco ocuparia a tela toda, então aqui vai a fita do visor. */
const MD_CURTO = { Topspin: "Top", Backspin: "Back", "Frequência": "Freq", "Oscilação": "Osc" };
function MiniDials({ dials }) {
  if (!dials) return null;
  const ef = efeitoDaRegulagem(dials);
  return (
    <div className="minidials">
      {naOrdemDoRemoto(dials).map(([k, v]) => (
        <span key={k} className={"md" + (k === "Oscilação" && Number(v) === 0 ? " md-off" : "")}>
          <em>{MD_CURTO[k] || k}</em>{v}</span>))}
      {ef && <span className={"md md-ef md-ef-" + ef.tom}>{ef.texto}</span>}
    </div>);
}

function RobotPanel({ cfg }) {
  if (!cfg) return null;
  if (cfg.shadow) return (
    <div className="robot shadow-card">
      <div className="section-eyebrow"><Bot size={13} /> Robô iPong V300</div>
      <p className="shadow-text">{cfg.why}</p>
      {cfg.extra && <div className="blockb"><div className="blockb-tag">{cfg.extra.title}</div>
        <div className="dials">{Object.entries(cfg.extra.dials).map(([k, v]) => <Dial key={k} label={k} value={v} />)}</div></div>}
    </div>);
  return (
    <div className="robot">
      <div className="section-eyebrow"><Bot size={13} /> Robô iPong V300</div>
      <div className="robot-title">{cfg.title}</div>
      {/* A fita do visor, na ordem em que os números aparecem no controle:
          assim dá para conferir sem traduzir nada. */}
      <div className="visor" title="Frequência · Oscilação · Topspin · Backspin">
        {naOrdemDoRemoto(cfg.dials).map(([k, v]) => <span key={k} className="visor-n">{v}</span>)}
        <span className="visor-lbl">freq · osc · top · back</span>
      </div>
      <div className="dials">{naOrdemDoRemoto(cfg.dials).map(([k, v]) => <Dial key={k} label={k} value={v} />)}</div>
      {efeitoDaRegulagem(cfg.dials) && (
        <div className={"robot-ef ef-" + efeitoDaRegulagem(cfg.dials).tom}>
          <Gauge size={13} /> {efeitoDaRegulagem(cfg.dials).texto}
        </div>)}
      <div className="robot-pos"><Info size={13} /> {cfg.pos}</div>
      {cfg.blockB && <div className="blockb"><div className="blockb-tag">Bloco B · Transição FH/BH (a partir da sem. 2)</div>
        <div className="dials">{Object.entries(cfg.blockB).map(([k, v]) => <Dial key={k} label={k} value={v} />)}</div></div>}
    </div>);
}

/* Um exercicio do acervo. Vive aqui porque aparece em dois lugares: na aba
   Golpes e dentro do card de sessao da semana. O tipo reusa o tagClass abaixo. */
const TIPO_TAG = { sombra: "sombra", "robô": "robô", parceiro: "jogo", multibola: "robô", jogo: "jogo", saque: "saque" };

function Exercicio({ e }) {
  return (
    <div className="exc">
      <div className="exc-top">
        <span className="exc-n">{String(e.n).padStart(2, "0")}</span>
        <span className="exc-nome">{e.nome}</span>
        <span className={"exc-tag " + tagClass(TIPO_TAG[e.tipo] || e.tipo)}>{e.tipo}</span>
      </div>
      <div className="exc-dose"><Repeat size={12} /> {e.series} séries × {e.repet}</div>
      <div className="exc-l"><span>Montagem</span>{e.montagem}</div>
      <div className="exc-l"><span>Meta</span>{bold(e.meta)}</div>
      <div className="exc-cue"><Target size={12} /> {e.cue}</div>
    </div>);
}

/* As tecnicas do acervo ligadas a alguma coisa — um padrao da semana, a terceira
   bola de um saque, um combo, um arquetipo de adversario. Vem fechado: o treino
   e o que esta no card; o acervo e a peca isolada, a um toque de distancia. */
function BlocoAcervo({ ids, titulo, sub }) {
  const tecnicas = tecnicasPorId(ids);
  if (!tecnicas.length) return null;
  const total = tecnicas.reduce((n, t) => n + t.exercicios.length, 0);
  return (
    <Collapsible title={titulo} icon={<Layers size={13} />}
      sub={sub || `${tecnicas.length} técnicas · ${total} exercícios`}>
      {tecnicas.map((t) => (
        <div className="acv-tec" key={t.id}>
          <div className="acv-top">
            <span className="acv-nome">{t.name}</span>
            <span className="acv-cat">{t.cat}</span>
          </div>
          <div className="exc-lista">{t.exercicios.map((e) => <Exercicio key={e.n} e={e} />)}</div>
        </div>))}
    </Collapsible>);
}

function tagClass(t) {
  if (!t) return "t-none";
  if (t.indexOf("robô") >= 0) return "t-robot";
  if (t === "saque") return "t-serve";
  if (t === "aula") return "t-lesson";
  if (t === "jogo" || t === "parceiro") return "t-match";
  if (t === "físico") return "t-phys";
  if (t === "sombra" || t === "estudo") return "t-shadow";
  return "t-none";
}

function Session({ session, onTimer }) {
  return (
    <div className="session">
      <div className="session-head"><div className="section-eyebrow" style={{ margin: 0 }}><Clock size={13} /> Sessão detalhada</div>
        <span className="session-total"><Clock size={12} /> {session.total}</span></div>
      {session.tagline && <div className="session-tagline">{session.tagline}</div>}
      <div className="timeline">
        {session.blocks.map((b, i) => {
          const sec = parseMin(b.time), rest = parseRest(b.rest);
          return (
            <div className="tl-block" key={i}>
              <div className="tl-rail"><span className="tl-num">{i + 1}</span></div>
              <div className="tl-card">
                <div className="tl-top"><span className="tl-label">{b.label}</span><span className="tl-time"><Clock size={11} /> {b.time}</span></div>
                {b.tag && <span className={"tl-tag " + tagClass(b.tag)}>{b.tag}</span>}
                <div className="tl-target"><Repeat size={13} /><span>{b.target}</span></div>
                <div className="tl-actions">
                  {sec && <button className="mini-btn" onClick={() => onTimer(b.label, sec)}><Play size={12} /> {b.time}</button>}
                  {rest && <button className="mini-btn ghost" onClick={() => onTimer("Descanso", rest)}><Timer size={12} /> {b.rest}</button>}
                </div>
                {b.cue && <p className="tl-cue">{b.cue}</p>}
              </div>
            </div>);
        })}
      </div>
    </div>);
}

function Counter({ label, record, onRecord }) {
  const [n, setN] = useState(0);
  return (
    <div className="counter">
      <div className="section-eyebrow"><Award size={13} /> Contador · {label}</div>
      <div className="counter-body">
        <div className="counter-num">{n}</div>
        <div className="counter-side">
          <div className="counter-rec"><Award size={12} /> Recorde: <strong>{record || 0}</strong></div>
          <div className="counter-btns">
            <button className="cbtn plus" onClick={() => { const v = n + 1; setN(v); if (v > (record || 0)) onRecord(v); }}><Plus size={16} /> +1</button>
            <button className="cbtn zero" onClick={() => setN(0)}><RotateCcw size={14} /> Errei</button>
          </div>
        </div>
      </div>
    </div>);
}

function Notes({ value, onSave, placeholder }) {
  const [t, setT] = useState(value || "");
  useEffect(() => setT(value || ""), [value]);
  return (
    <div className="notes"><div className="section-eyebrow"><StickyNote size={13} /> Anotações</div>
      <textarea className="notes-ta" value={t} placeholder={placeholder} onChange={e => setT(e.target.value)} onBlur={() => onSave(t)} /></div>);
}

function Collapsible({ title, icon, sub, children, tone }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"collapse" + (tone ? " " + tone : "")}>
      <button className="collapse-head" onClick={() => setOpen(o => !o)}>
        <span className="collapse-title">{icon}<span>{title}{sub && <em className="collapse-sub">{sub}</em>}</span></span>
        <ChevronDown size={18} className={"chev" + (open ? " open" : "")} /></button>
      {open && <div className="collapse-body">{children}</div>}
    </div>);
}

function Vids({ videos }) {
  if (!videos) return null;
  return (
    <div className="videos"><div className="section-eyebrow"><Play size={13} /> Referências no YouTube</div>
      <div className="chips">{videos.map(([l, u]) => <a key={l} className="chip" href={u} target="_blank" rel="noopener noreferrer"><Play size={13} /> {l}</a>)}</div></div>);
}

const bold = (s) => String(s).split(/\*\*(.+?)\*\*/g).map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p));

function BallClock() {
  const marks = [
    { a: 90, l: "6h", t: "backspin", c: "#F26B21" },
    { a: 45, l: "4-5h", t: "lateral + backspin", c: "#7C5CFC" },
    { a: 0, l: "3h", t: "lateral", c: "#1E5A8A" },
    { a: 180, l: "9h", t: "no-spin", c: "#6B7A8A" },
    { a: 270, l: "12h", t: "topspin", c: "#2FA36B" },
  ];
  const R = 50, cx = 78, cy = 78;
  return (
    <div className="ballclock">
      <svg viewBox="0 0 156 156" className="bc-svg">
        <circle cx={cx} cy={cy} r={R} fill="#FFF7F1" stroke="#F0C6A8" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="3" fill="#C9CFD6" />
        {marks.map(m => {
          const rad = (m.a * Math.PI) / 180;
          const x = cx + R * Math.cos(rad), y = cy + R * Math.sin(rad);
          return (<g key={m.l}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={m.c} strokeWidth="2" strokeDasharray="3 3" opacity="0.5" />
            <circle cx={x} cy={y} r="7" fill={m.c} /></g>);
        })}
      </svg>
      <div className="bc-legend">
        {marks.map(m => (<div className="bc-item" key={m.l}><span className="bc-dot" style={{ background: m.c }} />
          <span className="bc-l">{m.l}</span><span className="bc-t">{m.t}</span></div>))}
      </div>
    </div>);
}


/* ============ COMPONENTES COMPARTILHADOS ============ */
function SecTitle({ icon, n, children }) {
  return (<div className="sec"><span className="sec-n">{n}</span><span className="sec-i">{icon}</span><span className="sec-t">{children}</span></div>);
}

function Hero({ tone, eyebrow, title, sub, icon, pct }) {
  return (
    <div className={"tab-hero hero-" + tone}>
      <div className="sh-eyebrow">{icon} {eyebrow}</div>
      <h2>{title}</h2>
      <p>{sub}</p>
      {pct !== undefined && <div className="hero-bar"><div className="hero-fill" style={{ width: pct + "%" }} /></div>}
    </div>);
}

function Spark({ data, color, unit }) {
  const vals = data.map(d => d.v);
  const max = Math.max(1, ...vals);
  const W = 280, H = 96, pad = 26;
  const step = (W - pad * 2) / Math.max(1, data.length - 1);
  const pts = data.map((d, i) => [pad + i * step, H - 22 - (d.v / max) * (H - 44)]);
  const path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = path + ` L${pts[pts.length - 1][0].toFixed(1)} ${H - 22} L${pts[0][0].toFixed(1)} ${H - 22} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="spark">
      <line x1={pad - 8} y1={H - 22} x2={W - pad + 8} y2={H - 22} stroke="#E4E9EF" strokeWidth="1.5" />
      <path d={area} fill={color} opacity="0.12" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="4.5" fill="#fff" stroke={color} strokeWidth="2.5" />
          <text x={p[0]} y={p[1] - 10} textAnchor="middle" fontSize="11" fontWeight="800" fill="#14212E">{data[i].v || ""}</text>
          <text x={p[0]} y={H - 7} textAnchor="middle" fontSize="9.5" fill="#6B7A8A">{data[i].l}</text>
        </g>))}
    </svg>);
}

function GoalBar({ label, cur, target, unit }) {
  const pct = Math.min(100, Math.round((cur / target) * 100));
  const ok = cur >= target;
  return (
    <div className="gb">
      <div className="gb-top">
        <span className={"gb-l" + (ok ? " ok" : "")}>{ok && <Check size={12} strokeWidth={3} />} {label}</span>
        <span className="gb-v">{cur}<em>/{target}{unit || ""}</em></span>
      </div>
      <div className="gb-track"><div className={"gb-fill" + (ok ? " ok" : "")} style={{ width: pct + "%" }} /></div>
    </div>);
}



function Bars({ data, unit }) {
  const max = Math.max(1, ...data.map(d => d.v));
  return (
    <div className="bars">
      {data.map(d => (
        <div className="bar-row" key={d.l}>
          <span className="bar-l">{d.l}</span>
          <div className="bar-track"><div className="bar-fill" style={{ width: (d.v / max) * 100 + "%", background: d.c || "#F26B21" }} /></div>
          <span className="bar-v">{d.v > 0 ? d.v + (unit || "") : "—"}</span>
        </div>))}
    </div>);
}


/* Guia de execução de um padrão. Fica aberto por padrão: a dúvida "como eu faço
   isso" aparece na mesa, e um toque a mais nessa hora é atrito. */

/* ============ COMO FAZER ============
   O card do dia é curto: nome, dose, regulagem e uma frase. Isso basta quando
   você já sabe o exercício, e não basta nenhuma vez na primeira semana — daí
   este botão em cada bloco.

   A tela é montada em duas camadas: o que está escrito à mão em detalhes.js
   (o que é, montagem, passo a passo, meta, erros) e o que o próprio bloco já
   carrega (dose, regulagem, ciclo, limite do robô e a frase de atenção). Um
   bloco sem entrada em detalhes.js ainda abre uma tela cheia, com a segunda
   camada — botão que abre tela vazia é pior que botão nenhum. */
function ComoFazer({ bloco, cor, aberto, onFechar }) {
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e) => { if (e.key === "Escape") onFechar(); };
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = antes; window.removeEventListener("keydown", onKey); };
  }, [aberto, onFechar]);

  if (!aberto) return null;
  const d = (bloco.det && DETALHES[bloco.det]) || {};
  const passos = d.execucao || bloco.passos;
  const robo = d.robo || bloco.limite;

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onFechar(); }}>
      <div className="modal-cx cf-cx" role="dialog" aria-label={`Como fazer: ${bloco.label}`}>
        <div className="modal-top">
          <h3>{bloco.label}</h3>
          <button className="modal-x" onClick={onFechar} aria-label="Fechar"><X size={18} /></button>
        </div>

        {d.oque && <p className="modal-p">{d.oque}</p>}

        <div className="cf-dose"><Repeat size={13} /><span>{bloco.target}</span></div>
        <div className="cf-chips">
          {bloco.time && bloco.time !== "—" && <span className="cf-chip"><Clock size={11} /> {bloco.time}</span>}
          {bloco.rest && bloco.rest !== "—" && <span className="cf-chip"><Timer size={11} /> descanso {bloco.rest}</span>}
        </div>

        {bloco.dials && (
          <div className="cf-sec">
            <h4><Bot size={13} /> Regulagem do robô</h4>
            <MiniDials dials={bloco.dials} />
            {/* Onde o robô fica é metade da regulagem, e não estava escrito em
                lugar nenhum: o mesmo número com o robô adiantado manda a bola
                para fora. Vale para qualquer bloco, por isso mora aqui. */}
            <div className="cf-ajuste cf-onde">
              <div className="cf-ajuste-t">Onde fica o robô</div>
              <ul>
                <li><strong>Padrão:</strong> em cima da mesa, encostado na <strong>borda de trás</strong>, na <strong>linha do meio</strong>. Gire o furo de saída para escolher o lado.</li>
                <li><strong>Sem calço</strong> embaixo, a não ser que o bloco peça. A base fica reta na mesa.</li>
                <li><strong>Bola caindo comprida?</strong> puxe o robô mais para trás, colado na borda. Adiantado na mesa, a bola tem menos mesa para cair.</li>
                <li><strong>Quer bola curta</strong> (push, toque)? aí sim adiante o robô, perto da rede — é o único jeito, porque mirar curto ele não sabe.</li>
              </ul>
            </div>

            {/* A régua que o manual do V300 dá, e que vale para qualquer bloco:
                é ela que resolve 90% do "a bola não está caindo certo". */}
            <div className="cf-ajuste">
              <div className="cf-ajuste-t">Se a bola não está caindo certo</div>
              <ul>
                <li><strong>Saindo da mesa?</strong> nesta ordem: <strong>1)</strong> tire o calço e encoste o robô na borda de trás; <strong>2)</strong> desça o <strong>Backspin</strong> em 1 (cortada forte demais faz a bola flutuar longe); <strong>3)</strong> desça <strong>Top e Back juntos</strong> em 1 — isso tira velocidade sem mudar o efeito.</li>
                <li><strong>Na rede?</strong> suba o <strong>Topspin</strong> em 1 e teste. Se ainda ficar na rede, suba o Backspin; só depois disso use o calço.</li>
                <li><strong>O calço levanta a saída.</strong> Bola na rede, sobe a altura (9 → 17 → 26 mm). <strong>Bola fora, tire o calço</strong> — calço no máximo com bola comprida só piora.</li>
                <li><strong>Achou a regulagem?</strong> pause e aperte <strong>memória</strong> — o robô guarda uma, e amanhã você volta nela com um toque.</li>
              </ul>
            </div>
          </div>)}

        {d.montagem && (
          <div className="cf-sec">
            <h4><Target size={13} /> Montagem</h4>
            <ul className="cf-lista">{d.montagem.map((x, i) => <li key={i}>{bold(x)}</li>)}</ul>
          </div>)}

        {passos && (
          <div className="cf-sec">
            <h4><Play size={13} /> Como executar</h4>
            <ol className="tl-passos">{passos.map((x, i) => <li key={i}>{bold(x)}</li>)}</ol>
          </div>)}

        {d.meta && (
          <div className="cf-meta"><Award size={14} /><span><strong>Meta de hoje: </strong>{d.meta}</span></div>)}

        {d.erros && (
          <div className="cf-sec">
            <h4><AlertTriangle size={13} /> O que estraga o bloco</h4>
            <ul className="cf-erros">{d.erros.map((x, i) => <li key={i}>{bold(x)}</li>)}</ul>
          </div>)}

        {robo && (
          <div className="tl-limite"><AlertTriangle size={12} /><span><strong>O que o robô não faz: </strong>{robo}</span></div>)}

        {bloco.cue && <p className="cf-cue" style={{ borderLeftColor: cor }}>{bloco.cue}</p>}
      </div>
    </div>);
}

export {
  bold, Dial, RobotPanel, MiniDials, efeitoDaRegulagem, tagClass, Exercicio, BlocoAcervo, Session, Counter, Notes, Collapsible, Vids, BallClock, SecTitle, Hero, Spark, GoalBar, Bars, ComoFazer
};
