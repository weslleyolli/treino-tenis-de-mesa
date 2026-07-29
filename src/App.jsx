import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Check, ChevronDown, Play, Bot, GraduationCap, Trophy, Zap, Target, Info, RotateCcw, ChevronLeft, ChevronRight, Flame, Clock, Repeat, Timer, Pause, Plus, X, Gauge, Award, StickyNote, CalendarDays, Wind, AlertTriangle, Eye, EyeOff, CircleDot, Layers, TrendingUp, Users, Activity, Trash2, Camera, Minus
} from "lucide-react";
import "./styles.css";
import { fmt, beep } from "./lib/helpers.jsx";
import { storage as store } from "./lib/db.js";
import { DAYS, isDayDone } from "./data/schedule.jsx";
import { WeekTab } from "./tabs/WeekTab.jsx";
import { ServeTab } from "./tabs/ServeTab.jsx";
import { StrokesTab, TacticsTab, EvolutionTab } from "./tabs/StrokesTacticsEvolution.jsx";
import { AnalysisTab } from "./tabs/AnalysisTab.jsx";
import { TournamentTab } from "./tabs/TournamentTab.jsx";
import { RankingTab } from "./tabs/RankingTab.jsx";

/* Navegação por intenção, não por assunto: o que eu faço hoje, o que eu estudo,
   o que eu meço e o que eu jogo. Cada grupo abre no máximo 3 seções. */
const NAV = [
  { id: "hoje", label: "Hoje", icon: CalendarDays },
  { id: "tecnica", label: "Técnica", icon: Target, subs: [
    { id: "golpes", label: "Golpes" },
    { id: "saque", label: "Saque" },
    { id: "taticas", label: "Táticas" },
  ] },
  { id: "progresso", label: "Progresso", icon: TrendingUp, subs: [
    { id: "evolucao", label: "Evolução" },
    { id: "analise", label: "Análise" },
  ] },
  { id: "jogos", label: "Jogos", icon: Trophy, subs: [
    { id: "torneio", label: "Torneio" },
    { id: "ranking", label: "Ranking" },
  ] },
];

/* ============ APP ============ */
export default function App() {
  const [group, setGroup] = useState("hoje");
  const [sub, setSub] = useState({ tecnica: "golpes", progresso: "evolucao", jogos: "torneio" });
  const [week, setWeek] = useState(1);
  const [activeIdx, setActiveIdx] = useState(0);
  const [done, setDone] = useState({});
  const [records, setRecords] = useState({});
  const [notes, setNotes] = useState({});
  const [serveNote, setServeNote] = useState("");
  const [timer, setTimer] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { (async () => {
    setDone((await store.get("progress:v4")) || {});
    setRecords((await store.get("records:v4")) || {});
    setNotes((await store.get("notes:v4")) || {});
    setServeNote((await store.get("servenote:v3")) || "");
    const w = await store.get("week:v4"); if (w) setWeek(w);
    const js = new Date().getDay(); setActiveIdx(js === 0 ? 6 : js - 1);
    setLoaded(true);
  })(); }, []);

  useEffect(() => { if (!timer || !timer.running) return;
    const id = setInterval(() => setTimer(t => (t && t.running ? { ...t, left: Math.max(0, t.left - 1) } : t)), 1000);
    return () => clearInterval(id); }, [timer && timer.running]);

  useEffect(() => { if (timer && timer.running && timer.left === 0) {
    setTimer(t => (t ? { ...t, running: false } : t)); beep(); try { navigator.vibrate && navigator.vibrate(250); } catch {} } },
    [timer && timer.left, timer && timer.running]);

  const keyOf = (w, id) => `w${w}-${id}`;
  const day = DAYS[activeIdx];

  const toggleSession = (skey) => { const nx = { ...done, [skey]: !done[skey] }; setDone(nx); store.set("progress:v4", nx); };
  const changeWeek = (w) => { setWeek(w); store.set("week:v4", w); };
  const resetWeek = () => { const nx = { ...done }; Object.keys(nx).forEach(k => { if (k.indexOf("w" + week + "-") === 0) delete nx[k]; }); setDone(nx); store.set("progress:v4", nx); };
  const setRecord = (skey, v) => { const nx = { ...records, [skey]: v }; setRecords(nx); store.set("records:v4", nx); };
  const setNote = (skey, v) => { const nx = { ...notes, [skey]: v }; setNotes(nx); store.set("notes:v4", nx); };
  const saveServeNote = (v) => { setServeNote(v); store.set("servenote:v3", v); };
  const onTimer = (label, sec) => setTimer({ label, total: sec, left: sec, running: true });
  const monthDone = useMemo(() => { let n = 0; for (let w = 1; w <= 4; w++) DAYS.forEach(d => { if (isDayDone(done, w, d.id)) n++; }); return n; }, [done]);

  const cur = NAV.find(g => g.id === group);
  const view = cur.subs ? sub[group] : group;

  if (!loaded) return <div className="loading">Carregando seu treino…</div>;

  return (
    <div className="app">
      
      <header className="hdr">
        <div className="brand"><span className="ball" />
          <div><div className="brand-name">MESA<span>1</span></div>
            <div className="brand-sub">Robô 7 dias · 2 aulas · campeonato</div></div></div>
        <div className="tabs">
          {NAV.map(g => { const I = g.icon;
            return (<button key={g.id} className={"tab" + (group === g.id ? " active" : "")} onClick={() => setGroup(g.id)}>
              <I size={15} /> {g.label}</button>); })}
        </div>
      </header>

      <main className="content" style={{ paddingBottom: timer ? 90 : 26 }}>
        {cur.subs && (
          <div className="segtabs subnav">
            {cur.subs.map(s => (
              <button key={s.id} className={"segtab" + (view === s.id ? " on" : "")}
                onClick={() => setSub({ ...sub, [group]: s.id })}>{s.label}</button>))}
          </div>)}

        {group === "hoje" && <WeekTab week={week} setWeek={changeWeek} activeIdx={activeIdx} setActiveIdx={setActiveIdx} done={done}
          toggleSession={toggleSession} records={records} setRecord={setRecord} notes={notes} setNote={setNote}
          onTimer={onTimer} resetWeek={resetWeek} monthDone={monthDone} />}
        {view === "golpes" && <StrokesTab />}
        {view === "saque" && <ServeTab onTimer={onTimer} serveNote={serveNote} onServeNote={saveServeNote} />}
        {view === "taticas" && <TacticsTab />}
        {view === "analise" && <AnalysisTab />}
        {view === "evolucao" && <EvolutionTab done={done} records={records} keyOf={keyOf} />}
        {view === "torneio" && <TournamentTab />}
        {view === "ranking" && <RankingTab />}
      </main>

      {timer && (
        <div className="timerbar">
          <div className="tb-info"><span className="tb-label">{timer.label}</span><span className="tb-time">{fmt(timer.left)}</span></div>
          <div className="tb-controls">
            <button onClick={() => setTimer(t => ({ ...t, left: t.left + 30 }))}><Plus size={16} /></button>
            <button className="tb-main" onClick={() => setTimer(t => ({ ...t, running: !t.running }))}>{timer.running ? <Pause size={18} /> : <Play size={18} />}</button>
            <button onClick={() => setTimer(t => ({ ...t, left: t.total, running: false }))}><RotateCcw size={16} /></button>
            <button onClick={() => setTimer(null)}><X size={16} /></button>
          </div>
        </div>)}
    </div>);
}



