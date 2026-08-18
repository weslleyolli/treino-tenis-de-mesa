import React, { useState, useEffect } from "react";
import {
  Check, ChevronDown, Play, Bot, GraduationCap, Trophy, Zap, Target, Info, RotateCcw, ChevronLeft, ChevronRight, Flame, Clock, Repeat, Timer, Pause, Plus, X, Gauge, Award, StickyNote, CalendarDays, Wind, AlertTriangle, Eye, EyeOff, CircleDot, Layers, TrendingUp, Users, Activity, Trash2, Camera, Minus, Maximize, Minimize, ChevronUp
} from "lucide-react";
import { Hero, SecTitle, Collapsible } from "../components/ui.jsx";
import { storage as store } from "../lib/db.js";
import { uid, roundRobin, genGroupMatches, matchResult, standings, KO_SIZES, seedOrder, genBracket, DEFAULT_TOURNEY, serverOf, setStarter, setDone, serveInfo, ehExemploAntigo, cabeNaChave, embaralhar, proximaPotencia, agruparTies, tieResult, garantirDesempates, formatoDe, temGrupos, temMata, ordemInicial, ordemValida, confrontosDe } from "../data/tournament.js";

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
function MatchRow({ match, players, bestOf, onOpen, readOnly, etiqueta }) {
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
      {etiqueta && <div className="mrow-etq">{etiqueta}</div>}
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
    if (formatoDe(t) === "mata") {
      // a ordem montada no editor manda; ids nulos viram as vagas livres
      const ids = ordemValida(t.ordemChave, t.players, t.koStart)
        ? t.ordemChave : ordemInicial(t.players, t.koStart);
      const ordem = ids.map(id => (id == null ? undefined : { id }));
      const bracket = genBracket(ordem, t.koBestOf || t.bestOf, t.koStart, t.doubleRound);
      bracket.forEach((m, i) => { m.label = KO_SIZES[t.koStart] + (m.bye ? " · passa direto" : " #" + (Math.floor(i / (t.doubleRound ? 2 : 1)) + 1)); });
      save({ ...t, groupMatches: [], koMatches: bracket, frozen: null, phase: "ko", ordemChave: ids });
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
  /* Pode ser chamado antes de a fase de grupos terminar: é a saída para quem
     quer ir direto ao mata-mata. `modo` decide a ordem de cabeça de chave. */
  const startKO = (modo = "classificacao") => {
    /* No sorteio todo mundo entra, então a chave cresce até caber todos — senão
       um jogador ficaria de fora por acaso. Pela classificação valem os
       `koStart` primeiros, que é o combinado da fase de grupos. */
    const sorteio = modo === "sorteio";
    const q = sorteio ? embaralhar(t.players) : table.slice(0, t.koStart);
    const tam = sorteio ? proximaPotencia(q.length) : t.koStart;
    const bracket = genBracket(q, t.koBestOf || t.bestOf, tam);
    bracket.forEach((m, i) => { m.label = KO_SIZES[tam] + (m.bye ? " · passa direto" : " #" + (i + 1)); });
    /* Congela a classificação e descarta os jogos de grupo que não foram
       disputados: deixá-los na lista sugeriria que ainda valem alguma coisa. */
    save({
      ...t, koMatches: bracket, phase: "ko", frozen: t.frozen || table,
      groupMatches: t.groupMatches.filter(m => matchResult(m, t.bestOf).done),
    });
    setView("chave");
  };

  // ---- salvar placar (grupo ou ko) e avancar chave ----
  const saveMatch = (m) => {
    if (m.phase === "grupo") {
      save({ ...t, groupMatches: t.groupMatches.map(x => x.id === m.id ? m : x) });
    } else {
      const bo = t.koBestOf || t.bestOf;
      const idaVolta = !!t.doubleRound;
      let ko = t.koMatches.map(x => x.id === m.id ? m : x);
      ko = garantirDesempates(ko, bo);   // agregado empatado abre o set extra

      /* A rodada avança por confronto, não por partida: na ida e volta cada
         confronto tem dois jogos e pode ter ainda o desempate. */
      const porRodada = agruparTies(ko);
      const sizes = Object.keys(porRodada).map(Number).sort((a, b) => b - a);
      sizes.forEach(sz => {
        if (sz === 2) return;
        const ties = Object.values(porRodada[sz]);
        const rs = ties.map(legs => tieResult(legs, bo));
        const nextSz = sz / 2;
        const temProxima = Object.keys(porRodada[nextSz] || {}).length > 0;
        if (ties.length === sz / 2 && rs.every(r => r.done) && !temProxima) {
          const winners = rs.map(r => r.winner);
          const nextRound = [];
          for (let i = 0; i < winners.length; i += 2) {
            const rotulo = KO_SIZES[nextSz] + (nextSz > 2 ? " #" + (i / 2 + 1) : "");
            const tie = "c" + uid();
            nextRound.push({ id: uid(), phase: "ko", roundSize: nextSz, tie, leg: 1, a: winners[i], b: winners[i + 1], sets: [], done: false, label: rotulo });
            if (idaVolta) nextRound.push({ id: uid(), phase: "ko", roundSize: nextSz, tie, leg: 2, a: winners[i + 1], b: winners[i], sets: [], done: false, label: rotulo });
          }
          ko = ko.concat(nextRound);
        }
      });
      save({ ...t, koMatches: ko });
    }
    setLive(null);
  };

  const champion = (() => {
    // sem mata-mata, campeão é o líder quando todos os jogos de grupo terminam
    if (!temMata(t)) {
      const fim = t.groupMatches.length > 0 && t.groupMatches.every(m => matchResult(m, t.bestOf).done);
      return fim && table.length ? table[0].id : null;
    }
    const finais = Object.values(agruparTies(t.koMatches)[2] || {})[0];
    if (!finais) return null;
    const r = tieResult(finais, t.koBestOf || t.bestOf);
    return r.done ? r.winner : null;
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
    <LiveScore match={live} players={t.players}
      bestOf={live.desempate ? 1 : (live.phase === "ko" ? (t.koBestOf || t.bestOf) : t.bestOf)}
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
          {/* cada aba só existe se o formato a usa */}
          {temGrupos(t) && (
            <div className="segtabs">
              <button className={"segtab" + (view === "tabela" ? " on" : "")} onClick={() => setView("tabela")}>Classificação</button>
              <button className={"segtab" + (view === "jogos" ? " on" : "")} onClick={() => setView("jogos")}>Jogos</button>
              {temMata(t) && <button className={"segtab" + (view === "chave" ? " on" : "")} onClick={() => setView("chave")}>Mata-mata</button>}
            </div>)}

          {temGrupos(t) && view === "tabela" && <ClassTable table={table} />}
          {temGrupos(t) && view === "jogos" && <GroupGames t={t} onOpen={abrirPlacar} />}
          {temMata(t) && (!temGrupos(t) || view === "chave") &&
            <Bracket t={t} table={table} canKO={canKO} startKO={startKO} onOpen={abrirPlacar} champion={champion} nm={nm} />}

          <button className="linkbtn" onClick={() => { if (confirm("Voltar para a configuração?\n\nOs jogadores são mantidos e você pode trocar o formato, mas os resultados deste torneio são apagados.")) save({ ...DEFAULT_TOURNEY, players: t.players, formato: t.formato, chaveamento: t.chaveamento, bestOf: t.bestOf, koStart: t.koStart }); }}>
            <RotateCcw size={13} /> Reconfigurar torneio</button>
        </>)}
    </>);
}

const FASES = [[2, "Final"], [4, "Semis"], [8, "Quartas"], [16, "Oitavas"]];

function TourneyConfig({ t, save, nameInput, setNameInput, addPlayer, rmPlayer, moverPlayer, comecar }) {
  const fmt = formatoDe(t);
  const soMata = fmt === "mata";
  const qtd = t.players.length;
  // no mata-mata direto a chave precisa comportar os jogadores sem virar só bye
  const fasesOk = FASES.filter(([n]) => (soMata ? cabeNaChave(qtd, n) : n <= Math.max(2, qtd)));
  const chaveServe = !soMata || fasesOk.some(([n]) => n === t.koStart);
  const byes = soMata && chaveServe ? t.koStart - qtd : 0;
  const podeComecar = qtd >= 2 && (!soMata || chaveServe);

  /* A ordem de chaveamento é recalculada sempre que deixa de refletir os
     jogadores atuais — adicionar ou remover alguém invalida a anterior. */
  const ordem = ordemValida(t.ordemChave, t.players, t.koStart)
    ? t.ordemChave : ordemInicial(t.players, t.koStart);
  const setOrdem = (nova) => save({ ...t, ordemChave: nova });

  /* Sem isto a tela trava: com 5 jogadores a fase padrão (semis) não comporta
     todos, e nada aparecia até escolher "Quartas" na mão. */
  useEffect(() => {
    if (soMata && fasesOk.length && !fasesOk.some(([n]) => n === t.koStart))
      save({ ...t, koStart: fasesOk[0][0] });
  }, [soMata, qtd, t.koStart]);

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
              <button className="pc-x" onClick={() => rmPlayer(p.id)} aria-label="Remover"><X size={13} /></button>
            </div>))}
        </div>
      </div>

      <SecTitle n="2" icon={<Layers size={14} />}>Formato do torneio</SecTitle>
      <div className="block">
        <div className="segs wrap">
          <button className={"seg" + (fmt === "mata" ? " seg-v" : "")} onClick={() => save({ ...t, formato: "mata" })}>Mata-mata</button>
          <button className={"seg" + (fmt === "so-grupos" ? " seg-v" : "")} onClick={() => save({ ...t, formato: "so-grupos" })}>Fase de grupos</button>
          <button className={"seg" + (fmt === "grupos+mata" ? " seg-v" : "")} onClick={() => save({ ...t, formato: "grupos+mata" })}>Grupos + mata-mata</button>
        </div>
        <p className="tm-cap" style={{ textAlign: "left", marginTop: 10 }}>
          {fmt === "mata" ? "Elimina direto. Quem perde o confronto está fora."
            : fmt === "so-grupos" ? "Todos jogam entre si e vence quem liderar a classificação. Sem mata-mata."
              : "Todos jogam entre si primeiro; os melhores avançam para o mata-mata."}</p>
      </div>

      <SecTitle n="3" icon={<Repeat size={14} />}>Confrontos</SecTitle>
      <div className="block">
        <div className="optrow">
          <span className="opt-l">Formato dos confrontos</span>
          <div className="segs">
            <button className={"seg" + (!t.doubleRound ? " seg-v" : "")} onClick={() => save({ ...t, doubleRound: false })}>Só ida</button>
            <button className={"seg" + (t.doubleRound ? " seg-v" : "")} onClick={() => save({ ...t, doubleRound: true })}>Ida e volta</button>
          </div>
        </div>
        <div className="optrow" style={{ marginTop: 14 }}>
          <span className="opt-l">Sets por partida</span>
          <div className="segs">
            {[3, 5, 7].map(b => <button key={b} className={"seg" + (t.bestOf === b ? " seg-v" : "")} onClick={() => save({ ...t, bestOf: b })}>Melhor de {b}</button>)}
          </div>
        </div>
        <p className="tm-cap" style={{ textAlign: "left", marginTop: 12 }}>
          {t.doubleRound
            ? (temMata(t)
              ? "Cada dupla se enfrenta duas vezes, com o mando invertido na volta. No mata-mata vence quem somar mais sets nos dois jogos; se o agregado empatar, um set extra decide."
              : "Cada dupla se enfrenta duas vezes, com o mando invertido na volta.")
            : "Cada dupla se enfrenta uma vez só."}</p>
      </div>

      {temMata(t) && (
        <>
          <SecTitle n="4" icon={<Trophy size={14} />}>Fase mata-mata</SecTitle>
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

            <p className="tm-cap" style={{ textAlign: "left", marginTop: 12 }}>
              {soMata
                ? (byes > 0
                  ? `Com ${qtd} jogadores numa chave de ${t.koStart}, ${byes} ${byes === 1 ? "passa" : "passam"} direto para a rodada seguinte.`
                  : `Chave cheia: os ${qtd} jogadores se enfrentam já na primeira rodada.`)
                : `Os ${t.koStart} primeiros da classificação avançam. O chaveamento é montado automaticamente (1º x último, e assim por diante).`}</p>
          </div>

          {soMata && chaveServe && (
            <EditorChave players={t.players} tamanho={t.koStart} ordem={ordem} onOrdem={setOrdem} />)}
        </>)}

      <button className="bigbtn" disabled={!podeComecar} onClick={comecar}>
        <Play size={17} /> {soMata ? "Começar o mata-mata" : "Gerar partidas e começar"}</button>
    </>);
}

/* Editor de chaveamento: mostra os confrontos que vão sair e deixa trocar
   jogador de lugar. Antes só havia setas para reordenar a lista, e como a
   chave pareia o 1º com o último, o resultado parecia aleatório. */
function EditorChave({ players, tamanho, ordem, onOrdem }) {
  const [sel, setSel] = useState(null);
  const nome = (id) => players.find(p => p.id === id)?.name || null;
  const jogos = confrontosDe(ordem, tamanho);

  const tocar = (i) => {
    if (sel === null) { setSel(i); return; }
    if (sel === i) { setSel(null); return; }
    const nova = ordem.slice();
    [nova[sel], nova[i]] = [nova[i], nova[sel]];
    onOrdem(nova);
    setSel(null);
  };

  const slot = (i) => {
    const n = nome(ordem[i]);
    return (
      <button className={"ch-slot" + (sel === i ? " sel" : "") + (n ? "" : " vago")} onClick={() => tocar(i)}>
        {n || "vaga livre"}
      </button>);
  };

  return (
    <div className="block">
      <div className="section-eyebrow"><Layers size={13} /> Confrontos da primeira rodada</div>
      <div className="chlist">
        {jogos.map((j, k) => (
          <div className="chjogo" key={k}>
            <span className="ch-n">{k + 1}</span>
            {slot(j.ia)}<span className="ch-x">×</span>{slot(j.ib)}
          </div>))}
      </div>
      <p className="tm-cap" style={{ textAlign: "left", marginTop: 11 }}>
        {sel === null
          ? "Toque em dois jogadores para trocá-los de lugar. Quem cair contra uma vaga livre passa direto."
          : "Agora toque em quem vai trocar de lugar com o selecionado."}</p>
      <button className="linkbtn" onClick={() => { onOrdem(embaralhar(ordem)); setSel(null); }}>
        <Repeat size={14} /> Sortear os confrontos</button>
    </div>);
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
  if (t.koMatches.length === 0) {
    const faltam = t.groupMatches.filter(m => !matchResult(m, t.bestOf).done).length;
    const tamSorteio = proximaPotencia(Math.max(2, t.players.length));
    const sobras = tamSorteio - t.players.length;
    /* Antes isto ficava travado até a fase de grupos acabar, e não havia como
       ir direto ao mata-mata sem apagar o torneio inteiro. */
    const gerar = (modo) => {
      if (faltam > 0 && !confirm(
        `Ainda ${faltam === 1 ? "falta 1 jogo" : `faltam ${faltam} jogos`} na fase de grupos.\n\n` +
        "Gerar o mata-mata agora descarta os jogos restantes e congela a classificação como está. Continuar?")) return;
      startKO(modo);
    };
    return (
      <div className="block">
        <p className="p-lead">{canKO
          ? `A fase de grupos terminou. Monte o mata-mata com os ${t.koStart} primeiros.`
          : `Você pode ir direto para o mata-mata agora. ${faltam === 1 ? "1 jogo" : `${faltam} jogos`} da fase de grupos ${faltam === 1 ? "seria descartado" : "seriam descartados"}.`}</p>
        <button className="bigbtn" onClick={() => gerar("classificacao")}>
          <Layers size={16} /> Pela classificação · {KO_SIZES[t.koStart]}</button>
        <button className="bigbtn" style={{ background: "#1C6F63" }} onClick={() => gerar("sorteio")}>
          <Repeat size={16} /> Sortear a chave · {KO_SIZES[tamSorteio]}</button>
        <p className="tm-cap" style={{ textAlign: "left", marginTop: 4 }}>
          Pela classificação avançam os {t.koStart} primeiros, e o 1º enfrenta o último.
          No sorteio entram os {t.players.length} jogadores, em ordem aleatória
          {sobras > 0 && `, com ${sobras} ${sobras === 1 ? "passando" : "passando"} direto`}.</p>
      </div>);
  }
  const bo = t.koBestOf || t.bestOf;
  const porRodada = agruparTies(t.koMatches);
  const sizes = Object.keys(porRodada).map(Number).sort((a, b) => b - a);
  return (
    <>
      {champion && <div className="champbox"><Trophy size={22} /><div><div className="cb-l">Campeão</div><div className="cb-n">{nm(champion)}</div></div></div>}
      {sizes.map(sz => (
        <div key={sz}>
          <div className="round-lbl">{KO_SIZES[sz]}</div>
          {Object.entries(porRodada[sz]).map(([tie, legs]) => {
            const r = tieResult(legs, bo);
            const doisJogos = legs.filter(l => !l.desempate).length > 1;
            return (
              <div className={"tie" + (doisJogos ? " tie-duplo" : "")} key={tie}>
                {doisJogos && (
                  <div className="tie-top">
                    <span className="tie-quem">{nm(r.A)} <em>x</em> {nm(r.B)}</span>
                    <span className="tie-agg">{r.sa}<em>–</em>{r.sb}<i>sets</i></span>
                  </div>)}
                {legs.map(m => (
                  <MatchRow key={m.id} match={m} players={t.players}
                    bestOf={m.desempate ? 1 : bo} onOpen={onOpen}
                    etiqueta={doisJogos ? (m.desempate ? "Set de desempate" : (m.leg === 2 ? "Volta" : "Ida")) : null} />))}
                {r.temDesempate && !r.done && (
                  <p className="tie-nota"><AlertTriangle size={13} /> Agregado empatado em {r.sa}–{r.sb}. O set de desempate decide.</p>)}
                {r.viaDesempate && (
                  <p className="tie-nota"><Check size={13} /> <strong>{nm(r.winner)}</strong> passou no set de desempate.</p>)}
              </div>);
          })}
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
