import React, { useState, useEffect } from "react";
import {
  Check, ChevronDown, Play, Bot, GraduationCap, Trophy, Zap, Target, Info, RotateCcw, ChevronLeft, ChevronRight, Flame, Clock, Repeat, Timer, Pause, Plus, X, Gauge, Award, StickyNote, CalendarDays, Wind, AlertTriangle, Eye, EyeOff, CircleDot, Layers, TrendingUp, Users, Activity, Trash2, Camera, Minus, Maximize, Minimize, ChevronUp
} from "lucide-react";
import { Hero, SecTitle, Collapsible } from "../components/ui.jsx";
import { storage as store } from "../lib/db.js";
import { uid, roundRobin, genGroupMatches, matchResult, standings, KO_SIZES, seedOrder, genBracket, DEFAULT_TOURNEY, serverOf, setStarter, setDone, serveInfo, ehExemploAntigo, cabeNaChave, embaralhar } from "../data/tournament.js";

/* ============ ABA TORNEIO — UII ============ */
/* Fullscreen: no notebook o placar vira telão para a galera acompanhar.
   Falha em silêncio onde a API não existe (iOS) — o overlay já ocupa a tela toda. */
function pedirFullscreen() {
  const el = document.documentElement;
  const fn = el.requestFullscreen || el.webkitRequestFullscreen;
  if (fn) { try { Promise.resolve(fn.call(el)).catch(() => {}); } catch {} }
}
function sairFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) return;
  const fn = document.exitFullscreen || document.webkitExitFullscreen;
  if (fn) { try { Promise.resolve(fn.call(document)).catch(() => {}); } catch {} }
}

/* Placar ao vivo: cada jogador é um painel inteiro. Toque no painel = +1 ponto,
   para marcar sem olhar com o celular apoiado na mesa. A linha entre os dois
   painéis é a rede; a bola laranja marca quem saca. No notebook os painéis ficam
   lado a lado e as setas do teclado marcam ponto. */
function LiveScore({ match, players, bestOf, onSave, onClose }) {
  const [sets, setSets] = useState(() => match.sets.length ? match.sets.map(s => ({ ...s })) : [{ a: 0, b: 0 }]);
  const [cur, setCur] = useState(Math.max(0, match.sets.length ? match.sets.length - 1 : 0));
  const [starter, setStarterId] = useState(match.starter ?? 0);
  const nm = (id) => players.find(p => p.id === id)?.name || "—";
  const need = Math.ceil(bestOf / 2);

  let wa = 0, wb = 0;
  sets.forEach(s => { if (s.a > s.b) wa++; else if (s.b > s.a) wb++; });
  const decided = wa >= need || wb >= need;

  const s = sets[cur];
  const saque = serveInfo(s.a, s.b, setStarter(starter, cur));
  const server = saque.server;
  const thisSetDone = setDone(s);
  const deuce = saque.deuce;

  const bump = (side, d) => {
    const nx = sets.map(x => ({ ...x }));
    nx[cur][side] = Math.max(0, nx[cur][side] + d);
    setSets(nx);
  };
  const addSet = () => { setSets([...sets, { a: 0, b: 0 }]); setCur(sets.length); };
  const save = () => { sairFullscreen(); onSave({ ...match, sets: sets.filter(x => x.a > 0 || x.b > 0), done: decided, starter }); };
  const fechar = () => { sairFullscreen(); onClose(); };

  const [fs, setFs] = useState(false);
  useEffect(() => {
    const sync = () => setFs(!!(document.fullscreenElement || document.webkitFullscreenElement));
    sync();
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  // trava o scroll do app atrás do placar
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = anterior; };
  }, []);

  // teclado: no notebook marcar ponto com a mão no teclado é mais rápido que clicar
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      const esq = k === "ArrowLeft" || k === "a" || k === "A";
      const dir = k === "ArrowRight" || k === "l" || k === "L";
      if (!esq && !dir) return;
      e.preventDefault();
      bump(esq ? "a" : "b", e.shiftKey ? -1 : 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const panel = (side) => {
    const mine = side === "a" ? s.a : s.b;
    const theirs = side === "a" ? s.b : s.a;
    const setsWon = side === "a" ? wa : wb;
    const serving = server === (side === "a" ? 0 : 1);
    return (
      <div className={"pan" + (serving ? " pan-serve" : "") + (mine > theirs ? " pan-lead" : "")}>
        <button className="pan-hit" onClick={() => bump(side, 1)} aria-label={`Ponto para ${nm(match[side])}`}>
          <span className="pan-top">
            {/* o selo ocupa lugar mesmo escondido, senão os dois painéis desalinham */}
            <span className={"saca" + (serving ? "" : " off")}>
              <span className="saca-ball" />
              <span className="saca-txt">Saca</span>
              <span className="saca-pips" aria-hidden="true">
                {Array.from({ length: saque.de }).map((_, i) =>
                  <i key={i} className={"spip" + (i < saque.numero ? " on" : "")} />)}
              </span>
            </span>
            <span className="pan-name">{nm(match[side])}</span>
          </span>
          <span className="pan-row">
            <span className="pan-pts">{mine}</span>
            <span className="pan-sets" aria-label={`${setsWon} sets vencidos`}>
              {Array.from({ length: need }).map((_, i) => <i key={i} className={"pip" + (i < setsWon ? " on" : "")} />)}
            </span>
          </span>
        </button>
        <button className="pan-undo" onClick={() => bump(side, -1)} disabled={mine === 0} aria-label="Tirar um ponto">
          <Minus size={15} />
        </button>
      </div>);
  };

  return (
    <div className="stage">
      <div className="stage-bar">
        <span className="live-tag">{match.label || "Partida"}</span>
        <span className="live-meta">melhor de {bestOf}</span>
        <button className="stage-ic" onClick={() => (fs ? sairFullscreen() : pedirFullscreen())}
          aria-label={fs ? "Sair da tela cheia" : "Tela cheia"} title={fs ? "Sair da tela cheia" : "Tela cheia"}>
          {fs ? <Minimize size={17} /> : <Maximize size={17} />}
        </button>
        <button className="stage-ic" onClick={fechar} aria-label="Fechar placar"><X size={18} /></button>
      </div>

      <div className="board">
        {panel("a")}
        <div className="net"><span className="net-set">{cur + 1}º set</span></div>
        {panel("b")}
      </div>

      {(thisSetDone || decided) && (
        <div className={"stage-flash" + (decided ? " win" : "")}>
          {decided
            ? <><Trophy size={15} /> <strong>{wa > wb ? nm(match.a) : nm(match.b)}</strong> vence por {Math.max(wa, wb)}×{Math.min(wa, wb)}</>
            : <><Check size={15} /> Set para <strong>{s.a > s.b ? nm(match.a) : nm(match.b)}</strong> — abra o próximo em <Plus size={12} /></>}
        </div>)}

      <div className="stage-foot">
        <button className="bf-serve" onClick={() => setStarterId(starter ? 0 : 1)}
          title="Toque para inverter quem abriu o saque">
          <span className="bf-ball" /> Saca <strong>{nm(match[server === 0 ? "a" : "b"])}</strong>
          <em>{deuce ? "· deuce, troca a cada ponto"
            : saque.trocaNoProximo ? "· troca no próximo ponto"
              : `· saque ${saque.numero} de ${saque.de}`}</em>
        </button>

        <div className="setnav">
          <button disabled={cur === 0} onClick={() => setCur(cur - 1)} aria-label="Set anterior"><ChevronLeft size={18} /></button>
          <div className="setpills">
            {sets.map((x, i) => (
              <button key={i} className={"setpill" + (i === cur ? " on" : "")} onClick={() => setCur(i)}>{x.a}-{x.b}</button>))}
            {!decided && <button className="setpill add" onClick={addSet} aria-label="Novo set"><Plus size={13} /></button>}
          </div>
          <button disabled={cur >= sets.length - 1} onClick={() => setCur(cur + 1)} aria-label="Próximo set"><ChevronRight size={18} /></button>
        </div>

        <button className="stage-save" onClick={save}><Check size={16} /> Salvar placar</button>
        <p className="stage-hint">Toque no painel do jogador para marcar ponto. No teclado: <kbd>←</kbd> <kbd>→</kbd> marcam, com <kbd>Shift</kbd> corrigem.</p>
      </div>
    </div>);
}

/* Um confronto. Os dois jogadores ficam separados pela rede, como no placar
   ao vivo — mesma ideia, escala menor. Só o vencedor recebe cor. */
function MatchRow({ match, players, bestOf, onOpen, readOnly }) {
  const nm = (id) => players.find(p => p.id === id)?.name || "—";
  const r = matchResult(match, bestOf);
  const done = r.done;
  const bye = !!match.bye;
  const sets = (match.sets || []).map(s => `${s.a}-${s.b}`);
  const emAndamento = sets.length > 0 && !done;  // já tem sets, mas ninguém fechou
  const Tag = (readOnly || bye) ? "div" : "button";

  const lado = (side) => (
    <div className={"mside" + (done && r.winner === match[side] ? " win" : "") + (match[side] == null ? " vazio" : "")}>
      <span className="mside-name">{match[side] == null ? "vaga livre" : nm(match[side])}</span>
      {sets.length > 0 && <span className="mside-sc">{side === "a" ? r.wa : r.wb}</span>}
    </div>);

  return (
    <Tag className={"mrow" + (done ? " mrow-done" : "") + (emAndamento ? " mrow-vivo" : "") + (bye ? " mrow-bye" : "")}
      onClick={(readOnly || bye) ? undefined : () => onOpen(match)}>
      <div className="mrow-main">
        {lado("a")}
        <div className="mrow-net" />
        {lado("b")}
      </div>
      {/* rodapé sempre presente: sem ele, jogos com e sem sets teriam alturas diferentes */}
      <div className="mrow-foot">
        <div className="mrow-sets">
          {bye && <span className="ms-bye">passa direto</span>}
          {emAndamento && <span className="ms-vivo">em andamento</span>}
          {sets.map((s, i) => <span key={i}>{s}</span>)}
        </div>
        {!done && !readOnly && !bye && (
          <span className={"mrow-cta" + (emAndamento ? " vivo" : "")}>
            <Play size={12} /> {emAndamento ? "Continuar" : "Registrar"}</span>)}
      </div>
    </Tag>);
}

function TournamentTab() {
  const [t, setT] = useState(null);
  const [view, setView] = useState("tabela"); // tabela | jogos | chave
  const [live, setLive] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => { (async () => {
    const saved = await store.get("tourney:v1");
    if (saved && ehExemploAntigo(saved)) {          // descarta o campeonato de exemplo
      const limpo = { ...DEFAULT_TOURNEY };
      setT(limpo); store.set("tourney:v1", limpo);
    } else setT(saved || { ...DEFAULT_TOURNEY });
    setHistory((await store.get("tourney:history")) || []);
  })(); }, []);
  const save = (nt) => { setT(nt); store.set("tourney:v1", nt); };
  /* Apagar registra o id: como o histórico é mesclado por união entre aparelhos,
     sem esse registro o campeonato voltaria na próxima sincronização. */
  const removeHistory = async (id) => {
    const nh = history.filter(h => h.id !== id);
    setHistory(nh);
    const lixo = (await store.get("tourney:removidos")) || [];
    await store.set("tourney:removidos", [...lixo.filter(r => r.id !== id), { id, em: Date.now() }]);
    await store.set("tourney:history", nh);
  };

  if (!t) return <div className="loading">Carregando torneio…</div>;

  const nm = (id) => t.players.find(p => p.id === id)?.name || "—";
  const table = standings(t.players, t.groupMatches, t.bestOf, t.frozen);

  // ---- CONFIG ----
  const addPlayer = () => { const n = nameInput.trim(); if (!n) return; save({ ...t, players: [...t.players, { id: uid(), name: n }] }); setNameInput(""); };
  const rmPlayer = (id) => save({ ...t, players: t.players.filter(p => p.id !== id) });
  /* Reordenar define o chaveamento quando ele não é sorteado: a posição na
     lista é a posição de cabeça de chave. */
  const moverPlayer = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= t.players.length) return;
    const ps = t.players.slice();
    [ps[i], ps[j]] = [ps[j], ps[i]];
    save({ ...t, players: ps });
  };

  const comecar = () => {
    if (t.formato === "mata") {
      const ordem = t.chaveamento === "sorteio" ? embaralhar(t.players) : t.players;
      const bracket = genBracket(ordem, t.koBestOf || t.bestOf, t.koStart);
      bracket.forEach((m, i) => { m.label = KO_SIZES[t.koStart] + (m.bye ? " · passa direto" : " #" + (i + 1)); });
      save({ ...t, groupMatches: [], koMatches: bracket, frozen: null, phase: "ko", ordemChave: ordem.map(p => p.id) });
      setView("chave");
      return;
    }
    const gm = genGroupMatches(t.players, t.doubleRound);
    save({ ...t, groupMatches: gm, koMatches: [], frozen: null, phase: "grupo" });
    setView("jogos");
  };

  // ---- gerar mata-mata a partir da classificacao ----
  const groupsDone = t.groupMatches.length > 0 && t.groupMatches.every(m => matchResult(m, t.bestOf).done);
  const canKO = (t.frozen || groupsDone);
  const startKO = () => {
    const q = table.slice(0, t.koStart);
    const bracket = genBracket(q, t.koBestOf || t.bestOf);
    bracket.forEach((m, i) => m.label = KO_SIZES[t.koStart] + " #" + (i + 1));
    save({ ...t, koMatches: bracket, phase: "ko" });
    setView("chave");
  };

  // ---- salvar placar (grupo ou ko) e avancar chave ----
  const saveMatch = (m) => {
    if (m.phase === "grupo") {
      save({ ...t, groupMatches: t.groupMatches.map(x => x.id === m.id ? m : x) });
    } else {
      let ko = t.koMatches.map(x => x.id === m.id ? m : x);
      // gera proxima rodada se a atual terminou
      const bySize = {};
      ko.forEach(x => { (bySize[x.roundSize] = bySize[x.roundSize] || []).push(x); });
      const sizes = Object.keys(bySize).map(Number).sort((a, b) => b - a);
      sizes.forEach(sz => {
        if (sz === 2) return;
        const rd = bySize[sz];
        const allDone = rd.length === sz / 2 && rd.every(x => matchResult(x, t.koBestOf || t.bestOf).done);
        const nextSz = sz / 2;
        const hasNext = (bySize[nextSz] || []).length > 0;
        if (allDone && !hasNext) {
          const winners = rd.map(x => matchResult(x, t.koBestOf || t.bestOf).winner);
          const nextRound = [];
          for (let i = 0; i < winners.length; i += 2) {
            nextRound.push({ id: uid(), phase: "ko", roundSize: nextSz, a: winners[i], b: winners[i + 1], sets: [], done: false, label: KO_SIZES[nextSz] + (nextSz > 2 ? " #" + (i / 2 + 1) : "") });
          }
          ko = ko.concat(nextRound);
        }
      });
      save({ ...t, koMatches: ko });
    }
    setLive(null);
  };

  const champion = (() => {
    const fin = t.koMatches.find(m => m.roundSize === 2 && m.done);
    return fin ? matchResult(fin, t.koBestOf || t.bestOf).winner : null;
  })();

  const archiveTournament = () => {
    const entry = {
      id: uid(), name: t.name, finishedAt: Date.now(),
      players: t.players, bestOf: t.bestOf, koBestOf: t.koBestOf, doubleRound: t.doubleRound, koStart: t.koStart,
      table, groupMatches: t.groupMatches, koMatches: t.koMatches,
      championId: champion, championName: nm(champion),
    };
    const nh = [entry, ...history];
    setHistory(nh); store.set("tourney:history", nh);
    save({ ...DEFAULT_TOURNEY, players: t.players });
  };

  if (showHistory) return <TourneyHistory history={history} onBack={() => setShowHistory(false)} onRemove={removeHistory} />;

  // o pedido de fullscreen precisa sair de dentro do gesto do usuário
  const abrirPlacar = (m) => { pedirFullscreen(); setLive(m); };

  if (live) return (
    <LiveScore match={live} players={t.players} bestOf={live.phase === "ko" ? (t.koBestOf || t.bestOf) : t.bestOf}
      onSave={saveMatch} onClose={() => setLive(null)} />);

  return (
    <>
      <Hero tone="green" icon={<Trophy size={13} />} eyebrow={t.name}
        title={champion ? `🏆 Campeão: ${nm(champion)}` : t.phase === "config" ? "Configurar torneio" : t.phase === "ko" ? "Fase eliminatória" : "Fase de grupos"}
        sub={t.formato === "mata"
          ? `${t.players.length} jogadores · mata-mata desde ${KO_SIZES[t.koStart].toLowerCase()} · melhor de ${t.bestOf}`
          : `${t.players.length} jogadores · grupos ${t.doubleRound ? "ida e volta" : "só ida"} · melhor de ${t.bestOf}`} />

      {champion && (
        <div className="nextbox">
          <Trophy size={18} />
          <div><div className="nb-t">Torneio concluído</div>
            <div className="nb-d">Arquive para guardar a classificação final e o mata-mata no histórico, e comece um torneio novo com os mesmos jogadores.</div></div>
        </div>)}
      {champion && (
        <button className="bigbtn" style={{ background: "#2FA36B", marginTop: -6 }} onClick={archiveTournament}>
          <Check size={16} /> Arquivar e começar novo torneio</button>)}

      <button className="linkbtn" onClick={() => setShowHistory(true)}>
        <Clock size={13} /> Histórico de campeonatos{history.length > 0 ? ` (${history.length})` : ""}</button>

      {t.phase === "config" ? (
        <TourneyConfig t={t} save={save} nameInput={nameInput} setNameInput={setNameInput}
          addPlayer={addPlayer} rmPlayer={rmPlayer} moverPlayer={moverPlayer} comecar={comecar} />
      ) : (
        <>
          {/* sem fase de grupos não há classificação nem rodadas para mostrar */}
          {t.formato !== "mata" && (
            <div className="segtabs">
              <button className={"segtab" + (view === "tabela" ? " on" : "")} onClick={() => setView("tabela")}>Classificação</button>
              <button className={"segtab" + (view === "jogos" ? " on" : "")} onClick={() => setView("jogos")}>Jogos</button>
              <button className={"segtab" + (view === "chave" ? " on" : "")} onClick={() => setView("chave")}>Mata-mata</button>
            </div>)}

          {t.formato !== "mata" && view === "tabela" && <ClassTable table={table} />}
          {t.formato !== "mata" && view === "jogos" && <GroupGames t={t} onOpen={abrirPlacar} />}
          {(t.formato === "mata" || view === "chave") &&
            <Bracket t={t} table={table} canKO={canKO} startKO={startKO} onOpen={abrirPlacar} champion={champion} nm={nm} />}

          <button className="linkbtn" onClick={() => { if (confirm("Reiniciar o torneio? Isso apaga todos os resultados.")) save({ ...DEFAULT_TOURNEY, players: t.players }); }}>
            <RotateCcw size={13} /> Reconfigurar torneio</button>
        </>)}
    </>);
}

const FASES = [[2, "Final"], [4, "Semis"], [8, "Quartas"], [16, "Oitavas"]];

function TourneyConfig({ t, save, nameInput, setNameInput, addPlayer, rmPlayer, moverPlayer, comecar }) {
  const soMata = t.formato === "mata";
  const qtd = t.players.length;
  // no mata-mata direto a chave precisa comportar os jogadores sem virar só bye
  const fasesOk = FASES.filter(([n]) => (soMata ? cabeNaChave(qtd, n) : n <= Math.max(2, qtd)));
  const chaveServe = !soMata || fasesOk.some(([n]) => n === t.koStart);
  const byes = soMata && chaveServe ? t.koStart - qtd : 0;
  const podeComecar = qtd >= 2 && (!soMata || chaveServe);
  const ordenavel = soMata && t.chaveamento === "ordem";

  return (
    <>
      <SecTitle n="1" icon={<Users size={14} />}>Jogadores</SecTitle>
      <div className="block">
        <div className="addrow">
          <input value={nameInput} placeholder="Nome do jogador" onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addPlayer(); }} />
          <button className="addbtn" onClick={addPlayer}><Plus size={18} /></button>
        </div>
        {qtd === 0 && <p className="tm-cap" style={{ textAlign: "left" }}>Adicione ao menos 2 jogadores.</p>}
        <div className="plist">
          {t.players.map((p, i) => (
            <div className="pchip" key={p.id}>
              <span className="pc-n">{i + 1}</span><span className="pc-nome">{p.name}</span>
              {ordenavel && (
                <span className="pc-mover">
                  <button onClick={() => moverPlayer(i, -1)} disabled={i === 0} aria-label="Subir"><ChevronUp size={14} /></button>
                  <button onClick={() => moverPlayer(i, 1)} disabled={i === qtd - 1} aria-label="Descer"><ChevronDown size={14} /></button>
                </span>)}
              <button className="pc-x" onClick={() => rmPlayer(p.id)} aria-label="Remover"><X size={13} /></button>
            </div>))}
        </div>
        {ordenavel && qtd > 1 && (
          <p className="tm-cap" style={{ textAlign: "left", marginTop: 10 }}>
            A ordem acima é a ordem de cabeça de chave: o 1º enfrenta o último, o 2º o penúltimo, e assim por diante.</p>)}
      </div>

      <SecTitle n="2" icon={<Layers size={14} />}>Formato</SecTitle>
      <div className="block">
        <div className="segs">
          <button className={"seg" + (!soMata ? " seg-v" : "")} onClick={() => save({ ...t, formato: "grupos" })}>Grupos + mata-mata</button>
          <button className={"seg" + (soMata ? " seg-v" : "")} onClick={() => save({ ...t, formato: "mata" })}>Só mata-mata</button>
        </div>
        <p className="tm-cap" style={{ textAlign: "left", marginTop: 10 }}>
          {soMata
            ? "Elimina direto, sem fase de grupos. Quem perde está fora."
            : "Todos jogam entre si primeiro; os melhores avançam para o mata-mata."}</p>
      </div>

      {!soMata && (
        <>
          <SecTitle n="3" icon={<Repeat size={14} />}>Fase de grupos</SecTitle>
          <div className="block">
            <div className="optrow">
              <span className="opt-l">Formato dos confrontos</span>
              <div className="segs">
                <button className={"seg" + (!t.doubleRound ? " seg-v" : "")} onClick={() => save({ ...t, doubleRound: false })}>Só ida</button>
                <button className={"seg" + (t.doubleRound ? " seg-v" : "")} onClick={() => save({ ...t, doubleRound: true })}>Ida e volta</button>
              </div>
            </div>
          </div>
        </>)}

      <SecTitle n={soMata ? "3" : "4"} icon={<Trophy size={14} />}>{soMata ? "A chave" : "Fase eliminatória"}</SecTitle>
      <div className="block">
        <div className="optrow">
          <span className="opt-l">Começar em</span>
          <div className="segs wrap">
            {fasesOk.length === 0
              ? <p className="tm-cap" style={{ textAlign: "left", margin: 0 }}>Adicione mais jogadores para montar uma chave.</p>
              : fasesOk.map(([n, lbl]) =>
                <button key={n} className={"seg" + (t.koStart === n ? " seg-v" : "")} onClick={() => save({ ...t, koStart: n })}>{lbl}</button>)}
          </div>
        </div>

        {soMata && (
          <div className="optrow" style={{ marginTop: 14 }}>
            <span className="opt-l">Chaveamento</span>
            <div className="segs">
              <button className={"seg" + (t.chaveamento === "ordem" ? " seg-v" : "")} onClick={() => save({ ...t, chaveamento: "ordem" })}>Eu escolho</button>
              <button className={"seg" + (t.chaveamento === "sorteio" ? " seg-v" : "")} onClick={() => save({ ...t, chaveamento: "sorteio" })}>Sortear</button>
            </div>
          </div>)}

        <div className="optrow" style={{ marginTop: 14 }}>
          <span className="opt-l">Sets por partida</span>
          <div className="segs">
            {[3, 5, 7].map(b => <button key={b} className={"seg" + (t.bestOf === b ? " seg-v" : "")} onClick={() => save({ ...t, bestOf: b })}>Melhor de {b}</button>)}
          </div>
        </div>

        <p className="tm-cap" style={{ textAlign: "left", marginTop: 12 }}>
          {soMata
            ? (byes > 0
              ? `Com ${qtd} jogadores numa chave de ${t.koStart}, ${byes} ${byes === 1 ? "passa" : "passam"} direto para a rodada seguinte.`
              : `Chave cheia: os ${qtd} jogadores se enfrentam já na primeira rodada.`)
            : `Os ${t.koStart} primeiros da classificação avançam. O chaveamento é montado automaticamente (1º x último, e assim por diante).`}</p>
      </div>

      <button className="bigbtn" disabled={!podeComecar} onClick={comecar}>
        <Play size={17} /> {soMata
          ? (t.chaveamento === "sorteio" ? "Sortear a chave e começar" : "Montar a chave e começar")
          : "Gerar partidas e começar"}</button>
    </>);
}

function ClassTable({ table }) {
  return (
    <div className="ctable">
      <div className="ct-head"><span className="ct-pos">#</span><span className="ct-name">Jogador</span>
        <span>P</span><span>J</span><span>V</span><span>D</span><span>SP</span><span>SC</span></div>
      {table.map((r, i) => (
        <div className={"ct-row" + (i < 4 ? " ct-q" : "")} key={r.id}>
          <span className="ct-pos">{i + 1}</span>
          <span className="ct-name">{r.name}</span>
          <span className="ct-p">{r.P}</span><span>{r.J}</span><span>{r.V}</span><span>{r.D}</span><span>{r.SP}</span><span>{r.SC}</span>
        </div>))}
      <div className="ct-legend">P pontos · J jogos · V vitórias · D derrotas · SP sets pró · SC sets contra · <strong>verde = zona de classificação</strong></div>
    </div>);
}

function GroupGames({ t, onOpen }) {
  if (t.groupMatches.length === 0) return <div className="emptybox"><Info size={16} /><span>Ainda não há partidas de grupo. Volte à configuração e gere as partidas.</span></div>;
  const rounds = {};
  t.groupMatches.forEach(m => { (rounds[m.round] = rounds[m.round] || []).push(m); });
  return (
    <>
      {Object.keys(rounds).map(Number).sort((a, b) => a - b).map(rn => (
        <div key={rn}>
          <div className="round-lbl">Rodada {rn}</div>
          {rounds[rn].map(m => <MatchRow key={m.id} match={m} players={t.players} bestOf={t.bestOf} onOpen={onOpen} />)}
        </div>))}
    </>);
}

function Bracket({ t, table, canKO, startKO, onOpen, champion, nm }) {
  if (t.koMatches.length === 0) return (
    <div className="block" style={{ textAlign: "center" }}>
      <p className="p-lead" style={{ textAlign: "center" }}>{canKO
        ? `A fase de grupos terminou. Gere o mata-mata com os ${t.koStart} primeiros.`
        : "Termine todas as partidas da fase de grupos para liberar o mata-mata."}</p>
      <button className="bigbtn" disabled={!canKO} onClick={startKO}><Layers size={16} /> Gerar mata-mata ({KO_SIZES[t.koStart]})</button>
    </div>);
  const bySize = {};
  t.koMatches.forEach(m => { (bySize[m.roundSize] = bySize[m.roundSize] || []).push(m); });
  const sizes = Object.keys(bySize).map(Number).sort((a, b) => b - a);
  return (
    <>
      {champion && <div className="champbox"><Trophy size={22} /><div><div className="cb-l">Campeão</div><div className="cb-n">{nm(champion)}</div></div></div>}
      {sizes.map(sz => (
        <div key={sz}>
          <div className="round-lbl">{KO_SIZES[sz]}</div>
          {bySize[sz].map(m => <MatchRow key={m.id} match={m} players={t.players} bestOf={t.koBestOf || t.bestOf} onOpen={onOpen} />)}
        </div>))}
    </>);
}


function HistoryCard({ h, onRemove }) {
  const nm = (id) => h.players.find(p => p.id === id)?.name || "—";
  const date = new Date(h.finishedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const koDone = (h.koMatches || []).filter(m => matchResult(m, h.koBestOf || h.bestOf).done);
  return (
    <Collapsible icon={<Trophy size={15} />} title={h.championName ? `Campeão: ${h.championName}` : h.name}
      sub={`${date} · ${h.players.length} jogadores`}>
      <p className="p-lead">{h.name} · melhor de {h.bestOf} · grupos {h.doubleRound ? "ida e volta" : "só ida"}</p>
      <div className="mini-title">Classificação final</div>
      <ClassTable table={h.table} />
      {koDone.length > 0 && <>
        <div className="round-lbl">Mata-mata</div>
        {koDone.map(m => <MatchRow key={m.id} match={m} players={h.players} bestOf={h.koBestOf || h.bestOf} readOnly />)}
      </>}
      <button className="linkbtn" style={{ color: "#D14A32" }}
        onClick={() => { if (confirm("Remover este campeonato do histórico?")) onRemove(h.id); }}>
        <Trash2 size={13} /> Remover do histórico</button>
    </Collapsible>);
}

function TourneyHistory({ history, onBack, onRemove }) {
  return (
    <>
      <Hero tone="green" icon={<Clock size={13} />} eyebrow="Torneio" title="Histórico de campeonatos"
        sub={history.length > 0 ? `${history.length} campeonato${history.length === 1 ? "" : "s"} arquivado${history.length === 1 ? "" : "s"}` : "Nenhum campeonato arquivado ainda"} />
      <button className="linkbtn" onClick={onBack}><ChevronLeft size={14} /> Voltar ao torneio atual</button>
      {history.length === 0 && <div className="emptybox"><Info size={16} /><span>Quando um campeonato terminar, arquive-o para vê-lo aqui depois.</span></div>}
      {history.map(h => <HistoryCard key={h.id} h={h} onRemove={onRemove} />)}
    </>);
}

export { TournamentTab };
