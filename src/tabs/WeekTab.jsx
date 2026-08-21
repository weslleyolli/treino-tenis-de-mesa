import React, { useState, useEffect } from "react";
import {
  Check, ChevronDown, Play, Bot, GraduationCap, Trophy, Zap, Target, Info, RotateCcw, ChevronLeft, ChevronRight, Flame, Clock, Repeat, Timer, Pause, Plus, X, Gauge, Award, StickyNote, CalendarDays, Wind, AlertTriangle, Eye, EyeOff, CircleDot, Layers, TrendingUp, Users, Activity, Trash2, Camera, Minus
} from "lucide-react";
import { bold, RobotPanel, Session, Counter, tagClass, Collapsible, Vids, GuiaPadrao } from "../components/ui.jsx";
import { parseMin, parseRest } from "../lib/helpers.jsx";
import { sessionsFor, isDayDone, KIND_META, robotFor, DAYS, WEEK_INFO } from "../data/schedule.jsx";

/* ============ ABA SEMANA ============ */
function SessionCard({ session, week, dayId, done, toggle, notes, setNote, records, setRecord, onTimer }) {
  const meta = KIND_META[session.kind];
  const I = meta.icon;
  // slot separa dois treinos do mesmo tipo no mesmo dia (dois padroes de robo)
  const skey = `w${week}-${dayId}-${session.slot || session.kind}`;
  const isDone = !!done[skey];
  // cada padrao carrega a propria regulagem; robotFor e o padrao antigo por dia
  const cfg = session.robotCfg || (session.robot ? robotFor(dayId, week) : null);
  return (
    <div className={"sess" + (isDone ? " sess-done" : "")} style={{ "--c": meta.color }}>
      <div className="sess-head">
        <span className="sess-ico"><I size={17} /></span>
        <div className="sess-mid">
          <div className="sess-title">{session.title}</div>
          <div className="sess-sub">{session.sub}</div>
        </div>
        <span className="sess-time"><Clock size={11} /> {session.total}</span>
      </div>

      {cfg && <RobotPanel cfg={cfg} />}
      <GuiaPadrao guia={session.guia} />
      {session.kind === "saque" && (
        <div className="serveonly"><Wind size={15} /><span>Passo a passo de cada saque, zonas e disfarce estão na <strong>aba Saque</strong> — e o registro de acertos também.</span></div>)}

      <div className="sess-timeline">
        {session.blocks.map((b, i) => {
          const sec = parseMin(b.time), rest = parseRest(b.rest);
          return (
            <div className="tl-block" key={i}>
              <div className="tl-rail"><span className="tl-num" style={{ background: meta.color }}>{i + 1}</span></div>
              <div className="tl-card">
                <div className="tl-top"><span className="tl-label">{b.label}</span><span className="tl-time"><Clock size={11} /> {b.time}</span></div>
                {b.tag && <span className={"tl-tag " + tagClass(b.tag)}>{b.tag}</span>}
                <div className="tl-target"><Repeat size={13} /><span>{b.target}</span></div>
                <div className="tl-actions">
                  {sec && <button className="mini-btn" style={{ background: meta.color }} onClick={() => onTimer(b.label, sec)}><Play size={12} /> {b.time}</button>}
                  {rest && <button className="mini-btn ghost" onClick={() => onTimer("Descanso", rest)}><Timer size={12} /> {b.rest}</button>}
                </div>
                {b.cue && <p className="tl-cue" style={{ borderLeftColor: meta.color }}>{b.cue}</p>}
              </div>
            </div>);
        })}
      </div>

      {session.counter && <Counter label={session.counter} record={records[skey]} onRecord={(v) => setRecord(skey, v)} />}

      <div className="sess-notes">
        <label className="sn-label"><StickyNote size={12} /> Anotações · {session.title}</label>
        <textarea className="notes-ta" value={notes[skey] || ""} placeholder={
          session.kind === "saque" ? "Acertos por série, qual efeito saiu melhor, ajustes de lançamento…"
          : session.kind === "robo" ? "Recordes, sensações, o que ajustar no gesto…"
          : session.kind === "aula" ? "O que o professor corrigiu, o que treinar em casa…"
          : session.kind === "jogo" ? "Qual saque rendeu ponto, onde errei mais…"
          : "Como o corpo respondeu, cargas, dores…"}
          onChange={(e) => setNote(skey, e.target.value)} />
      </div>

      <button className={"sess-done-btn" + (isDone ? " on" : "")} onClick={() => toggle(skey)}>
        <span className="cb-box">{isDone && <Check size={15} strokeWidth={3} />}</span>
        {isDone ? `${session.title} concluído` : `Concluir ${session.title.toLowerCase()}`}
      </button>
    </div>);
}

function WeekTab(p) {
  const { week, setWeek, activeIdx, setActiveIdx, done, toggleSession, records, setRecord, notes, setNote, onTimer, resetWeek, monthDone } = p;
  const day = DAYS[activeIdx];
  const sessions = sessionsFor(day.id, week);
  const weekDone = DAYS.filter(d => isDayDone(done, week, d.id)).length;
  const pct = Math.round((weekDone / 7) * 100);
  const info = WEEK_INFO[week - 1];
  const intCls = day.intensity === "Alta" ? "int-high" : day.intensity === "Média" ? "int-mid" : day.intensity === "Jogo" ? "int-match" : "int-low";
  const doneN = sessions.filter(s => done[`w${week}-${day.id}-${s.slot || s.kind}`]).length;

  return (
    <>
      <div className="subhdr">
        <div className="week-row">
          <button className="wk-arrow" disabled={week === 1} onClick={() => setWeek(week - 1)}><ChevronLeft size={18} /></button>
          <div className="wk-pills">{WEEK_INFO.map(w => (
            <button key={w.n} className={"wk-pill" + (w.n === week ? " active" : "")} onClick={() => setWeek(w.n)}>
              <span className="wk-lbl">Sem</span><span className="wk-num">{w.n}</span></button>))}</div>
          <button className="wk-arrow" disabled={week === 4} onClick={() => setWeek(week + 1)}><ChevronRight size={18} /></button>
        </div>
        <div className="wk-focus"><div className="wk-focus-title">{info.title}</div><div className="wk-focus-note">{info.note}</div></div>
        <div className="prog">
          <div className="prog-bar"><div className="prog-fill" style={{ width: pct + "%" }} /></div>
          <div className="prog-lbl">{weekDone}/7 · mês {monthDone}/28</div>
          <button className="reset" onClick={resetWeek} title="Zerar semana"><RotateCcw size={15} /></button>
        </div>
      </div>

      <nav className="day-strip">
        {DAYS.map((d, i) => { const dn = isDayDone(done, week, d.id); const I = d.icon;
          return (
            <button key={d.id} className={"day-tab" + (i === activeIdx ? " active" : "")} onClick={() => setActiveIdx(i)} style={i === activeIdx ? { "--tint": d.tint } : {}}>
              <span className="day-icon"><I size={16} /></span><span className="day-short">{d.short}</span>
              <span className={"day-dot" + (dn ? " on" : "")}>{dn && <Check size={10} strokeWidth={3} />}</span>
            </button>); })}
      </nav>

      <div className="day-head" style={{ "--tint": day.tint }}>
        <div className="badges">
          {day.star && <span className="star-badge"><Zap size={11} /> Golpe-assinatura</span>}
          {day.lesson && <span className="lesson-badge"><GraduationCap size={11} /> Dia de aula</span>}
          {day.matchDay && <span className="match-badge"><Trophy size={11} /> Dia de jogo</span>}
          {day.serveDay && <span className="serve-badge"><Wind size={11} /> Saque</span>}
        </div>
        <h2>{day.name}</h2>
        <div className="day-meta">
          <span className="day-focus">{day.focus}</span>
          <span className={"int-badge " + intCls}><Flame size={11} /> {day.intensity}</span>
          <span className="day-dur"><Clock size={12} /> {day.total}</span>
        </div>
      </div>

      <div className="sessbar">
        <span className="sb-lbl">{sessions.length} treinos separados hoje · {doneN} concluído{doneN === 1 ? "" : "s"}</span>
        <div className="sb-chips">{sessions.map(s => { const m = KIND_META[s.kind]; const on = !!done[`w${week}-${day.id}-${s.slot || s.kind}`];
          return <span key={s.slot || s.kind} className={"sb-chip" + (on ? " on" : "")} style={{ "--c": m.color }}>{m.label}</span>; })}</div>
      </div>

      {day.matchNotes && <div className="matchbox"><div className="section-eyebrow" style={{ color: "#8A6100" }}><Trophy size={13} /> Protocolo de dia de jogo</div>
        <ul className="clean-list gold">{day.matchNotes.map((m, i) => <li key={i}>{m}</li>)}</ul></div>}

      {sessions.map(s => (
        <SessionCard key={s.slot || s.kind} session={s} week={week} dayId={day.id} done={done} toggle={toggleSession}
          notes={notes} setNote={setNote} records={records} setRecord={setRecord} onTimer={onTimer} />))}

      {day.checklist && <div className="block"><div className="section-eyebrow"><Check size={13} /> Checklist</div>
        <ul className="check-list">{day.checklist.map((c, i) => <li key={i}>{c}</li>)}</ul></div>}
      {day.semAula && <div className="matchbox"><div className="section-eyebrow" style={{ color: "#7A5A12" }}><GraduationCap size={13} /> Quando a aula voltar</div>
        <ul className="clean-list gold">{day.semAula.map((m, i) => <li key={i}>{bold(m)}</li>)}</ul></div>}
      {day.bio && <Collapsible title="Biomecânica passo a passo" icon={<Target size={15} />}>
        <ol className="bio-steps">{day.bio.steps.map((x, i) => <li key={i}>{bold(x)}</li>)}</ol>
        {day.bio.note && <div className="bio-note"><Info size={14} /> {day.bio.note}</div>}</Collapsible>}
      <Vids videos={day.videos} />
    </>);
}


export { WeekTab, SessionCard };
