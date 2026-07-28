import React, { useState, useEffect, useRef } from "react";
import {
  Check, ChevronDown, Play, Bot, GraduationCap, Trophy, Zap, Target, Info, RotateCcw, ChevronLeft, ChevronRight, Flame, Clock, Repeat, Timer, Pause, Plus, X, Gauge, Award, StickyNote, CalendarDays, Wind, AlertTriangle, Eye, EyeOff, CircleDot, Layers, TrendingUp, Users, Activity, Trash2, Camera, Minus
} from "lucide-react";
import { bold, Collapsible, Vids, Session, BallClock, Spark, SecTitle, Bars, Notes } from "../components/ui.jsx";
import { storage as store } from "../lib/db.js";
import { SERVE_RULES, SERVE_FAULTS, SERVE_GRIP, CONTACT_ZONES, TABLE_ZONES, SERVE_SUMMARY, HALF_LONG_WARNING, SERVES, DECEPTION, SERVE_SETUP, SERVE_SESSION, SERVE_PLAN } from "../data/serves.js";

/* ============ ABA SAQUE ============ */
function TableMap() {
  const cols = [{ x: 22, l: "FH dele" }, { x: 50, l: "meio" }, { x: 78, l: "BH dele" }];
  return (
    <div className="tablemap">
      <svg viewBox="0 0 100 96" className="tm-svg">
        <rect x="6" y="4" width="88" height="84" rx="2" fill="#1E5A8A" stroke="#0E2E4A" strokeWidth="1.2" />
        <line x1="50" y1="4" x2="50" y2="88" stroke="#fff" strokeWidth="0.6" opacity="0.4" />
        {TABLE_ZONES.map(z => (
          <g key={z.n}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="2.5"
              fill={z.y > 20 ? "#F26B21" : "#FFB347"} opacity={z.y > 20 ? "0.9" : "0.6"} />
            <text x={z.x + z.w / 2} y={z.y + z.h / 2 + 3.4} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#0E2E4A">{z.n}</text>
          </g>))}
        <rect x="4" y="44.4" width="92" height="3.2" fill="#F4F6F9" />
        <line x1="4" y1="46" x2="96" y2="46" stroke="#0E2E4A" strokeWidth="0.8" />
        {cols.map(c => <text key={c.l} x={c.x} y="94" textAnchor="middle" fontSize="5" fontWeight="700" fill="#6B7A8A">{c.l}</text>)}
        <text x="50" y="7.5" textAnchor="middle" fontSize="4.4" fill="#CFE3F2">linha de fundo dele</text>
        <text x="50" y="27" textAnchor="middle" fontSize="4.4" fill="#CFE3F2">rede</text>
        <text x="50" y="68" textAnchor="middle" fontSize="5.2" fill="#8FB4D2">seu lado</text>
      </svg>
      <p className="tm-cap"><strong>Laranja escuro (1-3):</strong> saques curtos, caem logo depois da rede — os mais seguros.
        <br /><strong>Laranja claro (4-6):</strong> saques longos, rasantes até o fundo — armas de surpresa.
        <br />Colunas na perspectiva de um adversário destro.</p>
    </div>);
}

function ServeSummary() {
  return (
    <div className="sumtable">
      <div className="st-head"><span>Saque</span><span>Efeito</span><span>Alvo</span></div>
      {SERVE_SUMMARY.map(r => (
        <div className="st-row" key={r[0]}>
          <div className="st-main"><span className="st-name">{r[0]}</span><span className="st-use">{r[3]}</span></div>
          <span className="st-spin">{r[1]}</span>
          <span className="st-target">{r[2]}</span>
        </div>))}
    </div>);
}

function ServeScore() {
  const [hit, setHit] = useState(0);
  const [miss, setMiss] = useState(0);
  const [best, setBest] = useState(null);
  useEffect(() => { (async () => { const b = await store.get("servebest:v1"); if (b) setBest(b); })(); }, []);
  const total = hit + miss;
  const pct = total ? Math.round((hit / total) * 100) : 0;
  const finish = () => {
    if (total === 0) return;
    if (!best || pct > best.pct) { const nb = { pct, hit, total }; setBest(nb); store.set("servebest:v1", nb); }
    setHit(0); setMiss(0);
  };
  return (
    <div className="scorebox">
      <div className="section-eyebrow"><Award size={13} /> Placar de saque no alvo</div>
      <div className="sc-top">
        <div className="sc-big">{hit}<span>/{total || 0}</span></div>
        <div className="sc-side">
          <div className="sc-pct">{pct}% de acerto</div>
          <div className="sc-best"><Award size={12} /> Recorde: {best ? `${best.hit}/${best.total} (${best.pct}%)` : "—"}</div>
        </div>
      </div>
      <div className="sc-btns">
        <button className="sbtn ok" onClick={() => setHit(h => h + 1)}><Check size={15} /> Acertou</button>
        <button className="sbtn no" onClick={() => setMiss(m => m + 1)}><X size={15} /> Errou</button>
        <button className="sbtn end" onClick={finish}><RotateCcw size={14} /> Fechar série</button>
      </div>
    </div>);
}

const SERVE_OUTCOMES = [
  { k: "boa", label: "Boa", short: "Boa", color: "#2FA36B", good: true },
  { k: "rede", label: "Não passou da rede", short: "Na rede", color: "#E0533A" },
  { k: "erro", label: "Erro de saque (falta)", short: "Falta", color: "#C43A22" },
  { k: "alta", label: "Bola alta", short: "Alta", color: "#E0A800" },
  { k: "efeito", label: "Pouco efeito", short: "S/ efeito", color: "#9A6BD0" },
  { k: "fora", label: "Bola fora", short: "Fora", color: "#6B7A8A" },
];

const SEED_SERVELOG = [
  { id: 1, date: "26/07", type: "Pendular — Lateral (sidespin)", counts: { boa: 20, rede: 4, erro: 1, alta: 1, efeito: 3, fora: 0 } },
  { id: 2, date: "26/07", type: "Pendular — Backspin", counts: { boa: 16, rede: 8, erro: 1, alta: 0, efeito: 2, fora: 0 } },
  { id: 3, date: "26/07", type: "Pendular — NO-SPIN (sem efeito)", counts: { boa: 18, rede: 6, erro: 5, alta: 2, efeito: 0, fora: 0 } },
  { id: 4, date: "26/07", type: "Tomahawk", counts: { boa: 16, rede: 0, erro: 6, alta: 7, efeito: 3, fora: 1 } },
];

function ServeLog() {
  const [log, setLog] = useState(null);
  const [type, setType] = useState(SERVES[0].name);
  const [c, setC] = useState({ boa: 0, rede: 0, erro: 0, alta: 0, efeito: 0, fora: 0 });
  const [saved, setSaved] = useState(false);

  useEffect(() => { (async () => {
    const l = await store.get("servelog:v3");
    const seeded = await store.get("servelog:seeded");
    if (Array.isArray(l)) setLog(l);
    else if (!seeded) { setLog(SEED_SERVELOG); store.set("servelog:v3", SEED_SERVELOG); store.set("servelog:seeded", true); }
    else setLog([]);
  })(); }, []);
  const persist = (arr) => { setLog(arr); store.set("servelog:v3", arr); store.set("servelog:seeded", true); };

  const total = SERVE_OUTCOMES.reduce((a, o) => a + (c[o.k] || 0), 0);
  const pct = total ? Math.round((c.boa / total) * 100) : 0;
  const pctColor = pct >= 65 ? "#2FA36B" : pct >= 45 ? "#E0A800" : "#E0533A";
  const bump = (k, d) => setC({ ...c, [k]: Math.max(0, (c[k] || 0) + d) });

  const save = () => {
    if (!total) return;
    const dt = new Date();
    const e = { id: Date.now(), date: `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}`, type, counts: { ...c } };
    persist([e, ...(log || [])].slice(0, 80));
    setC({ boa: 0, rede: 0, erro: 0, alta: 0, efeito: 0, fora: 0 });
    setSaved(true); setTimeout(() => setSaved(false), 2200);
  };
  const del = (id) => persist(log.filter(l => l.id !== id));

  if (log === null) return <div className="loading" style={{ padding: 30 }}>Carregando…</div>;

  const mine = log.filter(l => l.type === type);
  const curve = mine.slice(0, 8).reverse().map(l => { const t = SERVE_OUTCOMES.reduce((a, o) => a + (l.counts[o.k] || 0), 0); return { l: l.date, v: t ? Math.round((l.counts.boa / t) * 100) : 0 }; });

  // agregado geral de defeitos (todas as sessoes)
  const agg = {}; let aggTot = 0, aggBoa = 0;
  log.forEach(l => SERVE_OUTCOMES.forEach(o => { if (!o.good) { agg[o.k] = (agg[o.k] || 0) + (l.counts[o.k] || 0); } aggTot += l.counts[o.k] || 0; if (o.good) aggBoa += l.counts[o.k] || 0; }));
  const defeitos = SERVE_OUTCOMES.filter(o => !o.good).map(o => ({ l: o.short, v: agg[o.k] || 0, c: o.color })).filter(x => x.v > 0).sort((a, b) => b.v - a.v);
  const topDef = defeitos[0];

  return (
    <>
      <div className="slog">
        <div className="section-eyebrow"><Award size={13} /> Registrar sessão por tipo de erro</div>

        <div className="fld"><label>Tipo de saque</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            {SERVES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}</select></div>

        <div className="sl-counter">
          <div className="sl-big" style={{ color: pctColor }}>{c.boa}<span>/{total}</span></div>
          <div className="sl-side">
            <div className="sl-pct" style={{ color: pctColor }}>{total ? pct + "% bom" : "—"}</div>
            <div className="sl-ref">{total} saques contados</div>
          </div>
        </div>

        <div className="oc-grid">
          {SERVE_OUTCOMES.map(o => (
            <div className={"oc" + (o.good ? " oc-good" : "")} key={o.k} style={{ "--c": o.color }}>
              <div className="oc-top"><span className="oc-l">{o.label}</span><span className="oc-v">{c[o.k] || 0}</span></div>
              <div className="oc-btns">
                <button className="oc-b minus" onClick={() => bump(o.k, -1)}><Minus size={14} /></button>
                <button className="oc-b plus" onClick={() => bump(o.k, 1)}><Plus size={15} /></button>
              </div>
            </div>))}
        </div>

        <button className={"mastbtn" + (saved ? " on" : "")} disabled={!total} onClick={save}>
          <span className="mb-box">{saved && <Check size={13} strokeWidth={3} />}</span>
          {saved ? "Sessão registrada" : total ? `Salvar ${c.boa}/${total} (${pct}%)` : "Conte os saques para salvar"}</button>
      </div>

      {curve.length > 1 && (
        <div className="block">
          <div className="chart-head"><span className="ch-t">% bom · {type}</span><span className="ch-max">últimas {curve.length}</span></div>
          <Spark data={curve} color="#2FA36B" />
        </div>)}

      {defeitos.length > 0 && (
        <>
          <div className="block">
            <div className="section-eyebrow"><AlertTriangle size={13} /> Seus erros somados — treine o primeiro</div>
            <Bars data={defeitos} unit="×" />
          </div>
          {topDef && (
            <div className="diag"><div className="diag-row bad"><AlertTriangle size={15} /><div>
              <div className="dg-t">Prioridade da semana</div>
              <div className="dg-d"><strong>{topDef.l}</strong> é seu erro mais frequente ({topDef.v}× no total). {ERROR_TIP[topDef.l] || ""}</div>
            </div></div></div>)}
        </>)}

      {log.length > 0 && (
        <div className="slhist">
          <div className="section-eyebrow"><CalendarDays size={13} /> Histórico de sessões</div>
          {log.map(l => {
            const t = SERVE_OUTCOMES.reduce((a, o) => a + (l.counts[o.k] || 0), 0);
            const p = t ? Math.round((l.counts.boa / t) * 100) : 0;
            const worst = SERVE_OUTCOMES.filter(o => !o.good).map(o => ({ o, v: l.counts[o.k] || 0 })).sort((a, b) => b.v - a.v)[0];
            return (
              <div className="slrow" key={l.id}>
                <span className="sl-badge" style={{ background: p >= 65 ? "#2FA36B" : p >= 45 ? "#E0A800" : "#E0533A" }}>{p}%</span>
                <div className="sl-mid"><span className="sl-t">{l.type}</span>
                  <span className="sl-d">{l.counts.boa}/{t} boas · {l.date}{worst && worst.v ? ` · pior: ${worst.o.short} ${worst.v}` : ""}</span></div>
                <button className="mc-del" onClick={() => del(l.id)}><Trash2 size={14} /></button>
              </div>);
          })}
        </div>)}

      <div className="warnbox"><Info size={15} /><span>Referência de "% bom": iniciante 30–45%, intermediário 55–70%, avançado acima de 80%. Erros na rede indicam saque afundado — dê mais comprimento; bola alta indica contato tarde ou lançamento para trás.</span></div>
    </>);
}

const ERROR_TIP = {
  "Na rede": "Você está afundando o saque. Mesmo contato fino, mas empurre um pouco mais para frente junto com o para baixo — backspin curto ainda cruza a rede.",
  "Falta": "Revise o lançamento: 16 cm mínimos, quase vertical, bola visível. A maioria das faltas vem de lançamento baixo ou para o lado.",
  "Alta": "Contato tarde ou lançamento indo para trás. Toque a bola mais cedo e mantenha o lançamento na altura dos olhos.",
  "S/ efeito": "Contato grosso. Afine o toque e acelere o punho, não o braço.",
  "Fora": "Raro no seu caso. Reduza a força e encurte o comprimento.",
};

const SERVE_CHAPTERS = [
  { id: "base", label: "Regras e pegada" },
  { id: "efeito", label: "Efeito e alvo" },
  { id: "saques", label: "Os 8 saques" },
  { id: "treino", label: "Treinar" },
];

function ServeTab({ onTimer, serveNote, onServeNote }) {
  const [ch, setCh] = useState("base");
  return (
    <>
      {ch === "base" && (
        <div className="serve-hero">
          <div className="sh-eyebrow"><Target size={13} /> Academia de Saque</div>
          <h2>O saque é o único golpe 100% seu</h2>
          <p>Ninguém interfere. É onde um iniciante ganha de gente mais experiente — e onde o disfarce vale mais que a força.</p>
        </div>)}

      <div className="catbar">
        {SERVE_CHAPTERS.map(c => (
          <button key={c.id} className={"catpill" + (ch === c.id ? " active" : "")} onClick={() => setCh(c.id)}>{c.label}</button>))}
      </div>

      {ch === "base" && <>
      <div className="serve-section-title"><AlertTriangle size={14} /> 1. Regras e faltas</div>
      <Collapsible title="Regras oficiais do saque" icon={<AlertTriangle size={15} />} sub="leia antes de treinar">
        <ul className="clean-list">{SERVE_RULES.map((r, i) => <li key={i}>{bold(r)}</li>)}</ul>
        <div className="bio-note"><Info size={14} /> Esconder a bola com o corpo ou com o braço é falta. O disfarce moderno vem do <strong>movimento</strong>, não de ocultar a bola.</div>
      </Collapsible>
      <Collapsible title="Faltas que dão ponto ao adversário" icon={<X size={15} />} sub="evite estes 6">
        <ul className="err-list">{SERVE_FAULTS.map((f, i) => <li key={i}>{f}</li>)}</ul>
      </Collapsible>

      <div className="serve-section-title"><Target size={14} /> 2. Empunhadura e preparação</div>
      <div className="block">
        <ul className="clean-list">{SERVE_GRIP.map((g, i) => <li key={i}>{bold(g)}</li>)}</ul>
      </div>

      </>}

      {ch === "efeito" && <>
      <div className="serve-section-title"><CircleDot size={14} /> 3. O relógio da bola</div>
      <div className="block">
        <p className="p-lead">Imagine a bola como um relógio visto de lado. O <strong>ponto de contato</strong> decide o efeito — e o braço pode ser sempre o mesmo. Guarde este quadro: ele é a chave de todo o disfarce.</p>
        <BallClock />
        <div className="zones">{CONTACT_ZONES.map(z => (
          <div className="zone" key={z.z}>
            <div className="zone-top"><span className="zone-z">{z.z}</span><span className="zone-spin">{z.spin}</span></div>
            <p className="zone-how">{z.how}</p>
          </div>))}</div>
      </div>

      <div className="serve-section-title"><Layers size={14} /> 4. Onde sacar — as 6 zonas</div>
      <div className="block">
        <TableMap />
        <div className="zones">{TABLE_ZONES.map(z => (
          <div className="zone" key={z.n}>
            <div className="zone-top"><span className="zone-z"><span className="zn">{z.n}</span> {z.name}</span><span className="zone-spin">{z.tag}</span></div>
            <p className="zone-how">{z.d}</p>
          </div>))}</div>
        <div className="warnbox"><AlertTriangle size={15} /><span>{bold(HALF_LONG_WARNING)}</span></div>
      </div>

      </>}

      {ch === "saques" && <>
      <div className="serve-section-title"><Wind size={14} /> 5. Os 8 saques, um por um</div>
      <div className="block"><div className="section-eyebrow"><Layers size={13} /> Resumo — toque em cada saque abaixo para abrir a ficha completa</div>
        <ServeSummary /></div>
      {SERVES.map(s => (
        <Collapsible key={s.id} title={s.name} icon={<Wind size={15} />} sub={s.level} tone={s.key ? "serve-card key-card" : "serve-card"}>
          {s.key && <div className="keytag"><Zap size={12} /> Saque-chave do seu repertório</div>}
          <p className="p-lead">{s.idea}</p>
          <div className="mini-title">Posição e preparação</div>
          <ul className="clean-list">{s.setup.map((x, i) => <li key={i}>{bold(x)}</li>)}</ul>
          <div className="mini-title">Execução passo a passo</div>
          <ol className="bio-steps">{s.motion.map((x, i) => <li key={i}>{bold(x)}</li>)}</ol>
          <div className="len-box"><Info size={14} /><span><strong>Comprimento e alvo: </strong>{bold(s.length)}</span></div>
          <div className="mini-title">Erros comuns e correção</div>
          <ul className="err-list">{s.err.map((x, i) => <li key={i}>{x}</li>)}</ul>
          <div className="drill-box"><Repeat size={14} /><span><strong>Treino: </strong>{s.drill}</span></div>
          <div className="third-box"><Eye size={14} /><span><strong>3ª bola — o que esperar: </strong>{s.third}</span></div>
          <Vids videos={s.videos} />
        </Collapsible>))}

      <div className="serve-section-title"><EyeOff size={14} /> 6. O saque que ele não consegue ler</div>
      <div className="decept">
        <p className="dec-principle">{bold(DECEPTION.principle)}</p>
        <div className="mini-title">As 6 chaves do disfarce</div>
        <div className="dec-keys">{DECEPTION.keys.map(k => { const I = k.icon;
          return (<div className="dec-key" key={k.t}><span className="dk-icon"><I size={15} /></span>
            <div><div className="dk-t">{k.t}</div><div className="dk-d">{bold(k.d)}</div></div></div>); })}</div>

        <div className="mini-title" style={{ marginTop: 22 }}>Os pares de saque (mesmo movimento, efeitos opostos)</div>
        {DECEPTION.pairs.map((pr, i) => (
          <div className={"pair" + (pr.star ? " pair-star" : "")} key={i}>
            {pr.star && <div className="keytag"><Zap size={12} /> Comece por este par</div>}
            <div className="pair-heads"><span className="pair-a">{pr.a}</span><span className="pair-vs">×</span><span className="pair-b">{pr.b}</span></div>
            <div className="pair-row"><strong>O que muda:</strong> {pr.diff}</div>
            <div className="pair-row tell"><strong>Como ele descobre (tarde):</strong> {pr.tell}</div>
            <div className="pair-row use"><strong>Quando usar:</strong> {pr.use}</div>
          </div>))}

        <div className="mini-title" style={{ marginTop: 22 }}>Treino do disfarce — 5 blocos</div>
        <ul className="clean-list">{DECEPTION.drill.map((d, i) => <li key={i}>{bold(d)}</li>)}</ul>
        <Vids videos={DECEPTION.videos} />
      </div>

      </>}

      {ch === "treino" && <>
      <div className="serve-section-title"><Clock size={14} /> 7. Como treinar (quarta, sexta e domingo)</div>
      <div className="block">
        <div className="section-eyebrow"><Info size={13} /> Monte a estação de saque</div>
        <ul className="clean-list">{SERVE_SETUP.map((s, i) => <li key={i}>{bold(s)}</li>)}</ul>
      </div>
      <Session session={SERVE_SESSION} onTimer={onTimer} />

      <SecTitle n="8" icon={<Award size={14} />}>Registro e pontuação</SecTitle>
      <ServeLog />

      <div className="serve-plan">
        <div className="section-eyebrow"><CalendarDays size={13} /> Progressão do saque</div>
        {SERVE_PLAN.map(p => (
          <div className="sp-row" key={p.w}>
            <span className="sp-w">{p.w}</span>
            <span><strong>{p.t}</strong> — {p.d}</span>
          </div>))}
      </div>

      <Notes value={serveNote} onSave={onServeNote} placeholder="Diário de saque: qual efeito saiu melhor, quantos o adversário errou, ajustes de punho…" />
      </>}
    </>);
}



export { ServeTab };
