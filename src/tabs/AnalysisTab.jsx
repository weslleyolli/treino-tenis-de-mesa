import React, { useState, useEffect } from "react";
import {
  Check, ChevronDown, Play, Bot, GraduationCap, Trophy, Zap, Target, Info, RotateCcw, ChevronLeft, ChevronRight, Flame, Clock, Repeat, Timer, Pause, Plus, X, Gauge, Award, StickyNote, CalendarDays, Wind, AlertTriangle, Eye, EyeOff, CircleDot, Layers, TrendingUp, Users, Activity, Trash2, Camera, Minus
} from "lucide-react";
import { bold, Collapsible, Vids, SecTitle, Hero, Spark } from "../components/ui.jsx";
import { storage as store } from "../lib/db.js";
import { CAPTURE, FRAMES_GUIDE, RUBRICS, PROMPT_TEXT } from "../data/analysis.js";

/* ============ ABA ANÁLISE ============ */
function AnalysisTab() {
  const [rid, setRid] = useState(RUBRICS[0].id);
  const [scores, setScores] = useState({});
  const [hist, setHist] = useState([]);
  const [copied, setCopied] = useState(false);
  useEffect(() => { (async () => { const h = await store.get("analysis:v1"); if (h) setHist(h); })(); }, []);

  const rub = RUBRICS.find(r => r.id === rid);
  const items = rub.frames.flatMap((fr, fi) => fr.items.map((it, ii) => ({ ...it, f: fr.f, key: rid + "-" + fi + "-" + ii })));
  const answered = items.filter(i => scores[i.key] !== undefined);
  const sum = answered.reduce((a, i) => a + scores[i.key], 0);
  const nota = items.length ? (sum / (items.length * 2)) * 10 : 0;
  const complete = answered.length === items.length;
  const weak = items.filter(i => scores[i.key] === 0);

  const setS = (k, v) => setScores({ ...scores, [k]: v });
  const reset = () => setScores({});
  const save = () => {
    const d = new Date();
    const entry = { id: Date.now(), date: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      stroke: rub.name, nota: Number(nota.toFixed(1)) };
    const nx = [entry, ...hist].slice(0, 30);
    setHist(nx); store.set("analysis:v1", nx); reset();
  };
  const del = (id) => { const nx = hist.filter(h => h.id !== id); setHist(nx); store.set("analysis:v1", nx); };
  const copy = () => { try { navigator.clipboard.writeText(PROMPT_TEXT); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); } };

  const notaColor = nota >= 8 ? "#2FA36B" : nota >= 6 ? "#E0A800" : "#E0533A";
  const notaLabel = !answered.length ? "avalie os itens abaixo" : nota >= 8 ? "execução sólida" : nota >= 6 ? "funcional, com ajustes" : "precisa de correção";
  const mine = hist.filter(h => h.stroke === rub.name).slice(0, 6).reverse();

  return (
    <>
      <Hero tone="blue" icon={<Camera size={13} />} eyebrow="Análise de Execução"
        title="Grave, congele 4 frames, pontue"
        sub="Protocolo de captura, rubrica item por item e histórico das suas notas. Os mesmos critérios que eu uso quando você me envia os prints." />

      <SecTitle n="1" icon={<Camera size={14} />}>Protocolo de captura</SecTitle>
      <div className="block">
        {CAPTURE.map((c, i) => (
          <div className="varrow" key={c.t}><div className="var-t">{i + 1}. {c.t}</div><div className="var-d">{bold(c.d)}</div></div>))}
      </div>

      <SecTitle n="2" icon={<Layers size={14} />}>Os 4 frames obrigatórios</SecTitle>
      <div className="frames">
        {FRAMES_GUIDE.map(fr => (
          <div className={"frcard" + (fr.n === "F3" ? " fr-key" : "")} key={fr.n}>
            <div className="fr-top"><span className="fr-n">{fr.n}</span><span className="fr-t">{fr.t}</span>
              {fr.n === "F3" && <span className="sc-core"><Zap size={9} /> o mais importante</span>}</div>
            <div className="fr-when"><Clock size={12} /> {fr.when}</div>
            <div className="fr-look"><Eye size={12} /> <span><strong>O que se avalia: </strong>{fr.look}</span></div>
          </div>))}
      </div>

      <SecTitle n="3" icon={<Target size={14} />}>Rubrica de pontuação</SecTitle>
      <div className="catbar">
        {RUBRICS.map(r => (
          <button key={r.id} className={"catpill" + (r.id === rid ? " active" : "")}
            onClick={() => { setRid(r.id); setScores({}); }}>{r.name}</button>))}
      </div>

      <div className="notacard">
        <div className="nc-left">
          <div className="nc-nota" style={{ color: notaColor }}>{answered.length ? nota.toFixed(1) : "—"}</div>
          <div className="nc-max">/ 10</div>
        </div>
        <div className="nc-right">
          <div className="nc-label" style={{ color: notaColor }}>{notaLabel}</div>
          <div className="nc-prog">{answered.length} de {items.length} itens avaliados</div>
          <div className="gb-track"><div className="gb-fill" style={{ width: (answered.length / items.length) * 100 + "%" }} /></div>
        </div>
      </div>

      {rub.frames.map((fr, fi) => (
        <div className="rubframe" key={fr.f}>
          <div className="rf-head"><span className="rf-n">{fr.f}</span> {fr.label}</div>
          {fr.items.map((it, ii) => {
            const k = rid + "-" + fi + "-" + ii;
            const v = scores[k];
            return (
              <div className={"rubrow" + (v === 0 ? " r0" : v === 1 ? " r1" : v === 2 ? " r2" : "")} key={k}>
                <div className="rr-c">{it.c}</div>
                <div className="rr-ref"><Info size={11} /> {it.ref}</div>
                {v === 0 && <div className="rr-err"><AlertTriangle size={11} /> {it.err}</div>}
                <div className="rr-btns">
                  <button className={"rb rb0" + (v === 0 ? " on" : "")} onClick={() => setS(k, 0)}>errado</button>
                  <button className={"rb rb1" + (v === 1 ? " on" : "")} onClick={() => setS(k, 1)}>parcial</button>
                  <button className={"rb rb2" + (v === 2 ? " on" : "")} onClick={() => setS(k, 2)}>correto</button>
                </div>
              </div>);
          })}
        </div>))}

      {weak.length > 0 && (
        <div className="diag">
          <div className="diag-row bad"><AlertTriangle size={15} /><div>
            <div className="dg-t">Prioridade de correção ({weak.length} {weak.length === 1 ? "item" : "itens"})</div>
            <div className="dg-d">Comece pelo primeiro: <strong>{weak[0].c}</strong> ({weak[0].f}). {weak[0].err} — corrija este antes de olhar os outros.</div></div></div>
        </div>)}

      <div className="fbtns" style={{ marginBottom: 16 }}>
        <button className="sbtn end" onClick={reset}><RotateCcw size={14} /> Limpar</button>
        <button className="sbtn ok" disabled={!complete} onClick={save}>
          <Check size={15} /> {complete ? "Salvar nota" : `Faltam ${items.length - answered.length}`}</button>
      </div>

      <SecTitle n="4" icon={<TrendingUp size={14} />}>Histórico de notas</SecTitle>
      {mine.length > 1 && (
        <div className="block">
          <div className="chart-head"><span className="ch-t">{rub.name}</span><span className="ch-max">últimas {mine.length}</span></div>
          <Spark data={mine.map(m => ({ l: m.date, v: m.nota }))} color="#1E5A8A" />
        </div>)}
      {hist.length === 0
        ? <div className="emptybox"><Info size={16} /><span>Pontue todos os itens de um golpe e toque em <strong>Salvar nota</strong>. Com duas avaliações do mesmo golpe, aparece a curva de evolução aqui.</span></div>
        : hist.map(h => (
          <div className="histrow" key={h.id}>
            <span className="hr-nota" style={{ background: h.nota >= 8 ? "#2FA36B" : h.nota >= 6 ? "#E0A800" : "#E0533A" }}>{h.nota.toFixed(1)}</span>
            <span className="hr-s">{h.stroke}</span>
            <span className="hr-d">{h.date}</span>
            <button className="mc-del" onClick={() => del(h.id)}><Trash2 size={14} /></button>
          </div>))}

      <SecTitle n="5" icon={<StickyNote size={14} />}>Enviar para análise externa</SecTitle>
      <div className="block">
        <p className="p-lead">Anexe os 4 prints numa conversa comigo e cole o texto abaixo. Ele já pede a nota pela mesma rubrica, o erro mais grave e o exercício de correção no robô.</p>
        <div className="promptbox">{PROMPT_TEXT}</div>
        <button className={"mastbtn" + (copied ? " on" : "")} onClick={copy}>
          <span className="mb-box">{copied && <Check size={13} strokeWidth={3} />}</span>
          {copied ? "Texto copiado" : "Copiar texto"}</button>
        <div className="warnbox" style={{ marginTop: 13 }}><AlertTriangle size={15} />
          <span>Envie <strong>imagens</strong>, não vídeo — arquivos de vídeo não podem ser analisados. Se puder, mande também um print da câmera frontal para o saque.</span></div>
      </div>
    </>);
}



export { AnalysisTab };
