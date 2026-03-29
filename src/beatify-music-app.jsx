import { useState, useEffect, useRef, useCallback } from "react";

const JAMENDO_BASE = "https://api.jamendo.com/v3.0";

const GENRES = [
  { id: "pop", label: "Pop", color: "#E91E63", emoji: "✨" },
  { id: "rock", label: "Rock", color: "#FF5722", emoji: "🎸" },
  { id: "jazz", label: "Jazz", color: "#9C27B0", emoji: "🎷" },
  { id: "electronic", label: "Electronic", color: "#2196F3", emoji: "🎛️" },
  { id: "classical", label: "Classical", color: "#8D6E63", emoji: "🎻" },
  { id: "hiphop", label: "Hip Hop", color: "#FF9800", emoji: "🎤" },
  { id: "ambient", label: "Ambient", color: "#00BCD4", emoji: "🌊" },
  { id: "folk", label: "Folk", color: "#4CAF50", emoji: "🪕" },
  { id: "metal", label: "Metal", color: "#607D8B", emoji: "🤘" },
  { id: "reggae", label: "Reggae", color: "#CDDC39", emoji: "🌴" },
  { id: "lofi", label: "Lofi", color: "#7E57C2", emoji: "🌙" },
  { id: "indie_alternative", label: "Indie / Alternative", color: "#26A69A", emoji: "🎶" },
  { id: "electronic_edm", label: "Electronic / EDM", color: "#29B6F6", emoji: "💿" },
  { id: "techno", label: "Techno", color: "#3949AB", emoji: "🕺" },
  { id: "trance", label: "Trance", color: "#AB47BC", emoji: "🌀" },
  { id: "dance", label: "Dance", color: "#EC407A", emoji: "💃" },
  { id: "hiphop_rap", label: "Hip Hop / Rap", color: "#FFA726", emoji: "🎙️" },
  { id: "country", label: "Country", color: "#8D6E63", emoji: "🤠" },
  { id: "world_international", label: "World / International", color: "#66BB6A", emoji: "🌍" },
  { id: "hindi", label: "Hindi Songs", color: "#F4511E", emoji: "🇮🇳" },
  { id: "bollywood_filmi", label: "Bollywood / Filmi", color: "#D81B60", emoji: "🎬" },
  { id: "indipop", label: "Indi Pop", color: "#8E24AA", emoji: "🎵" },
  { id: "ghazal", label: "Ghazal", color: "#5E35B1", emoji: "🪔" },
  { id: "sufi", label: "Sufi", color: "#00897B", emoji: "🕊️" },
  { id: "qawwali", label: "Qawwali", color: "#43A047", emoji: "🎼" },
  { id: "hindustani_classical", label: "Hindustani Classical", color: "#6D4C41", emoji: "🪕" },
  { id: "carnatic_classical", label: "Carnatic Classical", color: "#7CB342", emoji: "🎻" },
  { id: "devotional_bhajan", label: "Devotional / Bhajan", color: "#FB8C00", emoji: "🙏" },
  { id: "bhangra", label: "Bhangra", color: "#FDD835", emoji: "🥁" },
  { id: "punjabi_pop", label: "Punjabi Pop", color: "#FF7043", emoji: "🎉" },
  { id: "classical_crossover", label: "Classical Crossover", color: "#6A1B9A", emoji: "🎻" },
  { id: "folk_regional", label: "Folk (Regional)", color: "#558B2F", emoji: "🧿" },
  { id: "indie_hindi", label: "Indie / Independent Hindi", color: "#26C6DA", emoji: "🎧" },
  { id: "romantic_ballads", label: "Romantic Ballads", color: "#EF5350", emoji: "💞" },
  { id: "bollywood_dance", label: "Dance / Bollywood Dance", color: "#EC407A", emoji: "🪩" },
  { id: "desi_hiphop", label: "Hip Hop / Desi Hip Hop", color: "#FB8C00", emoji: "🔥" },
  { id: "indian_edm", label: "Electronic / EDM (Hindi)", color: "#1E88E5", emoji: "🎚️" },
  { id: "fusion", label: "Fusion", color: "#8D6E63", emoji: "🎛️" },
  { id: "lounge_chillout", label: "Lounge / Chillout", color: "#00ACC1", emoji: "☁️" },
  { id: "hindi_film_score", label: "Soundtrack / Film Score", color: "#3949AB", emoji: "🎞️" },
  { id: "remixes_mashups", label: "Remixes & Mashups", color: "#9C27B0", emoji: "🔀" },
  { id: "kids_hindi", label: "Children's / Kids Hindi Songs", color: "#FBC02D", emoji: "🧒" },
];

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0b0b0b;
    --bg2: #121212;
    --bg3: #1a1a1a;
    --bg4: #242424;
    --accent: #1ed760;
    --accent-glow: #1ed76033;
    --text: #f5f5f5;
    --text2: #b3b3b3;
    --text3: #707070;
    --border: #2a2a2a;
    --space-1: 8px;
    --space-2: 12px;
    --space-3: 16px;
    --space-4: 20px;
    --space-5: 24px;
    --space-6: 28px;
    --player-h: 90px;
    --sidebar-w: 224px;
  }
  html, body { height: 100%; background: var(--bg); overflow: hidden; }
  #root { height: 100vh; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--bg4); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text3); }
  body, input, button {
    font-family: "Circular Std", "Circular Spotify Text", "Inter", "Helvetica Neue", Arial, sans-serif;
  }
  input[type=range] {
    -webkit-appearance: none; appearance: none;
    height: 3px; border-radius: 3px;
    background: var(--bg4); outline: none; cursor: pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 0; height: 0; border-radius: 50%;
    background: var(--text); cursor: pointer;
    transition: width 0.15s, height 0.15s;
  }
  .progress-wrap:hover input[type=range]::-webkit-slider-thumb,
  .vol-wrap input[type=range]::-webkit-slider-thumb {
    width: 13px; height: 13px;
  }
  .progress-wrap:hover input[type=range],
  .vol-wrap input[type=range] {
    background: linear-gradient(to right, var(--accent) var(--pct, 0%), var(--bg4) var(--pct, 0%));
  }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes viewSwap { from { opacity: 0; transform: translateY(16px) scale(0.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes barDance {
    0%, 100% { height: 4px; } 25% { height: 14px; } 50% { height: 8px; } 75% { height: 16px; }
  }
  .fade-up { animation: fadeUp 0.35s ease forwards; }
  .view-screen { animation: viewSwap 0.34s cubic-bezier(.22,.8,.2,1) both; }
  .spinning { animation: spin 12s linear infinite; }
  .pulsing { animation: pulse 1.5s ease infinite; }
  .content-header {
    position: sticky;
    top: 0;
    z-index: 20;
    backdrop-filter: blur(14px);
    background: linear-gradient(180deg, rgba(16,16,16,.84), rgba(16,16,16,.58));
    border-bottom: 1px solid var(--border);
  }
  .track-row { transition: background 0.2s, transform 0.15s, box-shadow 0.2s; }
  .track-row:hover {
    background: linear-gradient(90deg, #202020, #171717) !important;
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  }
  .track-row:active { transform: scale(0.995); }
  .genre-tile { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
  .genre-tile:hover { transform: scale(1.03); box-shadow: 0 12px 26px rgba(0,0,0,0.35); }
  .nav-btn { transition: color 0.15s, background 0.15s; }
  .nav-btn:hover { color: var(--text) !important; background: #1f1f1f !important; }
  .ctrl-btn { transition: color 0.15s, transform 0.1s; }
  .ctrl-btn:hover { color: var(--text) !important; transform: scale(1.1); }
  .ctrl-btn:active { transform: scale(0.92); }
  .play-btn { transition: background 0.15s, transform 0.1s, box-shadow 0.2s; }
  .play-btn:hover { transform: scale(1.08); box-shadow: 0 0 20px var(--accent-glow); }
  .play-btn:active { transform: scale(0.95); }
  .heart-btn { transition: color 0.15s, transform 0.15s; }
  .heart-btn:hover { transform: scale(1.2); }
  @media (max-width: 640px) {
    :root { --sidebar-w: 0px; }
    .sidebar { display: none !important; }
    .mobile-tabs { display: flex !important; }
    .player-bar { grid-template-columns: 1fr 1fr !important; }
    .player-vol { display: none !important; }
    .player-left { grid-column: 1; }
    .player-center { grid-column: 2; }
  }
`;

function formatTime(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function BeatifyLogo({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 152 152"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect x="0" y="0" width="152" height="152" rx="32" fill="#0d0d0d" />
      <defs>
        <clipPath id="beatify-heart-clip">
          <path d="M76 122L69 115C46 94 28 78 28 59C28 46 38 36 51 36C58 36 65 40 76 50C87 40 94 36 101 36C114 36 124 46 124 59C124 78 106 94 83 115Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#beatify-heart-clip)">
        <rect x="31" y="36" width="11" height="86" rx="5.5" fill="#00FF88" opacity="0.9" />
        <rect x="47" y="46" width="11" height="76" rx="5.5" fill="#00FF88" opacity="0.75" />
        <rect x="63" y="32" width="11" height="90" rx="5.5" fill="#00FF88" />
        <rect x="79" y="52" width="11" height="70" rx="5.5" fill="#00FF88" opacity="0.6" />
        <rect x="95" y="40" width="11" height="82" rx="5.5" fill="#00FF88" opacity="0.85" />
        <rect x="111" y="48" width="11" height="74" rx="5.5" fill="#00FF88" opacity="0.7" />
      </g>
    </svg>
  );
}

function Icon({ children, size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

const IconHome = ({ size = 18, color }) => (
  <Icon size={size} color={color}>
    <path d="M3 10.8L12 3l9 7.8" />
    <path d="M5.5 9.8V21h13V9.8" />
  </Icon>
);

const IconSearch = ({ size = 18, color }) => (
  <Icon size={size} color={color}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l5 5" />
  </Icon>
);

const IconHeart = ({ size = 18, color, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color || "currentColor" : "none"} aria-hidden="true">
    <path
      d="M12 20.4l-1.04-.95C7.25 16.1 4.8 13.88 4.8 11.1A4.1 4.1 0 0 1 8.9 7c1.28 0 2.5.58 3.1 1.52A4 4 0 0 1 15.1 7a4.1 4.1 0 0 1 4.1 4.1c0 2.78-2.45 5-6.16 8.35z"
      stroke={color || "currentColor"}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPrev = ({ size = 20, color }) => (
  <Icon size={size} color={color}>
    <path d="M6 5v14" />
    <path d="M18 6l-9 6 9 6z" />
  </Icon>
);

const IconNext = ({ size = 20, color }) => (
  <Icon size={size} color={color}>
    <path d="M18 5v14" />
    <path d="M6 6l9 6-9 6z" />
  </Icon>
);

const IconPlay = ({ size = 20, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"} aria-hidden="true">
    <path d="M8 5.5a1 1 0 0 1 1.55-.83l9.3 6.5a1 1 0 0 1 0 1.66l-9.3 6.5A1 1 0 0 1 8 18.5z" />
  </svg>
);

const IconPause = ({ size = 20, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"} aria-hidden="true">
    <rect x="7" y="5.5" width="3.8" height="13" rx="1.2" />
    <rect x="13.2" y="5.5" width="3.8" height="13" rx="1.2" />
  </svg>
);

// ────────────────────────── Setup Screen ──────────────────────────
function SetupScreen({ onSetup }) {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verify = async () => {
    const trimmed = id.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${JAMENDO_BASE}/tracks/?client_id=${trimmed}&format=json&limit=1`
      );
      const data = await res.json();
      if (data.headers?.status === "success") {
        localStorage.setItem("beatify_cid", trimmed);
        onSetup(trimmed);
      } else {
        setError("Invalid Client ID — please double-check and try again.");
      }
    } catch {
      setError("Connection error. Please check your internet and try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Circular Std', 'Circular Spotify Text', 'Inter', 'Helvetica Neue', Arial, sans-serif", padding: 24,
      backgroundImage: "radial-gradient(ellipse 80% 60% at 50% -20%, #f0a50029, transparent)"
    }}>
      <div style={{ maxWidth: 460, width: "100%" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            marginBottom: 10
          }}>
            <BeatifyLogo size={44} />
            <span style={{
              fontSize: 38, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.04em"
            }}>Beatify</span>
          </div>
          <p style={{ color: "var(--text2)", fontSize: 14, letterSpacing: "0.03em" }}>
            Music reimagined
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "linear-gradient(180deg, #171717, #111111)", borderRadius: 18, padding: "32px 28px",
          border: "1px solid var(--border)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.65)"
        }}>
          <h2 style={{ color: "var(--text)", fontSize: 19, fontWeight: 500, marginBottom: 6 }}>
            One-time setup · 2 minutes
          </h2>
          <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>
            Beatify streams from <strong style={{ color: "var(--text)" }}>Jamendo</strong> — 
            600,000+ free, legal tracks (indie, jazz, electronic, classical & more). 
            You just need a free API key.
          </p>

          {/* Steps */}
          {[
            {
              n: 1,
              html: <>Visit <a href="https://developer.jamendo.com" target="_blank" rel="noreferrer"
                style={{ color: "var(--accent)", textDecoration: "none" }}>developer.jamendo.com ↗</a></>
            },
            { n: 2, html: <>Create a free account — no credit card required</> },
            { n: 3, html: <>Go to <strong style={{ color: "var(--text)" }}>My Apps → New App</strong>, copy your <strong style={{ color: "var(--text)" }}>Client ID</strong></> },
          ].map((step) => (
            <div key={step.n} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "var(--accent)", color: "#000",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1
              }}>{step.n}</div>
              <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6, paddingTop: 3 }}>
                {step.html}
              </p>
            </div>
          ))}

          <div style={{ marginTop: 28 }}>
            <label style={{
              color: "var(--text2)", fontSize: 11, letterSpacing: "0.08em",
              textTransform: "uppercase", display: "block", marginBottom: 10
            }}>Paste your Client ID</label>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verify()}
              placeholder="e.g. b6747d04a1c2e3f..."
              style={{
                width: "100%", background: "var(--bg3)",
                border: `1px solid ${error ? "#ff6b6b44" : "var(--border)"}`,
                borderRadius: 10, padding: "13px 16px", color: "var(--text)",
                fontSize: 14, outline: "none", transition: "border-color 0.2s",
                letterSpacing: "0.02em"
              }}
            />
            {error && (
              <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 8 }}>{error}</p>
            )}
            <button
              onClick={verify}
              disabled={!id.trim() || loading}
              style={{
                width: "100%", marginTop: 14, padding: 14, borderRadius: 10,
                background: id.trim() ? "var(--accent)" : "var(--bg4)",
                color: id.trim() ? "#000" : "var(--text2)",
                border: "none", fontSize: 15, fontWeight: 600,
                cursor: id.trim() ? "pointer" : "default",
                transition: "all 0.2s", letterSpacing: "0.01em"
              }}
            >
              {loading ? "Verifying…" : "Launch Beatify →"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "var(--text3)", fontSize: 11, marginTop: 20, lineHeight: 1.6 }}>
          Free & legal · No ads · No subscription · Works on any browser<br />
          Your API key is stored only in this browser
        </p>
      </div>
    </div>
  );
}

// ────────────────────────── Track Row ──────────────────────────
function TrackRow({ track, index, isActive, isPlaying, onPlay, onLike, liked }) {
  return (
    <div
      className="track-row"
      onClick={() => onPlay(track)}
      style={{
        display: "grid",
        gridTemplateColumns: "28px 50px 1fr 36px 52px",
        alignItems: "center", gap: 12,
        padding: "7px 10px", borderRadius: 8, cursor: "pointer",
        background: isActive ? "#1f1f1f" : "#141414",
        border: `1px solid ${isActive ? "var(--accent-glow)" : "var(--border)"}`,
        userSelect: "none",
      }}
    >
      {/* Index / playing indicator */}
      <div style={{
        textAlign: "center", fontSize: 12,
        color: isActive ? "var(--accent)" : "var(--text2)"
      }}>
        {isActive && isPlaying ? (
          <div style={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "flex-end", height: 16 }}>
            {[0, 80, 160].map((delay) => (
              <div key={delay} style={{
                width: 3, background: "var(--accent)", borderRadius: 2,
                animation: `barDance 0.8s ${delay}ms ease-in-out infinite`
              }} />
            ))}
          </div>
        ) : index}
      </div>

      {/* Art */}
      <img
        src={track.image || track.album_image || ""}
        alt=""
        style={{
          width: 50, height: 50, borderRadius: 6, objectFit: "cover",
          background: "var(--bg4)", display: "block"
        }}
      />

      {/* Info */}
      <div style={{ overflow: "hidden" }}>
        <div style={{
          color: isActive ? "var(--accent)" : "var(--text)",
          fontSize: 14, fontWeight: 500,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
        }}>
          {track.name}
        </div>
        <div style={{
          color: "var(--text2)", fontSize: 12, marginTop: 3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
        }}>
          {track.artist_name}
        </div>
      </div>

      {/* Like */}
      <button
        className="heart-btn"
        onClick={(e) => { e.stopPropagation(); onLike(track.id); }}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: liked ? "var(--accent)" : "var(--text3)",
          padding: 4, display: "flex"
        }}
      >
        <IconHeart size={16} color="currentColor" filled={liked} />
      </button>

      {/* Duration */}
      <div style={{ color: "var(--text2)", fontSize: 12, textAlign: "right" }}>
        {formatTime(track.duration)}
      </div>
    </div>
  );
}

// ────────────────────────── Main App ──────────────────────────
function MainApp({ clientId, onReset }) {
  const [view, setView] = useState("home");
  const [tracks, setTracks] = useState([]);
  const [trending, setTrending] = useState([]);
  const [availableGenres, setAvailableGenres] = useState(GENRES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [queue, setQueue] = useState([]);
  const [queueIdx, setQueueIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [likedIds, setLikedIds] = useState(
    () => new Set(JSON.parse(localStorage.getItem("beatify_liked") || "[]"))
  );
  const [likedTracks, setLikedTracks] = useState(
    () => JSON.parse(localStorage.getItem("beatify_liked_tracks") || "[]")
  );

  const audioRef = useRef(null);
  const searchTimer = useRef(null);
  const progressRef = useRef(null);
  const volRef = useRef(null);
  const queueRef = useRef([]);
  const skipNextRef = useRef(() => {});

  // Init audio
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    a.volume = volume;

    const handlers = {
      timeupdate: () => {
        setProgress(a.currentTime);
        if (progressRef.current && a.duration) {
          const pct = (a.currentTime / a.duration) * 100;
          progressRef.current.style.setProperty("--pct", `${pct}%`);
        }
      },
      durationchange: () => setDuration(a.duration || 0),
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      ended: () => skipNextRef.current(),
      error: () => skipNextRef.current(),
    };

    Object.entries(handlers).forEach(([e, h]) => a.addEventListener(e, h));
    return () => Object.entries(handlers).forEach(([e, h]) => a.removeEventListener(e, h));
  }, []);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    if (volRef.current) {
      volRef.current.style.setProperty("--pct", `${volume * 100}%`);
    }
  }, [volume]);

  // Fetch helpers
  const api = useCallback(async (params) => {
    setLoading(true);
    try {
      const url = `${JAMENDO_BASE}/tracks/?client_id=${clientId}&format=json&limit=24&audioformat=mp32&${params}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.results || [];
    } catch { return []; }
    finally { setLoading(false); }
  }, [clientId]);

  const checkGenreHasTracks = useCallback(async (genreId) => {
    try {
      const url = `${JAMENDO_BASE}/tracks/?client_id=${clientId}&format=json&limit=1&audioformat=mp32&tags=${encodeURIComponent(genreId)}`;
      const res = await fetch(url);
      const data = await res.json();
      return (data.results || []).length > 0;
    } catch {
      return false;
    }
  }, [clientId]);

  // Init: load trending
  useEffect(() => {
    api("order=popularity_total&tags=pop+rock+electronic+jazz").then((r) => {
      setTrending(r);
      if (r.length && queue.length === 0) setQueue(r);
    });
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const checks = await Promise.all(
        GENRES.map(async (genre) => ({ genre, ok: await checkGenreHasTracks(genre.id) }))
      );
      if (!active) return;
      const filtered = checks.filter((x) => x.ok).map((x) => x.genre);
      setAvailableGenres(filtered.length ? filtered : GENRES);
    })();
    return () => { active = false; };
  }, [checkGenreHasTracks]);

  // Search
  useEffect(() => {
    if (view !== "search") return;
    clearTimeout(searchTimer.current);
    if (!searchQuery.trim()) { setTracks([]); return; }
    searchTimer.current = setTimeout(async () => {
      const r = await api(`search=${encodeURIComponent(searchQuery)}&order=popularity_total`);
      setTracks(r);
    }, 380);
  }, [searchQuery, view]);

  const playTrack = useCallback((track, list) => {
    const a = audioRef.current;
    if (!a || !track?.audio) return;
    const tList = list || queue;
    const idx = tList.findIndex((t) => t.id === track.id);
    setQueue(tList);
    setQueueIdx(Math.max(0, idx));
    setCurrentTrack(track);
    setProgress(0);
    setDuration(0);
    a.src = track.audio;
    a.play().catch(() => {});
  }, [queue]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
  };

  const skipNext = useCallback(() => {
    setQueueIdx((qi) => {
      const q = queueRef.current;
      if (!q.length) return 0;
      const next = qi < q.length - 1 ? qi + 1 : 0;
      const t = q[next];
      if (t && audioRef.current) {
        setCurrentTrack(t);
        audioRef.current.src = t.audio;
        audioRef.current.play().catch(() => {});
      }
      return next;
    });
  }, []);

  useEffect(() => {
    skipNextRef.current = skipNext;
  }, [skipNext]);

  const skipPrev = () => {
    if (!audioRef.current) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      setQueueIdx((qi) => {
        const prev = qi > 0 ? qi - 1 : queue.length - 1;
        const t = queue[prev];
        if (t) {
          setCurrentTrack(t);
          audioRef.current.src = t.audio;
          audioRef.current.play().catch(() => {});
        }
        return prev;
      });
    }
  };

  const seek = (e) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setProgress(val);
  };

  const browseGenre = async (genre) => {
    setSelectedGenre(genre);
    setView("genre");
    const r = await api(`tags=${genre.id}&order=popularity_total`);
    setTracks(r);
  };

  const toggleLike = (trackId) => {
    const track = [...trending, ...tracks].find((t) => t.id === trackId);
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
        const newLiked = likedTracks.filter((t) => t.id !== trackId);
        setLikedTracks(newLiked);
        localStorage.setItem("beatify_liked_tracks", JSON.stringify(newLiked));
      } else {
        next.add(trackId);
        if (track) {
          const newLiked = [...likedTracks.filter((t) => t.id !== trackId), track];
          setLikedTracks(newLiked);
          localStorage.setItem("beatify_liked_tracks", JSON.stringify(newLiked));
        }
      }
      localStorage.setItem("beatify_liked", JSON.stringify([...next]));
      return next;
    });
  };

  // Nav items
  const navItems = [
    { id: "home", icon: IconHome, label: "Home" },
    { id: "search", icon: IconSearch, label: "Search" },
    { id: "liked", icon: IconHeart, label: "Liked Songs" },
  ];

  
  const greeting = () => "Mood: Beatify";

  // ── Sidebar ──
  const Sidebar = () => (
    <div className="sidebar" style={{
      width: "var(--sidebar-w)", minWidth: "var(--sidebar-w)",
      background: "var(--bg)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", height: "100%", overflow: "hidden"
    }}>
      {/* Logo */}
      <div style={{ padding: "22px 22px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BeatifyLogo size={34} />
          <span style={{
            fontSize: 25, fontWeight: 700,
            color: "var(--text)", letterSpacing: "-0.03em"
          }}>Beatify</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 10px 0", flex: 1, overflow: "auto" }}>
        {navItems.map((item) => (
          <button key={item.id} className="nav-btn" onClick={() => setView(item.id)} style={{
            display: "flex", alignItems: "center", gap: 13, width: "100%",
            padding: "10px 12px", borderRadius: 8, border: "none",
            background: view === item.id ? "var(--bg3)" : "transparent",
            color: view === item.id ? "var(--text)" : "var(--text2)",
            fontSize: 14, fontWeight: view === item.id ? 500 : 400,
            cursor: "pointer", textAlign: "left", marginBottom: 2,
          }}>
            <span style={{ width: 20, display: "flex", justifyContent: "center" }}>
              <item.icon size={17} color={view === item.id ? "var(--text)" : "var(--text2)"} />
            </span>
            {item.label}
          </button>
        ))}

        {/* Genres */}
        <div style={{ margin: "20px 12px 10px", color: "var(--text3)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Genres
        </div>
        {availableGenres.map((g) => (
          <button key={g.id} className="nav-btn" onClick={() => browseGenre(g)} style={{
            display: "flex", alignItems: "center", gap: 12, width: "100%",
            padding: "9px 12px", borderRadius: 8, border: "none",
            background: selectedGenre?.id === g.id && view === "genre" ? "var(--bg3)" : "transparent",
            color: selectedGenre?.id === g.id && view === "genre" ? "var(--text)" : "var(--text2)",
            fontSize: 13, cursor: "pointer", textAlign: "left", marginBottom: 1,
          }}>
            {g.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "14px 22px", borderTop: "1px solid var(--border)" }}>
        <button onClick={onReset} style={{
          background: "none", border: "none", color: "var(--text3)",
          fontSize: 11, cursor: "pointer", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 6
        }}>⚙ Change API Key</button>
      </div>
    </div>
  );

  // ── Track List ──
  const TrackList = ({ trackList }) => (
    <div>
      {trackList.map((track, i) => (
        <TrackRow
          key={track.id} track={track} index={i + 1}
          isActive={currentTrack?.id === track.id}
          isPlaying={isPlaying}
          liked={likedIds.has(track.id)}
          onPlay={(t) => playTrack(t, trackList)}
          onLike={toggleLike}
        />
      ))}
    </div>
  );

  // ── Player Bar ──
  const PlayerBar = () => {
    if (!currentTrack) return null;
    const art = currentTrack.image || currentTrack.album_image || "";
    return (
      <div style={{
        height: "var(--player-h)", background: "var(--bg2)",
        borderTop: "1px solid var(--border)", flexShrink: 0,
        display: "grid", gridTemplateColumns: "1fr 2fr 1fr",
        alignItems: "center", padding: "0 20px", gap: 12,
      }}>
        {/* Left: track info */}
        <div className="player-left" style={{ display: "flex", alignItems: "center", gap: 12, overflow: "hidden" }}>
          <img src={art} alt="" className={isPlaying ? "spinning" : ""} onClick={() => setView("nowplaying")} style={{
            width: 48, height: 48, borderRadius: 8, objectFit: "cover",
            background: "var(--bg4)", flexShrink: 0,
            boxShadow: isPlaying ? "0 0 16px var(--accent-glow)" : "none",
            transition: "box-shadow 0.4s",
            cursor: "pointer"
          }} />
          <div style={{ overflow: "hidden", minWidth: 0 }}>
            <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentTrack.name}
            </div>
            <div style={{ color: "var(--text2)", fontSize: 11, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentTrack.artist_name}
            </div>
          </div>
          <button className="heart-btn" onClick={() => toggleLike(currentTrack.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: likedIds.has(currentTrack.id) ? "var(--accent)" : "var(--text3)",
            flexShrink: 0, padding: 4, display: "flex"
          }}>
            <IconHeart size={18} color="currentColor" filled={likedIds.has(currentTrack.id)} />
          </button>
        </div>

        {/* Center: controls + scrubber */}
        <div className="player-center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button className="ctrl-btn" onClick={skipPrev} style={{
              background: "none", border: "none", color: "var(--text2)",
              cursor: "pointer", fontSize: 22, padding: 4, lineHeight: 1
            }}><IconPrev size={22} color="currentColor" /></button>
            <button className="play-btn" onClick={togglePlay} style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "var(--accent)", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: isPlaying ? 15 : 17,
              color: "#000"
            }}>
              {isPlaying ? <IconPause size={18} color="#000" /> : <IconPlay size={18} color="#000" />}
            </button>
            <button className="ctrl-btn" onClick={skipNext} style={{
              background: "none", border: "none", color: "var(--text2)",
              cursor: "pointer", fontSize: 22, padding: 4, lineHeight: 1
            }}><IconNext size={22} color="currentColor" /></button>
          </div>

          <div className="progress-wrap" ref={progressRef} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", maxWidth: 380 }}>
            <span style={{ color: "var(--text2)", fontSize: 10, width: 32, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(progress)}
            </span>
            <input
              type="range" min={0} max={duration || 100} value={progress} step={0.1}
              onChange={seek} style={{ flex: 1 }}
            />
            <span style={{ color: "var(--text2)", fontSize: 10, width: 32, fontVariantNumeric: "tabular-nums" }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: volume */}
        <div className="player-vol vol-wrap" ref={volRef} style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end" }}>
          <span style={{ color: "var(--text2)", fontSize: 15, flexShrink: 0 }}>
            {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
          </span>
          <input
            type="range" min={0} max={1} value={volume} step={0.01}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: 90 }}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      fontFamily: "'Circular Std', 'Circular Spotify Text', 'Inter', 'Helvetica Neue', Arial, sans-serif", overflow: "hidden", background: "var(--bg)"
    }}>
      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        {/* Content area */}
        <div style={{
          flex: 1, overflow: "auto",
          background: "linear-gradient(180deg, #212121 0%, #121212 320px, var(--bg) 520px)"
        }}>
          <div className="content-header" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 22px"
          }}>
            <div style={{ color: "var(--text2)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Beatify Premium
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setView("nowplaying")} style={{
                background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text2)",
                borderRadius: 999, padding: "8px 12px", fontSize: 12, cursor: "pointer"
              }}>
                Now Playing
              </button>
              <div style={{
                display: "flex", alignItems: "center", gap: 10, borderRadius: 999,
                border: "1px solid var(--border)", background: "var(--bg3)", padding: "5px 10px 5px 5px"
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", background: "var(--accent)", color: "#0b0b0b",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12
                }}>U</div>
                <span style={{ color: "var(--text)", fontSize: 12, fontWeight: 600 }}>You</span>
              </div>
            </div>
          </div>

          {/* ── HOME ── */}
          {view === "home" && (
            <div className="view-screen" style={{ padding: "24px 22px" }}>
              <h1 style={{
                fontSize: 36, fontWeight: 800,
                color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 6
              }}>
                {greeting()} ☀
              </h1>
              <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 36 }}>
                Discover your next favorite track
              </p>

              {/* Genre Grid */}
              <h2 style={{ color: "var(--text)", fontSize: 16, fontWeight: 500, marginBottom: 14 }}>
                Browse by Genre
              </h2>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: 10, marginBottom: 28
              }}>
                {availableGenres.map((g) => (
                  <div key={g.id} className="genre-tile" onClick={() => browseGenre(g)} style={{
                    background: g.color + "18", border: `1px solid ${g.color}30`,
                    borderRadius: 12, padding: "18px 14px", cursor: "pointer",
                    backdropFilter: "blur(8px)"
                  }}>
                    <div style={{ color: "var(--text)", fontSize: 14, fontWeight: 600 }}>{g.label}</div>
                  </div>
                ))}
              </div>

              {/* Trending */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <h2 style={{ color: "var(--text)", fontSize: 16, fontWeight: 500 }}>Trending Now</h2>
                {loading && <span className="pulsing" style={{ color: "var(--text2)", fontSize: 12 }}>Loading…</span>}
              </div>
              {trending.length > 0 && (
                <div style={{
                  marginBottom: 24, padding: 10, borderRadius: 12,
                  border: "1px solid var(--border)", background: "#11111188"
                }}>
                  <TrackList trackList={trending} />
                </div>
              )}
            </div>
          )}

          {/* ── SEARCH ── */}
          {view === "search" && (
            <div className="view-screen" style={{ padding: "24px 22px" }}>
              <h1 style={{
                fontSize: 34, fontWeight: 800,
                color: "var(--text)", marginBottom: 22
              }}>Search</h1>

              <div style={{ position: "relative", maxWidth: 540, marginBottom: 22 }}>
                <span style={{
                  position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                  color: "var(--text2)", pointerEvents: "none", display: "flex"
                }}><IconSearch size={20} color="currentColor" /></span>
                <input
                  autoFocus value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Artists, songs, moods…"
                  style={{
                    width: "100%", background: "var(--bg2)",
                    border: "1px solid var(--border)", borderRadius: 12,
                    padding: "13px 16px 13px 50px", color: "var(--text)",
                    fontSize: 15, outline: "none"
                  }}
                />
              </div>

              {!searchQuery && (
                <>
                  <h3 style={{ color: "var(--text2)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Browse Genres</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, maxWidth: 680 }}>
                    {availableGenres.map((g) => (
                      <div key={g.id} className="genre-tile" onClick={() => browseGenre(g)} style={{
                        background: g.color + "18", border: `1px solid ${g.color}30`,
                    borderRadius: 12, padding: "18px 14px", cursor: "pointer",
                    backdropFilter: "blur(8px)"
                      }}>
                        <div style={{ color: "var(--text)", fontSize: 14, fontWeight: 600 }}>{g.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {loading && searchQuery && <p className="pulsing" style={{ color: "var(--text2)", fontSize: 14 }}>Searching…</p>}

              {tracks.length > 0 && (
                <>
                  <p style={{ color: "var(--text2)", fontSize: 12, marginBottom: 12 }}>{tracks.length} results for "{searchQuery}"</p>
                  <TrackList trackList={tracks} />
                </>
              )}
              {!loading && searchQuery && tracks.length === 0 && (
                <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 12 }}>No results found. Try a different search.</p>
              )}
            </div>
          )}

          {/* ── GENRE ── */}
          {view === "genre" && selectedGenre && (
            <div className="view-screen" style={{ padding: "24px 22px" }}>
              <button onClick={() => setView("home")} style={{
                background: "var(--bg2)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "8px 16px", color: "var(--text2)",
                cursor: "pointer", fontSize: 13, marginBottom: 24, display: "flex", alignItems: "center", gap: 6
              }}>← Back</button>

              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 16, fontSize: 36,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: selectedGenre.color + "22", border: `1px solid ${selectedGenre.color}44`
                }}>
                  <span style={{ color: "var(--text)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em" }}>GENRE</span>
                </div>
                <div>
                  <div style={{ color: "var(--text2)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Genre</div>
                  <h1 style={{ fontSize: 36, fontWeight: 800, color: "var(--text)" }}>
                    {selectedGenre.label}
                  </h1>
                </div>
              </div>

              {loading && <p className="pulsing" style={{ color: "var(--text2)", fontSize: 14 }}>Loading tracks…</p>}
              {tracks.length > 0 && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <button
                      onClick={() => tracks[0] && playTrack(tracks[0], tracks)}
                      style={{
                        background: "var(--accent)", border: "none", borderRadius: 30,
                        padding: "10px 24px", color: "#000", fontSize: 14, fontWeight: 600,
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 8
                      }}
                    ><IconPlay size={16} color="#000" /> Play All</button>
                  </div>
                  <TrackList trackList={tracks} />
                </>
              )}
            </div>
          )}

          {/* ── NOW PLAYING ── */}
          {view === "nowplaying" && currentTrack && (
            <div className="view-screen" style={{ padding: "24px 22px" }}>
              <div style={{
                maxWidth: 960, margin: "0 auto", borderRadius: 18, border: "1px solid var(--border)",
                background: "linear-gradient(180deg, #1b1b1b, #121212)", padding: 24
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 28 }}>
                  <img
                    src={currentTrack.image || currentTrack.album_image || ""}
                    alt={currentTrack.name}
                    style={{
                      width: "100%", maxWidth: 320, aspectRatio: "1 / 1", borderRadius: 14, objectFit: "cover",
                      background: "var(--bg4)", boxShadow: "0 18px 40px rgba(0,0,0,0.45)"
                    }}
                  />
                  <div>
                    <div style={{ color: "var(--text2)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Now Playing
                    </div>
                    <h1 style={{ color: "var(--text)", fontSize: 40, fontWeight: 800, margin: "8px 0 4px", letterSpacing: "-0.04em" }}>
                      {currentTrack.name}
                    </h1>
                    <p style={{ color: "var(--text2)", fontSize: 16 }}>{currentTrack.artist_name}</p>

                    <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 16 }}>
                      <button className="ctrl-btn" onClick={skipPrev} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", padding: 2 }}>
                        <IconPrev size={24} color="currentColor" />
                      </button>
                      <button className="play-btn" onClick={togglePlay} style={{
                        width: 56, height: 56, borderRadius: "50%", background: "var(--accent)", border: "none",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        {isPlaying ? <IconPause size={20} color="#000" /> : <IconPlay size={20} color="#000" />}
                      </button>
                      <button className="ctrl-btn" onClick={skipNext} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", padding: 2 }}>
                        <IconNext size={24} color="currentColor" />
                      </button>
                    </div>

                    <div className="progress-wrap" ref={progressRef} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, width: "100%", maxWidth: 520 }}>
                      <span style={{ color: "var(--text2)", fontSize: 11, width: 34, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                        {formatTime(progress)}
                      </span>
                      <input
                        type="range" min={0} max={duration || 100} value={progress} step={0.1}
                        onChange={seek} style={{ flex: 1 }}
                      />
                      <span style={{ color: "var(--text2)", fontSize: 11, width: 34, fontVariantNumeric: "tabular-nums" }}>
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 22 }}>
                  <h2 style={{ color: "var(--text)", fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Lyrics</h2>
                  <div style={{
                    border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px",
                    background: "#101010", color: "var(--text2)", lineHeight: 1.8, fontSize: 14
                  }}>
                    <p>"{currentTrack.name}" by {currentTrack.artist_name}</p>
                    <p>Lyrics are not available from Jamendo for this track in the current integration.</p>
                    <p>Tip: keep this screen open while listening for a focused now-playing experience.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── LIKED SONGS ── */}
          {view === "liked" && (
            <div className="view-screen" style={{ padding: "24px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 16, fontSize: 36,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--accent-glow)", border: "1px solid var(--accent)30"
                }}>♥</div>
                <div>
                  <div style={{ color: "var(--text2)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Collection</div>
                  <h1 style={{ fontSize: 36, fontWeight: 800, color: "var(--text)" }}>
                    Liked Songs
                  </h1>
                  <div style={{ color: "var(--text2)", fontSize: 13, marginTop: 4 }}>{likedIds.size} songs</div>
                </div>
              </div>

              {likedTracks.length > 0 ? (
                <>
                  <button
                    onClick={() => likedTracks[0] && playTrack(likedTracks[0], likedTracks)}
                    style={{
                      background: "var(--accent)", border: "none", borderRadius: 30,
                      padding: "10px 24px", color: "#000", fontSize: 14, fontWeight: 600,
                      cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 8
                    }}
                  ><IconPlay size={16} color="#000" /> Play All</button>
                  <TrackList trackList={likedTracks} />
                </>
              ) : (
                <div style={{ color: "var(--text2)", lineHeight: 1.8 }}>
                  <p style={{ fontSize: 15, marginBottom: 8 }}>No liked songs yet.</p>
                  <p style={{ fontSize: 13 }}>Click ♡ on any track to add it here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <PlayerBar />

      {/* Mobile bottom tabs */}
      <div className="mobile-tabs" style={{
        display: "none", borderTop: "1px solid var(--border)",
        background: "var(--bg2)", padding: "10px 0"
      }}>
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setView(item.id)} style={{
            flex: 1, background: "none", border: "none",
            color: view === item.id ? "var(--accent)" : "var(--text2)",
            cursor: "pointer", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 4, fontSize: 20, padding: "4px 0"
          }}>
            <span style={{ display: "flex" }}>
              <item.icon size={19} color="currentColor" />
            </span>
            <span style={{ fontSize: 10 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────── Root ──────────────────────────
export default function Beatify() {
  const [clientId, setClientId] = useState(
    () => localStorage.getItem("beatify_cid") || "b3855015"
  );

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {clientId
        ? <MainApp clientId={clientId} onReset={() => { localStorage.removeItem("beatify_cid"); setClientId(""); }} />
        : <SetupScreen onSetup={setClientId} />
      }
    </>
  );
}
