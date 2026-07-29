import React, { useState, useEffect } from "react";
import { Trophy, ChevronLeft, ChevronRight, Info, Award, Layers } from "lucide-react";
import { Hero, Collapsible } from "../components/ui.jsx";
import { storage as store } from "../lib/db.js";
import { buildRanking, countEvents, RANK_TABLE, RANKING_SEED } from "../data/ranking.js";

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const fmtPts = (n) => n.toLocaleString("pt-BR");

/* `parcial` = o recorte mistura saldo herdado com campeonatos registrados, então
   a contagem de campeonatos não descreve o total e seria enganosa ao lado dos títulos. */
function RankRow({ r, i, max, parcial }) {
  const pct = max > 0 ? Math.round((r.points / max) * 100) : 0;
  return (
    <div className={"rk" + (i < 3 ? " rk-podio rk-p" + (i + 1) : "")}>
      <span className="rk-pos">{i + 1}</span>
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
  const [scope, setScope] = useState("ano");
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  useEffect(() => { (async () => setHistory((await store.get("tourney:history")) || []))(); }, []);
  if (!history) return <div className="loading">Carregando ranking…</div>;

  const rank = buildRanking(history, { scope, year, month });
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
        <div className="rklist">{rank.map((r, i) => <RankRow key={r.name} r={r} i={i} max={max} parcial={temSaldo} />)}</div>
      )}

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
