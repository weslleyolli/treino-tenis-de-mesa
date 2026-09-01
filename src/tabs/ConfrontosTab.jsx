import React, { useState, useEffect } from "react";
import { Swords, Info, Trophy, Calendar } from "lucide-react";
import { Hero } from "../components/ui.jsx";
import { storage as store } from "../lib/db.js";
import { confrontosEntre, jogadoresDoHistorico } from "../lib/confrontos.js";

/* Confronto direto entre dois jogadores. O histórico já guardava tudo isso —
   faltava um lugar para perguntar "quantas vezes eu joguei contra ele, e como
   foi cada uma". */
function ConfrontosTab() {
  const [history, setHistory] = useState(null);
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  useEffect(() => { (async () => {
    const h = (await store.get("tourney:history")) || [];
    setHistory(h);
    const nomes = jogadoresDoHistorico(h);
    if (nomes.length) { setA(nomes[0]); setB(nomes[1] || nomes[0]); }
  })(); }, []);

  if (!history) return <div className="loading">Carregando confrontos…</div>;
  const nomes = jogadoresDoHistorico(history);

  if (nomes.length < 2) return (
    <>
      <Hero tone="purple" icon={<Swords size={13} />} eyebrow="Confronto direto" title="Quem ganha de quem"
        sub="Precisa de pelo menos dois jogadores em campeonatos arquivados." />
      <div className="emptybox"><Info size={16} />
        <span>Arquive um campeonato na aba Torneio e o histórico de confrontos começa a se montar sozinho.</span></div>
    </>);

  const r = confrontosEntre(history, a, b);
  const total = r.jogos.length;
  const pctA = total ? Math.round((r.vitA / total) * 100) : 0;

  return (
    <>
      <Hero tone="purple" icon={<Swords size={13} />} eyebrow="Confronto direto"
        title={total ? `${r.vitA} × ${r.vitB}` : "Nunca se enfrentaram"}
        sub={total
          ? `${total} ${total === 1 ? "partida" : "partidas"} entre ${a} e ${b}, somando todos os campeonatos arquivados.`
          : `${a} e ${b} não têm partida registrada entre si nos campeonatos arquivados.`}
        pct={total ? pctA : 0} />

      <div className="duelo">
        <label className="duelo-lado">
          <span>Jogador</span>
          <select value={a} onChange={e => setA(e.target.value)}>
            {nomes.map(n => <option key={n} value={n}>{n}</option>)}</select>
        </label>
        <span className="duelo-x">×</span>
        <label className="duelo-lado">
          <span>Adversário</span>
          <select value={b} onChange={e => setB(e.target.value)}>
            {nomes.map(n => <option key={n} value={n}>{n}</option>)}</select>
        </label>
      </div>

      {a === b && <div className="emptybox" style={{ marginTop: 12 }}><Info size={16} />
        <span>Escolha dois jogadores diferentes.</span></div>}

      {total > 0 && <>
        <div className="statgrid" style={{ marginTop: 14 }}>
          <div className="stat"><span className="stat-v">{r.vitA}<em style={{ opacity: .4 }}>/{total}</em></span>
            <span className="stat-l">vitórias de {a}</span></div>
          <div className="stat"><span className="stat-v">{r.vitB}<em style={{ opacity: .4 }}>/{total}</em></span>
            <span className="stat-l">vitórias de {b}</span></div>
          <div className="stat"><span className="stat-v">{r.setsA}–{r.setsB}</span><span className="stat-l">sets</span></div>
          <div className="stat"><span className="stat-v">{r.pontosA}–{r.pontosB}</span><span className="stat-l">pontos</span></div>
        </div>

        <div className="mini-title" style={{ marginTop: 20 }}>Partida a partida · da mais recente</div>
        <div className="duelo-grade">
        {r.jogos.map(j => (
          <div className={"duelo-jogo" + (j.venceuA ? " venceu-a" : " venceu-b")} key={j.id}>
            <div className="dj-topo">
              <span className="dj-fase">{j.fase}</span>
              <span className="dj-quando"><Calendar size={10} /> {new Date(j.em).toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="dj-placar">
              <span className={"dj-nome" + (j.venceuA ? " vit" : "")}>{a}</span>
              <span className="dj-sets">{j.setsA}<em>×</em>{j.setsB}</span>
              <span className={"dj-nome dir" + (!j.venceuA ? " vit" : "")}>{b}</span>
            </div>
            {j.sets.length > 0 && (
              <div className="dj-parciais">
                {j.sets.map((s, i) => (
                  <span key={i} className={s.a > s.b ? "p-a" : "p-b"}>{s.a}-{s.b}</span>))}
              </div>)}
            <div className="dj-torneio"><Trophy size={10} /> {j.torneio}</div>
          </div>))}
        </div>
      </>}
    </>);
}

export { ConfrontosTab };
