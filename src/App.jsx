import { useState, useRef, useEffect } from "react";

// ── Themes ────────────────────────────────────────────────────────────────────
const THEMES = {
  classic: {
    id: "classic",
    name: "Classic",
    desc: "Dark felt casino",
    bgGrad: "radial-gradient(ellipse at 50% 20%, #091a0d 0%, #060e08 100%)",
    bgGradSetup: "radial-gradient(ellipse at 50% 30%, #091a0d 0%, #060e08 100%)",
    surface: "rgba(0,0,0,0.22)",
    surfaceBorder: "rgba(255,255,255,0.07)",
    accent: "#f0c040",
    accentDim: "#f0c04044",
    textDim: "#3a6a3a",
    textMid: "#5a7a5a",
    textBright: "#e8d88a",
    titleColor: "#f0c040",
    deckBorder: "#4a8a4a",
    deckBg1: "#223a22",
    deckBg2: "#1e401e",
    deckBg3: "#1a3a1a",
    fieldBg: "#0a160a",
    fieldBorder: "#1a3a1a",
    bottomBg: "rgba(0,0,0,0.3)",
    bottomBorder: "rgba(255,255,255,0.06)",
    sheetBg: "#0a180a",
    sheetBorder: "rgba(240,192,64,0.3)",
    logBg: "#070f07",
    logBorder: "#1a3a1a",
    logText: "#4a8a4a",
    statBg: "rgba(0,0,0,0.3)",
    statBorder: "rgba(255,255,255,0.06)",
    jokerBg: "#1a1a2e",
    jokerBorder: "#5a6aee",
    jokerGlow: "#5a6aee99",
    matchNumberBg: "rgba(240,192,64,0.15)",
    matchNumberBorder: "#f0c04055",
    matchNumberText: "#f0c040",
    matchSuitBg: "rgba(90,106,238,0.15)",
    matchSuitBorder: "#5a6aee55",
    matchSuitText: "#5a6aee",
    suits: {
      "♠": { text: "#1a1a2e", accent: "#5a6aee" },
      "♥": { text: "#c0392b", accent: "#ff6b6b" },
      "♦": { text: "#1a7a3c", accent: "#4ecb71" },
      "♣": { text: "#1565c0", accent: "#5ba4f5" },
    },
    btnGold: { bg: "linear-gradient(180deg,#f0c040,#c09010)", color: "#0a0800", border: "2px solid #806000" },
    btnGoldDis: { bg: "#3a3010", color: "#5a4a10", border: "2px solid #2a2008" },
    btnGreen: { bg: "linear-gradient(180deg,#2a5a2a,#1a4a1a)", color: "#a8d8a8", border: "2px solid #0a3a0a" },
    btnGreenDis: { bg: "#1a2a1a", color: "#3a5a3a", border: "2px solid #101a10" },
    btnPurple: { bg: "linear-gradient(180deg,#5a6aee,#3a4acc)", color: "#ffffff", border: "2px solid #2a3aaa" },
    btnPurpleDis: { bg: "#1a1a3a", color: "#3a3a6a", border: "2px solid #101028" },
    cardBg: "#fdf6e3",
    cardBorder: "#8b6914",
    cardShadow: "0 2px 6px rgba(0,0,0,0.4)",
    cardPopBg: "#3a1a1a",
    cardPopBorder: "#e74c3c",
    cardSelBg: "#2a2000",
    cardSelBorder: "#f0c040",
    cardSelShadow: "0 0 14px #f0c04099",
    cardHoverBorder: "#f0c040",
    cardHoverShadow: "0 0 8px #f0c04044",
    selectorBg: "#080e08",
    selectorBorder: "#1a3a1a",
    selectorActiveBg: "rgba(240,192,64,0.12)",
    selectorActiveBorder: "#f0c040",
  },

  bright: {
    id: "bright",
    name: "Bright",
    desc: "Navy to purple evening",
    bgGrad: "radial-gradient(ellipse at 50% 20%, #1a2a4a 0%, #2a1a3a 100%)",
    bgGradSetup: "radial-gradient(ellipse at 50% 30%, #1a2a4a 0%, #2a1a3a 100%)",
    surface: "rgba(255,255,255,0.07)",
    surfaceBorder: "rgba(255,255,255,0.12)",
    accent: "#64b4ff",
    accentDim: "#64b4ff44",
    textDim: "#6090b0",
    textMid: "#90b8d8",
    textBright: "#e0eeff",
    titleColor: "#64b4ff",
    deckBorder: "#2a5a8a",
    deckBg1: "#0e1e3a",
    deckBg2: "#0c1830",
    deckBg3: "#0a1428",
    fieldBg: "#0e1628",
    fieldBorder: "#1a2a4a",
    bottomBg: "rgba(10,14,30,0.8)",
    bottomBorder: "rgba(100,180,255,0.1)",
    sheetBg: "#0e1630",
    sheetBorder: "rgba(100,180,255,0.3)",
    logBg: "#080e20",
    logBorder: "#1a2a4a",
    logText: "#4a7aaa",
    statBg: "rgba(255,255,255,0.05)",
    statBorder: "rgba(100,180,255,0.12)",
    jokerBg: "#1a1a3a",
    jokerBorder: "#7788ff",
    jokerGlow: "#7788ff99",
    matchNumberBg: "rgba(100,180,255,0.15)",
    matchNumberBorder: "#64b4ff55",
    matchNumberText: "#64b4ff",
    matchSuitBg: "rgba(119,136,255,0.15)",
    matchSuitBorder: "#7788ff55",
    matchSuitText: "#7788ff",
    suits: {
      "♠": { text: "#2233aa", accent: "#7788ff" },
      "♥": { text: "#cc2244", accent: "#ff5577" },
      "♦": { text: "#117744", accent: "#44dd88" },
      "♣": { text: "#1166bb", accent: "#44aaff" },
    },
    btnGold: { bg: "linear-gradient(180deg,#64b4ff,#2a7acc)", color: "#001830", border: "2px solid #1a5a9a" },
    btnGoldDis: { bg: "#0e1e38", color: "#2a4a6a", border: "2px solid #0a1828" },
    btnGreen: { bg: "linear-gradient(180deg,#3a6a9a,#2a4a7a)", color: "#c0d8f0", border: "2px solid #1a3a6a" },
    btnGreenDis: { bg: "#0e1828", color: "#2a3a5a", border: "2px solid #080e18" },
    btnPurple: { bg: "linear-gradient(180deg,#7788ff,#5566dd)", color: "#ffffff", border: "2px solid #4455bb" },
    btnPurpleDis: { bg: "#1a1a3a", color: "#3a3a6a", border: "2px solid #101028" },
    cardBg: "#f0f4ff",
    cardBorder: "#7090c0",
    cardShadow: "0 2px 8px rgba(0,0,30,0.5)",
    cardPopBg: "#2a1020",
    cardPopBorder: "#ff5577",
    cardSelBg: "#001830",
    cardSelBorder: "#64b4ff",
    cardSelShadow: "0 0 16px #64b4ff99",
    cardHoverBorder: "#64b4ff",
    cardHoverShadow: "0 0 8px #64b4ff44",
    selectorBg: "#0a1020",
    selectorBorder: "#1a2a4a",
    selectorActiveBg: "rgba(100,180,255,0.12)",
    selectorActiveBorder: "#64b4ff",
  },

  neon: {
    id: "neon",
    name: "Neon",
    desc: "Near-black electric glow",
    bgGrad: "radial-gradient(ellipse at 50% 20%, #0a0015 0%, #000510 100%)",
    bgGradSetup: "radial-gradient(ellipse at 50% 30%, #0a0015 0%, #000510 100%)",
    surface: "rgba(255,255,255,0.03)",
    surfaceBorder: "rgba(0,255,204,0.15)",
    accent: "#00ffcc",
    accentDim: "#00ffcc33",
    textDim: "#440066",
    textMid: "#882299",
    textBright: "#cc88ff",
    titleColor: "#ff00aa",
    deckBorder: "#00ffcc",
    deckBg1: "#050015",
    deckBg2: "#040012",
    deckBg3: "#03000e",
    fieldBg: "#03000e",
    fieldBorder: "#0a0030",
    bottomBg: "rgba(0,0,10,0.9)",
    bottomBorder: "rgba(0,255,204,0.15)",
    sheetBg: "#05001a",
    sheetBorder: "rgba(0,255,204,0.4)",
    logBg: "#020008",
    logBorder: "#0a0030",
    logText: "#440066",
    statBg: "rgba(255,255,255,0.03)",
    statBorder: "rgba(0,255,204,0.12)",
    jokerBg: "#050015",
    jokerBorder: "#00ffcc",
    jokerGlow: "#00ffcc99",
    matchNumberBg: "rgba(0,255,204,0.1)",
    matchNumberBorder: "#00ffcc55",
    matchNumberText: "#00ffcc",
    matchSuitBg: "rgba(255,0,170,0.1)",
    matchSuitBorder: "#ff00aa55",
    matchSuitText: "#ff00aa",
    suits: {
      "♠": { text: "#1100ff", accent: "#4433ff" },
      "♥": { text: "#ff0055", accent: "#ff3377" },
      "♦": { text: "#00ff88", accent: "#33ffaa" },
      "♣": { text: "#00aaff", accent: "#33ccff" },
    },
    btnGold: { bg: "linear-gradient(180deg,#00ffcc,#00cc99)", color: "#000a08", border: "2px solid #00aa77" },
    btnGoldDis: { bg: "#030a08", color: "#1a3a30", border: "2px solid #010806" },
    btnGreen: { bg: "linear-gradient(180deg,#330066,#220044)", color: "#cc88ff", border: "2px solid #440088" },
    btnGreenDis: { bg: "#0a0015", color: "#330044", border: "2px solid #05000e" },
    btnPurple: { bg: "linear-gradient(180deg,#ff00aa,#cc0088)", color: "#ffffff", border: "2px solid #aa0066" },
    btnPurpleDis: { bg: "#1a0015", color: "#550033", border: "2px solid #0a000e" },
    cardBg: "#0a0020",
    cardBorder: "#330055",
    cardShadow: "0 2px 10px rgba(0,0,20,0.8)",
    cardPopBg: "#200010",
    cardPopBorder: "#ff0066",
    cardSelBg: "#000a08",
    cardSelBorder: "#00ffcc",
    cardSelShadow: "0 0 20px #00ffcc99",
    cardHoverBorder: "#00ffcc",
    cardHoverShadow: "0 0 12px #00ffcc55",
    selectorBg: "#030008",
    selectorBorder: "#0a0030",
    selectorActiveBg: "rgba(0,255,204,0.08)",
    selectorActiveBorder: "#00ffcc",
  },
};

// ── Constants ─────────────────────────────────────────────────────────────────
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const GOLDILOCKS_TARGETS = [10, 14, 18, 22, 26];
const DEBT1 = 5;
const DEBT2 = 8;
const SWIPE_THRESHOLD = 40;

function buildDeck(includeJokers) {
  const deck = [];
  for (const suit of SUITS)
    for (const rank of RANKS)
      deck.push({ rank, suit, id: rank + suit });
  if (includeJokers) {
    deck.push({ rank: "JKR", suit: "★", id: "J1", isJoker: true });
    deck.push({ rank: "JKR", suit: "★", id: "J2", isJoker: true });
  }
  return deck;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function checkTail(row) {
  if (row.length < 4) return null;
  const c1 = row[row.length - 4];
  const c4 = row[row.length - 1];
  if (c1.rank === c4.rank)
    return { type: "number", nextRow: row.slice(0, -4), count: 4 };
  if (c1.suit === c4.suit)
    return { type: "suit", nextRow: row.slice(0, row.length - 3).concat([row[row.length - 1]]), count: 2 };
  return null;
}

function resolveAll(startRow, sType, isScoring, currentScore, d1, d2, jokerCount) {
  var r = startRow.slice(), pts = 0, nd1 = d1, nd2 = d2, lines = [], m;
  while ((m = checkTail(r)) !== null) {
    r = m.nextRow;
    var earned = 0;
    if (isScoring) {
      var active = (m.type === "number" && sType === "number") || (m.type === "suit" && sType === "suit");
      if (active) earned = m.count;
    }
    pts += earned;
    var total = currentScore + pts;
    if (!nd1 && total >= DEBT1) { nd1 = true; lines.push("✓ Debt 1 paid!"); }
    if (nd1 && jokerCount >= 2 && !nd2 && total >= DEBT1 + DEBT2) { nd2 = true; lines.push("✓ Debt 2 paid!"); }
    lines.push(m.type === "number"
      ? "🔢 Number match — " + m.count + " removed" + (earned > 0 ? ", +" + earned + " pts" : " (pre-scoring)")
      : "♠ Suit match — " + m.count + " removed" + (earned > 0 ? ", +" + earned + " pts" : " (pre-scoring)"));
  }
  return { finalRow: r, pts, nd1, nd2, lines };
}

// ── SwipeableDeck ─────────────────────────────────────────────────────────────
function SwipeableDeck({ remaining, onSwipeUp, disabled, label, theme }) {
  const touchStartY = useRef(null);
  const mouseStartY = useRef(null);
  const [liftY, setLiftY] = useState(0);
  const [fired, setFired] = useState(false);
  const t = theme;

  function onTouchStart(e) { if (disabled) return; touchStartY.current = e.touches[0].clientY; setFired(false); }
  function onTouchMove(e) {
    if (disabled || touchStartY.current === null) return;
    const dy = touchStartY.current - e.touches[0].clientY;
    if (dy > 0) setLiftY(Math.min(dy, 60));
    if (dy > SWIPE_THRESHOLD && !fired) { setFired(true); onSwipeUp(); }
  }
  function onTouchEnd() { touchStartY.current = null; setLiftY(0); setFired(false); }
  function onMouseDown(e) { if (disabled) return; mouseStartY.current = e.clientY; setFired(false); }
  function onMouseMove(e) {
    if (disabled || mouseStartY.current === null) return;
    const dy = mouseStartY.current - e.clientY;
    if (dy > 0) setLiftY(Math.min(dy, 60));
    if (dy > SWIPE_THRESHOLD && !fired) { setFired(true); onSwipeUp(); }
  }
  function onMouseUp() { mouseStartY.current = null; setLiftY(0); setFired(false); }

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: disabled ? "default" : "grab", userSelect: "none" }}>
      <div style={{ position: "relative", width: 54, height: 76, flexShrink: 0,
        transform: liftY > 0 ? "translateY(-" + liftY + "px)" : "none",
        transition: liftY === 0 ? "transform 0.25s ease-out" : "none" }}>
        {remaining > 0 ? (
          <>
            {remaining > 2 && <div style={{ position: "absolute", top: -3, left: 2, width: 54, height: 76, background: t.deckBg3, border: "2px solid " + t.deckBorder + "33", borderRadius: 8 }} />}
            {remaining > 1 && <div style={{ position: "absolute", top: -1.5, left: 1, width: 54, height: 76, background: t.deckBg2, border: "2px solid " + t.deckBorder + "66", borderRadius: 8 }} />}
            <div style={{ position: "absolute", top: 0, left: 0, width: 54, height: 76, background: t.deckBg1, border: "2px solid " + t.deckBorder, borderRadius: 8,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}>
              <span style={{ fontSize: 22, opacity: 0.5 }}>🂠</span>
              <span style={{ fontSize: 10, color: t.deckBorder, fontFamily: "Georgia,serif" }}>{remaining}</span>
            </div>
          </>
        ) : null}
      </div>
      <div style={{ fontSize: 11, color: disabled ? t.textDim : t.textMid, letterSpacing: 1, textTransform: "uppercase", fontFamily: "Georgia,serif" }}>
        {label}
      </div>
    </div>
  );
}

// ── CardEl ────────────────────────────────────────────────────────────────────
function CardEl({ card, selectable, selected, pop, theme }) {
  if (!card) return null;
  const t = theme;
  const isJoker = card.isJoker;
  const suitInfo = !isJoker ? t.suits[card.suit] : null;

  let bg = t.cardBg;
  let borderColor = t.cardBorder;
  let shadow = t.cardShadow;
  let textColor = isJoker ? t.accent : suitInfo.text;

  if (isJoker)   { bg = t.jokerBg; borderColor = t.jokerBorder; shadow = "0 0 12px " + t.jokerGlow; textColor = t.accent; }
  if (pop)       { bg = t.cardPopBg; borderColor = t.cardPopBorder; shadow = "0 0 10px " + t.cardPopBorder + "66"; }
  if (selected)  { bg = t.cardSelBg; borderColor = t.cardSelBorder; shadow = t.cardSelShadow; }
  if (selectable && !selected) { borderColor = t.cardHoverBorder; shadow = t.cardHoverShadow; }

  return (
    <div style={{
      display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
      width: 46, height: 64, flexShrink: 0, borderRadius: 7, padding: "3px 4px",
      background: bg, border: "2px solid " + borderColor, boxShadow: shadow,
      opacity: pop ? 0.4 : 1, cursor: selectable ? "pointer" : "default", transition: "all 0.15s",
      transform: selected ? "translateY(-8px) scale(1.05)" : "none", userSelect: "none",
    }}>
      <span style={{ fontSize: card.rank === "10" ? 9 : 11, fontFamily: "Georgia,serif", fontWeight: "bold", color: textColor, lineHeight: 1, alignSelf: "flex-start" }}>
        {isJoker ? "J" : card.rank}
      </span>
      <span style={{ fontSize: isJoker ? 18 : 16, lineHeight: 1, color: isJoker ? t.accent : (selected ? suitInfo.accent : suitInfo.text) }}>
        {isJoker ? "★" : card.suit}
      </span>
      <span style={{ fontSize: card.rank === "10" ? 9 : 11, fontFamily: "Georgia,serif", fontWeight: "bold", color: textColor, lineHeight: 1, alignSelf: "flex-end", transform: "rotate(180deg)" }}>
        {isJoker ? "R" : card.rank}
      </span>
    </div>
  );
}

// ── Btn ───────────────────────────────────────────────────────────────────────
function Btn({ onClick, disabled, children, variant, theme }) {
  const t = theme;
  const v = variant || "green";
  let s;
  if (v === "gold")   s = disabled ? t.btnGoldDis   : t.btnGold;
  else if (v==="purple") s = disabled ? t.btnPurpleDis : t.btnPurple;
  else                s = disabled ? t.btnGreenDis  : t.btnGreen;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: s.bg, color: s.color, border: s.border,
      padding: "11px 22px", borderRadius: 10, fontFamily: "Georgia,serif",
      fontWeight: "bold", fontSize: 15, cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : "0 3px 8px rgba(0,0,0,0.4)",
      transition: "all 0.15s", letterSpacing: 0.3, whiteSpace: "nowrap",
    }}>{children}</button>
  );
}

// ── GameLog ───────────────────────────────────────────────────────────────────
function GameLog({ entries, theme }) {
  const t = theme;
  return (
    <div style={{ maxHeight: 80, overflowY: "auto", background: t.logBg, border: "1px solid " + t.logBorder,
      borderRadius: 8, padding: "6px 10px", fontFamily: "monospace", fontSize: 11, color: t.logText,
      display: "flex", flexDirection: "column-reverse", gap: 2 }}>
      {entries.length === 0
        ? <span style={{ color: t.textDim }}>Game log…</span>
        : entries.map(function(e, i) { return <div key={i}>{e}</div>; })}
    </div>
  );
}

// ── BottomSheet ───────────────────────────────────────────────────────────────
function BottomSheet({ open, children, theme }) {
  const t = theme;
  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none", transition: "opacity 0.3s", zIndex: 40 }} />
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: t.sheetBg,
        border: "1px solid " + t.sheetBorder, borderBottom: "none", borderRadius: "20px 20px 0 0",
        padding: "20px 20px 44px", transform: open ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)", zIndex: 50,
        boxShadow: "0 -8px 40px rgba(0,0,0,0.7)" }}>
        <div style={{ width: 40, height: 4, background: t.textDim, borderRadius: 2, margin: "0 auto 20px", opacity: 0.4 }} />
        {children}
      </div>
    </>
  );
}

// ── CardRow ───────────────────────────────────────────────────────────────────
function CardRow({ row, animIds, canSelect, onResolve, prePhase, newCardId, theme }) {
  const [sel, setSel] = useState({ c1: false, c4: false });
  const rowRef = useRef(null);
  const t = theme;

  useEffect(function() { setSel({ c1: false, c4: false }); }, [row.length]);
  useEffect(function() {
    if (rowRef.current) rowRef.current.scrollLeft = rowRef.current.scrollWidth;
  }, [row.length]);

  const hasLast4 = row.length >= 4;
  const last4Start = row.length - 4;

  function toggleC1() {
    if (!canSelect || !hasLast4) return;
    const next = { ...sel, c1: !sel.c1 };
    setSel(next);
    if (next.c1 && next.c4) { setSel({ c1: false, c4: false }); onResolve(); }
  }
  function toggleC4() {
    if (!canSelect || !hasLast4) return;
    const next = { ...sel, c4: !sel.c4 };
    setSel(next);
    if (next.c1 && next.c4) { setSel({ c1: false, c4: false }); onResolve(); }
  }

  return (
    <div ref={rowRef} style={{ overflowX: "auto", display: "flex", alignItems: "center",
      gap: 6, padding: "14px 10px", background: t.fieldBg, border: "1px solid " + t.fieldBorder,
      borderRadius: 12, minHeight: 100, WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
      {row.length === 0 && (
        <span style={{ color: t.textDim, fontSize: 13, fontStyle: "italic", whiteSpace: "nowrap", margin: "0 auto" }}>
          {prePhase ? "Swipe up the deck to deal…" : "Swipe up the deck to deal…"}
        </span>
      )}
      {row.map(function(card, i) {
        const isPop = animIds.includes(card.id);
        const isNewCard = card.id === newCardId && !isPop;
        const isC1pos = hasLast4 && i === last4Start;
        const isC4pos = hasLast4 && i === row.length - 1;
        const isSelectable = canSelect && (isC1pos || isC4pos) && !isPop;
        const isSelected = (isC1pos && sel.c1) || (isC4pos && sel.c4);
        function handleClick() {
          if (!isSelectable) return;
          if (isC1pos) toggleC1(); else if (isC4pos) toggleC4();
        }
        return (
          <div key={card.id} onClick={handleClick}
            style={{ position: "relative", flexShrink: 0,
              animation: isPop ? "cOut 0.4s ease-in forwards" : isNewCard ? "cIn 0.2s ease-out" : "none" }}>
            {isSelectable && (
              <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)",
                fontSize: 9, color: isSelected ? t.accent : t.textMid,
                fontFamily: "Georgia,serif", whiteSpace: "nowrap", letterSpacing: 0.5 }}>
                {isC1pos ? "1st" : "4th"}
              </div>
            )}
            <CardEl card={card} selectable={isSelectable} selected={isSelected} pop={isPop} theme={t} />
          </div>
        );
      })}
    </div>
  );
}

// ── StatPill ──────────────────────────────────────────────────────────────────
function StatPill({ label, value, valueColor, theme }) {
  const t = theme;
  return (
    <div style={{ flex: 1, padding: "5px 6px", borderRadius: 8, background: t.statBg,
      border: "1px solid " + t.statBorder, textAlign: "center", fontSize: 11, color: t.textMid }}>
      {label} <b style={{ color: valueColor || t.textBright }}>{value}</b>
    </div>
  );
}

// ── SETUP ─────────────────────────────────────────────────────────────────────
function Setup({ onStart }) {
  const [mode, setMode] = useState("solo");
  const [themeId, setThemeId] = useState("classic");
  const theme = THEMES[themeId];
  const t = theme;

  const modes = [
    { id: "solo", emoji: "🃏", label: "Solo Solitaire",
      desc: "Remove every card before the deck runs out. Tap the 1st and 4th of the last four cards to resolve a match." },
    { id: "gold", emoji: "🌟", label: "Goldilocks",
      desc: "Two Jokers trigger scoring choices and debts. Hit an exact net score — not too low, not too high." },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: t.bgGradSetup, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "Georgia,serif" }}>
      <style>{`@keyframes cIn{from{transform:translateY(-16px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes cOut{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(0.3);opacity:0}}`}</style>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: t.textMid, textTransform: "uppercase", marginBottom: 6 }}>Card Game</div>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: "bold", color: t.titleColor, textShadow: "0 2px 12px " + t.accentDim }}>Solo Solitaire</h1>
        <div style={{ width: 80, height: 2, background: "linear-gradient(90deg,transparent," + t.accent + ",transparent)", margin: "10px auto 0" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 400, background: t.surface, border: "1px solid " + t.surfaceBorder,
        borderRadius: 16, padding: "20px 20px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", marginBottom: 14 }}>

        {/* Theme selector */}
        <div style={{ fontSize: 11, letterSpacing: 2, color: t.textMid, textTransform: "uppercase", marginBottom: 10 }}>Theme</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {Object.values(THEMES).map(function(th) {
            const active = themeId === th.id;
            return (
              <div key={th.id} onClick={function() { setThemeId(th.id); }}
                style={{ flex: 1, padding: "10px 8px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                  background: active ? th.selectorActiveBg : th.selectorBg,
                  border: "2px solid " + (active ? th.selectorActiveBorder : th.selectorBorder),
                  transition: "all 0.15s" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", margin: "0 auto 6px",
                  background: th.accent, boxShadow: active ? "0 0 12px " + th.accent : "none",
                  transition: "all 0.15s" }} />
                <div style={{ fontSize: 12, fontWeight: "bold", color: active ? th.accent : th.textMid, marginBottom: 2 }}>{th.name}</div>
                <div style={{ fontSize: 10, color: th.textDim, lineHeight: 1.3 }}>{th.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Mode selector */}
        <div style={{ fontSize: 11, letterSpacing: 2, color: t.textMid, textTransform: "uppercase", marginBottom: 10 }}>Mode</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {modes.map(function(m) {
            const active = mode === m.id;
            return (
              <div key={m.id} onClick={function() { setMode(m.id); }}
                style={{ padding: "13px 14px", borderRadius: 10, cursor: "pointer",
                  background: active ? t.selectorActiveBg : t.selectorBg,
                  border: "2px solid " + (active ? t.selectorActiveBorder : t.selectorBorder),
                  transition: "all 0.15s", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, marginTop: 3,
                  border: "2px solid " + (active ? t.accent : t.textDim),
                  background: active ? t.accent : "transparent", transition: "all 0.15s" }} />
                <div>
                  <div style={{ color: active ? t.accent : t.textMid, fontWeight: "bold", fontSize: 15, marginBottom: 4 }}>{m.emoji} {m.label}</div>
                  <div style={{ color: t.textDim, fontSize: 12, lineHeight: 1.5 }}>{m.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <Btn onClick={function() { onStart(mode, themeId); }} variant="gold" theme={t}>Deal Cards</Btn>
      </div>

      <div style={{ width: "100%", maxWidth: 400, background: t.surface, border: "1px solid " + t.surfaceBorder,
        borderRadius: 12, padding: "12px 16px", fontSize: 12, color: t.textDim, lineHeight: 1.9 }}>
        <div style={{ color: t.textMid, fontWeight: "bold", marginBottom: 4, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>How to Play</div>
        <div>👆 Swipe the deck upward to deal a card.</div>
        <div>🔢 Tap <b style={{ color: t.accent }}>1st &amp; 4th</b> cards — same rank → all four removed.</div>
        <div>♠ Tap <b style={{ color: t.accent }}>1st &amp; 4th</b> cards — same suit → middle two removed.</div>
        <div style={{ color: t.textDim, marginTop: 4 }}>You can miss a match and keep dealing.</div>
      </div>
    </div>
  );
}

// ── SOLO GAME ─────────────────────────────────────────────────────────────────
function SoloGame({ onBack, themeId }) {
  const theme = THEMES[themeId];
  const t = theme;
  const [deck, setDeck] = useState(function() { return shuffle(buildDeck(false)); });
  const [row, setRow] = useState([]);
  const [idx, setIdx] = useState(0);
  const [removed, setRemoved] = useState(0);
  const [log, setLog] = useState([]);
  const [animIds, setAnimIds] = useState([]);
  const [busy, setBusy] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [lastMatch, setLastMatch] = useState(null);
  const [newCardId, setNewCardId] = useState(null);

  function addLog(msg) { setLog(function(l) { return [msg, ...l]; }); }

  function deal() {
    if (idx >= deck.length || gameOver || busy) return;
    const card = deck[idx];
    const newIdx = idx + 1;
    setIdx(newIdx);
    setNewCardId(card.id);
    setRow(function(r) { return [...r, card]; });
    addLog("Dealt " + card.rank + card.suit);
    if (newIdx >= deck.length) {
      setTimeout(function() {
        setRow(function(cur) {
          setWon(cur.length === 0); setGameOver(true);
          if (cur.length > 0) addLog("Deck gone — " + cur.length + " left.");
          else addLog("🎉 Perfect game!");
          return cur;
        });
      }, 80);
    }
  }

  function handleResolve() {
    if (busy || gameOver || row.length < 4) return;
    const c1 = row[row.length - 4], c4 = row[row.length - 1];
    const isNumber = c1.rank === c4.rank, isSuit = c1.suit === c4.suit;
    if (!isNumber && !isSuit) return;
    const matchType = isNumber ? "number" : "suit";
    setBusy(true); setNewCardId(null);
    const toAnim = matchType === "number"
      ? row.slice(-4).map(function(c) { return c.id; })
      : [row[row.length - 3].id, row[row.length - 2].id];
    setAnimIds(toAnim); setLastMatch(matchType);
    setTimeout(function() {
      const firstNext = matchType === "number"
        ? row.slice(0, -4)
        : row.slice(0, row.length - 3).concat([row[row.length - 1]]);
      const result = resolveAll(firstNext, null, false, 0, false, false, 0);
      setAnimIds([]); setRow(result.finalRow);
      setRemoved(function(r) { return r + (matchType === "number" ? 4 : 2); });
      addLog(matchType === "number"
        ? "🔢 Number match — " + row.slice(-4).map(function(c){ return c.rank+c.suit; }).join(" ") + " removed"
        : "♠ Suit match — " + row[row.length-3].rank+row[row.length-3].suit + " & " + row[row.length-2].rank+row[row.length-2].suit + " removed");
      result.lines.forEach(function(l) { addLog(l); });
      setBusy(false);
      if (idx >= deck.length) {
        setWon(result.finalRow.length === 0); setGameOver(true);
        if (result.finalRow.length > 0) addLog("Deck gone — " + result.finalRow.length + " left.");
        else addLog("🎉 Perfect game!");
      }
    }, 380);
  }

  function restart() {
    setDeck(shuffle(buildDeck(false))); setRow([]); setIdx(0); setRemoved(0); setLog([]);
    setAnimIds([]); setBusy(false); setGameOver(false); setWon(false); setLastMatch(null); setNewCardId(null);
  }

  const remaining = deck.length - idx;
  const canDeal = !gameOver && remaining > 0 && !busy;
  const canSelect = !gameOver && !busy && row.length >= 4;
  var matchAvailable = false;
  if (canSelect) { const c1 = row[row.length-4], c4 = row[row.length-1]; matchAvailable = c1.rank===c4.rank || c1.suit===c4.suit; }

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: t.bgGrad, fontFamily: "Georgia,serif", overflow: "hidden" }}>
      <style>{`@keyframes cIn{from{transform:translateY(-16px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes cOut{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(0.3);opacity:0}}`}</style>

      {/* Header */}
      <div style={{ padding: "14px 16px 10px", flexShrink: 0 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: "bold", color: t.titleColor }}>Solo Solitaire</h1>
          <div style={{ position: "absolute", right: 0, display: "flex", gap: 6 }}>
            <button onClick={restart} style={{ background: "none", border: "none", color: t.textMid, fontSize: 18, cursor: "pointer", padding: 4 }}>↺</button>
            <button onClick={onBack} style={{ background: "none", border: "none", color: t.textMid, fontSize: 18, cursor: "pointer", padding: 4 }}>☰</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <StatPill label="Deck" value={remaining} valueColor={t.accent} theme={t} />
          <StatPill label="Row" value={row.length} valueColor={t.textBright} theme={t} />
          <StatPill label="Removed" value={removed} valueColor={t.textMid} theme={t} />
        </div>
      </div>

      {/* Field */}
      <div style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
        <div style={{ fontSize: 12, textAlign: "center", color: matchAvailable ? t.accent : t.textDim, minHeight: 18 }}>
          {canSelect && (matchAvailable ? "✦ Match available — tap 1st and 4th cards" : "Tap 1st & 4th cards to check for a match")}
        </div>
        <CardRow row={row} animIds={animIds} canSelect={canSelect} onResolve={handleResolve}
          prePhase={false} newCardId={newCardId} theme={t} />
        <div style={{ textAlign: "center", minHeight: 24 }}>
          {lastMatch && (
            <span style={{ display: "inline-block", padding: "3px 14px", borderRadius: 20, fontSize: 11,
              background: lastMatch === "number" ? t.matchNumberBg : t.matchSuitBg,
              border: "1px solid " + (lastMatch === "number" ? t.matchNumberBorder : t.matchSuitBorder),
              color: lastMatch === "number" ? t.matchNumberText : t.matchSuitText, letterSpacing: 1 }}>
              {lastMatch === "number" ? "🔢 NUMBER MATCH" : "♠ SUIT MATCH"}
            </span>
          )}
        </div>
        <GameLog entries={log} theme={t} />
      </div>

      {/* Bottom */}
      <div style={{ flexShrink: 0, padding: "16px 16px 36px", borderTop: "1px solid " + t.bottomBorder,
        background: t.bottomBg, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        {gameOver ? (
          <div style={{ textAlign: "center", padding: "12px 20px", borderRadius: 14, width: "100%",
            background: won ? "rgba(80,200,80,0.1)" : t.surface, border: "1px solid " + (won ? "#4a9a4a" : t.surfaceBorder) }}>
            <div style={{ fontSize: 26, marginBottom: 4 }}>{won ? "🎉" : "🃏"}</div>
            <div style={{ color: won ? "#a8e8a8" : t.textBright, fontWeight: "bold", fontSize: 17, marginBottom: 8 }}>
              {won ? "Perfect Game!" : "Game Over — " + row.length + " card(s) remain"}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn onClick={restart} variant="gold" theme={t}>↺ New Game</Btn>
              <Btn onClick={onBack} variant="green" theme={t}>↩ Menu</Btn>
            </div>
          </div>
        ) : (
          <SwipeableDeck remaining={remaining} onSwipeUp={deal} disabled={!canDeal}
            label={canDeal ? "swipe up to deal" : "dealing…"} theme={t} />
        )}
      </div>
    </div>
  );
}

// ── GOLDILOCKS GAME ───────────────────────────────────────────────────────────
function GoldilocksGame({ onBack, themeId }) {
  const theme = THEMES[themeId];
  const t = theme;
  const [deck] = useState(function() { return shuffle(buildDeck(true)); });
  const [row, setRow] = useState([]);
  const [idx, setIdx] = useState(0);
  const [log, setLog] = useState([]);
  const [animIds, setAnimIds] = useState([]);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState("pre");
  const [scoringType, setScoringType] = useState(null);
  const [score, setScore] = useState(0);
  const [debt1Paid, setDebt1Paid] = useState(false);
  const [debt2Paid, setDebt2Paid] = useState(false);
  const [jokersFound, setJokersFound] = useState(0);
  const [lastMatch, setLastMatch] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [savedForJoker1, setSavedForJoker1] = useState(null);
  const [newCardId, setNewCardId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function addLog(msg) { setLog(function(l) { return [msg, ...l]; }); }

  function finishGame(finalScore, d1, d2) {
    setGameOver(true); setPhase("done");
    const net = finalScore - (d1 ? DEBT1 : 0) - (d2 ? DEBT2 : 0);
    addLog("Game over. Score: " + finalScore + " · Net: " + net);
  }

  function chooseScoring(type) {
    setSheetOpen(false); setScoringType(type); setPhase("scoring");
    addLog("Chose " + (type === "number" ? "Number" : "Suit") + " scoring — resolving deferred matches…");
    var saved = savedForJoker1;
    var result = resolveAll(saved.currentRow, type, true, saved.currentScore, saved.d1, saved.d2, 1);
    result.lines.forEach(function(l) { addLog(l); });
    var newScore = saved.currentScore + result.pts;
    setScore(newScore); setDebt1Paid(result.nd1); setDebt2Paid(result.nd2); setRow(result.finalRow);
    if (result.lines.some(function(l) { return l.includes("Number"); })) setLastMatch("number");
    else if (result.lines.some(function(l) { return l.includes("Suit"); })) setLastMatch("suit");
    setSavedForJoker1(null);
    if (saved.deckDone) finishGame(newScore, result.nd1, result.nd2);
  }

  function deal() {
    if (idx >= deck.length || gameOver || busy || phase === "choose") return;
    const card = deck[idx];
    const newIdx = idx + 1;
    setIdx(newIdx);
    if (card.isJoker) {
      const nj = jokersFound + 1; setJokersFound(nj);
      if (nj === 1) {
        setSavedForJoker1({ currentRow: row, currentScore: score, d1: debt1Paid, d2: debt2Paid, deckDone: newIdx >= deck.length });
        setPhase("choose"); setSheetOpen(true);
        addLog("🌟 First Joker! Choose your scoring type.");
      } else {
        const flipped = scoringType === "number" ? "suit" : "number";
        setScoringType(flipped);
        addLog("🌟 Second Joker! Scoring flips → " + (flipped === "number" ? "Number" : "Suit"));
        if (newIdx >= deck.length) finishGame(score, debt1Paid, debt2Paid);
      }
      return;
    }
    setNewCardId(card.id);
    setRow(function(r) { return [...r, card]; });
    addLog("Dealt " + card.rank + card.suit);
    if (newIdx >= deck.length) {
      setTimeout(function() {
        setRow(function(cur) { finishGame(score, debt1Paid, debt2Paid); return cur; });
      }, 80);
    }
  }

  function handleResolve() {
    if (busy || gameOver || row.length < 4 || phase !== "scoring") return;
    const c1 = row[row.length - 4], c4 = row[row.length - 1];
    const isNumber = c1.rank === c4.rank, isSuit = c1.suit === c4.suit;
    if (!isNumber && !isSuit) return;
    const matchType = isNumber ? "number" : "suit";
    setBusy(true); setNewCardId(null);
    const toAnim = matchType === "number"
      ? row.slice(-4).map(function(c) { return c.id; })
      : [row[row.length - 3].id, row[row.length - 2].id];
    setAnimIds(toAnim); setLastMatch(matchType);
    setTimeout(function() {
      const firstNext = matchType === "number"
        ? row.slice(0, -4)
        : row.slice(0, row.length - 3).concat([row[row.length - 1]]);
      const active = (matchType === "number" && scoringType === "number") || (matchType === "suit" && scoringType === "suit");
      const firstEarned = active ? (matchType === "number" ? 4 : 2) : 0;
      const result = resolveAll(firstNext, scoringType, true, score + firstEarned, debt1Paid, debt2Paid, jokersFound);
      const newScore = score + firstEarned + result.pts;
      const nd1 = result.nd1 || (!debt1Paid && newScore >= DEBT1);
      const nd2 = result.nd2 || (nd1 && jokersFound >= 2 && !debt2Paid && newScore >= DEBT1 + DEBT2);
      setAnimIds([]); setRow(result.finalRow); setScore(newScore); setDebt1Paid(nd1); setDebt2Paid(nd2);
      addLog(matchType === "number"
        ? "🔢 Number match — 4 removed" + (firstEarned > 0 ? ", +" + firstEarned + " pts" : "")
        : "♠ Suit match — 2 removed" + (firstEarned > 0 ? ", +" + firstEarned + " pts" : ""));
      result.lines.forEach(function(l) { addLog(l); });
      if (nd1 && !debt1Paid) addLog("✓ Debt 1 paid!");
      if (nd2 && !debt2Paid) addLog("✓ Debt 2 paid!");
      setBusy(false);
      if (idx >= deck.length) finishGame(newScore, nd1, nd2);
    }, 380);
  }

  const remaining = deck.length - idx;
  const canDeal = !gameOver && remaining > 0 && !busy && phase !== "choose";
  const canSelect = !gameOver && !busy && phase === "scoring" && row.length >= 4;
  const net = score - (debt1Paid ? DEBT1 : 0) - (debt2Paid ? DEBT2 : 0);
  const victory = gameOver && debt1Paid && debt2Paid && GOLDILOCKS_TARGETS.includes(net);
  var matchAvailable = false;
  if (canSelect) { const c1 = row[row.length-4], c4 = row[row.length-1]; matchAvailable = c1.rank===c4.rank||c1.suit===c4.suit; }

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: t.bgGrad, fontFamily: "Georgia,serif", overflow: "hidden" }}>
      <style>{`@keyframes cIn{from{transform:translateY(-16px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes cOut{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(0.3);opacity:0}}@keyframes jPulse{0%,100%{opacity:0.7}50%{opacity:1}}`}</style>

      {/* Header */}
      <div style={{ padding: "14px 16px 10px", flexShrink: 0 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: "bold", color: t.titleColor }}>Goldilocks</h1>
          <div style={{ position: "absolute", right: 0 }}>
            <button onClick={onBack} style={{ background: "none", border: "none", color: t.textMid, fontSize: 18, cursor: "pointer", padding: 4 }}>☰</button>
          </div>
        </div>
        {/* Stats */}
        <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
          <StatPill label="Deck" value={remaining} valueColor={t.accent} theme={t} />
          <StatPill label="Score" value={score} valueColor={t.textBright} theme={t} />
          <StatPill label="Net" value={net} valueColor={t.accent} theme={t} />
          <div style={{ flex: 1, padding: "5px 6px", borderRadius: 8, background: scoringType ? t.selectorActiveBg : t.statBg,
            border: "1px solid " + (scoringType ? t.accent + "44" : t.statBorder), textAlign: "center", fontSize: 11, color: scoringType ? t.accent : t.textDim }}>
            {scoringType ? (scoringType === "number" ? "🔢 Num" : "♠ Suit") : "No scoring"}
          </div>
        </div>
        {/* Debts + jokers */}
        <div style={{ display: "flex", gap: 5 }}>
          {[
            { label: "Debt 1: " + DEBT1, paid: debt1Paid, active: jokersFound >= 1 },
            { label: "Debt 2: " + DEBT2, paid: debt2Paid, active: jokersFound >= 2 },
          ].map(function(item) {
            return (
              <div key={item.label} style={{ flex: 1, padding: "5px 6px", borderRadius: 8, textAlign: "center",
                background: item.paid ? "rgba(50,170,50,0.12)" : item.active ? "rgba(200,100,40,0.12)" : t.statBg,
                border: "1px solid " + (item.paid ? "#3ab83a40" : item.active ? "#c8640040" : t.statBorder),
                fontSize: 11, color: item.paid ? "#6ae86a" : item.active ? "#e8a060" : t.textDim }}>
                {item.paid ? "✓" : item.active ? "⏳" : "🔒"} {item.label}
              </div>
            );
          })}
          {[1, 2].map(function(n) {
            return (
              <div key={n} style={{ flex: 1, padding: "5px 6px", borderRadius: 8, textAlign: "center",
                background: jokersFound >= n ? t.selectorActiveBg : t.statBg,
                border: "1px solid " + (jokersFound >= n ? t.accent + "55" : t.statBorder),
                fontSize: 11, color: jokersFound >= n ? t.accent : t.textDim,
                animation: jokersFound === n ? "jPulse 1.2s ease-in-out 3" : "none" }}>
                J{n} {jokersFound >= n ? "✓" : "—"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Field */}
      <div style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
        <div style={{ fontSize: 12, textAlign: "center", minHeight: 18,
          color: phase === "pre" ? t.textDim : matchAvailable ? t.accent : t.textDim, fontStyle: phase === "pre" ? "italic" : "normal" }}>
          {phase === "pre" && row.length > 0 && "Accumulating — no matches until you choose scoring"}
          {phase === "scoring" && canSelect && (matchAvailable ? "✦ Match available — tap 1st and 4th cards" : "Tap 1st & 4th cards to check for a match")}
        </div>
        <CardRow row={row} animIds={animIds} canSelect={canSelect} onResolve={handleResolve}
          prePhase={phase === "pre"} newCardId={newCardId} theme={t} />
        {!gameOver && (
          <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
            {GOLDILOCKS_TARGETS.map(function(tgt) {
              return (
                <div key={tgt} style={{ padding: "2px 9px", borderRadius: 12, fontSize: 11,
                  background: t.accentDim, border: "1px solid " + t.accent + "33", color: t.accent + "88" }}>
                  {tgt}
                </div>
              );
            })}
          </div>
        )}
        <div style={{ textAlign: "center", minHeight: 22 }}>
          {lastMatch && (
            <span style={{ display: "inline-block", padding: "3px 14px", borderRadius: 20, fontSize: 11,
              background: lastMatch === "number" ? t.matchNumberBg : t.matchSuitBg,
              border: "1px solid " + (lastMatch === "number" ? t.matchNumberBorder : t.matchSuitBorder),
              color: lastMatch === "number" ? t.matchNumberText : t.matchSuitText, letterSpacing: 1 }}>
              {lastMatch === "number" ? "🔢 NUMBER MATCH" : "♠ SUIT MATCH"}
            </span>
          )}
        </div>
        <GameLog entries={log} theme={t} />
      </div>

      {/* Bottom */}
      <div style={{ flexShrink: 0, padding: "16px 16px 36px", borderTop: "1px solid " + t.bottomBorder,
        background: t.bottomBg, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        {gameOver ? (
          <div style={{ textAlign: "center", padding: "12px 20px", borderRadius: 14, width: "100%",
            background: victory ? "rgba(80,200,80,0.1)" : t.surface, border: "1px solid " + (victory ? "#4a9a4a" : t.surfaceBorder) }}>
            <div style={{ fontSize: 26, marginBottom: 4 }}>{victory ? "🎉" : "🌟"}</div>
            <div style={{ color: victory ? "#a8e8a8" : t.textBright, fontWeight: "bold", fontSize: 17, marginBottom: 4 }}>
              {victory ? "Victory! Net: " + net : "Round Complete"}
            </div>
            <div style={{ color: t.textMid, fontSize: 12, marginBottom: 8 }}>
              Score: {score} · Debts: {(debt1Paid ? DEBT1 : 0) + (debt2Paid ? DEBT2 : 0)} · Net: {net}
            </div>
            {!debt1Paid && <div style={{ color: "#e87050", fontSize: 12, marginBottom: 4 }}>Debt 1 unpaid</div>}
            {!debt2Paid && <div style={{ color: "#e87050", fontSize: 12, marginBottom: 4 }}>Debt 2 unpaid</div>}
            {!victory && <div style={{ color: t.textDim, fontSize: 12, marginBottom: 8 }}>Targets: {GOLDILOCKS_TARGETS.join(", ")}</div>}
            <Btn onClick={onBack} variant="green" theme={t}>↩ Menu</Btn>
          </div>
        ) : (
          <SwipeableDeck remaining={remaining} onSwipeUp={deal} disabled={!canDeal}
            label={phase === "choose" ? "choose scoring first" : canDeal ? "swipe up to deal" : "dealing…"}
            theme={t} />
        )}
      </div>

      {/* Joker bottom sheet */}
      <BottomSheet open={sheetOpen} theme={t}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌟</div>
          <div style={{ color: t.accent, fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>First Joker</div>
          <div style={{ color: t.textMid, fontSize: 14, marginBottom: 6, lineHeight: 1.5 }}>Choose which match type earns points.</div>
          <div style={{ color: t.textDim, fontSize: 12, marginBottom: 20, lineHeight: 1.5 }}>
            All deferred matches in the row will resolve once you choose.
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Btn onClick={function() { chooseScoring("number"); }} variant="gold" theme={t}>🔢 Number</Btn>
            <Btn onClick={function() { chooseScoring("suit"); }} variant="purple" theme={t}>♠ Suit</Btn>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("setup");
  const [mode, setMode] = useState(null);
  const [themeId, setThemeId] = useState("classic");

  if (screen === "setup") return <Setup onStart={function(m, tid) { setMode(m); setThemeId(tid); setScreen("play"); }} />;
  if (mode === "solo")    return <SoloGame onBack={function() { setScreen("setup"); }} themeId={themeId} />;
  if (mode === "gold")    return <GoldilocksGame onBack={function() { setScreen("setup"); }} themeId={themeId} />;
  return <Setup onStart={function(m, tid) { setMode(m); setThemeId(tid); setScreen("play"); }} />;
}
