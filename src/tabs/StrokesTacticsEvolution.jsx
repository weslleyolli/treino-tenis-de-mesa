import React, { useState, useEffect } from "react";
import {
  Check, ChevronDown, Play, Bot, GraduationCap, Trophy, Zap, Target, Info, RotateCcw, ChevronLeft, ChevronRight, Flame, Clock, Repeat, Timer, Pause, Plus, X, Gauge, Award, StickyNote, CalendarDays, Wind, AlertTriangle, Eye, EyeOff, CircleDot, Layers, TrendingUp, Users, Activity, Trash2, Camera, Minus
} from "lucide-react";
import { bold, Collapsible, Vids, SecTitle, Hero, Spark, GoalBar, Bars } from "../components/ui.jsx";
import { storage as store } from "../lib/db.js";
import { STROKES, STROKE_CATS } from "../data/strokes.js";
import { COMBOS, OPPONENTS, GAME_VARIATIONS, LOSING_FIXES, GOLDEN_RULES } from "../data/tactics.js";
import { DAYS, isDayDone } from "../data/schedule.jsx";

/* ============ ABA GOLPES ============ */
const CAT_COLOR = { Base: "#1E5A8A", Controle: "#2FA36B", Ataque: "#F26B21", Defesa: "#7C5CFC" };

function StrokesTab() {
  const [cat, setCat] = useState("Todos");
  const [openId, setOpenId] = useState(STROKES[0].id);
  const [mast, setMast] = useState({});
  useEffect(() => { (async () => { const m = await store.get("mastery:v1"); if (m) setMast(m); })(); }, []);
  const toggle = (id) => { const nx = { ...mast, [id]: !mast[id] }; setMast(nx); store.set("mastery:v1", nx); };
  const list = cat === "Todos" ? STROKES : STROKES.filter(s => s.cat === cat);
  const doneN = STROKES.filter(s => mast[s.id]).length;

  return (
    <>
      <Hero tone="blue" icon={<Target size={13} />} eyebrow="Biblioteca de Golpes"
        title={`${doneN} de ${STROKES.length} golpes dominados`}
        sub="Biomecânica, erros comuns, treino no robô e vídeo de cada fundamento. Marque o que já saiu automático."
        pct={Math.round((doneN / STROKES.length) * 100)} />

      <div className="catbar">
        {["Todos"].concat(STROKE_CATS).map(c => (
          <button key={c} className={"catpill" + (c === cat ? " active" : "")}
            style={c !== "Todos" ? { "--c": CAT_COLOR[c] } : {}} onClick={() => setCat(c)}>
            {c !== "Todos" && <span className="cd" />}{c}</button>))}
      </div>

      {list.map((s, i) => {
        const open = openId === s.id;
        return (
          <div className={"scard" + (open ? " open" : "")} key={s.id} style={{ "--c": CAT_COLOR[s.cat] }}>
            <button className="scard-head" onClick={() => setOpenId(open ? null : s.id)}>
              <span className="sc-num">{String(STROKES.indexOf(s) + 1).padStart(2, "0")}</span>
              <span className="sc-mid">
                <span className="sc-name">{s.name}</span>
                <span className="sc-meta"><span className="sc-cat">{s.cat}</span><span className="sc-lvl">{s.level}</span>
                  {s.core && <span className="sc-core"><Zap size={9} /> Mês 1</span>}</span>
              </span>
              <ChevronDown size={18} className={"chev" + (open ? " open" : "")} />
            </button>
            {open && (
              <div className="scard-body">
                <p className="p-lead">{s.idea}</p>
                <div className="whenbox"><Info size={14} /><span><strong>Quando usar: </strong>{s.when}</span></div>
                <div className="mini-title">Execução passo a passo</div>
                <ol className="bio-steps">{s.steps.map((x, k) => <li key={k}>{bold(x)}</li>)}</ol>
                <div className="mini-title">Erros comuns</div>
                <ul className="err-list">{s.err.map((x, k) => <li key={k}>{x}</li>)}</ul>
                <div className="drill-box"><Repeat size={14} /><span><strong>Treino: </strong>{s.drill}</span></div>
                {s.robot && <div className="len-box"><Bot size={14} /><span><strong>No robô: </strong>{s.robot}</span></div>}
                <Vids videos={s.videos} />
                <button className={"mastbtn" + (mast[s.id] ? " on" : "")} onClick={() => toggle(s.id)}>
                  <span className="mb-box">{mast[s.id] && <Check size={13} strokeWidth={3} />}</span>
                  {mast[s.id] ? "Golpe dominado" : "Marcar como dominado"}</button>
              </div>)}
          </div>);
      })}
    </>);
}

/* ============ ABA TÁTICAS ============ */
function TacticsTab() {
  const [openC, setOpenC] = useState(1);
  const [openO, setOpenO] = useState(null);
  return (
    <>
      <Hero tone="purple" icon={<Layers size={13} />} eyebrow="Táticas de Jogo"
        title="O que usar no domingo"
        sub="Combos prontos, plano contra cada tipo de adversário e o que ajustar quando o jogo escapa." />

      <div className="cheat">
        <div className="ch-head"><Trophy size={14} /> Cartão de domingo — leve estes três na cabeça</div>
        <div className="ch-items">
          <div className="ch-item"><span className="ch-n">1</span><div><strong>Meu saque:</strong> pendular backspin curto na zona 1. Repito enquanto funcionar.</div></div>
          <div className="ch-item"><span className="ch-n">2</span><div><strong>Meu combo:</strong> no-spin curto no cotovelo → ele empurra alto → ataco de forehand.</div></div>
          <div className="ch-item"><span className="ch-n">3</span><div><strong>Minha regra:</strong> 80% de força e pés antes do golpe. Nada de saque novo em jogo.</div></div>
        </div>
      </div>

      <SecTitle n="1" icon={<Zap size={14} />}>Combos saque + 3ª bola</SecTitle>
      {COMBOS.map(c => {
        const open = openC === c.n;
        return (
          <div className={"combo" + (c.star ? " combo-star" : "") + (open ? " open" : "")} key={c.n}>
            <button className="combo-head" onClick={() => setOpenC(open ? null : c.n)}>
              <span className="combo-n">{c.n}</span>
              <span className="combo-mid"><span className="combo-name">{c.name}</span>
                {c.star && <span className="sc-core"><Zap size={9} /> combo principal</span>}</span>
              <ChevronDown size={17} className={"chev" + (open ? " open" : "")} />
            </button>
            {open && (<div className="combo-body">
              <ol className="seq">{c.seq.map((s, i) => <li key={i}>{bold(s)}</li>)}</ol>
              <div className="combo-why"><Info size={13} /><span>{c.why}</span></div>
              <div className="combo-train"><Repeat size={13} /><span><strong>Como treinar: </strong>{c.train}</span></div>
            </div>)}
          </div>);
      })}

      <SecTitle n="2" icon={<Users size={14} />}>Plano contra cada adversário</SecTitle>
      {OPPONENTS.map(o => {
        const open = openO === o.type;
        return (
          <div className={"ocard" + (open ? " open" : "")} key={o.type}>
            <button className="ocard-head" onClick={() => setOpenO(open ? null : o.type)}>
              <span className="oc-ico"><Users size={15} /></span>
              <span className="oc-name">{o.type}</span>
              <ChevronDown size={17} className={"chev" + (open ? " open" : "")} />
            </button>
            {open && (<div className="ocard-body">
              <div className="whenbox"><Target size={14} /><span><strong>Ponto fraco: </strong>{o.weak}</span></div>
              <ul className="clean-list" style={{ marginTop: 12 }}>{o.plan.map((p, i) => <li key={i}>{bold(p)}</li>)}</ul>
            </div>)}
          </div>);
      })}

      <SecTitle n="3" icon={<Activity size={14} />}>Variações que funcionam</SecTitle>
      <div className="vargrid">
        {GAME_VARIATIONS.map((v, i) => (
          <div className="varcard" key={v.t}><span className="vc-n">{i + 1}</span>
            <div className="vc-t">{v.t}</div><div className="vc-d">{v.d}</div></div>))}
      </div>

      <SecTitle n="4" icon={<TrendingUp size={14} />}>Quando está perdendo</SecTitle>
      <div className="block"><ul className="clean-list">{LOSING_FIXES.map((l, i) => <li key={i}>{bold(l)}</li>)}</ul></div>

      <SecTitle n="5" icon={<Award size={14} />}>Regras de ouro</SecTitle>
      <div className="block"><ul className="check-list">{GOLDEN_RULES.map((g, i) => <li key={i}>{g}</li>)}</ul></div>
    </>);
}

/* ============ ABA EVOLUÇÃO ============ */
function EvolutionTab({ done, records, keyOf }) {
  const [best, setBest] = useState(null);
  const [mast, setMast] = useState({});
  useEffect(() => { (async () => {
    const b = await store.get("servebest:v1"); if (b) setBest(b);
    const m = await store.get("mastery:v1"); if (m) setMast(m);
  })(); }, []);
  const weeks = [1, 2, 3, 4];
  const total = (() => { let n = 0; for (let w = 1; w <= 4; w++) DAYS.forEach(d => { if (isDayDone(done, w, d.id)) n++; }); return n; })();
  const pct = Math.round((total / 28) * 100);
  const byWeek = weeks.map(w => DAYS.filter(d => isDayDone(done, w, d.id)).length);
  const series = (dayId) => weeks.map(w => ({ l: "S" + w, v: records[`w${w}-${dayId}-robo`] || 0 }));
  const fh = series("seg"), bh = series("sex"), ts = series("qua");
  const mx = (a) => Math.max(0, ...a.map(x => x.v));
  const mastN = STROKES.filter(s => mast[s.id]).length;
  const minutes = total * 50;
  const charts = [
    { t: "Forehand — bolas seguidas", d: fh, c: "#F26B21", day: "segunda" },
    { t: "Backhand — bolas seguidas", d: bh, c: "#1E5A8A", day: "sexta" },
    { t: "Topspin vs backspin — bolas boas", d: ts, c: "#7C5CFC", day: "quarta" },
  ];
  const nextStep = mx(fh) < 40 ? "Foco em regularidade de forehand na segunda — meta de 40 bolas seguidas."
    : mx(bh) < 30 ? "Forehand no ponto. Agora puxe o backhand na sexta até 30 seguidas."
    : mx(ts) < 15 ? "Base sólida. O gargalo agora é o topspin contra backspin, na quarta."
    : "Fundamentos do Mês 1 batidos. Hora de abrir o Mês 2: topspin de backhand e saques invertidos.";

  return (
    <>
      <Hero tone="green" icon={<TrendingUp size={13} />} eyebrow="Evolução"
        title={`${total} de 28 treinos · ${pct}%`}
        sub={total === 0 ? "Marque um treino como concluído na aba Semana para começar a preencher os gráficos."
          : `Cerca de ${Math.round(minutes / 60)}h de treino acumuladas neste mês.`}
        pct={pct} />

      <div className="statgrid">
        <div className="stat"><span className="stat-v">{total}</span><span className="stat-l">treinos feitos</span></div>
        <div className="stat"><span className="stat-v">{mx(fh) || "—"}</span><span className="stat-l">recorde forehand</span></div>
        <div className="stat"><span className="stat-v">{mx(bh) || "—"}</span><span className="stat-l">recorde backhand</span></div>
        <div className="stat"><span className="stat-v">{best ? best.pct + "%" : "—"}</span><span className="stat-l">saque no alvo</span></div>
      </div>

      <SecTitle n="1" icon={<CalendarDays size={14} />}>Mapa do mês</SecTitle>
      <div className="block">
        <div className="heat">
          <div className="heat-row heat-head"><span className="heat-w" /> {DAYS.map(d => <span className="heat-c hc-lbl" key={d.id}>{d.short[0]}</span>)}</div>
          {weeks.map(w => (
            <div className="heat-row" key={w}>
              <span className="heat-w">S{w}</span>
              {DAYS.map(d => { const on = isDayDone(done, w, d.id);
                return <span className={"heat-c" + (on ? " on" : "")} key={d.id} title={d.name}>{on && <Check size={10} strokeWidth={4} />}</span>; })}
              <span className="heat-n">{byWeek[w - 1]}/7</span>
            </div>))}
        </div>
        <p className="tm-cap" style={{ textAlign: "left" }}>Cada quadrado é um treino. Quatro linhas cheias = Mês 1 completo.</p>
      </div>

      <SecTitle n="2" icon={<Award size={14} />}>Curva dos recordes</SecTitle>
      {charts.map(c => (
        <div className="block" key={c.t}>
          <div className="chart-head"><span className="ch-t">{c.t}</span><span className="ch-max">máx {Math.max(0, ...c.d.map(x => x.v)) || 0}</span></div>
          {c.d.some(x => x.v > 0)
            ? <Spark data={c.d} color={c.c} />
            : <div className="emptymini"><Info size={14} /><span>Use o contador <strong>+1</strong> no treino de {c.day} — a curva aparece aqui.</span></div>}
        </div>))}

      <SecTitle n="3" icon={<Target size={14} />}>Metas do Mês 1</SecTitle>
      <div className="block">
        <GoalBar label="Forehands seguidos" cur={mx(fh)} target={40} />
        <GoalBar label="Backhands seguidos" cur={mx(bh)} target={30} />
        <GoalBar label="Topspins bons vs backspin" cur={mx(ts)} target={15} />
        <GoalBar label="Saque no alvo" cur={best ? best.pct : 0} target={70} unit="%" />
        <GoalBar label="Golpes dominados" cur={mastN} target={STROKES.length} />
        <GoalBar label="Treinos do mês" cur={total} target={28} />
      </div>

      <div className="nextbox"><TrendingUp size={16} /><div><div className="nb-t">Próximo passo</div><div className="nb-d">{nextStep}</div></div></div>
    </>);
}


export { StrokesTab, TacticsTab, EvolutionTab };
