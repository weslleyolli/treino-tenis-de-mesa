import React, { useState, useEffect } from "react";
import {
  Users, Plus, X, Trophy, Info, Target, ChevronRight, AlertTriangle,
  Check, Gauge, Layers, Flame, RotateCcw, Award,
} from "lucide-react";
import { bold, Hero, Collapsible, SecTitle } from "../components/ui.jsx";
import { storage as store } from "../lib/db.js";
import {
  CATEGORIAS, REGRAS, NIVEIS, FORMATOS, regrasPorCategoria, regraPorId,
  tabelaTodosContraTodos, totalPartidas, classificacao, regraDaVez, proximoJogo,
} from "../data/regras.js";

/* ============ ABA GRUPO: CAMPEONATO COM REGRA ============
   Campeonato normal não levanta o nível de ninguém. O que muda o jogo é uma
   regra que proíbe a saída fácil — e o grupo monta o campeonato escolhendo
   quais regras quer treinar.

   Numa mesa só jogam sempre dois, e quem está fora apita. Duas raquetes
   bastam para o dia inteiro, e é isso que faz este formato rodar quando o da
   sessão com diagonais e multibola não rodava.

   O conteúdo (as 23 regras, os formatos, a tabela) está em data/regras.js.
   Aqui mora só o estado do dia, gravado a cada toque: o celular fica na ponta
   da mesa o campeonato inteiro e não pode perder nada se a tela apagar. */

const CHAVE = "grupo:v2";
const VAZIO = { jogadores: [], escolhidas: [], formato: "todos", camp: null };
const TROCA_REI = 3;   // partidas até a regra girar no rei da mesa

/* ---------- elenco ---------- */
function Elenco({ jogadores, onAdd, onRemove, travado }) {
  const [nome, setNome] = useState("");
  const add = () => {
    const n = nome.trim();
    if (!n || jogadores.some(j => j.toLowerCase() === n.toLowerCase())) { setNome(""); return; }
    onAdd(n); setNome("");
  };
  return (
    <div className="gr-elenco">
      <div className="section-eyebrow"><Users size={13} /> Quem veio hoje</div>
      <div className="gr-nomes">
        {jogadores.map((j, i) => (
          <span className="gr-nome" key={j}><b>{i + 1}</b>{j}
            {!travado && <button onClick={() => onRemove(j)} aria-label={`Tirar ${j}`}><X size={13} /></button>}
          </span>))}
        {!jogadores.length && <span className="gr-vazio">Escreva os nomes para a tela montar a tabela.</span>}
      </div>
      {travado
        ? <p className="gr-nota">Campeonato em andamento — a lista só muda encerrando o campeonato.</p>
        : (<div className="gr-add">
            <input value={nome} placeholder="Nome" maxLength={18}
              onChange={e => setNome(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") add(); }} />
            <button className="mini-btn" onClick={add}><Plus size={14} /> Entrar</button>
          </div>)}
    </div>);
}

/* ---------- uma regra do acervo ---------- */
function CartaoRegra({ r, escolhida, onToggle }) {
  const niv = NIVEIS[r.nivel];
  return (
    <div className={"rg" + (escolhida ? " on" : "")}>
      <button className="rg-head" onClick={() => onToggle(r.id)}>
        <span className={"rg-check" + (escolhida ? " on" : "")}>{escolhida && <Check size={13} />}</span>
        <span className="rg-nome">{r.nome}</span>
        <span className="rg-niv" style={{ background: niv.cor }}>{r.nivel}</span>
      </button>
      <p className="rg-como">{r.como}</p>
      <p className="rg-juiz"><Gauge size={12} /><span><strong>O juiz marca assim: </strong>{r.juiz}</span></p>
      {r.placar && <p className="rg-placar"><Trophy size={12} /> {r.placar}</p>}
      {r.aviso && <p className="rg-aviso"><Info size={12} /> {r.aviso}</p>}
    </div>);
}

/* ---------- a regra que está valendo agora ---------- */
function RegraDaVez({ id, titulo }) {
  const r = id && regraPorId(id);
  if (!r) return (
    <div className="gr-regra-vez sem">
      <span className="rv-eyebrow">{titulo}</span>
      <strong>Sem regra — jogo normal</strong>
      <p>Escolha regras no acervo para o campeonato treinar alguma coisa.</p>
    </div>);
  const cat = CATEGORIAS.find(c => c.id === r.cat);
  return (
    <div className="gr-regra-vez" style={{ "--c": cat ? cat.cor : "var(--ball)" }}>
      <span className="rv-eyebrow">{titulo} · treina {cat ? cat.nome.toLowerCase() : "—"}</span>
      <strong>{r.nome}</strong>
      <p>{r.como}</p>
      <p className="rv-juiz"><Gauge size={12} /><span><strong>Juiz: </strong>{r.juiz}</span></p>
      {r.placar && <p className="rv-placar"><Trophy size={12} /> {r.placar}</p>}
    </div>);
}

/* ---------- lançar o resultado de uma partida ---------- */
function Partida({ par, res, onVencedor, onBonus, atual }) {
  const [a, b] = par;
  return (
    <div className={"pt" + (res ? " feita" : "") + (atual ? " atual" : "")}>
      <div className="pt-duelo">
        {par.map(j => (
          <button key={j} className={"pt-j" + (res && res.vencedor === j ? " venceu" : "")}
            onClick={() => onVencedor(j)}>
            {res && res.vencedor === j && <Trophy size={12} />}{j}
          </button>))}
      </div>
      {res && res.vencedor && (
        <div className="pt-bonus">
          <span>Cumpriu a regra (+1):</span>
          <div>{par.map(j => (
            <button key={j} className={"pt-b" + ((res.bonus || []).includes(j) ? " on" : "")}
              onClick={() => onBonus(j)}>{(res.bonus || []).includes(j) && <Check size={11} />}{j}</button>))}
          </div>
        </div>)}
    </div>);
}

/* ---------- classificação ---------- */
function Tabela({ jogadores, resultados, titulo }) {
  const cl = classificacao(jogadores, resultados);
  if (!cl.length) return null;
  return (
    <div className="gr-rank">
      <div className="section-eyebrow"><Trophy size={13} /> {titulo}</div>
      <div className="cl-head"><span /><span className="cl-n">Jogador</span>
        <span>V</span><span>D</span><span>R</span><span>Pts</span></div>
      {cl.map((r, i) => (
        <div className={"cl" + (i === 0 && r.pts > 0 ? " top" : "")} key={r.nome}>
          <span className="cl-p">{i + 1}</span>
          <span className="cl-n">{r.nome}</span>
          <span>{r.v}</span><span>{r.d}</span><span>{r.regra}</span>
          <strong>{r.pts}</strong>
        </div>))}
      <p className="gr-nota">V vitórias · D derrotas · R partidas em que cumpriu a regra · Pts = 2 por vitória + 1 por regra cumprida.</p>
    </div>);
}

/* ---------- campeonato: todos contra todos ---------- */
function TodosContraTodos({ camp, setCamp }) {
  const { jogadores, rodadas, escolhidas, resultados } = camp;
  const feita = (k) => resultados[k] && resultados[k].vencedor;
  /* A rodada "de agora" é a primeira que ainda tem partida em aberto: é o que
     o grupo quer ver ao pegar o celular, sem ter que procurar. */
  let iAtual = rodadas.findIndex((r, ri) => r.jogos.some((p, pi) => !feita(`r${ri}-${pi}`)));
  if (iAtual < 0) iAtual = rodadas.length - 1;
  const acabou = rodadas.every((r, ri) => r.jogos.every((p, pi) => feita(`r${ri}-${pi}`)));

  const lancar = (k, par, vencedor) => {
    const atual = resultados[k];
    const perdedor = par.find(j => j !== vencedor);
    /* Tocar de novo no mesmo vencedor desfaz o lançamento — é o jeito de
       corrigir o toque errado sem um botão de apagar em cada linha. */
    const novo = atual && atual.vencedor === vencedor
      ? undefined : { vencedor, perdedor, bonus: (atual && atual.bonus) || [] };
    const r = { ...resultados };
    if (novo) r[k] = novo; else delete r[k];
    setCamp({ ...camp, resultados: r });
  };
  const bonus = (k, nome) => {
    const atual = resultados[k]; if (!atual) return;
    const lista = atual.bonus || [];
    const nova = lista.includes(nome) ? lista.filter(x => x !== nome) : [...lista, nome];
    setCamp({ ...camp, resultados: { ...resultados, [k]: { ...atual, bonus: nova } } });
  };

  const total = totalPartidas(rodadas);
  const prontas = Object.values(resultados).filter(r => r && r.vencedor).length;

  return (<>
    <div className="gr-progresso">
      <span>{prontas} de {total} partidas</span>
      <div className="gr-track"><div className="gr-fill" style={{ width: (total ? (prontas / total) * 100 : 0) + "%" }} /></div>
    </div>
    {acabou && <div className="gr-fim"><Award size={15} /> Campeonato completo. A tabela abaixo é a final.</div>}

    {rodadas.map((rd, ri) => {
      const regraId = regraDaVez(escolhidas, ri);
      const aberta = ri === iAtual;
      return (
        <div className={"rd" + (aberta ? " aberta" : "")} key={ri}>
          <div className="rd-head">
            <span className="rd-n">Rodada {ri + 1}</span>
            {rd.juiz && <span className="rd-juiz"><Gauge size={11} /> apita: {rd.juiz}</span>}
          </div>
          {aberta && <RegraDaVez id={regraId} titulo={`Regra da rodada ${ri + 1}`} />}
          {!aberta && regraId && <div className="rd-regra">{regraPorId(regraId)?.nome || ""}</div>}
          {rd.jogos.map((par, pi) => {
            const k = `r${ri}-${pi}`;
            return <Partida key={k} par={par} res={resultados[k]} atual={aberta}
              onVencedor={(v) => lancar(k, par, v)} onBonus={(n) => bonus(k, n)} />;
          })}
        </div>);
    })}

    <Tabela jogadores={jogadores} resultados={resultados} titulo={acabou ? "Classificação final" : "Classificação"} />
  </>);
}

/* ---------- campeonato: rei da mesa ---------- */
function ReiDaMesa({ camp, setCamp }) {
  const { jogadores, escolhidas, resultados, rei } = camp;
  const nPartidas = Object.keys(resultados).length;
  const regraId = regraDaVez(escolhidas, Math.floor(nPartidas / TROCA_REI));
  const faltam = TROCA_REI - (nPartidas % TROCA_REI);
  const pendente = camp.pendente;

  const venceu = (v) => {
    const r = proximoJogo(rei, v);
    const k = `p${nPartidas}`;
    setCamp({
      ...camp, rei: { mesa: r.mesa, fila: r.fila, seguidas: r.seguidas, campeao: r.campeao },
      resultados: { ...resultados, [k]: { vencedor: v, perdedor: r.perdedor, bonus: [] } },
      pendente: { chave: k, par: [v, r.perdedor] },
    });
  };
  const bonus = (nome) => {
    const k = pendente.chave, atual = resultados[k]; if (!atual) return;
    const lista = atual.bonus || [];
    const nova = lista.includes(nome) ? lista.filter(x => x !== nome) : [...lista, nome];
    setCamp({ ...camp, resultados: { ...resultados, [k]: { ...atual, bonus: nova } } });
  };

  return (<>
    <RegraDaVez id={regraId} titulo={`Regra valendo · troca em ${faltam} partida${faltam > 1 ? "s" : ""}`} />

    <div className="gr-duelo">
      {rei.mesa.map(j => (
        <button className="gr-duelista" key={j} disabled={!!pendente} onClick={() => venceu(j)}>
          <span className="gr-duel-n">{j}</span>
          {rei.campeao === j && <em className="gr-seq">{rei.seguidas} seguida{rei.seguidas > 1 ? "s" : ""}</em>}
          <span className="gr-duel-b"><Trophy size={12} /> Ganhou</span>
        </button>))}
    </div>

    {pendente && (
      <div className="gr-bonus">
        <span>Quem cumpriu a regra a partida inteira? <em>(+1 cada, mesmo perdendo)</em></span>
        <div className="pt-bonus-b">
          {pendente.par.filter(Boolean).map(j => (
            <button key={j} className={"pt-b" + ((resultados[pendente.chave]?.bonus || []).includes(j) ? " on" : "")}
              onClick={() => bonus(j)}>{(resultados[pendente.chave]?.bonus || []).includes(j) && <Check size={11} />}{j}</button>))}
        </div>
        <button className="gr-prox" onClick={() => setCamp({ ...camp, pendente: null })}>
          Próxima partida <ChevronRight size={16} /></button>
      </div>)}

    {rei.fila.length > 0 && (
      <div className="gr-fila"><span className="gr-fila-l">Fila</span>
        {rei.fila.map((j, i) => (
          <span className={"gr-fila-j" + (i === 0 ? " apita" : "")} key={j}>
            <b>{i + 1}</b>{j}{i === 0 && <em>apita</em>}</span>))}
      </div>)}

    <Tabela jogadores={jogadores} resultados={resultados} titulo={`Classificação · ${nPartidas} partida${nPartidas === 1 ? "" : "s"}`} />
  </>);
}

/* ---------- a aba ---------- */
function GrupoTab() {
  const [s, setS] = useState(null);
  useEffect(() => { (async () => { setS({ ...VAZIO, ...((await store.get(CHAVE)) || {}) }); })(); }, []);
  if (!s) return <div className="loading">Carregando o campeonato…</div>;

  const grava = (novo) => { const nx = { ...s, ...novo }; setS(nx); store.set(CHAVE, nx); };
  const { jogadores, escolhidas, formato, camp } = s;
  const fmt = FORMATOS.find(f => f.id === formato) || FORMATOS[0];
  const podeComecar = jogadores.length >= fmt.minJog;

  const toggleRegra = (id) => grava({
    escolhidas: escolhidas.includes(id) ? escolhidas.filter(x => x !== id) : [...escolhidas, id] });

  const comecar = () => {
    const base = { formato, jogadores: [...jogadores], escolhidas: [...escolhidas], resultados: {}, pendente: null };
    grava({ camp: formato === "todos"
      ? { ...base, rodadas: tabelaTodosContraTodos(jogadores) }
      : { ...base, rei: { mesa: jogadores.slice(0, 2), fila: jogadores.slice(2), seguidas: 0, campeao: null } } });
  };
  const encerrar = () => {
    if (!confirm("Encerrar o campeonato?\n\nOs resultados são apagados e a lista de jogadores volta a ser editável.")) return;
    grava({ camp: null });
  };

  /* ---- campeonato em andamento: a tela é só ele ---- */
  if (camp) {
    const f = FORMATOS.find(x => x.id === camp.formato) || FORMATOS[0];
    return (
      <>
        <Hero tone="purple" icon={<Trophy size={13} />} eyebrow={`Campeonato · ${f.nome}`}
          title="Valendo" sub={`${camp.jogadores.length} jogadores · ${camp.escolhidas.length} regra${camp.escolhidas.length === 1 ? "" : "s"} no rodízio`} />
        <Elenco jogadores={camp.jogadores} travado />
        {camp.formato === "todos"
          ? <TodosContraTodos camp={camp} setCamp={c => grava({ camp: c })} />
          : <ReiDaMesa camp={camp} setCamp={c => grava({ camp: c })} />}
        <button className="gr-zerar" onClick={encerrar}><RotateCcw size={14} /> Encerrar o campeonato</button>
      </>);
  }

  /* ---- montagem ---- */
  return (
    <>
      <Hero tone="purple" icon={<Trophy size={13} />} eyebrow="Campeonato com regra"
        title="Campeonato que treina alguma coisa"
        sub="Campeonato normal não levanta o nível de ninguém. Escolha as regras, monte o campeonato, e a tela cuida da tabela, do juiz e do placar." />

      <div className="gr-raquete"><Info size={15} />
        <span><strong>Duas raquetes bastam. </strong>Numa mesa só jogam sempre dois — quem está fora apita, e juiz não precisa de raquete.</span></div>

      <Elenco jogadores={jogadores}
        onAdd={n => grava({ jogadores: [...jogadores, n] })}
        onRemove={n => grava({ jogadores: jogadores.filter(j => j !== n) })} />

      <SecTitle icon={<Layers size={13} />} n="1">O acervo de regras</SecTitle>
      <p className="gr-intro">
        {REGRAS.length} regras. Cada uma proíbe uma saída fácil — aquela que você usa quando a bola
        fica difícil e que é justamente a que precisa sumir. O número na ponta é o nível:
        <strong> 1</strong> dá para jogar hoje, <strong>2</strong> exige atenção,
        <strong> 3</strong> vira outro jogo por uns minutos.
      </p>

      {CATEGORIAS.map(c => {
        const lista = regrasPorCategoria(c.id);
        const n = lista.filter(r => escolhidas.includes(r.id)).length;
        return (
          <Collapsible key={c.id} title={c.nome} icon={<Target size={15} />}
            sub={n ? `${n} escolhida${n === 1 ? "" : "s"} de ${lista.length}` : `${lista.length} regras`}>
            <p className="gr-alvo">Treina: {c.alvo}.</p>
            {lista.map(r => (
              <CartaoRegra key={r.id} r={r} escolhida={escolhidas.includes(r.id)} onToggle={toggleRegra} />))}
          </Collapsible>);
      })}

      <SecTitle icon={<Flame size={13} />} n="2">Montar o campeonato</SecTitle>
      <div className="gr-formatos">
        {FORMATOS.map(f => (
          <button key={f.id} className={"gr-fmt" + (formato === f.id ? " on" : "")} onClick={() => grava({ formato: f.id })}>
            <strong>{f.nome}</strong>
            <span>{f.resumo}</span>
            {formato === f.id && <ul className="clean-list">{f.detalhe.map((d, i) => <li key={i}>{bold(d)}</li>)}</ul>}
          </button>))}
      </div>

      <div className="gr-pronto">
        <div className="gr-pronto-l">
          <span><strong>{jogadores.length}</strong> jogador{jogadores.length === 1 ? "" : "es"}</span>
          <span><strong>{escolhidas.length}</strong> regra{escolhidas.length === 1 ? "" : "s"}</span>
          {formato === "todos" && jogadores.length >= fmt.minJog &&
            <span><strong>{totalPartidas(tabelaTodosContraTodos(jogadores))}</strong> partidas</span>}
        </div>
        <button className="gr-prox" disabled={!podeComecar} onClick={comecar}>
          Começar o campeonato <ChevronRight size={16} /></button>
        {!podeComecar && <p className="gr-nota">Precisa de pelo menos {fmt.minJog} jogadores para este formato.</p>}
        {podeComecar && !escolhidas.length && <p className="gr-nota">Sem regra escolhida vira campeonato normal — dá para começar assim, mas aí não treina nada.</p>}
      </div>
    </>);
}

export { GrupoTab };
