import { useState, useEffect, useCallback, useRef } from "react";
import puzzle1 from "./assets/puzzle1.jpg";
import puzzle2 from "./assets/puzzle2.jpg";
import puzzle3 from "./assets/puzzle3.jpg";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  :root {
    --bg:#0a0a0f; --surface:#111118; --surface2:#1a1a24; --border:#2a2a3a;
    --amber:#f5a623; --amber-dim:#c07a10; --amber-glow:rgba(245,166,35,0.15);
    --red:#e05555; --green:#4ecb8d; --text:#e8e4d8; --text-dim:#8a8578; --text-muted:#4a4840; --paper:#f5f0e8;
  }
  html,body,#root { height:100%; background:var(--bg); color:var(--text); font-family:'Space Mono',monospace; overflow-x:hidden; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shake  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
  @keyframes ping   { 0%{transform:scale(1);opacity:1} 75%,100%{transform:scale(2.4);opacity:0} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  @keyframes pulseAmber { 0%,100%{box-shadow:0 0 0 0 var(--amber-glow)} 50%{box-shadow:0 0 24px 8px var(--amber-glow)} }
  @keyframes float  { 0%,100%{transform:translateY(0) rotate(0.7deg)} 50%{transform:translateY(-7px) rotate(0.7deg)} }
  @keyframes glowPulse { 0%,100%{opacity:0.55} 50%{opacity:1} }
  @keyframes badgeIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
  .anim-fade-up  { animation:fadeUp 0.4s ease both; }
  .anim-shake    { animation:shake 0.5s ease; }
  .anim-float    { animation:float 4s ease-in-out infinite; }
  .anim-glow     { animation:glowPulse 2s ease-in-out infinite; }
  .anim-pulse-amb{ animation:pulseAmber 2s ease-in-out infinite; }
  .anim-badge-in { animation:badgeIn 0.35s cubic-bezier(.34,1.56,.64,1) both; }
  .paper-card { background:var(--paper); color:#1a1208; border-radius:8px; padding:22px 20px 22px 24px;
    position:relative; overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.3); }
  .paper-card::before { content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(transparent,transparent 27px,rgba(0,0,0,0.055) 27px,rgba(0,0,0,0.055) 28px); }
  .paper-card .accent-bar { position:absolute; left:0; top:0; bottom:0; width:5px;
    background:linear-gradient(180deg,var(--amber),var(--amber-dim)); }
  .surface-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:18px 16px; }
  .btn-primary { width:100%; background:var(--amber); color:#0a0808; border:none; border-radius:10px;
    padding:16px; font-family:'Space Mono',monospace; font-size:11px; font-weight:700;
    letter-spacing:.2em; text-transform:uppercase; cursor:pointer; transition:all .15s;
    box-shadow:0 4px 0 var(--amber-dim),0 6px 20px rgba(245,166,35,0.25); }
  .btn-primary:active { transform:translateY(2px); box-shadow:0 2px 0 var(--amber-dim); }
  .btn-secondary { width:100%; background:var(--surface2); color:var(--amber);
    border:1px solid rgba(245,166,35,0.3); border-radius:10px; padding:14px;
    font-family:'Space Mono',monospace; font-size:11px; font-weight:700;
    letter-spacing:.12em; text-transform:uppercase; cursor:pointer; transition:all .15s;
    display:flex; align-items:center; justify-content:center; gap:8px; }
  .btn-secondary:active { background:var(--surface); }
  .btn-secondary:disabled { opacity:0.4; cursor:not-allowed; }
  .stage-badge { display:inline-flex; align-items:center; background:var(--surface2); border:1px solid var(--border);
    border-radius:99px; padding:5px 14px; font-size:9px; letter-spacing:.2em; text-transform:uppercase; color:var(--amber); font-weight:700; }
  .label { font-size:9px; letter-spacing:.3em; text-transform:uppercase; font-weight:700; color:var(--amber); }
  .progress-track { height:3px; background:var(--border); border-radius:99px; overflow:hidden; flex:1; }
  .progress-fill  { height:100%; background:var(--amber); border-radius:99px; transition:width .5s ease; }
  .code-input { flex:1; background:#000; border:1px solid var(--border); border-radius:8px;
    padding:12px; font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.25em;
    text-transform:uppercase; text-align:center; color:var(--amber); outline:none; transition:border-color .15s; }
  .code-input::placeholder { color:var(--text-muted); letter-spacing:.1em; }
  .code-input:focus { border-color:rgba(245,166,35,0.5); }
  .code-input.error { border-color:var(--red); color:var(--red); }
  .option-btn { width:100%; text-align:left; padding:14px 16px; border-radius:10px;
    border:1px solid var(--border); background:var(--surface); color:var(--text);
    font-family:'Space Mono',monospace; font-size:11px; line-height:1.5; cursor:pointer;
    transition:all .15s; display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .option-btn:active { transform:scale(0.99); }
  .option-btn:disabled { cursor:not-allowed; }
  .option-btn.correct { background:rgba(78,203,141,.12); border-color:var(--green); color:var(--green); }
  .option-btn.wrong   { background:rgba(224,85,85,.12); border-color:var(--red); color:var(--red); }
  .timeline-item { display:flex; align-items:center; gap:10px; padding:12px 14px;
    border-radius:10px; border:1px solid var(--border); background:var(--surface); transition:all .25s; }
  .timeline-item.in-place { border-color:rgba(245,166,35,0.5); background:rgba(245,166,35,0.06); }
  .timeline-item.all-done { border-color:var(--green); background:rgba(78,203,141,0.08); color:var(--green); }
  .timeline-num { font-size:10px; font-weight:700; color:var(--text-muted); background:#000;
    width:26px; height:26px; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .arrow-btn { background:#000; border:1px solid var(--border); border-radius:6px;
    width:28px; height:28px; color:rgba(245,166,35,0.6); cursor:pointer; font-size:10px;
    display:flex; align-items:center; justify-content:center; transition:all .1s; flex-shrink:0; }
  .arrow-btn:active { color:var(--amber); border-color:var(--amber); }
  .arrow-btn:disabled { color:var(--text-muted); cursor:not-allowed; border-color:transparent; }
  .evidence-item { background:var(--surface); border:1px solid var(--border); border-left:3px solid var(--amber);
    border-radius:6px; padding:10px 12px; font-family:'Lora',serif; font-style:italic; font-size:12px; line-height:1.5; color:var(--text-dim); }
  .intel-card { background:var(--paper); color:#1a1208; border-radius:10px; padding:28px 22px;
    text-align:center; box-shadow:0 12px 40px rgba(0,0,0,0.6); border-top:6px solid var(--amber); }
  .intel-card blockquote { font-family:'Lora',serif; font-style:italic; font-size:15px; line-height:1.75; color:#2a1f0a; margin:12px 0; }
  .error-box { background:rgba(224,85,85,.08); border:1px solid rgba(224,85,85,.3); border-radius:8px;
    padding:10px 12px; font-size:10px; line-height:1.5; color:#f08080; }
  .ping-dot { width:8px; height:8px; border-radius:50%; background:var(--red); display:inline-block; position:relative; flex-shrink:0; }
  .ping-dot::after { content:''; position:absolute; inset:-2px; border-radius:50%; background:var(--red); animation:ping 1.5s ease-out infinite; }
  .spinner { width:16px; height:16px; border:2px solid rgba(245,166,35,0.2); border-top-color:var(--amber);
    border-radius:50%; animation:spin 0.8s linear infinite; flex-shrink:0; }
  .gold-divider { height:2px; background:linear-gradient(90deg,transparent,var(--amber),transparent); width:48px; margin:8px auto; }
  .or-line { display:flex; align-items:center; gap:12px; font-size:9px; letter-spacing:.2em; text-transform:uppercase; color:var(--text-muted); }
  .or-line::before,.or-line::after { content:''; flex:1; height:1px; background:var(--border); }
  .puzzle-tile { cursor:pointer; border:2px solid transparent; padding:0; background:transparent;
    transition:border-color .15s, transform .1s; border-radius:3px; overflow:hidden; display:block; }
  .puzzle-tile:active { transform:scale(0.95); }
  .puzzle-tile.selected { border-color:var(--amber); box-shadow:0 0 10px var(--amber-glow); }
  .puzzle-tile.correct-pos { border-color:rgba(78,203,141,0.6); }
  .puzzle-tile.empty-slot { background:rgba(245,166,35,0.08); border:2px dashed rgba(245,166,35,0.3); cursor:default; }
`;

// ─── Photo data: three real photos as base64 data URIs ───────────────────────
// We use the same three photos from the original code
const PHOTO_SRCS = [
  puzzle1,
  puzzle2,
  puzzle3,
];

const PHOTO_LABELS = ["Memory #1 — Library Nights", "Memory #2 — Adventures Together", "Memory #3 — Our Story"];

// ─── Helpers ────────────────────────────────────────────────────────────────
function haversineInFeet(lat1, lon1, lat2, lon2) {
  const R = 6371e3, p1 = (lat1 * Math.PI) / 180, p2 = (lat2 * Math.PI) / 180,
    dp = ((lat2 - lat1) * Math.PI) / 180, dl = ((lon2 - lon1) * Math.PI) / 180,
    a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 3.28084;
}

function injectStyles() {
  if (document.getElementById("case2026-styles")) return;
  const el = document.createElement("style");
  el.id = "case2026-styles";
  el.textContent = GLOBAL_CSS;
  document.head.appendChild(el);
}

// ─── Locations (CORRECTED) ──────────────────────────────────────────────────
const LOCATIONS = [
  {
    id: 1,
    name: "Plainsboro Public Library",
    address: "9 Van Doren St, Plainsboro Township, NJ 08536",
    lat: 40.3329,
    lng: -74.5803,
    radiusFeet: 5000,
    backupCode: "LIBRARY2026",
    story: "Witnesses report the lantern was last seen shortly after a late-night investigation. Investigators believe this clue is connected to where the wish first began.",
    evidence: "The wish did not appear overnight. It began with a conversation."
  },
  {
    id: 2,
    name: "Amazing Thai",
    address: "260 Nassau St, Princeton, NJ 08542",
    lat: 40.3505,
    lng: -74.6595,
    radiusFeet: 5000,
    backupCode: "THAI2026",
    story: "Investigators discovered evidence suggesting the wish continued to grow during several food-related encounters. Reconstruct the scrambled evidence photos to secure the next lead.",
    evidence: "The wish continued to grow. The lantern next appeared near a familiar dessert location."
  },
  {
    id: 3,
    name: "Fruity Yogurt",
    address: "166 Nassau St, Princeton, NJ 08542",
    lat: 40.3491,
    lng: -74.6572,
    radiusFeet: 5000,
    backupCode: "FROYO2026",
    story: "Investigators have uncovered a major breakthrough. The lantern may not have been stolen at all. Arrange the structural timeline to unlock the final transmission.",
    evidence: "Investigation Update: The lantern was not stolen. It was intentionally hidden until its wish was ready to be revealed."
  },
  {
    id: 4,
    name: "Carnegie Lake",
    address: "Carnegie Lake, Princeton, NJ",
    lat: 40.3392,
    lng: -74.6421,
    radiusFeet: 20000,
    backupCode: "WISH2026",
    story: "Case Status: Lantern Located. Detective, your investigation is complete. Follow the lanterns to discover the wish.",
    evidence: "The lantern was hidden because its wish was not yet ready. Every piece of evidence pointed toward the same conclusion — the wish was formed through countless shared memories."
  }
];

// ─── Persistence ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "case2026_v6";
function loadState() { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null; } catch { return null; } }
function saveState(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }
const DEFAULT_STATE = { screen: "INTRO", stage: 0, evidence: [] };

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  injectStyles();
  const [state, setState] = useState(() => loadState() || DEFAULT_STATE);
  useEffect(() => { saveState(state); }, [state]);
  const go = useCallback((patch) => setState(prev => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) })), []);

  const loc = LOCATIONS[state.stage];
  const unlock = () => go({ screen: "GAME" });
  const onGameWon = () => go({ screen: "INTEL" });
  const logAndAdvance = () => {
    go(prev => {
      const ev = [...new Set([...prev.evidence, loc.evidence])];
      if (prev.stage === 3) return { ...prev, evidence: ev, screen: "FINAL" };
      return { ...prev, evidence: ev, stage: prev.stage + 1, screen: "DASHBOARD" };
    });
  };

  const bg = {
    position: "relative", zIndex: 1, maxWidth: 430, margin: "0 auto", minHeight: "100dvh",
    display: "flex", flexDirection: "column", padding: "0 20px 40px"
  };

  return (
    <div style={bg}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,166,35,0.08) 0%, transparent 60%)" }} />
      <TopBar stage={state.stage} screen={state.screen} />
      {state.screen === "INTRO"     && <IntroScreen onBegin={() => go({ screen: "DASHBOARD" })} />}
      {state.screen === "DASHBOARD" && <DashboardScreen loc={loc} stage={state.stage} evidence={state.evidence} onUnlock={unlock} />}
      {state.screen === "GAME"      && <GameScreen stage={state.stage} onWin={onGameWon} />}
      {state.screen === "INTEL"     && <IntelScreen loc={loc} onContinue={logAndAdvance} />}
      {state.screen === "FINAL"     && <FinalScreen />}
    </div>
  );
}

function TopBar({ stage, screen }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 12px", borderBottom: "1px solid var(--border)", marginBottom: 22, flexShrink: 0 }}>
      <div style={{ fontSize: 9, letterSpacing: "0.28em", color: "var(--amber)", fontWeight: 700, textTransform: "uppercase" }}>🕯️ DET. AGENCY</div>
      <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "var(--text-dim)", textTransform: "uppercase" }}>
        {screen === "INTRO" ? "CASE FILE #2026" : `STAGE ${stage + 1} / 4`}
      </div>
    </div>
  );
}

function IntroScreen({ onBegin }) {
  return (
    <div className="anim-fade-up" style={{ margin: "auto 0", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div className="label" style={{ letterSpacing: ".35em" }}>Confidential Dossier</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 900, lineHeight: 1.0, color: "var(--text)", marginTop: 8 }}>
          CASE FILE<br />#2026
        </div>
        <div className="gold-divider" style={{ margin: "12px auto" }} />
        <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 18, color: "var(--amber)", letterSpacing: ".05em" }}>
          The Missing Lantern
        </div>
      </div>
      <div className="paper-card" style={{ transform: "rotate(-1.3deg)" }}>
        <div className="accent-bar" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <P>Earlier today, a lantern disappeared.</P>
          <P>According to ancient lore, this asset holds a singular power: <em><strong>Whoever uncovers its hiding place may reveal the raw wish sealed deep inside.</strong></em></P>
          <P>Field agents recovered raw tactical data, but the core objective remains missing.</P>
          <P style={{ fontWeight: 600, color: "#1a1208" }}>Detective, your field recruitment begins immediately.</P>
        </div>
      </div>
      <button className="btn-primary anim-pulse-amb" onClick={onBegin}>⚡ Begin Investigation</button>
    </div>
  );
}

function P({ children, style }) {
  return <p style={{ fontFamily: "'Lora',serif", fontSize: 14, lineHeight: 1.7, color: "#2a2010", ...style }}>{children}</p>;
}

function DashboardScreen({ loc, stage, evidence, onUnlock }) {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const checkGPS = () => {
    if (!navigator.geolocation) { setGpsError("Geolocation not supported."); return; }
    setGpsLoading(true); setGpsError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const dist = haversineInFeet(pos.coords.latitude, pos.coords.longitude, loc.lat, loc.lng);
        if (dist <= loc.radiusFeet) { onUnlock(); }
        else { setGpsError(`Target out of range. ~${Math.round(dist)} ft away. Keep moving!`); }
      },
      () => { setGpsLoading(false); setGpsError("Could not access location. Ensure GPS is enabled."); },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const verifyCode = () => {
    if (code.trim().toUpperCase() === loc.backupCode) { onUnlock(); }
    else { setCodeError(true); setShakeKey(k => k + 1); setTimeout(() => { setCodeError(false); setCode(""); }, 900); }
  };

  return (
    <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
      <div className="surface-card" style={{ padding: "13px 15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span className="label">Current Objective</span>
          <span style={{ fontSize: 9, letterSpacing: ".15em", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>{stage + 1} / 4</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{loc.name}</div>
        <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 10, letterSpacing: ".05em" }}>{loc.address}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${((stage + 1) / 4) * 100}%` }} /></div>
        </div>
      </div>

      <div className="paper-card">
        <div className="accent-bar" />
        <div style={{ fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: "#b07a10", fontWeight: 700, marginBottom: 6 }}>Location Briefing</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#1a1208", marginBottom: 10 }}>{loc.name}</div>
        <p style={{ fontFamily: "'Lora',serif", fontSize: 13, lineHeight: 1.7, color: "#3a2e1a" }}>{loc.story}</p>
      </div>

      <div className="surface-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="label">Geofence Lock Mechanisms</div>
        <button className="btn-secondary" onClick={checkGPS} disabled={gpsLoading}>
          {gpsLoading ? <><div className="spinner" /><span>PINGING SATELLITES...</span></> : <><div className="ping-dot" /><span>SCAN LOCAL GPS CODES</span></>}
        </button>
        {gpsError && <div className="error-box">⚠ {gpsError}</div>}
        <div className="or-line">or encrypt manual bypass</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input key={shakeKey} className={`code-input${codeError ? " error anim-shake" : ""}`}
            placeholder="ENTER OVERRIDE CODE" value={code}
            onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === "Enter" && verifyCode()} />
          <button onClick={verifyCode} style={{ background: "var(--amber)", color: "#0a0808", border: "none", borderRadius: 8, padding: "0 16px", fontFamily: "'Space Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: ".1em", cursor: "pointer", whiteSpace: "nowrap" }}>DECRYPT</button>
        </div>
        {codeError && <div className="error-box">⚠ Invalid override code. Try again.</div>}
      </div>

      {evidence.length > 0 && (
        <div style={{ marginTop: "auto" }}>
          <div style={{ fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 8, fontWeight: 700 }}>Recovered Intelligence</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 144, overflowY: "auto" }}>
            {evidence.map((ev, i) => <div key={i} className="evidence-item">"{ev}"</div>)}
          </div>
        </div>
      )}
    </div>
  );
}

function GameScreen({ stage, onWin }) {
  return (
    <div className="anim-fade-up" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {stage === 0 && <GameOne   onWin={onWin} />}
      {stage === 1 && <GameTwo   onWin={onWin} />}
      {stage === 2 && <GameThree onWin={onWin} />}
      {stage === 3 && <GameFour  onWin={onWin} />}
    </div>
  );
}

function IntelScreen({ loc, onContinue }) {
  return (
    <div className="anim-fade-up" style={{ margin: "auto 0", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div className="label" style={{ color: "var(--amber)" }}>⚡ Critical Intel Recovered</div>
        <div style={{ height: 1, background: "var(--border)", width: 48, margin: "10px auto" }} />
      </div>
      <div className="intel-card anim-float">
        <div style={{ fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: "#b07a10", fontWeight: 700, marginBottom: 10 }}>CLASSIFIED EVIDENCE</div>
        <blockquote>"{loc.evidence}"</blockquote>
      </div>
      <button className="btn-secondary" onClick={onContinue}>Log Evidence &amp; Continue →</button>
    </div>
  );
}

function FinalScreen() {
  return (
    <div className="anim-fade-up" style={{ margin: "auto 0", display: "flex", flexDirection: "column", gap: 24, textAlign: "center" }}>
      <div>
        <div className="label" style={{ color: "var(--green)", letterSpacing: ".2em" }}>✓ Mission Objective Complete</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 44, fontWeight: 900, color: "var(--amber)", lineHeight: 1.0, marginTop: 8 }}>
          WISH<br />RECOVERED
        </div>
        <div className="gold-divider" style={{ margin: "14px auto" }} />
      </div>
      <div className="paper-card" style={{ textAlign: "left", transform: "rotate(0.9deg)" }}>
        <div className="accent-bar" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <P>The mysterious lantern was hidden purposefully because its contents were awaiting a rare alignment of elements.</P>
          <P>Every piece of field analysis compiled along your journey points directly to the exact same deduction. This sentiment was constructed through years of shared conversations, laughs, and timeless memories.</P>
          <P style={{ fontWeight: 700, color: "#7a3f00", borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: 12, textAlign: "center", textTransform: "uppercase", letterSpacing: ".08em" }}>
            The physical search window closes now.
          </P>
        </div>
      </div>
      <div>
        <p style={{ fontSize: 10, letterSpacing: ".15em", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 18 }} className="anim-glow">
          Look up from your screen. The path is open.</p>
        <button className="btn-primary anim-pulse-amb" style={{ fontSize: 14, padding: 20 }}
          onClick={() => alert("🕯️ Lock your phone, take a deep breath, and walk down the lantern path.\n\nI'm waiting for you at the end. ❤️")}>
          ✨ FOLLOW THE LANTERNS ✨
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// GAME 1 — RELATIONSHIP INTERROGATION
// ═══════════════════════════════════════════
const Q1 = [
  {
    q: "Let's review the timeline, detective. What exact date did I officially ask you out?",
    options: ["April 30, 2026", "May 5, 2026", "May 16, 2026", "May 23, 2026"],
    correct: 2, jokeMode: false
  },
  {
    q: "Be entirely transparent in this cross-examination… What is your absolute favorite thing about me?",
    options: ["Your smile 😊", "Your hair ✨", "Your glasses 🤓", "Everything about you — no question 🥹"],
    correct: 3, jokeMode: false
  },
  {
    q: "During our late-night library sessions when we first started talking — what subject were we up until 3am with me helping you?",
    options: ["Organic Chemistry", "Multivariable Calculus", "Statistics", "Data Structures"],
    correct: 2, jokeMode: false
  },
  {
    q: "Critical intel needed. How much can I bench press?",
    options: ["100 lbs", "115 lbs", "135 lbs", "175 lbs"],
    correct: -1, jokeMode: true,
    jokeMessage: "😂 None of those are right. Guess you'll have to come to the gym with me to find out. Field trip required."
  },
  {
    q: "What annoys you the MOST?",
    options: ["When I text \"ok\" 😑", "When I take a FaceTime photo 📸", "Nothing — you're basically perfect 🤷"],
    correct: 2, jokeMode: false
  },
  {
    q: "What nickname do I like the most for you?",
    options: ["Shiv", "Shivali 😐", "Panda 🐼", "Chud"],
    correct: 2, jokeMode: false
  }
];

function GameOne({ onWin }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [jokeShown, setJokeShown] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const q = Q1[qIdx];

  const advance = () => {
    if (qIdx < Q1.length - 1) { setQIdx(i => i + 1); setSelected(null); setWrongCount(0); setJokeShown(false); }
    else { onWin(); }
  };

  const pick = (idx) => {
    if (selected !== null) return;
    if (q.jokeMode) {
      const nc = wrongCount + 1; setWrongCount(nc); setSelected(idx); setShakeKey(k => k + 1);
      if (nc >= 4) { setJokeShown(true); } else { setTimeout(() => setSelected(null), 800); }
      return;
    }
    setSelected(idx);
    if (idx === q.correct) { setTimeout(advance, 900); }
    else { setShakeKey(k => k + 1); setTimeout(() => setSelected(null), 900); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, margin: "auto 0", flex: 1 }}>
      <div style={{ textAlign: "center" }}>
        <div className="stage-badge anim-badge-in">Mini-Game // Stage 1</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "var(--text)", marginTop: 10, lineHeight: 1.2 }}>
          The Relationship<br />Interrogation</div>
        <p style={{ fontSize: 11, lineHeight: 1.5, color: "var(--text-dim)", marginTop: 6 }}>Verify credentials by establishing chronological fact patterns.</p>
      </div>
      <div key={shakeKey} className="surface-card" style={{ border: (selected !== null && !q.jokeMode && selected !== q.correct) ? "1px solid var(--red)" : "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 9, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--text-muted)" }}>
          <span>Alibi Check</span><span>Log {qIdx + 1} of {Q1.length}</span>
        </div>
        <p style={{ fontFamily: "'Lora',serif", fontSize: 14, lineHeight: 1.65, color: "var(--text)" }}>{q.q}</p>
      </div>
      {jokeShown ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.4)", borderRadius: 10, padding: "16px", textAlign: "center", fontFamily: "'Lora',serif", fontSize: 13, lineHeight: 1.7, color: "var(--amber)" }}>
            {q.jokeMessage}
          </div>
          <button className="btn-secondary" onClick={advance}>Got it. Continue →</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {q.options.map((opt, i) => {
            let cls = "option-btn";
            if (selected === i) cls += q.jokeMode ? " wrong" : (i === q.correct ? " correct" : " wrong");
            return (
              <button key={i} className={cls} disabled={selected !== null && !q.jokeMode} onClick={() => pick(i)}>
                <span>{opt}</span>
                {selected === i && !q.jokeMode && <span style={{ fontSize: 9, letterSpacing: ".1em" }}>{i === q.correct ? "✓ VERIFIED" : "✗ INCORRECT"}</span>}
                {selected === i && q.jokeMode && <span style={{ fontSize: 9, letterSpacing: ".1em" }}>✗ NOPE</span>}
              </button>
            );
          })}
          {q.jokeMode && wrongCount > 0 && wrongCount < 4 && (
            <div style={{ fontSize: 9, textAlign: "center", color: "var(--text-muted)", letterSpacing: ".1em", textTransform: "uppercase" }}>
              Wrong attempts: {wrongCount} / 4
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// GAME 2 — CANVAS PHOTO PUZZLE (tap-to-swap, 3×4 grid, draws real images)
// ═══════════════════════════════════════════
const COLS = 3, ROWS = 4, TOTAL = COLS * ROWS;

// Palette of colors for each "memory" when no real image is loaded
const MEMORY_PALETTES = [
  ["#1a0a2e","#2d1a4a","#4a2a6b","#6b3a8c","#8c4aad","#ad5ace","#ce6aef",
   "#3a1a5e","#5a2a7e","#7a3a9e","#9a4abe","#ba5ade"],
  ["#0a1a2e","#1a2a4a","#2a3a6b","#3a4a8c","#4a5aad","#5a6ace","#6a7aef",
   "#1a2a5e","#2a3a7e","#3a4a9e","#4a5abe","#5a6ade"],
  ["#1a2a0a","#2a4a1a","#3a6b2a","#4a8c3a","#5aad4a","#6ace5a","#7aef6a",
   "#2a3a1a","#3a5a2a","#4a7a3a","#5a9a4a","#6aba5a"],
];

function createShuffledTiles() {
  const arr = [...Array(TOTAL).keys()];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr.every((v, i) => v === i)) { [arr[0], arr[1]] = [arr[1], arr[0]]; }
  return arr;
}

// Renders a puzzle tile using canvas — draws either a real image crop or a color block
function PuzzleTile({ src, tileVal, pos, isSelected, isSolved, TW, TH, paletteIdx, onClick }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [imgReady, setImgReady] = useState(false);

  const tileRow = Math.floor(tileVal / COLS);
  const tileCol = tileVal % COLS;

  // Draw the tile whenever parameters change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = TW;
    canvas.height = TH;

    if (src && imgRef.current && imgReady) {
      // Draw the correct slice of the real image
      const img = imgRef.current;
      const srcW = img.naturalWidth / COLS;
      const srcH = img.naturalHeight / ROWS;
      ctx.drawImage(img, tileCol * srcW, tileRow * srcH, srcW, srcH, 0, 0, TW, TH);
    } else {
      // Draw a colored block with the tile number
      const palette = MEMORY_PALETTES[paletteIdx % MEMORY_PALETTES.length];
      ctx.fillStyle = palette[tileVal % palette.length];
      ctx.fillRect(0, 0, TW, TH);
      // Draw tile number for puzzle reference
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = `bold ${Math.floor(TW * 0.28)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(tileVal + 1), TW / 2, TH / 2);
    }
  }, [src, tileVal, TW, TH, imgReady, tileRow, tileCol, paletteIdx]);

  // Load the real image if provided
  useEffect(() => {
  setImgReady(false); // force redraw for new image

  if (!src) return;

  const img = new Image();

  img.onload = () => {
    imgRef.current = img;
    setImgReady(true);
  };

  img.onerror = () => {
    setImgReady(false);
  };

  img.src = src;
}, [src]);

  const border = isSolved
    ? "2px solid var(--green)"
    : isSelected
      ? "2px solid var(--amber)"
      : "1px solid rgba(255,255,255,0.08)";

  return (
    <button
      onClick={onClick}
      style={{
        width: TW, height: TH, padding: 0, border, cursor: "pointer",
        display: "block", position: "relative", overflow: "hidden",
        outline: "none", transition: "border .12s",
        boxShadow: isSelected ? "0 0 12px var(--amber-glow)" : "none",
        borderRadius: 2,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </button>
  );
}

function GameTwo({ onWin }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [tiles, setTiles] = useState(() => createShuffledTiles());
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  // Use one of the provided base64 images if available, otherwise null (color blocks)
  const photoSrc = PHOTO_SRCS[photoIdx] || null;
  const label = PHOTO_LABELS[photoIdx];

  const GRID_SIZE = Math.min(330, (typeof window !== "undefined" ? window.innerWidth : 400) - 60);
  const TW = Math.floor(GRID_SIZE / COLS);
  const TH = Math.floor(GRID_SIZE / ROWS);

  useEffect(() => {
    setTiles(createShuffledTiles());
    setSelected(null); setMoves(0); setSolved(false);
  }, [photoIdx]);

  const tapTile = (pos) => {
    if (solved) return;
    if (selected === null) { setSelected(pos); return; }
    if (selected === pos) { setSelected(null); return; }
    const next = [...tiles];
    [next[selected], next[pos]] = [next[pos], next[selected]];
    setTiles(next); setMoves(m => m + 1); setSelected(null);
    if (next.every((v, i) => v === i)) { setTimeout(() => setSolved(true), 200); }
  };

  const nextPhoto = () => {
    if (photoIdx < PHOTO_LABELS.length - 1) { setPhotoIdx(i => i + 1); }
    else { onWin(); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div className="stage-badge anim-badge-in">Mini-Game // Stage 2</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "var(--text)", marginTop: 10, lineHeight: 1.2 }}>
          Scrambled<br />Evidence Photos</div>
        <p style={{ fontSize: 11, lineHeight: 1.5, color: "var(--text-dim)", marginTop: 6 }}>
          Tap two tiles to swap them. Reconstruct the image.</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, padding: "8px 12px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)", letterSpacing: ".1em" }}>
        <span style={{ color: "var(--text-dim)", textTransform: "uppercase" }}>{label} ({photoIdx + 1}/{PHOTO_LABELS.length})</span>
        <span>Swaps: <span style={{ color: "var(--amber)" }}>{moves}</span></span>
      </div>

      {/* Puzzle grid */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${TW}px)`,
          gap: 2,
          background: "var(--border)",
          borderRadius: 8,
          overflow: "hidden",
          border: solved ? "2px solid var(--green)" : "2px solid var(--border)",
          transition: "border .3s",
          width: TW * COLS + 2 * (COLS - 1),
        }}>
          {tiles.map((tileVal, pos) => (
            <PuzzleTile
              key={`${photoIdx}-${pos}`}
              src={photoSrc}
              tileVal={tileVal}
              pos={pos}
              isSelected={selected === pos}
              isSolved={solved && tileVal === pos}
              TW={TW}
              TH={TH}
              paletteIdx={photoIdx}
              onClick={() => tapTile(pos)}
            />
          ))}
        </div>
      </div>

      <p style={{ fontSize: 9, textAlign: "center", color: "var(--text-muted)", letterSpacing: ".15em", textTransform: "uppercase" }}>
        {solved ? "✓ Puzzle solved!" : selected !== null ? "Tile selected — tap another to swap" : "Tap any tile to select it"}
      </p>

      {solved && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="anim-fade-up">
          <div style={{ background: "rgba(78,203,141,0.1)", border: "1px solid var(--green)", borderRadius: 8, padding: "12px", textAlign: "center", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--green)" }} className="anim-glow">
            ✦ Photo Reconstructed — {moves} swaps
          </div>
          <button className="btn-secondary" onClick={nextPhoto}>
            {photoIdx < PHOTO_LABELS.length - 1 ? "Next Photo →" : "Evidence Secured →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// GAME 3 — CHRONOLOGICAL SORT
// ═══════════════════════════════════════════
const TIMELINE_ITEMS = [
  { id: "froyo",    label: "First Froyo Date 🍦",   order: 0 },
  { id: "thai",     label: "Amazing Thai Dinner 🍜", order: 1 },
  { id: "nandos",   label: "Nando's Pizza Night 🍕", order: 2 },
  { id: "nyc",      label: "NYC Adventure 🗽",       order: 3 },
  { id: "sixflags", label: "Six Flags Trip 🎢",      order: 4 },
];

function GameThree({ onWin }) {
  const [list, setList] = useState(TIMELINE_ITEMS);
  const [success, setSuccess] = useState(false);
  const [showFroyo, setShowFroyo] = useState(false);

  const move = (idx, dir) => {
    if (success) return;
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= list.length) return;
    const next = [...list]; [next[idx], next[target]] = [next[target], next[idx]]; setList(next);
    if (next.every((item, i) => item.order === i)) { setSuccess(true); setTimeout(() => setShowFroyo(true), 1200); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div className="stage-badge anim-badge-in">Mini-Game // Stage 3</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "var(--text)", marginTop: 10, lineHeight: 1.25 }}>
          Chronological Case File<br />Reconstruction</div>
        <p style={{ fontSize: 11, lineHeight: 1.5, color: "var(--text-dim)", marginTop: 6 }}>Arrange our dates from oldest (top) to newest (bottom).</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((item, idx) => {
          const inPlace = item.order === idx;
          let cls = "timeline-item";
          if (success) cls += " all-done"; else if (inPlace) cls += " in-place";
          return (
            <div key={item.id} className={cls}>
              <div className="timeline-num">{String(idx + 1).padStart(2, "0")}</div>
              <div style={{ flex: 1, fontSize: 12 }}>{item.label}</div>
              <div style={{ display: "flex", gap: 4 }}>
                <button className="arrow-btn" disabled={idx === 0 || success} onClick={() => move(idx, "up")}>▲</button>
                <button className="arrow-btn" disabled={idx === list.length - 1 || success} onClick={() => move(idx, "down")}>▼</button>
              </div>
            </div>
          );
        })}
      </div>
      {success && !showFroyo && (
        <div style={{ background: "rgba(78,203,141,0.1)", border: "1px solid var(--green)", borderRadius: 8, padding: "12px", textAlign: "center", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--green)" }} className="anim-glow">
          ✦ Chronology Verified. Parsing Final Coordinates...
        </div>
      )}
      {showFroyo && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="anim-fade-up">
          <div style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.4)", borderRadius: 10, padding: "16px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🍦</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "var(--amber)", marginBottom: 6 }}>Field Agent Directive</div>
            <p style={{ fontFamily: "'Lora',serif", fontSize: 13, lineHeight: 1.7, color: "var(--text-dim)" }}>
              You're at Fruity Yogurt for a reason. Go grab yourself a froyo — you've earned it, detective. Then continue to the next objective.</p>
          </div>
          <button className="btn-primary" onClick={onWin}>🍦 Froyo Acquired. Continue →</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// GAME 4 — CARNEGIE LAKE FINAL
// ═══════════════════════════════════════════
function GameFour({ onWin }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, margin: "auto 0", textAlign: "center" }}>
      <div>
        <div className="stage-badge anim-badge-in">Final Stage // Carnegie Lake</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "var(--amber)", marginTop: 12, lineHeight: 1.2 }}>
          FINAL CODES<br />DETECTED</div>
        <div className="gold-divider" style={{ margin: "14px auto" }} />
      </div>
      <div className="surface-card" style={{ textAlign: "left" }}>
        <p style={{ fontFamily: "'Lora',serif", fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>
          Terminal frequencies detected at Carnegie Lake. All case evidence has been cross-referenced and confirmed. The final discovery packet is ready for decryption, detective.</p>
      </div>
      <button className="btn-primary anim-pulse-amb" onClick={onWin}>🕯️ DECRYPT DISCOVERY PACKET</button>
    </div>
  );
}