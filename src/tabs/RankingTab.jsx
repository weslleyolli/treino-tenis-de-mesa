import React, { useState, useEffect } from "react";
import { Trophy, ChevronLeft, ChevronRight, Info, Award, Layers, X, Trash2, Check, Undo2, Users } from "lucide-react";
import { Hero, Collapsible } from "../components/ui.jsx";
import { storage as store } from "../lib/db.js";
import { buildRanking, countEvents, RANK_TABLE, RANKING_SEED, awardsOf } from "../data/ranking.js";
import { fundirJogadores, renomearJogador, removerJogador } from "../lib/corrigirTorneio.js";

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const fmtPts = (n) => n.toLocaleString("pt-BR");

/* `parcial` = o recorte mistura saldo herdado com campeonatos registrados, então
   a contagem de campeonatos não descreve o total e seria enganosa ao lado dos títulos. */
function RankRow({ r, i, max, parcial, onRemover }) {
  const pct = max > 0 ? Math.round((r.points / max) * 100) : 0;
  return (
    <div className={"rk" + (i < 3 ? " rk-podio rk-p" + (i + 1) : "")}>
      {onRemover
        ? <button className="rk-rm" onClick={() => onRemover(r.name)} aria-label={`Tirar ${r.name} do ranking`}><X size={15} /></button>
        : <span className="rk-pos">{i + 1}</span>}
      <div className="rk-mid">
        <div className="rk-top">
          <span className="rk-name">{r.name}</span>
          <span className="rk-pts">{fmtPts(r.points)}<em>pts</em></span>
        </div>
        <div className="rk-sub">
          {r.titles > 0
            ? <span className="rk-tit"><Trophy size={11} /> {r.titles} {r.titles === 1 ? "título" : "títulos"}</span>
            : <span>sem títulos</span>}
          {!parcial && r.events > 0 && <span>{r.events} {r.events === 1 ? "campeonato" : "campeonatos"}</span>}
        </div>
        <div className="rk-track"><div className="rk-fill" style={{ width: pct + "%" }} /></div>
      </div>
    </div>);
}

function RankingTab() {
  const [history, setHistory] = useState(null);
  const [removidos, setRemovidos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [corrigindo, setCorrigindo] = useState(null);
  const [scope, setScope] = useState("ano");
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  useEffect(() => { (async () => {
    setHistory((await store.get("tourney:history")) || []);
    setRemovidos((await store.get("ranking:removidos")) || []);
  })(); }, []);
  if (!history) return <div className="loading">Carregando ranking…</div>;

  const gravarRemovidos = (lista) => { setRemovidos(lista); store.set("ranking:removidos", lista); };
  const remover = (nome) => {
    if (!confirm(`Tirar ${nome} do ranking?\n\nOs campeonatos continuam no histórico; ele só deixa de aparecer aqui e pode voltar depois.`)) return;
    gravarRemovidos([...removidos.filter(r => r.nome !== nome), { nome, em: Date.now() }]);
  };
  const restaurar = (nome) => gravarRemovidos(removidos.filter(r => r.nome !== nome));

  /* Correção de campeonato já arquivado. Toda edição reescreve o torneio inteiro
     no histórico — o ranking é derivado, então ele se recalcula sozinho. */
  const gravarHistorico = (nh) => { setHistory(nh); store.set("tourney:history", nh); };
  const corrigir = (torneioId, fn) =>
    gravarHistorico(history.map(h => h.id === torneioId ? fn(h) : h));

  const pedirFusao = (h, jog) => {
    const outros = h.players.filter(p => p.id !== jog.id);
    const lista = outros.map((p, i) => `${i + 1}. ${p.name}`).join("\n");
    const esc = prompt(
      `Quem jogou de verdade no lugar de ${jog.name}?\n\n${lista}\n\nDigite o número:`);
    const alvo = outros[Number(esc) - 1];
    if (!alvo) return;
    if (!confirm(
      `${alvo.name} herda as partidas que ${jog.name} realmente disputou, e ${jog.name} deixa de existir neste campeonato.\n\n` +
      `Os jogos que nunca aconteceram (0-0-0) são apagados em vez de irem para ${alvo.name}.\n\nConfirmar?`)) return;
    corrigir(h.id, t => fundirJogadores(t, jog.id, alvo.id));
  };
  const pedirRenome = (h, jog) => {
    const nome = prompt(`Novo nome para ${jog.name} neste campeonato:`, jog.name);
    if (nome && nome.trim() && nome.trim() !== jog.name) corrigir(h.id, t => renomearJogador(t, jog.id, nome));
  };
  const pedirRemocao = (h, jog) => {
    if (!confirm(
      `Apagar ${jog.name} deste campeonato, junto com todas as partidas dele?\n\n` +
      `Se alguém jogou no lugar dele, use "quem jogou" — assim os pontos não se perdem.`)) return;
    corrigir(h.id, t => removerJogador(t, jog.id));
  };

  const rank = buildRanking(history, { scope, year, month, removidos });
  const events = countEvents(history, { scope, year, month });
  const max = rank.length ? rank[0].points : 0;
  const temSaldo = scope === "ano" && year === RANKING_SEED.year;

  // navegação de período — nunca avança para o futuro
  const step = (d) => {
    if (scope === "ano") { if (year + d <= now.getFullYear()) setYear(year + d); return; }
    let m = month + d, y = year;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    if (y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth())) return;
    setMonth(m); setYear(y);
  };
  const noFuturo = scope === "ano"
    ? year >= now.getFullYear()
    : year === now.getFullYear() && month >= now.getMonth();
  const periodo = scope === "ano" ? String(year) : `${MESES[month]} de ${year}`;

  return (
    <>
      <Hero tone="gold" icon={<Trophy size={13} />} eyebrow="Ranqueamento"
        title={scope === "ano" ? `Temporada ${year}` : MESES[month][0].toUpperCase() + MESES[month].slice(1)}
        sub={events > 0
          ? `${events} ${events === 1 ? "campeonato registrado" : "campeonatos registrados"}${temSaldo ? ", mais o saldo da temporada" : ""} · pontos pela colocação final`
          : temSaldo
            ? "Saldo da temporada. Arquive um campeonato para somar daqui em diante."
            : "Nenhum campeonato arquivado neste período."} />

      <div className="segtabs">
        <button className={"segtab" + (scope === "mes" ? " on" : "")} onClick={() => setScope("mes")}>Mensal</button>
        <button className={"segtab" + (scope === "ano" ? " on" : "")} onClick={() => setScope("ano")}>Anual</button>
      </div>

      <div className="periodnav">
        <button onClick={() => step(-1)} aria-label="Período anterior"><ChevronLeft size={18} /></button>
        <span>{periodo}</span>
        <button onClick={() => step(1)} disabled={noFuturo} aria-label="Próximo período"><ChevronRight size={18} /></button>
      </div>

      {rank.length === 0 ? (
        <div className="emptybox"><Info size={16} />
          <span>Sem pontos em {periodo}. Arquive um campeonato na aba Torneio para o ranking começar a contar.</span></div>
      ) : (
        <div className="rklist">{rank.map((r, i) =>
          <RankRow key={r.name} r={r} i={i} max={max} parcial={temSaldo}
            onRemover={editando ? remover : null} />)}</div>
      )}

      {(rank.length > 0 || removidos.length > 0) && (
        <button className="linkbtn" onClick={() => setEditando(e => !e)}>
          {editando ? <><Check size={14} /> Concluir</> : <><Trash2 size={14} /> Remover jogadores do ranking</>}
        </button>)}

      {editando && removidos.length > 0 && (
        <div className="block">
          <div className="section-eyebrow"><Undo2 size={13} /> Fora do ranking</div>
          <div className="plist">
            {removidos.map(r => (
              <div className="pchip" key={r.nome}>
                <span className="pc-nome">{r.nome}</span>
                <button className="pc-voltar" onClick={() => restaurar(r.nome)}>Trazer de volta</button>
              </div>))}
          </div>
          <p className="tm-cap" style={{ textAlign: "left", marginTop: 10 }}>
            Os campeonatos deles continuam no histórico — só não entram na contagem do ranking.</p>
        </div>)}

      {editando && history.length > 0 && (
        <div className="block">
          <div className="section-eyebrow"><Users size={13} /> Corrigir um campeonato</div>
          <p className="tm-cap" style={{ textAlign: "left", margin: "0 0 11px" }}>
            Para quando alguém foi inscrito e não apareceu, jogou com o nome trocado, ou entrou na vaga de outro.
          </p>
          <div className="plist">
            {history.map(h => (
              <button key={h.id} className={"pchip" + (corrigindo === h.id ? " on" : "")}
                onClick={() => setCorrigindo(corrigindo === h.id ? null : h.id)}
                style={{ cursor: "pointer", textAlign: "left" }}>
                <span className="pc-nome">{h.championName ? `${h.name} · ${h.championName}` : h.name}</span>
                <span className="pc-voltar">{new Date(h.finishedAt).toLocaleDateString("pt-BR")}</span>
              </button>))}
          </div>

          {corrigindo && (() => {
            const h = history.find(x => x.id === corrigindo);
            if (!h) return null;
            const pontos = Object.fromEntries(awardsOf(h).map(a => [a.name, a.points]));
            return (
              <div className="corrigir">
                {h.players.map(jog => (
                  <div className="cor-linha" key={jog.id}>
                    <div className="cor-mid">
                      <span className="cor-nome">{jog.name}</span>
                      <span className="cor-pts">{pontos[jog.name] != null ? `${fmtPts(pontos[jog.name])} pts` : "sem pontos"}</span>
                    </div>
                    <div className="cor-btns">
                      <button onClick={() => pedirFusao(h, jog)}>Quem jogou</button>
                      <button onClick={() => pedirRenome(h, jog)}>Renomear</button>
                      <button className="perigo" onClick={() => pedirRemocao(h, jog)}>Apagar</button>
                    </div>
                  </div>))}
                <p className="tm-cap" style={{ textAlign: "left", marginTop: 10 }}>
                  <strong>Quem jogou</strong> transfere as partidas para quem realmente esteve lá e apaga o inscrito ausente —
                  é o certo quando alguém entrou na vaga de outro, porque os pontos vão junto e ninguém conta duas vezes.
                </p>
              </div>);
          })()}
        </div>)}

      {temSaldo && (
        <div className="emptymini" style={{ marginTop: 12 }}><Info size={15} />
          <span>O anual inclui o saldo da temporada já em andamento quando o app começou a registrar. O mensal conta só os campeonatos arquivados aqui.</span></div>)}

      <Collapsible icon={<Award size={15} />} title="Como os pontos são distribuídos" sub="por colocação final">
        <p className="p-lead">Cada campeonato arquivado distribui pontos pela posição final. O mata-mata define o topo: a final dá 1º e 2º, os perdedores das semis vêm depois, e quem não chegou lá entra pela classificação de grupos.</p>
        <div className="ptstable">
          {RANK_TABLE.map(r => (
            <div className="pts-row" key={r.pos}>
              <span className="pts-pos">{r.pos}</span>
              <span className="pts-lbl">{r.label}</span>
              <span className="pts-v">{fmtPts(r.pts)}</span>
            </div>))}
        </div>
      </Collapsible>
    </>);
}

export { RankingTab };
