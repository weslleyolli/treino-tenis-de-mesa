import React, { useState, useEffect } from "react";
import { Cloud, CloudOff, RefreshCw, Check, X, AlertTriangle } from "lucide-react";
import { lerChave, gravarChave, testarChave, sincronizar, assinar } from "../lib/sync.js";

const MOTIVOS = {
  "sem-chave": "Informe a senha para sincronizar.",
  "senha-invalida": "Senha incorreta.",
  "nao-configurado": "O servidor ainda não tem a senha configurada (SYNC_KEY no Netlify).",
};
const explicar = (m) => MOTIVOS[m] || "Não consegui falar com o servidor. Seus dados seguem salvos neste aparelho.";

function quando(t) {
  if (!t) return "nunca";
  const min = Math.round((Date.now() - t) / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  return new Date(t).toLocaleDateString("pt-BR");
}

function SyncBadge({ onSynced }) {
  const [est, setEst] = useState({ fase: "ocioso", erro: null, em: 0 });
  const [aberto, setAberto] = useState(false);
  const [senha, setSenha] = useState("");
  const [testando, setTestando] = useState(false);
  const [aviso, setAviso] = useState(null);

  useEffect(() => assinar(setEst), []);

  const temChave = !!lerChave();
  const icone = est.fase === "sincronizando" ? <RefreshCw size={15} className="girando" />
    : est.fase === "erro" ? <AlertTriangle size={15} />
      : temChave ? <Cloud size={15} /> : <CloudOff size={15} />;
  const tom = est.fase === "erro" ? " ruim" : est.fase === "ok" ? " bom" : temChave ? "" : " off";

  const salvar = async () => {
    const v = senha.trim();
    if (!v) return;
    setTestando(true); setAviso(null);
    const r = await testarChave(v);
    setTestando(false);
    if (!r.ok) { setAviso(explicar(r.motivo)); return; }
    setSenha("");
    const { mudou } = await sincronizar();
    setAviso(null);
    if (mudou && mudou.length && onSynced) onSynced();
  };

  const agora = async () => {
    const { mudou, erro } = await sincronizar();
    if (erro) setAviso(explicar(erro));
    else if (mudou && mudou.length && onSynced) onSynced();
  };

  const desligar = () => { gravarChave(""); setAviso(null); setAberto(false); window.location.reload(); };

  return (
    <>
      <button className={"syncbtn" + tom} onClick={() => setAberto(true)}
        aria-label="Sincronização" title="Sincronização">{icone}</button>

      {aberto && (
        <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) setAberto(false); }}>
          <div className="modal-cx" role="dialog" aria-label="Sincronização">
            <div className="modal-top">
              <h3>Sincronizar aparelhos</h3>
              <button className="modal-x" onClick={() => setAberto(false)} aria-label="Fechar"><X size={18} /></button>
            </div>

            {temChave ? (
              <>
                <p className="modal-p">
                  Campeonatos, ranking e treino ficam guardados na nuvem e chegam nos seus outros aparelhos.
                </p>
                <div className="synclinha">
                  <span className={"syncdot" + tom} />
                  {est.fase === "erro" ? explicar(est.erro) : `Última sincronização ${quando(est.em)}`}
                </div>
                {aviso && <div className="warnbox" style={{ marginTop: 10 }}><AlertTriangle size={15} /><span>{aviso}</span></div>}
                <button className="bigbtn" onClick={agora} disabled={est.fase === "sincronizando"}>
                  <RefreshCw size={16} /> {est.fase === "sincronizando" ? "Sincronizando…" : "Sincronizar agora"}
                </button>
                <button className="linkbtn" onClick={desligar}>Desconectar este aparelho</button>
              </>
            ) : (
              <>
                <p className="modal-p">
                  Digite a senha combinada do grupo. Ela fica guardada só neste aparelho e libera o acesso aos
                  campeonatos e ao ranking em qualquer celular ou notebook.
                </p>
                <div className="fld">
                  <label htmlFor="senha-sync">Senha</label>
                  <input id="senha-sync" type="password" value={senha} autoComplete="current-password"
                    placeholder="senha do grupo" onChange={(e) => setSenha(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") salvar(); }} />
                </div>
                {aviso && <div className="warnbox"><AlertTriangle size={15} /><span>{aviso}</span></div>}
                <button className="bigbtn" onClick={salvar} disabled={testando || !senha.trim()}>
                  <Check size={16} /> {testando ? "Conferindo…" : "Conectar"}
                </button>
                <p className="modal-nota">Sem senha o app continua funcionando normalmente, só que os dados ficam
                  guardados apenas neste aparelho.</p>
              </>
            )}
          </div>
        </div>)}
    </>);
}

export { SyncBadge };
