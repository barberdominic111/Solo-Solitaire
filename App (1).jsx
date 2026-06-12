import { useState, useEffect } from "react";

const SUITS = ["♠", "♥", "♦", "♣"];
const SUIT_COLORS = { "♠": "#a8c8f8", "♥": "#f87878", "♦": "#f87878", "♣": "#a8c8f8" };
const RANKS = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const GOLDILOCKS_TARGETS = [10, 14, 18, 22, 26];
const DEBT1 = 5;
const DEBT2 = 8;

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

// Given a row, check the last 4 positions for a match. Returns match info or null.
function checkTail(row) {
  if (row.length < 4) return null;
  const c1 = row[row.length - 4];
  const c4 = row[row.length - 1];
  if (c1.rank === c4.rank) {
    return { type: "number", nextRow: row.slice(0, -4), count: 4 };
  }
  if (c1.suit === c4.suit) {
    return { type: "suit", nextRow: row.slice(0, row.length - 3).concat([row[row.length - 1]]), count: 2 };
  }
  return null;
}

// Cascade: keep resolving tail matches until none remain. Returns {finalRow, matches:[{type,count}]}
function cascadeResolve(startRow) {
  var r = startRow.slice();
  var matches = [];
  var m;
  while ((m = checkTail(r)) !== null) {
    matches.push({ type: m.type, count: m.count });
    r = m.nextRow;
  }
  return { finalRow: r, matches: matches };
}

// ── Shared UI components ──────────────────────────────────────────────────────

function CardEl({ card, selectable, selected, pop, isNew }) {
  if (!card) return null;
  const isRed = card.suit === "♥" || card.suit === "♦";
  const isJoker = card.isJoker;

  let bg = "#fdf6e3";
  let borderColor = "#8b6914";
  let shadow = "0 2px 6px rgba(0,0,0,0.4)";

  if (isJoker)    { bg = "#1a1a3a"; borderColor = "#8080d0"; shadow = "0 0 12px #8080d099"; }
  if (pop)        { bg = "#3a1a1a"; borderColor = "#c84040"; shadow = "0 0 10px #c8404066"; }
  if (selected)   { bg = "#2a2000"; borderColor = "#f5c518"; shadow = "0 0 14px #f5c51899"; }
  if (selectable && !selected) { borderColor = "#c8a832"; shadow = "0 0 8px #c8a83244"; }

  return (
    <div
      onClick={selectable ? undefined : undefined}
      style={{
        display: "inline-flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between",
        width: 44, height: 62, flexShrink: 0, borderRadius: 7, padding: "3px 4px",
        background: bg,
        border: "2px solid " + borderColor,
        boxShadow: shadow,
        opacity: pop ? 0.4 : 1,
        cursor: selectable ? "pointer" : "default",
        transition: "all 0.15s",
        animation: isNew ? "cIn 0.2s ease-out" : pop ? "cOut 0.42s ease-in forwards" : "none",
        transform: selected ? "translateY(-6px)" : "none",
        userSelect: "none",
      }}
    >
      <span style={{
        fontSize: card.rank === "10" ? 9 : 10, fontFamily: "Georgia,serif", fontWeight: "bold",
        color: isJoker ? "#a0a0f0" : isRed ? "#c84040" : "#1a1a2a", lineHeight: 1, alignSelf: "flex-start"
      }}>
        {isJoker ? "J" : card.rank}
      </span>
      <span style={{ fontSize: isJoker ? 18 : 15, lineHeight: 1, color: isJoker ? "#a0a0f0" : SUIT_COLORS[card.suit] }}>
        {isJoker ? "★" : card.suit}
      </span>
      <span style={{
        fontSize: card.rank === "10" ? 9 : 10, fontFamily: "Georgia,serif", fontWeight: "bold",
        color: isJoker ? "#a0a0f0" : isRed ? "#c84040" : "#1a1a2a", lineHeight: 1,
        alignSelf: "flex-end", transform: "rotate(180deg)"
      }}>
        {isJoker ? "R" : card.rank}
      </span>
    </div>
  );
}

function Btn({ onClick, disabled, children, variant }) {
  const v = variant || "green";
  let bg, color, border;
  if (v === "gold") {
    bg = disabled ? "#3a3020" : "linear-gradient(180deg,#c8a832,#906010)";
    color = disabled ? "#5a4a30" : "#1a0f00";
    border = "2px solid " + (disabled ? "#2a2010" : "#604000");
  } else if (v === "purple") {
    bg = disabled ? "#2a2040" : "linear-gradient(180deg,#7060c0,#503080)";
    color = disabled ? "#4a3a6a" : "#e8e0ff";
    border = "2px solid " + (disabled ? "#1a1030" : "#301060");
  } else {
    bg = disabled ? "#2a3c2a" : "linear-gradient(180deg,#3a6a3a,#2a5a2a)";
    color = disabled ? "#4a6a4a" : "#c8e8c8";
    border = "2px solid " + (disabled ? "#2a3a2a" : "#1a4a1a");
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: bg, color: color, border: border,
      padding: "10px 18px", borderRadius: 8,
      fontFamily: "Georgia,serif", fontWeight: "bold", fontSize: 14,
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : "0 3px 8px rgba(0,0,0,0.35)",
      transition: "all 0.15s", letterSpacing: 0.3, whiteSpace: "nowrap"
    }}>
      {children}
    </button>
  );
}

function GameLog({ entries }) {
  return (
    <div style={{
      maxHeight: 90, overflowY: "auto", background: "#0a130a",
      border: "1px solid #1a3a1a", borderRadius: 8, padding: "6px 10px",
      fontFamily: "monospace", fontSize: 11, color: "#6a9a6a",
      display: "flex", flexDirection: "column-reverse", gap: 2
    }}>
      {entries.length === 0
        ? <span style={{ color: "#2a4a2a" }}>Game log…</span>
        : entries.map(function(e, i) { return <div key={i}>{e}</div>; })}
    </div>
  );
}

function DeckVisual({ remaining, blue }) {
  const bc = blue ? "#2a5a80" : "#4a8a4a";
  const bg1 = blue ? "#122535" : "#223a22";
  const bg2 = blue ? "#102030" : "#1e401e";
  const bg3 = blue ? "#0d1e2e" : "#1a3a1a";
  return (
    <div style={{ position: "relative", width: 44, height: 62, flexShrink: 0 }}>
      {remaining > 0 ? (
        <>
          {remaining > 2 && <div style={{ position: "absolute", top: -3, left: 2, width: 44, height: 62, background: bg3, border: "2px solid " + bc + "44", borderRadius: 7 }} />}
          {remaining > 1 && <div style={{ position: "absolute", top: -1.5, left: 1, width: 44, height: 62, background: bg2, border: "2px solid " + bc + "77", borderRadius: 7 }} />}
          <div style={{ position: "absolute", top: 0, left: 0, width: 44, height: 62, background: bg1, border: "2px solid " + bc, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 20, opacity: 0.35 }}>🂠</span>
          </div>
        </>
      ) : (
        <div style={{ width: 44, height: 62, border: "2px dashed " + bc + "44", borderRadius: 7, opacity: 0.3 }} />
      )}
    </div>
  );
}

// ── SETUP ─────────────────────────────────────────────────────────────────────

function Setup({ onStart }) {
  const [mode, setMode] = useState("solo");
  const modes = [
    { id: "solo", emoji: "🃏", label: "Solo Solitaire", desc: "Remove every card before the deck runs out. Tap the 1st and 4th of the last four cards to trigger a match." },
    { id: "gold", emoji: "🌟", label: "Goldilocks", desc: "Two Jokers trigger scoring choices and debts. Hit an exact net score — not too low, not too high." },
  ];
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, #1e4a1e 0%, #0d2a0d 60%, #071507 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px 16px", fontFamily: "Georgia,serif"
    }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#6aaa6a", textTransform: "uppercase", marginBottom: 6 }}>Card Game</div>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: "bold", color: "#e8d88a", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>Solo Solitaire</h1>
        <div style={{ width: 80, height: 2, background: "linear-gradient(90deg,transparent,#c8a832,transparent)", margin: "10px auto 0" }} />
      </div>
      <div style={{
        width: "100%", maxWidth: 400, background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(200,168,50,0.2)", borderRadius: 16, padding: "22px 22px 26px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
      }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#6aaa6a", textTransform: "uppercase", marginBottom: 12 }}>Choose Mode</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {modes.map(function(m) {
            return (
              <div key={m.id} onClick={function() { setMode(m.id); }} style={{
                padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                background: mode === m.id ? "rgba(200,168,50,0.12)" : "rgba(255,255,255,0.03)",
                border: "2px solid " + (mode === m.id ? "#c8a832" : "rgba(255,255,255,0.08)"),
                transition: "all 0.15s", display: "flex", alignItems: "flex-start", gap: 12
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%", flexShrink: 0, marginTop: 3,
                  border: "2px solid " + (mode === m.id ? "#c8a832" : "#3a5a3a"),
                  background: mode === m.id ? "#c8a832" : "transparent"
                }} />
                <div>
                  <div style={{ color: mode === m.id ? "#e8d88a" : "#8aaa8a", fontWeight: "bold", fontSize: 15, marginBottom: 4 }}>{m.emoji} {m.label}</div>
                  <div style={{ color: "#4a6a4a", fontSize: 12, lineHeight: 1.5 }}>{m.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
        <Btn onClick={function() { onStart(mode); }} variant="gold">Deal Cards</Btn>
      </div>
      <div style={{
        marginTop: 16, width: "100%", maxWidth: 400, background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 16px",
        fontSize: 12, color: "#4a7a4a", lineHeight: 1.8
      }}>
        <div style={{ color: "#6aaa6a", fontWeight: "bold", marginBottom: 4, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>How to Play</div>
        <div>Deal cards one at a time into the row.</div>
        <div>🔢 Tap cards <b style={{color:"#c8a832"}}>1 &amp; 4</b> of the last four — same rank → all four vanish.</div>
        <div>♠ Tap cards <b style={{color:"#7bafd4"}}>1 &amp; 4</b> of the last four — same suit → middle two vanish.</div>
        <div style={{ color: "#3a5a3a", marginTop: 4 }}>You can miss a match and keep dealing.</div>
      </div>
    </div>
  );
}

// ── Row component with selection logic ────────────────────────────────────────
// selectable positions: only the last 4 cards, specifically positions -4 and -1 (indices 0 and 3 of last4)
// Tapping c1 or c4 of last4 toggles selection. When both are selected, auto-resolves.

function CardRow({ row, animIds, canSelect, onResolve, blue, prePhase }) {
  const [sel, setSel] = useState({ c1: false, c4: false });

  // Reset selection whenever row changes
  useEffect(function() { setSel({ c1: false, c4: false }); }, [row.length]);

  const last4Start = row.length - 4; // index of c1 in row
  const hasLast4 = row.length >= 4;

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

  const bgColor = blue ? "#080e18" : "#0d1a0d";
  const borderColor = blue ? "#0d1e30" : "#1a3a1a";

  return (
    <div style={{
      minHeight: 86, background: bgColor, border: "1px solid " + borderColor,
      borderRadius: 10, padding: "10px 8px", marginBottom: 12,
      display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6,
      justifyContent: row.length === 0 ? "center" : "flex-start",
      position: "relative"
    }}>
      {row.length === 0 && (
        <span style={{ color: blue ? "#1a2a3a" : "#1e3e1e", fontSize: 12, fontStyle: "italic" }}>
          Deal a card to begin…
        </span>
      )}
      {row.map(function(card, i) {
        const isPop = animIds.includes(card.id);
        const isNew = i === row.length - 1 && animIds.length === 0;
        const isC1pos = hasLast4 && i === last4Start;
        const isC4pos = hasLast4 && i === row.length - 1;
        const isSelectable = canSelect && (isC1pos || isC4pos) && !isPop;
        const isSelected = (isC1pos && sel.c1) || (isC4pos && sel.c4);

        function handleClick() {
          if (!isSelectable) return;
          if (isC1pos) toggleC1();
          else if (isC4pos) toggleC4();
        }

        return (
          <div key={card.id} style={{ position: "relative" }} onClick={handleClick}>
            {/* Position label above c1 and c4 when selectable */}
            {isSelectable && (
              <div style={{
                position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)",
                fontSize: 9, color: isSelected ? "#f5c518" : "#6a8a6a",
                fontFamily: "Georgia,serif", letterSpacing: 0.5, whiteSpace: "nowrap",
              }}>
                {isC1pos ? "1st" : "4th"}
              </div>
            )}
            <CardEl
              card={card}
              selectable={isSelectable}
              selected={isSelected}
              pop={isPop}
              isNew={isNew}
            />
          </div>
        );
      })}
      {/* Hint when prePhase */}
      {prePhase && row.length > 0 && (
        <div style={{
          position: "absolute", bottom: 4, right: 8,
          fontSize: 10, color: "#2a4a3a", fontStyle: "italic"
        }}>
          accumulating…
        </div>
      )}
    </div>
  );
}

// ── SOLO GAME ─────────────────────────────────────────────────────────────────

function SoloGame({ onBack }) {
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
  const [invalidFlash, setInvalidFlash] = useState(false);

  function addLog(msg) { setLog(function(l) { return [msg, ...l]; }); }

  function deal() {
    if (idx >= deck.length || gameOver || busy) return;
    const card = deck[idx];
    const newIdx = idx + 1;
    setIdx(newIdx);
    setRow(function(r) { return [...r, card]; });
    addLog("Dealt " + card.rank + card.suit);
    if (newIdx >= deck.length) {
      // Will check game over after state settles — use a flag
      setTimeout(function() {
        setRow(function(currentRow) {
          if (currentRow.length > 0) addLog("Deck gone — " + currentRow.length + " left.");
          else addLog("🎉 Perfect game!");
          setWon(currentRow.length === 0);
          setGameOver(true);
          return currentRow;
        });
      }, 50);
    }
  }

  function handleResolve() {
    if (busy || gameOver || row.length < 4) return;
    const c1 = row[row.length - 4];
    const c4 = row[row.length - 1];
    const isNumber = c1.rank === c4.rank;
    const isSuit = c1.suit === c4.suit;

    if (!isNumber && !isSuit) {
      // Invalid — flash
      setInvalidFlash(true);
      setTimeout(function() { setInvalidFlash(false); }, 600);
      return;
    }

    const matchType = isNumber ? "number" : "suit";
    setBusy(true);
    const toAnim = matchType === "number"
      ? row.slice(-4).map(function(c) { return c.id; })
      : [row[row.length - 3].id, row[row.length - 2].id];
    setAnimIds(toAnim);
    setLastMatch(matchType);

    setTimeout(function() {
      var firstNext = matchType === "number"
        ? row.slice(0, -4)
        : row.slice(0, row.length - 3).concat([row[row.length - 1]]);
      var result = cascadeResolve(firstNext);
      var totalRemoved = (matchType === "number" ? 4 : 2);
      result.matches.forEach(function(m) { totalRemoved += m.count; });

      setAnimIds([]);
      setRow(result.finalRow);
      setRemoved(function(r) { return r + totalRemoved; });

      addLog(matchType === "number"
        ? "🔢 Number match — " + row.slice(-4).map(function(c) { return c.rank + c.suit; }).join(" ") + " removed"
        : "♠ Suit match — " + row[row.length - 3].rank + row[row.length - 3].suit + " & " + row[row.length - 2].rank + row[row.length - 2].suit + " removed");
      result.matches.forEach(function(m) {
        addLog(m.type === "number" ? "🔢 Cascade — number match, " + m.count + " removed" : "♠ Cascade — suit match, " + m.count + " removed");
      });

      setBusy(false);
      if (idx >= deck.length) {
        setGameOver(true);
        setWon(result.finalRow.length === 0);
        if (result.finalRow.length > 0) addLog("Deck gone — " + result.finalRow.length + " left.");
        else addLog("🎉 Perfect game!");
      }
    }, 380);
  }

  function restart() {
    setDeck(shuffle(buildDeck(false)));
    setRow([]); setIdx(0); setRemoved(0); setLog([]);
    setAnimIds([]); setBusy(false); setGameOver(false); setWon(false); setLastMatch(null);
  }

  const remaining = deck.length - idx;
  const canDeal = !gameOver && remaining > 0 && !busy;
  const canSelect = !gameOver && !busy && row.length >= 4;

  // Check if the current last-4 have any valid match (to hint the player)
  var matchAvailable = false;
  if (row.length >= 4) {
    const c1 = row[row.length - 4];
    const c4 = row[row.length - 1];
    matchAvailable = c1.rank === c4.rank || c1.suit === c4.suit;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, #1e4a1e 0%, #0d2a0d 60%, #071507 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "20px 16px 40px", fontFamily: "Georgia,serif"
    }}>
      <style>{`
        @keyframes cIn  { from { transform: translateY(-14px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes cOut { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(0.3); opacity: 0; } }
        @keyframes flash { 0%,100% { background: rgba(255,255,255,0.04); } 50% { background: rgba(200,60,60,0.18); } }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: "bold", color: "#e8d88a" }}>Solo Solitaire</h1>
        <div style={{ fontSize: 11, color: "#4a7a4a", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>Spot the match</div>
      </div>

      <div style={{
        width: "100%", maxWidth: 520, background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(200,168,50,0.2)", borderRadius: 16, padding: "14px 14px 18px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        animation: invalidFlash ? "flash 0.6s ease" : "none",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 12, color: "#6aaa6a", letterSpacing: 1, textTransform: "uppercase" }}>
          <span>Deck <b style={{ color: "#c8d890" }}>{remaining}</b></span>
          <span>Row <b style={{ color: "#e8d88a" }}>{row.length}</b></span>
          <span>Removed <b style={{ color: "#7aaa7a" }}>{removed}</b></span>
        </div>

        {/* Deal button */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, justifyContent: "center" }}>
          <DeckVisual remaining={remaining} blue={false} />
          <Btn onClick={deal} disabled={!canDeal} variant="gold">
            {canDeal ? "Deal Card" : gameOver ? (won ? "🎉 Won!" : "Game Over") : "Dealing…"}
          </Btn>
        </div>

        {/* Match hint */}
        {canSelect && (
          <div style={{ textAlign: "center", marginBottom: 8, fontSize: 12,
            color: matchAvailable ? "#c8a832" : "#3a5a3a" }}>
            {matchAvailable
              ? "✦ Match available — tap the 1st and 4th cards to resolve"
              : "Tap the 1st and 4th of the last four cards to check for a match"}
          </div>
        )}

        <CardRow
          row={row}
          animIds={animIds}
          canSelect={canSelect}
          onResolve={handleResolve}
          blue={false}
          prePhase={false}
        />

        {lastMatch && (
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <span style={{
              display: "inline-block", padding: "3px 14px", borderRadius: 20, fontSize: 11,
              background: lastMatch === "number" ? "rgba(200,168,50,0.15)" : "rgba(123,175,212,0.15)",
              border: "1px solid " + (lastMatch === "number" ? "#c8a83260" : "#7bafd460"),
              color: lastMatch === "number" ? "#c8a832" : "#7bafd4", letterSpacing: 1
            }}>
              {lastMatch === "number" ? "🔢 NUMBER MATCH" : "♠ SUIT MATCH"}
            </span>
          </div>
        )}

        {gameOver && (
          <div style={{
            padding: "12px 14px", marginBottom: 12, borderRadius: 10, textAlign: "center",
            background: won ? "rgba(80,180,80,0.1)" : "rgba(200,60,60,0.08)",
            border: "1px solid " + (won ? "#4a9a4a" : "#8a3a3a")
          }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{won ? "🎉" : "🃏"}</div>
            <div style={{ color: won ? "#a8e8a8" : "#e8a8a8", fontWeight: "bold", fontSize: 17 }}>
              {won ? "Perfect Game!" : "Game Over"}
            </div>
            {!won && <div style={{ color: "#6a6a6a", fontSize: 12, marginTop: 4 }}>{row.length} card(s) remain</div>}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
          <Btn onClick={restart} variant="green">↺ New Game</Btn>
          <Btn onClick={onBack} variant="green">↩ Menu</Btn>
        </div>
        <GameLog entries={log} />
      </div>

      <div style={{ marginTop: 12, width: "100%", maxWidth: 520, display: "flex", gap: 8 }}>
        {[
          { label: "Number Match", color: "#c8a832", emoji: "🔢", detail: "Cards 1 & 4 same rank → all four removed" },
          { label: "Suit Match", color: "#7bafd4", emoji: "♠", detail: "Cards 1 & 4 same suit → middle two removed" }
        ].map(function(item) {
          return (
            <div key={item.label} style={{ flex: 1, background: "rgba(0,0,0,0.25)", border: "1px solid " + item.color + "30", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, letterSpacing: 1, color: item.color, textTransform: "uppercase", marginBottom: 4, fontWeight: "bold" }}>{item.emoji} {item.label}</div>
              <div style={{ fontSize: 11, color: "#3a5a3a", lineHeight: 1.5 }}>{item.detail}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── GOLDILOCKS ────────────────────────────────────────────────────────────────

function resolveAll(startRow, sType, isScoring, currentScore, d1, d2, jokerCount) {
  var r = startRow.slice();
  var pts = 0;
  var nd1 = d1;
  var nd2 = d2;
  var lines = [];
  var m;
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
  return { finalRow: r, pts: pts, nd1: nd1, nd2: nd2, lines: lines };
}

function GoldilocksGame({ onBack }) {
  const [deck] = useState(function() { return shuffle(buildDeck(true)); });
  const [row, setRow] = useState([]);
  const [idx, setIdx] = useState(0);
  const [log, setLog] = useState([]);
  const [animIds, setAnimIds] = useState([]);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState("pre"); // pre | choose | scoring | done
  const [scoringType, setScoringType] = useState(null);
  const [score, setScore] = useState(0);
  const [debt1Paid, setDebt1Paid] = useState(false);
  const [debt2Paid, setDebt2Paid] = useState(false);
  const [jokersFound, setJokersFound] = useState(0);
  const [lastMatch, setLastMatch] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [savedForJoker1, setSavedForJoker1] = useState(null);
  const [invalidFlash, setInvalidFlash] = useState(false);

  function addLog(msg) { setLog(function(l) { return [msg, ...l]; }); }

  function finishGame(finalScore, d1, d2) {
    setGameOver(true);
    setPhase("done");
    const net = finalScore - (d1 ? DEBT1 : 0) - (d2 ? DEBT2 : 0);
    addLog("Game over. Score: " + finalScore + " · Net: " + net);
  }

  function chooseScoring(type) {
    setScoringType(type);
    setPhase("scoring");
    addLog("Chose " + (type === "number" ? "Number" : "Suit") + " scoring — resolving deferred matches…");
    var saved = savedForJoker1;
    var result = resolveAll(saved.currentRow, type, true, saved.currentScore, saved.d1, saved.d2, 1);
    result.lines.forEach(function(l) { addLog(l); });
    var newScore = saved.currentScore + result.pts;
    setScore(newScore);
    setDebt1Paid(result.nd1);
    setDebt2Paid(result.nd2);
    setRow(result.finalRow);
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
      const nj = jokersFound + 1;
      setJokersFound(nj);
      if (nj === 1) {
        setSavedForJoker1({ currentRow: row, currentScore: score, d1: debt1Paid, d2: debt2Paid, deckDone: newIdx >= deck.length });
        setPhase("choose");
        addLog("🌟 First Joker! No removals so far — choose your scoring type.");
      } else {
        const flipped = scoringType === "number" ? "suit" : "number";
        setScoringType(flipped);
        addLog("🌟 Second Joker! Scoring flips → " + (flipped === "number" ? "Number" : "Suit") + " scoring");
        if (newIdx >= deck.length) finishGame(score, debt1Paid, debt2Paid);
      }
      return;
    }

    // Pre-joker: accumulate only
    if (phase === "pre") {
      setRow(function(r) { return [...r, card]; });
      addLog("Dealt " + card.rank + card.suit);
      if (newIdx >= deck.length) finishGame(score, debt1Paid, debt2Paid);
      return;
    }

    // Scoring phase: add card but let player spot the match
    setRow(function(r) { return [...r, card]; });
    addLog("Dealt " + card.rank + card.suit);
    if (newIdx >= deck.length) {
      setTimeout(function() {
        setRow(function(currentRow) {
          finishGame(score, debt1Paid, debt2Paid);
          return currentRow;
        });
      }, 50);
    }
  }

  function handleResolve() {
    if (busy || gameOver || row.length < 4 || phase !== "scoring") return;
    const c1 = row[row.length - 4];
    const c4 = row[row.length - 1];
    const isNumber = c1.rank === c4.rank;
    const isSuit = c1.suit === c4.suit;

    if (!isNumber && !isSuit) {
      setInvalidFlash(true);
      setTimeout(function() { setInvalidFlash(false); }, 600);
      return;
    }

    const matchType = isNumber ? "number" : "suit";
    setBusy(true);
    const toAnim = matchType === "number"
      ? row.slice(-4).map(function(c) { return c.id; })
      : [row[row.length - 3].id, row[row.length - 2].id];
    setAnimIds(toAnim);
    setLastMatch(matchType);

    setTimeout(function() {
      var firstNext = matchType === "number"
        ? row.slice(0, -4)
        : row.slice(0, row.length - 3).concat([row[row.length - 1]]);

      // Cascade from firstNext using resolveAll for scoring
      var active = (matchType === "number" && scoringType === "number") || (matchType === "suit" && scoringType === "suit");
      var firstEarned = active ? (matchType === "number" ? 4 : 2) : 0;
      var result = resolveAll(firstNext, scoringType, true, score + firstEarned, debt1Paid, debt2Paid, jokersFound);

      var newScore = score + firstEarned + result.pts;
      var nd1 = result.nd1;
      var nd2 = result.nd2;
      if (!debt1Paid && newScore >= DEBT1) nd1 = true;
      if (nd1 && jokersFound >= 2 && !debt2Paid && newScore >= DEBT1 + DEBT2) nd2 = true;

      setAnimIds([]);
      setRow(result.finalRow);
      setScore(newScore);
      setDebt1Paid(nd1);
      setDebt2Paid(nd2);

      addLog(matchType === "number"
        ? "🔢 Number match — " + (matchType === "number" ? 4 : 2) + " removed" + (firstEarned > 0 ? ", +" + firstEarned + " pts" : "")
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
  if (canSelect && row.length >= 4) {
    const c1 = row[row.length - 4];
    const c4 = row[row.length - 1];
    matchAvailable = c1.rank === c4.rank || c1.suit === c4.suit;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, #1a2e4a 0%, #0d1825 60%, #050c14 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "20px 16px 40px", fontFamily: "Georgia,serif"
    }}>
      <style>{`
        @keyframes cIn { from { transform: translateY(-14px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes cOut { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(0.3); opacity: 0; } }
        @keyframes jPulse { 0%, 100% { box-shadow: 0 0 6px #8080d066; } 50% { box-shadow: 0 0 22px #8080d0cc; } }
        @keyframes flash { 0%,100% { background: rgba(255,255,255,0.04); } 50% { background: rgba(200,60,60,0.18); } }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: "bold", color: "#e8d88a" }}>Goldilocks</h1>
        <div style={{ fontSize: 11, color: "#4a6a7a", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>Just right</div>
      </div>

      <div style={{
        width: "100%", maxWidth: 520, background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(112,160,200,0.25)", borderRadius: 16, padding: "14px 14px 18px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        animation: invalidFlash ? "flash 0.6s ease" : "none",
      }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          {[{ l: "Deck", v: remaining, c: "#c8d890" }, { l: "Score", v: score, c: "#e8d88a" }, { l: "Net", v: net, c: "#a0c8e8" }].map(function(item) {
            return (
              <div key={item.l} style={{ flex: 1, padding: "6px 10px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center", fontSize: 11, color: "#5a7a7a", letterSpacing: 1 }}>
                {item.l} <b style={{ color: item.c, fontSize: 14 }}>{item.v}</b>
              </div>
            );
          })}
          <div style={{ flex: 1, padding: "6px 10px", borderRadius: 8, textAlign: "center", background: scoringType ? "rgba(80,100,160,0.15)" : "rgba(0,0,0,0.3)", border: "1px solid " + (scoringType ? "#7080c040" : "rgba(255,255,255,0.06)"), fontSize: 11, color: scoringType ? "#a0b0e0" : "#3a4a5a", letterSpacing: 1 }}>
            {scoringType ? (scoringType === "number" ? "🔢 Number" : "♠ Suit") : "No scoring"}
          </div>
        </div>

        {/* Debts */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {[
            { label: "Debt 1: " + DEBT1 + " pts", paid: debt1Paid, active: jokersFound >= 1 },
            { label: "Debt 2: " + DEBT2 + " pts", paid: debt2Paid, active: jokersFound >= 2 }
          ].map(function(item) {
            return (
              <div key={item.label} style={{ flex: 1, padding: "7px 10px", borderRadius: 8, textAlign: "center", background: item.paid ? "rgba(50,170,50,0.12)" : item.active ? "rgba(200,100,40,0.12)" : "rgba(0,0,0,0.2)", border: "1px solid " + (item.paid ? "#3ab83a40" : item.active ? "#c8640040" : "rgba(255,255,255,0.04)"), fontSize: 12, color: item.paid ? "#6ae86a" : item.active ? "#e8a060" : "#2a4a4a" }}>
                {item.paid ? "✓" : item.active ? "⏳" : "🔒"} {item.label}
              </div>
            );
          })}
        </div>

        {/* Joker choice */}
        {phase === "choose" && (
          <div style={{ marginBottom: 12, padding: "14px 16px", borderRadius: 10, textAlign: "center", background: "rgba(80,60,160,0.15)", border: "1px solid #8080d050" }}>
            <div style={{ color: "#b0a0f0", fontWeight: "bold", fontSize: 14, marginBottom: 8 }}>🌟 First Joker — choose scoring type</div>
            <div style={{ color: "#5a5a8a", fontSize: 12, marginBottom: 12 }}>Deferred matches will now resolve. Which type scores more?</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn onClick={function() { chooseScoring("number"); }} variant="gold">🔢 Number</Btn>
              <Btn onClick={function() { chooseScoring("suit"); }} variant="purple">♠ Suit</Btn>
            </div>
          </div>
        )}

        {/* Deal */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10, justifyContent: "center" }}>
          <DeckVisual remaining={remaining} blue={true} />
          <Btn onClick={deal} disabled={!canDeal} variant="gold">
            {phase === "choose" ? "Choose scoring first" : canDeal ? "Deal Card" : gameOver ? "Done" : "Deck Empty"}
          </Btn>
        </div>

        {/* Match hint */}
        {canSelect && (
          <div style={{ textAlign: "center", marginBottom: 8, fontSize: 12,
            color: matchAvailable ? "#c8a832" : "#3a5a5a" }}>
            {matchAvailable
              ? "✦ Match available — tap the 1st and 4th cards to resolve"
              : "Tap the 1st and 4th of the last four to check for a match"}
          </div>
        )}
        {phase === "pre" && row.length > 0 && (
          <div style={{ textAlign: "center", marginBottom: 8, fontSize: 12, color: "#2a4a5a", fontStyle: "italic" }}>
            Accumulating cards — no matches until you choose scoring
          </div>
        )}

        <CardRow
          row={row}
          animIds={animIds}
          canSelect={canSelect}
          onResolve={handleResolve}
          blue={true}
          prePhase={phase === "pre"}
        />

        {/* Joker pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, justifyContent: "center" }}>
          {[1, 2].map(function(n) {
            return (
              <div key={n} style={{ padding: "3px 18px", borderRadius: 20, fontSize: 11, background: jokersFound >= n ? "rgba(80,60,160,0.25)" : "rgba(0,0,0,0.2)", border: "1px solid " + (jokersFound >= n ? "#8080d060" : "rgba(255,255,255,0.04)"), color: jokersFound >= n ? "#a0a0f0" : "#2a3a4a", animation: jokersFound === n ? "jPulse 1.2s ease-in-out 3" : "none" }}>
                Joker {n} {jokersFound >= n ? "✓" : "—"}
              </div>
            );
          })}
        </div>

        {/* Targets */}
        {!gameOver && (
          <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
            {GOLDILOCKS_TARGETS.map(function(t) {
              const isNet = gameOver && net === t;
              return <div key={t} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, background: isNet ? "rgba(80,200,80,0.2)" : "rgba(200,168,50,0.07)", border: "1px solid " + (isNet ? "#4aaa4a" : "rgba(200,168,50,0.18)"), color: isNet ? "#6ae86a" : "#c8a83270" }}>{t}</div>;
            })}
          </div>
        )}

        {lastMatch && (
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <span style={{ display: "inline-block", padding: "3px 14px", borderRadius: 20, fontSize: 11, background: lastMatch === "number" ? "rgba(200,168,50,0.14)" : "rgba(123,175,212,0.14)", border: "1px solid " + (lastMatch === "number" ? "#c8a83255" : "#7bafd455"), color: lastMatch === "number" ? "#c8a832" : "#7bafd4", letterSpacing: 1 }}>
              {lastMatch === "number" ? "🔢 NUMBER MATCH" : "♠ SUIT MATCH"}
            </span>
          </div>
        )}

        {gameOver && (
          <div style={{ padding: "12px 14px", marginBottom: 12, borderRadius: 10, textAlign: "center", background: victory ? "rgba(80,200,80,0.1)" : "rgba(200,160,40,0.07)", border: "1px solid " + (victory ? "#4a9a4a" : "#9a8020") }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{victory ? "🎉" : "🌟"}</div>
            <div style={{ color: victory ? "#a8e8a8" : "#e8d88a", fontWeight: "bold", fontSize: 17 }}>
              {victory ? "Victory! Net: " + net : "Round Complete"}
            </div>
            <div style={{ color: "#5a6a5a", fontSize: 12, marginTop: 5 }}>
              Score: {score} · Debts: {(debt1Paid ? DEBT1 : 0) + (debt2Paid ? DEBT2 : 0)} · Net: {net}
            </div>
            {!debt1Paid && <div style={{ color: "#c87050", fontSize: 12, marginTop: 4 }}>Debt 1 unpaid</div>}
            {!debt2Paid && <div style={{ color: "#c87050", fontSize: 12, marginTop: 4 }}>Debt 2 unpaid</div>}
            {!victory && <div style={{ color: "#5a6a3a", fontSize: 12, marginTop: 4 }}>Targets: {GOLDILOCKS_TARGETS.join(", ")}</div>}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
          <Btn onClick={onBack} variant="green">↩ Menu</Btn>
        </div>
        <GameLog entries={log} />
      </div>

      <div style={{ marginTop: 12, width: "100%", maxWidth: 520, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(112,160,200,0.12)", borderRadius: 10, padding: "12px 14px", fontSize: 11, color: "#2a4a5a", lineHeight: 1.9 }}>
        <div style={{ color: "#4a7a8a", fontWeight: "bold", marginBottom: 4, letterSpacing: 1 }}>GOLDILOCKS RULES</div>
        <div>🌟 <b style={{ color: "#8080d0" }}>1st Joker</b> — choose which match type earns points; deferred matches resolve</div>
        <div>🌟 <b style={{ color: "#8080d0" }}>2nd Joker</b> — scoring flips instantly to the other type</div>
        <div>💸 Debt 1 = {DEBT1} pts · Debt 2 = {DEBT2} pts (after 2nd Joker)</div>
        <div>🎯 Net score must exactly hit: {GOLDILOCKS_TARGETS.join(", ")}</div>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("setup");
  const [mode, setMode] = useState(null);
  if (screen === "setup") return <Setup onStart={function(m) { setMode(m); setScreen("play"); }} />;
  if (mode === "solo")    return <SoloGame onBack={function() { setScreen("setup"); }} />;
  if (mode === "gold")    return <GoldilocksGame onBack={function() { setScreen("setup"); }} />;
  return <Setup onStart={function(m) { setMode(m); setScreen("play"); }} />;
}
