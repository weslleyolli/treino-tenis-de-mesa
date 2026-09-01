import React, { useState, useEffect, useRef } from "react";
import {
  Check, ChevronDown, Play, Bot, GraduationCap, Trophy, Zap, Target, Info, RotateCcw, ChevronLeft, ChevronRight, Flame, Clock, Repeat, Timer, Pause, Plus, X, Gauge, Award, StickyNote, CalendarDays, Wind, AlertTriangle, Eye, EyeOff, CircleDot, Layers, TrendingUp, Users, Activity, Trash2, Camera, Minus
} from "lucide-react";
import { parseMin, parseRest, fmt, beep, yt } from "../lib/helpers.jsx";
import { storage as store } from "../lib/db.js";
import { robotFor, KIND_META } from "../data/schedule.jsx";
import { tecnicasPorId } from "../data/strokes.js";

/* ============ COMPONENTES ============ */
function Dial({ label, value }) {
  const tog = value === "ON" || value === "OFF";
  return (
    <div className="dial">
      <div className="dial-head"><span className="dial-label">{label}</span>
        <span className={"dial-val" + (tog ? (value === "ON" ? " on" : " off") : "")}>{value}</span></div>
      {tog ? <div className={"toggle " + (value === "ON" ? "toggle-on" : "toggle-off")}><div className="toggle-knob" /></div>
        : <div className="track">{Array.from({ length: 10 }).map((_, i) => <span key={i} className={"tick" + (i === value ? " active" : i < value ? " past" : "")} />)}</div>}
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
      <div className="dials">{Object.entries(cfg.dials).map(([k, v]) => <Dial key={k} label={k} value={v} />)}</div>
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
  if (t === "jogo") return "t-match";
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
function GuiaPadrao({ guia }) {
  const [aberto, setAberto] = useState(true);
  if (!guia) return null;
  return (
    <div className="guia">
      <button className="guia-head" onClick={() => setAberto(o => !o)}>
        <span className="guia-t"><Info size={14} /> Como fazer</span>
        <ChevronDown size={17} className={"chev" + (aberto ? " open" : "")} />
      </button>

      {aberto && (
        <div className="guia-body">
          <div className="guia-sec">
            <div className="mini-title">Montagem</div>
            <div className="gset"><span className="gset-l">Robô</span><span>{guia.montagem.robo}</span></div>
            <div className="gset"><span className="gset-l">Você</span><span>{guia.montagem.voce}</span></div>
            <div className="gset"><span className="gset-l">Confira</span><span>{guia.montagem.confira}</span></div>
          </div>

          <div className="guia-sec">
            <div className="mini-title">A situação de jogo</div>
            <p className="guia-sit">{guia.situacao}</p>
          </div>

          <div className="guia-sec">
            <div className="mini-title">Passo a passo</div>
            <ol className="bio-steps">{guia.passos.map((x, i) => <li key={i}>{bold(x)}</li>)}</ol>
          </div>

          <div className="guia-foco"><Target size={15} /><span><strong>O que olhar hoje: </strong>{guia.olhar}</span></div>

          <div className="guia-sec">
            <div className="mini-title">Se estiver errando</div>
            <div className="gfix">
              {guia.ajustes.map(([sintoma, correcao], i) => (
                <div className="gfix-row" key={i}>
                  <span className="gfix-s">{sintoma}</span>
                  <span className="gfix-c">{correcao}</span>
                </div>))}
            </div>
          </div>

          <div className="guia-erro"><AlertTriangle size={15} /><span><strong>Erro mais comum: </strong>{guia.erro}</span></div>
        </div>)}
    </div>);
}

export {
  bold, GuiaPadrao, Dial, RobotPanel, tagClass, Exercicio, BlocoAcervo, Session, Counter, Notes, Collapsible, Vids, BallClock, SecTitle, Hero, Spark, GoalBar, Bars
};
