import React, { useState, useEffect } from "react";
import {
  Users, Plus, X, Trophy, Info, Target, ChevronRight, AlertTriangle,
  Check, Gauge, Layers, Flame, RotateCcw, Award, ChevronDown, HelpCircle, Ban, Undo2, Plus as Mais,
} from "lucide-react";
import { bold, Hero, Collapsible, SecTitle } from "../components/ui.jsx";
import { storage as store } from "../lib/db.js";
import {
  CATEGORIAS, REGRAS, NIVEIS, FORMATOS, regrasPorCategoria, regraPorId,
  montarBlocos, totalPartidas, chaveDaPartida, classificacao, regraDaVez, proximoJogo,
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
const VAZIO = { jogadores: [], escolhidas: [], formato: "porregra", camp: null };
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

/* ---------- o corpo de uma regra ----------
   Os mesmos campos servem o acervo (antes do jogo) e a regra que está
   valendo (durante), porque é a mesma pergunta nos dois momentos: como
   funciona, quando vale, o que acontece se quebrar, e o que o juiz olha. */
function RegraCorpo({ r }) {
  return (<>
    <ol className="rc-passos">{r.comoFunciona.map((x, i) => <li key={i}>{x}</li>)}</ol>
    <div className="rc-linhas">
      <p className="rc-l"><span>Vale</span>{r.vale}</p>
      <p className="rc-l pun"><Ban size={12} /><span className="rc-lb">Se quebrar</span>{r.punicao}</p>
      <p className="rc-l juiz"><Gauge size={12} /><span className="rc-lb">Juiz</span>{r.juiz}</p>
      {r.placar && <p className="rc-l placar"><Trophy size={12} />{r.placar}</p>}
    </div>
    {r.aviso && <p className="rc-aviso"><Info size={12} /><span>{r.aviso}</span></p>}
  </>);
}

/* As dúvidas são o que impede o campeonato de parar para discutir: são os
   casos de borda já decididos, à mão, antes de alguém precisar deles. */
function Duvidas({ lista }) {
  const [aberto, setAberto] = useState(false);
  if (!lista || !lista.length) return null;
  return (
    <div className="dv">
      <button className="dv-head" onClick={() => setAberto(a => !a)}>
        <HelpCircle size={13} />
        <span>Combinado antes · {lista.length} dúvida{lista.length === 1 ? "" : "s"}</span>
        <ChevronDown size={15} className={"chev" + (aberto ? " open" : "")} />
      </button>
      {aberto && (
        <div className="dv-body">
          {lista.map((d, i) => (
            <div className="dv-i" key={i}>
              <p className="dv-p">{d.p}</p>
              <p className="dv-r">{d.r}</p>
            </div>))}
        </div>)}
    </div>);
}

/* ---------- uma regra do acervo ---------- */
function CartaoRegra({ r, escolhida, onToggle }) {
  const [aberto, setAberto] = useState(false);
  const niv = NIVEIS[r.nivel];
  return (
    <div className={"rg" + (escolhida ? " on" : "")}>
      <button className="rg-head" onClick={() => onToggle(r.id)}>
        <span className={"rg-check" + (escolhida ? " on" : "")}>{escolhida && <Check size={13} />}</span>
        <span className="rg-nome">{r.nome}</span>
        <span className="rg-niv" style={{ background: niv.cor }} title={niv.nome}>{r.nivel}</span>
      </button>
      <p className="rg-resumo">{r.resumo}</p>
      {/* O detalhe fica fechado: com 32 regras, o acervo aberto viraria uma
          parede de texto e ninguém acharia nada. */}
      <button className="rg-mais" onClick={() => setAberto(a => !a)}>
        {aberto ? "Menos" : "Como funciona, e as dúvidas"}
        <ChevronDown size={14} className={"chev" + (aberto ? " open" : "")} />
      </button>
      {aberto && <div className="rg-det"><RegraCorpo r={r} /><Duvidas lista={r.duvidas} /></div>}
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
      <p className="rv-resumo">{r.resumo}</p>
      <RegraCorpo r={r} />
      <Duvidas lista={r.duvidas} />
    </div>);
}

/* ---------- placar ao vivo da partida que está rolando ----------
   Ponto normal soma 1; ponto feito seguindo a regra soma 2. É isso que faz
   a regra valer a pena dentro da partida, e não só no discurso: quem executa
   o que a regra pede ganha em metade dos pontos do adversário.

   O histórico existe só para o desfazer. Numa mesa com o grupo em volta,
   toque errado acontece o tempo todo, e sem desfazer o placar vira briga. */
function Placar({ par, res, onMarcar, onDesfazer, onEncerrar }) {
  const pts = res?.placar || {};
  const reg = res?.naRegra || {};
  const [a, b] = par;
  const pa = pts[a] || 0, pb = pts[b] || 0;
  const temHist = !!(res?.hist && res.hist.length);
  return (
    <div className="plc">
      <div className="plc-linha">
        {par.map((j) => (
          <div className="plc-j" key={j}>
            <span className="plc-n">{j}</span>
            <span className="plc-p">{pts[j] || 0}</span>
            <span className={"plc-r" + (reg[j] ? "" : " zero")}>{reg[j] || 0} na regra</span>
            <div className="plc-btns">
              <button className="plc-b1" onClick={() => onMarcar(j, 1)}>
                <Mais size={12} />1</button>
              <button className="plc-b2" onClick={() => onMarcar(j, 2)}>
                <Mais size={12} />2 <em>na regra</em></button>
            </div>
          </div>))}
      </div>
      <div className="plc-pe">
        <button className="plc-desf" disabled={!temHist} onClick={onDesfazer}>
          <Undo2 size={13} /> Desfazer</button>
        <button className="plc-fim" disabled={pa === pb}
          onClick={() => onEncerrar(pa > pb ? a : b)}>
          {pa === pb
            ? (pa === 0 ? "Marque os pontos" : "Empate: não dá para encerrar")
            : <><Check size={14} /> Encerrar: {pa > pb ? a : b} venceu</>}
        </button>
      </div>
    </div>);
}

/* ---------- uma partida da tabela ---------- */
function Partida({ par, res, atual, onVencedor, onBonus, placarProps }) {
  const feita = res && res.vencedor;
  const temPlacar = res && res.placar && Object.keys(res.placar).length;
  return (
    <div className={"pt" + (feita ? " feita" : "") + (atual && !feita ? " atual" : "")}>
      {atual && !feita
        ? <Placar par={par} res={res} {...placarProps} />
        : (<div className="pt-duelo">
            {par.map(j => (
              <button key={j} className={"pt-j" + (feita && res.vencedor === j ? " venceu" : "")}
                onClick={() => onVencedor(j)}>
                {feita && res.vencedor === j && <Trophy size={12} />}{j}
                {temPlacar && <em className="pt-pl">{res.placar[j] || 0}</em>}
              </button>))}
          </div>)}
      {feita && (
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
        <span>V</span><span>D</span><span title="partidas em que cumpriu a regra">R</span>
        <span title="pontos feitos na regra">PR</span><span>Pts</span></div>
      {cl.map((r, i) => (
        <div className={"cl" + (i === 0 && r.pts > 0 ? " top" : "")} key={r.nome}>
          <span className="cl-p">{i + 1}</span>
          <span className="cl-n">{r.nome}</span>
          <span>{r.v}</span><span>{r.d}</span><span>{r.regra}</span>
          <span className="cl-pr">{r.pr}</span><strong>{r.pts}</strong>
        </div>))}
      <p className="gr-nota">V vitórias · D derrotas · R partidas em que cumpriu a regra ·
        PR pontos feitos na regra · Pts = 2 por vitória + 1 por regra cumprida.
        PR não entra nos pontos: ele já se paga dentro da partida, onde vale 2.</p>
    </div>);
}

/* ---------- campeonato em tabela (os dois formatos) ----------
   Desenha blocos. No formato "todos" cada bloco é uma rodada com a sua
   regra; no "porregra" cada bloco é uma regra com o rodízio inteiro. */
function Tabelado({ camp, setCamp }) {
  const { jogadores, blocos, resultados } = camp;
  const feita = (k) => resultados[k] && resultados[k].vencedor;

  /* A partida "de agora" é a primeira ainda em aberto: é o que o grupo quer
     ver ao pegar o celular, e é a única que ganha o placar ao vivo — porque
     é uma mesa só, e só uma partida acontece por vez. */
  let atual = null;
  blocos.forEach((bl, bi) => bl.rodadas.forEach((rd, ri) => rd.jogos.forEach((par, pi) => {
    if (!atual && !feita(chaveDaPartida(bi, ri, pi))) atual = chaveDaPartida(bi, ri, pi);
  })));
  const acabou = !atual;

  const gravar = (k, valor) => {
    const r = { ...resultados };
    if (valor) r[k] = valor; else delete r[k];
    setCamp({ ...camp, resultados: r });
  };
  const marcar = (k, jogador, valor) => {
    const at = resultados[k] || { placar: {}, naRegra: {}, hist: [] };
    gravar(k, {
      ...at,
      placar: { ...at.placar, [jogador]: (at.placar[jogador] || 0) + valor },
      naRegra: valor === 2
        ? { ...at.naRegra, [jogador]: (at.naRegra[jogador] || 0) + 1 }
        : { ...at.naRegra },
      hist: [...(at.hist || []), { j: jogador, v: valor }],
    });
  };
  const desfazer = (k) => {
    const at = resultados[k]; if (!at || !at.hist || !at.hist.length) return;
    const hist = [...at.hist], ult = hist.pop();
    const placar = { ...at.placar, [ult.j]: Math.max(0, (at.placar[ult.j] || 0) - ult.v) };
    const naRegra = { ...at.naRegra };
    if (ult.v === 2) naRegra[ult.j] = Math.max(0, (naRegra[ult.j] || 0) - 1);
    gravar(k, hist.length || Object.values(placar).some(Boolean)
      ? { ...at, placar, naRegra, hist } : undefined);
  };
  const encerrar = (k, par, vencedor) => {
    const at = resultados[k] || {};
    gravar(k, { ...at, vencedor, perdedor: par.find(j => j !== vencedor), bonus: at.bonus || [] });
  };
  /* Nas partidas já lançadas, tocar no mesmo vencedor desfaz; tocar no outro
     troca e mantém o bônus, que não depende de quem ganhou. */
  const lancar = (k, par, vencedor) => {
    const at = resultados[k];
    if (at && at.vencedor === vencedor) {
      const { vencedor: _v, perdedor: _p, ...resto } = at;
      gravar(k, Object.keys(resto.placar || {}).length ? resto : undefined);
    } else encerrar(k, par, vencedor);
  };
  const bonus = (k, nome) => {
    const at = resultados[k]; if (!at) return;
    const lista = at.bonus || [];
    gravar(k, { ...at, bonus: lista.includes(nome) ? lista.filter(x => x !== nome) : [...lista, nome] });
  };

  const total = totalPartidas(blocos);
  const prontas = Object.values(resultados).filter(r => r && r.vencedor).length;
  const porRegra = camp.formato === "porregra";

  return (<>
    <div className="gr-progresso">
      <span>{prontas} de {total} partidas</span>
      <div className="gr-track"><div className="gr-fill" style={{ width: (total ? (prontas / total) * 100 : 0) + "%" }} /></div>
    </div>
    {acabou && <div className="gr-fim"><Award size={15} /> Campeonato completo. A tabela abaixo é a final.</div>}

    {blocos.map((bl, bi) => {
      const abertoAqui = atual && atual.startsWith(`b${bi}-`);
      const nPart = bl.rodadas.reduce((a, r) => a + r.jogos.length, 0);
      const nFeitas = bl.rodadas.reduce((a, r, ri) =>
        a + r.jogos.filter((_, pi) => feita(chaveDaPartida(bi, ri, pi))).length, 0);
      return (
        <div className={"rd" + (abertoAqui ? " aberta" : "")} key={bi}>
          <div className="rd-head">
            <span className="rd-n">{porRegra ? `Regra ${bi + 1}` : `Rodada ${bi + 1}`}</span>
            <span className="rd-cont">{nFeitas}/{nPart}</span>
          </div>
          {abertoAqui
            ? <RegraDaVez id={bl.regraId} titulo={porRegra ? "Regra deste rodízio" : `Regra da rodada ${bi + 1}`} />
            : <div className="rd-regra">{bl.regraId ? (regraPorId(bl.regraId)?.nome || "") : "sem regra"}</div>}

          {bl.rodadas.map((rd, ri) => (
            <div className="rdz" key={ri}>
              {porRegra && (
                <div className="rdz-head"><span>Rodada {ri + 1}</span>
                  {rd.juiz && <span className="rd-juiz"><Gauge size={11} /> apita: {rd.juiz}</span>}</div>)}
              {!porRegra && rd.juiz && (
                <div className="rdz-head"><span /><span className="rd-juiz"><Gauge size={11} /> apita: {rd.juiz}</span></div>)}
              {rd.jogos.map((par, pi) => {
                const k = chaveDaPartida(bi, ri, pi);
                return <Partida key={k} par={par} res={resultados[k]} atual={k === atual}
                  onVencedor={(v) => lancar(k, par, v)} onBonus={(n) => bonus(k, n)}
                  placarProps={{
                    onMarcar: (j, v) => marcar(k, j, v),
                    onDesfazer: () => desfazer(k),
                    onEncerrar: (v) => encerrar(k, par, v),
                  }} />;
              })}
            </div>))}
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

/* Um campeonato gravado antes dos blocos guardava `rodadas` soltas, com a
   regra saindo do índice da rodada, e as chaves das partidas em outro
   formato. Converter é barato; largar alguém no meio de um campeonato por
   causa de uma mudança de formato, não. */
function migrar(camp) {
  if (!camp || camp.formato === "rei" || camp.blocos) return camp;
  const rodadas = camp.rodadas || [];
  const blocos = rodadas.map((rd, i) => ({ regraId: regraDaVez(camp.escolhidas || [], i), rodadas: [rd] }));
  const resultados = {};
  Object.entries(camp.resultados || {}).forEach(([k, v]) => {
    const m = /^r(\d+)-(\d+)$/.exec(k);
    resultados[m ? chaveDaPartida(Number(m[1]), 0, Number(m[2])) : k] = v;
  });
  const { rodadas: _r, ...resto } = camp;
  return { ...resto, blocos, resultados };
}

/* ---------- a aba ---------- */
function GrupoTab() {
  const [s, setS] = useState(null);
  useEffect(() => { (async () => {
    const g = { ...VAZIO, ...((await store.get(CHAVE)) || {}) };
    /* O acervo cresce e muda entre versões do app. Uma regra gravada que não
       existe mais viraria um buraco no rodízio ("sem regra") no meio do
       campeonato, então ela é descartada na entrada. */
    g.escolhidas = (g.escolhidas || []).filter(id => regraPorId(id));
    if (g.camp) g.camp = migrar({ ...g.camp, escolhidas: (g.camp.escolhidas || []).filter(id => regraPorId(id)) });
    setS(g);
  })(); }, []);
  if (!s) return <div className="loading">Carregando o campeonato…</div>;

  const grava = (novo) => { const nx = { ...s, ...novo }; setS(nx); store.set(CHAVE, nx); };
  const { jogadores, escolhidas, formato, camp } = s;
  const fmt = FORMATOS.find(f => f.id === formato) || FORMATOS[0];
  const podeComecar = jogadores.length >= fmt.minJog;

  const toggleRegra = (id) => grava({
    escolhidas: escolhidas.includes(id) ? escolhidas.filter(x => x !== id) : [...escolhidas, id] });

  const comecar = () => {
    const base = { formato, jogadores: [...jogadores], escolhidas: [...escolhidas], resultados: {}, pendente: null };
    grava({ camp: formato === "rei"
      ? { ...base, rei: { mesa: jogadores.slice(0, 2), fila: jogadores.slice(2), seguidas: 0, campeao: null } }
      : { ...base, blocos: montarBlocos(formato, jogadores, escolhidas) } });
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
        {camp.formato === "rei"
          ? <ReiDaMesa camp={camp} setCamp={c => grava({ camp: c })} />
          : <Tabelado camp={camp} setCamp={c => grava({ camp: c })} />}
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
        {REGRAS.length} regras em {CATEGORIAS.length} frentes. Cada uma proíbe uma saída fácil — aquela que
        você usa quando a bola fica difícil e que é justamente a que precisa sumir. Abra qualquer
        uma para ver o passo a passo, o que o juiz olha e as dúvidas que vão aparecer na mesa, já
        respondidas. O número na ponta é o nível: <strong>1</strong> dá para jogar hoje,
        <strong> 2</strong> exige atenção, <strong>3</strong> vira outro jogo por uns minutos.
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
          {formato !== "rei" && jogadores.length >= fmt.minJog &&
            <span><strong>{totalPartidas(montarBlocos(formato, jogadores, escolhidas))}</strong> partidas</span>}
        </div>
        <button className="gr-prox" disabled={!podeComecar} onClick={comecar}>
          Começar o campeonato <ChevronRight size={16} /></button>
        {!podeComecar && <p className="gr-nota">Precisa de pelo menos {fmt.minJog} jogadores para este formato.</p>}
        {podeComecar && !escolhidas.length && <p className="gr-nota">Sem regra escolhida vira campeonato normal — dá para começar assim, mas aí não treina nada.</p>}
      </div>
    </>);
}

export { GrupoTab };
