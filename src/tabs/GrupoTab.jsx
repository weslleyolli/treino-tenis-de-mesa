import React, { useState, useEffect } from "react";
import {
  Users, Plus, X, Play, Clock, RotateCcw, Trophy, Info, Target, ChevronRight,
  AlertTriangle, Bot, Check, Minus, Layers, StickyNote,
} from "lucide-react";
import { bold, Hero, Collapsible, SecTitle } from "../components/ui.jsx";
import { storage as store } from "../lib/db.js";
import {
  BLOCOS, REGRAS_DE_CASA, DRILLS, GUIA_ALIMENTADOR, FOCOS_MULTIBOLA,
  REGRAS_JOGO, PLANO_B, TOTAL_MIN,
  escalacaoDiagonais, turnoMultibola, totalTurnosMultibola, voltaDoTurno,
  proximoJogo, rankingMultibola,
} from "../data/grupo.js";

/* ============ ABA GRUPO ============
   Uma tela para treinar com o pessoal numa mesa só. O conteúdo está em
   data/grupo.js; aqui mora só o estado do dia: quem veio, em que volta o
   rodízio está, quantas bolas cada um acertou e como está a fila do jogo.

   Tudo é gravado a cada toque. O celular fica na ponta da mesa o treino
   inteiro e não pode perder nada se a tela apagar ou alguém recarregar. */

const CHAVE = "grupo:v1";
const VAZIO = { jogadores: [], voltas: {}, turno: 0, acertos: {}, regra: "A", jogo: null };

/* ---------- peças pequenas ---------- */
function Stepper({ valor, onMuda, max }) {
  return (
    <div className="gr-cnt">
      <button onClick={() => onMuda(Math.max(0, valor - 1))} aria-label="Menos um acerto"><Minus size={15} /></button>
      <span className="gr-cnt-v">{valor}<em>/{max}</em></span>
      <button onClick={() => onMuda(Math.min(max, valor + 1))} aria-label="Mais um acerto"><Plus size={15} /></button>
    </div>);
}

function Elenco({ jogadores, onAdd, onRemove }) {
  const [nome, setNome] = useState("");
  const add = () => {
    const n = nome.trim();
    if (!n) return;
    if (jogadores.some(j => j.toLowerCase() === n.toLowerCase())) { setNome(""); return; }
    onAdd(n); setNome("");
  };
  return (
    <div className="gr-elenco">
      <div className="section-eyebrow"><Users size={13} /> Quem veio hoje</div>
      <div className="gr-nomes">
        {jogadores.map((j, i) => (
          <span className="gr-nome" key={j}>
            <b>{i + 1}</b>{j}
            <button onClick={() => onRemove(j)} aria-label={`Tirar ${j}`}><X size={13} /></button>
          </span>))}
        {!jogadores.length && <span className="gr-vazio">Escreva os nomes para a tela calcular os rodízios.</span>}
      </div>
      <div className="gr-add">
        <input value={nome} placeholder="Nome" maxLength={18}
          onChange={e => setNome(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") add(); }} />
        <button className="mini-btn" onClick={add}><Plus size={14} /> Entrar</button>
      </div>
    </div>);
}

/* ---------- painel: diagonais ---------- */
function PainelDiagonais({ bloco, jogadores, volta, setVolta, onTimer }) {
  const e = escalacaoDiagonais(jogadores, volta);
  if (!e) return <div className="gr-falta">Precisa de pelo menos 2 nomes.</div>;
  const min = Math.round(bloco.trocaSeg / 60);
  return (
    <div className="gr-painel">
      <div className="gr-painel-top">
        <span className="gr-volta">Volta {volta + 1}</span>
        <button className="mini-btn ghost" onClick={() => onTimer(`${bloco.nome} · volta ${volta + 1}`, bloco.trocaSeg)}>
          <Clock size={12} /> {min} min</button>
      </div>
      <div className="gr-mesa">
        {e.diagonais.map(d => (
          <div className="gr-diag" key={d.nome}>
            <span className="gr-diag-n">{d.nome}</span>
            <div className="gr-par"><span>{d.par[0]}</span><em>×</em><span>{d.par[1]}</span></div>
          </div>))}
      </div>
      {e.fora.length > 0 && (
        <div className="gr-fora"><Layers size={13} />
          <span><strong>Fora da mesa:</strong> {e.fora.join(", ")} — conta a série de quem está jogando.</span></div>)}
      <button className="gr-prox" onClick={() => setVolta(volta + 1)}>
        Girar o rodízio <ChevronRight size={16} /></button>
    </div>);
}

/* ---------- painel: multibola ---------- */
function PainelMultibola({ jogadores, turno, setTurno, acertos, setAcerto, onTimer }) {
  const n = jogadores.length;
  const t = turnoMultibola(jogadores, turno);
  if (!t) return <div className="gr-falta">Precisa de pelo menos 2 nomes.</div>;
  const total = totalTurnosMultibola(n, FOCOS_MULTIBOLA.length);
  const iVolta = Math.min(voltaDoTurno(n, turno), FOCOS_MULTIBOLA.length - 1);
  const foco = FOCOS_MULTIBOLA[iVolta];
  const chave = `${foco.volta}:${t.treina}`;
  const acabou = turno >= total;
  const rank = rankingMultibola(jogadores, acertos);
  return (
    <div className="gr-painel">
      <div className="gr-painel-top">
        <span className="gr-volta">Turno {Math.min(turno + 1, total)} de {total}</span>
        <button className="mini-btn ghost" onClick={() => onTimer(`Multibola · ${t.treina}`, 120)}>
          <Clock size={12} /> 2 min</button>
      </div>

      <div className="gr-foco">
        <span className="gr-foco-n">Volta {foco.volta} · {foco.titulo}</span>
        <strong>{foco.alvo}</strong>
        <p>{foco.como}</p>
        <p className="gr-foco-conta"><Info size={12} /> {foco.conta}</p>
      </div>

      {!acabou && (<>
        <div className="gr-papeis">
          <div className="gr-papel treina"><span>Treina</span><strong>{t.treina}</strong></div>
          <div className="gr-papel alimenta"><span>Alimenta</span><strong>{t.alimenta}</strong></div>
          <div className="gr-papel cata"><span>Catam</span><strong>{t.catam.join(", ") || "—"}</strong></div>
        </div>
        <div className="gr-conta">
          <span>Acertos de <strong>{t.treina}</strong></span>
          <Stepper valor={Number(acertos[chave]) || 0} max={30} onMuda={v => setAcerto(chave, v)} />
        </div>
        <button className="gr-prox" onClick={() => setTurno(turno + 1)}>
          Próximo turno <ChevronRight size={16} /></button>
      </>)}
      {acabou && <div className="gr-fim"><Check size={15} /> Multibola encerrada. O ranking abaixo é o do fechamento.</div>}

      {rank.some(r => r.total > 0) && (
        <div className="gr-rank">
          <div className="section-eyebrow"><Trophy size={13} /> Ranking da multibola</div>
          {rank.map((r, i) => (
            <div className={"gr-rk" + (i === 0 ? " top" : "")} key={r.nome}>
              <span className="gr-rk-p">{i + 1}</span>
              <span className="gr-rk-n">{r.nome}</span>
              <span className="gr-rk-v">{r.voltas.join(" + ")}</span>
              <strong>{r.total}</strong>
            </div>))}
        </div>)}
    </div>);
}

/* ---------- painel: jogo com regra ---------- */
function PainelJogo({ jogadores, jogo, setJogo, regra, setRegra }) {
  if (jogadores.length < 2) return <div className="gr-falta">Precisa de pelo menos 2 nomes.</div>;
  /* Se alguém entrou ou saiu depois da fila montada, a fila não vale mais:
     é melhor remontar do que jogar com um nome que foi embora. */
  const elencoOk = jogo && [...jogo.mesa, ...jogo.fila].length === jogadores.length
    && [...jogo.mesa, ...jogo.fila].every(j => jogadores.includes(j));

  if (!elencoOk) return (
    <div className="gr-painel">
      <button className="gr-prox" onClick={() => setJogo({
        mesa: jogadores.slice(0, 2), fila: jogadores.slice(2),
        seguidas: 0, campeao: null, pontos: {}, pendente: null,
      })}>{jogo ? "Remontar a fila" : "Montar a fila"} <ChevronRight size={16} /></button>
      {jogo && <p className="gr-nota">A lista de jogadores mudou — a fila precisa ser refeita. O placar recomeça.</p>}
    </div>);

  const venceu = (v) => {
    const r = proximoJogo(jogo, v);
    const pontos = { ...jogo.pontos, [v]: (jogo.pontos[v] || 0) + 2 };
    setJogo({ ...jogo, ...r, pontos, pendente: r.perdedor || null });
  };
  const bonus = (sim) => {
    const p = jogo.pendente;
    const pontos = sim ? { ...jogo.pontos, [p]: (jogo.pontos[p] || 0) + 1 } : jogo.pontos;
    setJogo({ ...jogo, pontos, pendente: null });
  };
  const placar = jogadores.map(j => ({ nome: j, pts: jogo.pontos[j] || 0 })).sort((a, b) => b.pts - a.pts);

  return (
    <div className="gr-painel">
      <div className="gr-regras-sel">
        {REGRAS_JOGO.opcoes.map(o => (
          <button key={o.id} className={"gr-reg" + (regra === o.id ? " on" : "")} onClick={() => setRegra(o.id)}>
            <strong>{o.nome}</strong><span>{o.texto}</span></button>))}
      </div>

      <div className="gr-duelo">
        {jogo.mesa.map(j => (
          <button className="gr-duelista" key={j} disabled={!!jogo.pendente} onClick={() => venceu(j)}>
            <span className="gr-duel-n">{j}</span>
            {jogo.campeao === j && <em className="gr-seq">{jogo.seguidas} seguida{jogo.seguidas > 1 ? "s" : ""}</em>}
            <span className="gr-duel-b"><Trophy size={12} /> Ganhou</span>
          </button>))}
      </div>

      {jogo.pendente && (
        <div className="gr-bonus">
          <span><strong>{jogo.pendente}</strong> cumpriu a regra a partida inteira?</span>
          <div>
            <button className="mini-btn" onClick={() => bonus(true)}><Check size={13} /> Sim, +1</button>
            <button className="mini-btn ghost" onClick={() => bonus(false)}>Não</button>
          </div>
        </div>)}

      {jogo.fila.length > 0 && (
        <div className="gr-fila"><span className="gr-fila-l">Fila</span>
          {jogo.fila.map((j, i) => <span className="gr-fila-j" key={j}><b>{i + 1}</b>{j}</span>)}</div>)}

      <div className="gr-rank">
        <div className="section-eyebrow"><Trophy size={13} /> Placar do bloco</div>
        {placar.map((p, i) => (
          <div className={"gr-rk" + (i === 0 && p.pts > 0 ? " top" : "")} key={p.nome}>
            <span className="gr-rk-p">{i + 1}</span><span className="gr-rk-n">{p.nome}</span>
            <strong>{p.pts}</strong></div>))}
      </div>
      <p className="gr-nota">{REGRAS_JOGO.pontos} {REGRAS_JOGO.bonus}</p>
    </div>);
}

/* ---------- a aba ---------- */
function GrupoTab({ onTimer }) {
  const [s, setS] = useState(null);

  useEffect(() => { (async () => {
    setS({ ...VAZIO, ...((await store.get(CHAVE)) || {}) });
  })(); }, []);
  if (!s) return <div className="loading">Carregando o treino do grupo…</div>;

  const grava = (novo) => { const nx = { ...s, ...novo }; setS(nx); store.set(CHAVE, nx); };
  const { jogadores } = s;
  /* Sem gente não há rodízio para calcular. O aviso mora só no elenco: um
     "precisa de 2 nomes" repetido em cada bloco só empurrava o conteúdo
     para baixo sem dizer nada de novo. */
  const pronto = jogadores.length >= 2;

  const zerar = () => {
    if (!confirm("Zerar o dia?\n\nOs nomes continuam; o rodízio, os acertos da multibola e o placar do jogo voltam ao zero.")) return;
    grava({ voltas: {}, turno: 0, acertos: {}, jogo: null });
  };

  const rank = rankingMultibola(jogadores, s.acertos);

  return (
    <>
      <Hero tone="green" icon={<Users size={13} />} eyebrow="Treino em grupo"
        title="Uma mesa, o grupo inteiro treinando"
        sub={`${TOTAL_MIN} min de bola em 5 blocos. A tela calcula quem entra, quem sai e quem alimenta — ninguém fica parado olhando.`} />

      <Elenco jogadores={jogadores}
        onAdd={n => grava({ jogadores: [...jogadores, n] })}
        onRemove={n => grava({ jogadores: jogadores.filter(j => j !== n) })} />

      <Collapsible title="As três regras de casa" icon={<AlertTriangle size={15} />}
        sub="leia em voz alta antes de começar">
        {REGRAS_DE_CASA.map(r => (
          <div className="gr-regra" key={r.titulo}>
            <strong>{r.titulo}</strong><p>{r.texto}</p></div>))}
      </Collapsible>

      <SecTitle icon={<Clock size={13} />} n="1">A sessão, minuto a minuto</SecTitle>

      {BLOCOS.map((b, i) => (
        <div className="gr-bloco" key={b.id} style={{ "--c": b.cor }}>
          <div className="gr-bloco-head">
            <span className="gr-bloco-t">{b.de}–{b.ate}<em>min</em></span>
            <div className="gr-bloco-mid">
              <div className="gr-bloco-n">{b.nome}</div>
              <div className="gr-bloco-f">{b.formacao}</div>
            </div>
            <button className="mini-btn" style={{ background: b.cor }}
              onClick={() => onTimer(b.nome, b.min * 60)}><Play size={12} /> {b.min}min</button>
          </div>

          <p className="gr-bloco-r">{b.resumo}</p>
          <ol className="gr-passos">{b.comoRodar.map((x, k) => <li key={k}>{bold(x)}</li>)}</ol>

          {b.id === "regularidade" && (
            <div className="gr-drills">
              {DRILLS.map((d, k) => (
                <div className="gr-drill" key={d.nome}>
                  <div className="gr-drill-top"><span className="gr-drill-n">{k + 1}. {d.nome}</span>
                    <span className="gr-drill-m"><Target size={11} /> {d.meta}</span></div>
                  <p>{d.como}</p>
                  <p className="gr-drill-o"><Info size={12} /> {d.olho}</p>
                </div>))}
            </div>)}

          {pronto && b.painel === "diagonais" && (
            <PainelDiagonais bloco={b} jogadores={jogadores} onTimer={onTimer}
              volta={s.voltas[b.id] || 0}
              setVolta={v => grava({ voltas: { ...s.voltas, [b.id]: v } })} />)}

          {b.painel === "multibola" && (<>
            <Collapsible title="Como alimentar sem estragar o treino" icon={<Bot size={15} />} sub="o trabalho é ser previsível">
              <p className="gr-onde"><strong>Onde ficar: </strong>{GUIA_ALIMENTADOR.onde}</p>
              <ul className="clean-list">{GUIA_ALIMENTADOR.passos.map((x, k) => <li key={k}>{bold(x)}</li>)}</ul>
            </Collapsible>
            {pronto && <PainelMultibola jogadores={jogadores} onTimer={onTimer}
              turno={s.turno} setTurno={t => grava({ turno: t })}
              acertos={s.acertos} setAcerto={(k, v) => grava({ acertos: { ...s.acertos, [k]: v } })} />}
          </>)}

          {pronto && b.painel === "jogo" && (
            <PainelJogo jogadores={jogadores} jogo={s.jogo} setJogo={j => grava({ jogo: j })}
              regra={s.regra} setRegra={r => grava({ regra: r })} />)}

          {b.id === "fechamento" && rank.some(r => r.total > 0) && (
            <div className="gr-rank gr-rank-fim">
              <div className="section-eyebrow"><Trophy size={13} /> Para ler em voz alta</div>
              {rank.map((r, k) => (
                <div className={"gr-rk" + (k === 0 ? " top" : "")} key={r.nome}>
                  <span className="gr-rk-p">{k + 1}</span><span className="gr-rk-n">{r.nome}</span>
                  <span className="gr-rk-v">{r.voltas.join(" + ")}</span><strong>{r.total}</strong></div>))}
            </div>)}
        </div>))}

      <SecTitle icon={<AlertTriangle size={13} />} n="2">Quando o dia não sai como o planejado</SecTitle>
      <div className="gr-planob">
        {PLANO_B.map(p => (
          <div className="gr-pb" key={p.se}><span className="gr-pb-se">{p.se}</span><p>{p.entao}</p></div>))}
      </div>

      <button className="gr-zerar" onClick={zerar}><RotateCcw size={14} /> Zerar o dia</button>
    </>);
}

export { GrupoTab };
