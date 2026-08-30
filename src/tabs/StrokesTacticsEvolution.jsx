import React, { useState, useEffect } from "react";
import {
  Check, ChevronDown, Play, Bot, GraduationCap, Trophy, Zap, Target, Info, RotateCcw, ChevronLeft, ChevronRight, Flame, Clock, Repeat, Timer, Pause, Plus, X, Gauge, Award, StickyNote, CalendarDays, Wind, AlertTriangle, Eye, EyeOff, CircleDot, Layers, TrendingUp, Users, Activity, Trash2, Camera, Minus, Search
} from "lucide-react";
import { bold, Collapsible, Vids, SecTitle, Hero, Spark, GoalBar, Bars, Exercicio, BlocoAcervo } from "../components/ui.jsx";
import { storage as store } from "../lib/db.js";
import { STROKES, STROKE_CATS } from "../data/strokes.js";
import { COMBOS, OPPONENTS, GAME_VARIATIONS, LOSING_FIXES, GOLDEN_RULES } from "../data/tactics.js";
import { COMO_FILMAR, promptDaTecnica } from "../data/analiseVideo.js";
import { DAYS, isDayDone, sessionsFor, WEEK_INFO } from "../data/schedule.jsx";

/* ============ ABA GOLPES ============ */
const CAT_COLOR = { Base: "#1E5A8A", Deslocamento: "#0E8B8B", Controle: "#2FA36B", Ataque: "#F26B21",
  Defesa: "#7C5CFC", "Recepção": "#D6A324", Especiais: "#C2477A" };


/* Manda o video para uma IA em vez de preencher rubrica na mao. O prompt sai
   pronto com os passos e os erros DESTA tecnica dentro — e com os exercicios
   dela, para a resposta vir amarrada no que ele ja tem para treinar. */
function AnaliseVideo({ t }) {
  const [copiado, setCopiado] = useState(false);
  const texto = promptDaTecnica(t);
  const copiar = async () => {
    try { await navigator.clipboard.writeText(texto); setCopiado(true); setTimeout(() => setCopiado(false), 2500); }
    catch { setCopiado(false); }
  };
  return (
    <Collapsible title="Analisar meu vídeo com IA" icon={<Camera size={13} />}
      sub="como filmar e o prompt pronto para esta técnica">
      <div className="mini-title">Como filmar</div>
      <ul className="clean-list">{COMO_FILMAR.map(c => <li key={c.t}><strong>{c.t}. </strong>{bold(c.d)}</li>)}</ul>
      <div className="mini-title">Prompt pronto</div>
      <p className="p-lead">Mande o vídeo e cole este texto. Ele já leva os passos e os erros comuns desta técnica, e pede o ajuste amarrado nos exercícios que você tem aqui.</p>
      <pre className="promptbox">{texto}</pre>
      <button className={"mastbtn" + (copiado ? " on" : "")} onClick={copiar}>
        <span className="mb-box">{copiado && <Check size={13} strokeWidth={3} />}</span>
        {copiado ? "Prompt copiado" : "Copiar prompt"}</button>
    </Collapsible>);
}

function StrokesTab() {
  const [cat, setCat] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [openId, setOpenId] = useState(STROKES[0].id);
  const [mast, setMast] = useState({});
  useEffect(() => { (async () => { const m = await store.get("mastery:v1"); if (m) setMast(m); })(); }, []);
  const toggle = (id) => { const nx = { ...mast, [id]: !mast[id] }; setMast(nx); store.set("mastery:v1", nx); };
  const q = busca.trim().toLowerCase();
  const list = STROKES.filter(s =>
    (cat === "Todos" || s.cat === cat) &&
    (!q || s.name.toLowerCase().includes(q) || (s.aka || "").toLowerCase().includes(q)));
  const doneN = STROKES.filter(s => mast[s.id]).length;

  return (
    <>
      <Hero tone="blue" icon={<Target size={13} />} eyebrow="Acervo Técnico"
        title={`${doneN} de ${STROKES.length} técnicas dominadas`}
        sub="Biomecânica, erros comuns, exercícios e vídeo de cada técnica do jogo. Marque o que já saiu automático."
        pct={Math.round((doneN / STROKES.length) * 100)} />

      <div className="catbar">
        {["Todos"].concat(STROKE_CATS).map(c => (
          <button key={c} className={"catpill" + (c === cat ? " active" : "")}
            style={c !== "Todos" ? { "--c": CAT_COLOR[c] } : {}} onClick={() => setCat(c)}>
            {c !== "Todos" && <span className="cd" />}{c}</button>))}
      </div>

      <div className="buscabar">
        <Search size={15} />
        <input value={busca} onChange={e => setBusca(e.target.value)}
          placeholder="Buscar técnica — em português ou inglês" />
        {busca && <button onClick={() => setBusca("")}><X size={15} /></button>}
      </div>
      {list.length === 0 && <p className="vazio">Nenhuma técnica com esse nome.</p>}

      {list.map((s, i) => {
        const open = openId === s.id;
        return (
          <div className={"scard" + (open ? " open" : "")} key={s.id} style={{ "--c": CAT_COLOR[s.cat] }}>
            <button className="scard-head" onClick={() => setOpenId(open ? null : s.id)}>
              <span className="sc-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="sc-mid">
                <span className="sc-name">{s.name}</span>
                {s.aka && <span className="sc-aka">{s.aka}</span>}
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
                {s.robot && <div className="len-box"><Bot size={14} /><span><strong>No robô: </strong>{s.robot}</span></div>}
                <div className="mini-title">Exercícios · {s.exercicios.length}</div>
                {s.exercicios.map(e => <Exercicio key={e.n} e={e} />)}
                <Collapsible title="Progressão" icon={<TrendingUp size={13} />}
                  sub="Onde você está e o que falta para o próximo nível">
                  <ol className="progniv">
                    {s.progressao.map((p, k) => (
                      <li key={k}>
                        <span className="progniv-n">{p.nivel}</span>
                        <span className="progniv-f">{p.foco}</span>
                        <span className="progniv-c"><Check size={11} strokeWidth={3} /> {p.criterio}</span>
                      </li>))}
                  </ol>
                </Collapsible>
                <AnaliseVideo t={s} />
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
              <div className="mini-title">Como treinar · {c.exercicios.length} exercícios</div>
              {c.exercicios.map(e => <Exercicio key={e.n} e={e} />)}
              <BlocoAcervo ids={c.tecnicas} titulo="Golpes deste combo"
                sub="as técnicas que executam a sequência" />
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
              <BlocoAcervo ids={o.tecnicas} titulo="O que treinar para este plano"
                sub="as técnicas que o plano acima exige" />
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
/* As chaves de recorde vem do proprio cronograma. Antes elas eram escritas a mao
   ("w1-seg-robo") e pararam de existir quando os padroes ganharam slot proprio —
   os graficos ficaram vazios sem ninguem perceber. Derivando de sessionsFor(),
   remanejar o cronograma nao quebra mais a Evolucao. */
/* Varre o ciclo INTEIRO, não só a primeira semana: com blocos, cada semana traz
   técnicas diferentes, e olhar só a semana 1 esconderia dois terços do que se
   mede. Guarda em que semanas e dias cada coisa aparece, porque o recorde da
   semana é o melhor entre os dias em que ela rodou. */
function padroesComContador() {
  const m = new Map();
  for (const { n: w } of WEEK_INFO) {
    for (const d of DAYS) {
      for (const sess of sessionsFor(d.id, w)) {
        if (!sess.counter || !sess.slot) continue;
        if (!m.has(sess.slot)) m.set(sess.slot, { slot: sess.slot, titulo: sess.title, contador: sess.counter, dias: new Set(), semanas: new Set() });
        const e = m.get(sess.slot);
        e.dias.add(d.id);
        e.semanas.add(w);
      }
    }
  }
  return [...m.values()].map(e => ({ ...e, dias: [...e.dias], semanas: [...e.semanas] }));
}

const CORES_PADRAO = ["#F26B21", "#1E5A8A", "#7C5CFC", "#2FA36B", "#D6A324", "#0E8B8B", "#C2477A", "#D14A32"];
const minutosDoDia = (d) => { const m = String(d.total).match(/(\d+)/); return m ? Number(m[1]) : 0; };

function EvolutionTab({ done, records }) {
  const [best, setBest] = useState(null);
  const [mast, setMast] = useState({});
  useEffect(() => { (async () => {
    const b = await store.get("servebest:v1"); if (b) setBest(b);
    const m = await store.get("mastery:v1"); if (m) setMast(m);
  })(); }, []);

  const weeks = WEEK_INFO.map(w => w.n);
  const meta = weeks.length * DAYS.length;
  const total = weeks.reduce((n, w) => n + DAYS.filter(d => isDayDone(done, w, d.id)).length, 0);
  const pct = Math.round((total / meta) * 100);
  const byWeek = weeks.map(w => DAYS.filter(d => isDayDone(done, w, d.id)).length);
  const minutes = weeks.reduce((n, w) => n + DAYS.reduce((m, d) => m + (isDayDone(done, w, d.id) ? minutosDoDia(d) : 0), 0), 0);

  const medidos = padroesComContador();
  /* A série cobre só as semanas em que aquilo roda. Um padrão volta nas quatro
     semanas do bloco e vira curva; uma técnica aparece numa semana só e vira
     marca única — desenhar 11 zeros e um pico seria mentira gráfica. */
  const serieDe = (p) => p.semanas.map(w => ({
    l: "S" + w,
    v: Math.max(0, ...p.dias.map(d => records[`w${w}-${d}-${p.slot}`] || 0)),
  }));
  const mx = (a) => Math.max(0, ...a.map(x => x.v));

  const todos = medidos.map((p, i) => ({ ...p, dados: serieDe(p), cor: CORES_PADRAO[i % CORES_PADRAO.length] }));
  const curvas = todos.filter(c => c.semanas.length > 1);
  const comDado = curvas.filter(c => mx(c.dados) > 0);
  const semDado = todos.filter(c => mx(c.dados) === 0);
  const marcas = todos.filter(c => c.semanas.length === 1 && mx(c.dados) > 0);
  const mastN = STROKES.filter(s => mast[s.id]).length;

  /* Da para ter recorde sem nenhum DIA inteiro concluido — isDayDone exige todas
     as sessoes do dia. So mande marcar treino quando nao houver nada dos dois. */
  const nextStep = (total === 0 && comDado.length === 0 && marcas.length === 0)
    ? "Marque um treino como concluído na aba Hoje para começar a preencher os gráficos."
    : semDado.length
      ? `Você ainda não registrou nada em ${semDado[0].titulo}. Use o contador +1 durante o treino e o número aparece aqui.`
      : "Tudo com registro. Onde a curva está plana há duas semanas, é ali que o treino parou de render — suba a frequência do robô em 1.";

  return (
    <>
      <Hero tone="green" icon={<TrendingUp size={13} />} eyebrow="Evolução"
        title={`${total} de ${meta} treinos · ${pct}%`}
        sub={total === 0 ? "Marque um treino como concluído na aba Hoje para começar a preencher os gráficos."
          : `Cerca de ${Math.round(minutes / 60)}h de treino acumuladas neste mês.`}
        pct={pct} />

      <div className="statgrid">
        <div className="stat"><span className="stat-v">{total}</span><span className="stat-l">treinos feitos</span></div>
        <div className="stat"><span className="stat-v">{comDado.length + marcas.length}/{todos.length}</span><span className="stat-l">itens medidos</span></div>
        <div className="stat"><span className="stat-v">{mastN}</span><span className="stat-l">técnicas dominadas</span></div>
        <div className="stat"><span className="stat-v">{best ? best.pct + "%" : "—"}</span><span className="stat-l">saque no alvo</span></div>
      </div>

      <SecTitle n="1" icon={<CalendarDays size={14} />}>Mapa do ciclo</SecTitle>
      <div className="block">
        <div className="heat">
          <div className="heat-row heat-head"><span className="heat-w" /> {DAYS.map(d => <span className="heat-c hc-lbl" key={d.id}>{d.short[0]}</span>)}</div>
          {WEEK_INFO.map((wi, i) => (
            <React.Fragment key={wi.n}>
              {/* Cabeçalho a cada troca de bloco: 12 linhas soltas não dizem
                  onde uma fase termina e a outra começa. */}
              {(i === 0 || wi.bloco !== WEEK_INFO[i - 1].bloco) && (
                <div className="heat-bloco" style={{ "--c": wi.cor }}>Bloco {wi.bloco} · {wi.blocoNome}</div>)}
              <div className="heat-row">
                <span className="heat-w">S{wi.n}</span>
                {DAYS.map(d => { const on = isDayDone(done, wi.n, d.id);
                  return <span className={"heat-c" + (on ? " on" : "")} key={d.id} title={d.name}>{on && <Check size={10} strokeWidth={4} />}</span>; })}
                <span className="heat-n">{byWeek[wi.n - 1]}/7</span>
              </div>
            </React.Fragment>))}
        </div>
        <p className="tm-cap" style={{ textAlign: "left" }}>Cada quadrado é um treino. Doze linhas cheias = ciclo completo.</p>
      </div>

      <SecTitle n="2" icon={<Award size={14} />}>Curva dos recordes</SecTitle>
      {comDado.length === 0 && marcas.length === 0
        ? <div className="block"><div className="emptymini"><Info size={14} />
            <span>Nenhum recorde ainda. Use o contador <strong>+1</strong> durante o treino — os padrões viram curva ao longo do bloco, e as técnicas viram marca.</span></div></div>
        : comDado.map(c => (
          <div className="block" key={c.slot}>
            <div className="chart-head">
              <span className="ch-t">{c.titulo}</span>
              <span className="ch-max">máx {mx(c.dados)}</span>
            </div>
            <Spark data={c.dados} color={c.cor} />
          </div>))}

      {marcas.length > 0 && (
        <div className="block">
          <div className="mini-title">Marcas das técnicas</div>
          <p className="tm-cap" style={{ textAlign: "left", marginTop: 0 }}>
            Cada técnica roda numa semana do ciclo, então aqui vale o número, não a curva.</p>
          <ul className="semreg">
            {marcas.map(c => (
              <li key={c.slot}>
                <span className="sr-slot">S{c.semanas[0]}</span>{c.titulo}
                <strong style={{ marginLeft: "auto", color: "var(--ink)" }}>{mx(c.dados)}</strong>
              </li>))}
          </ul>
        </div>)}

      {semDado.length > 0 && (comDado.length > 0 || marcas.length > 0) && (
        <div className="block">
          <div className="mini-title">Ainda sem registro</div>
          <ul className="semreg">
            {semDado.slice(0, 8).map(c => <li key={c.slot}><span className="sr-slot">S{c.semanas[0]}</span>{c.titulo}</li>)}
          </ul>
        </div>)}

      <SecTitle n="3" icon={<Target size={14} />}>Metas do ciclo</SecTitle>
      <div className="block">
        <GoalBar label="Treinos do ciclo" cur={total} target={meta} />
        <GoalBar label="Itens medidos" cur={comDado.length + marcas.length} target={todos.length} />
        <GoalBar label="Saque no alvo" cur={best ? best.pct : 0} target={70} unit="%" />
        <GoalBar label="Técnicas dominadas" cur={mastN} target={STROKES.length} />
      </div>

      <div className="nextbox"><TrendingUp size={16} /><div><div className="nb-t">Próximo passo</div><div className="nb-d">{nextStep}</div></div></div>
    </>);
}


export { StrokesTab, TacticsTab, EvolutionTab };
