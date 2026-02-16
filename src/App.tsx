import { useConvexAuth, useQuery, useMutation, useAction } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic2,
  Music,
  Sparkles,
  Play,
  Loader2,
  LogOut,
  Trash2,
  Crown,
  Volume2,
  ChevronDown,
} from "lucide-react";

type Artist = "tupac" | "biggie" | "50cent";

const ARTISTS: { id: Artist; name: string; aka: string; color: string; gradient: string }[] = [
  {
    id: "tupac",
    name: "Tupac Shakur",
    aka: "2Pac",
    color: "#FFD700",
    gradient: "from-yellow-500 via-orange-500 to-red-600",
  },
  {
    id: "biggie",
    name: "Notorious B.I.G.",
    aka: "Biggie",
    color: "#9333EA",
    gradient: "from-purple-600 via-violet-500 to-indigo-600",
  },
  {
    id: "50cent",
    name: "50 Cent",
    aka: "Fiddy",
    color: "#22C55E",
    gradient: "from-green-500 via-emerald-500 to-teal-600",
  },
];

function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", flow);
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 via-purple-500 to-green-500 mb-4"
          >
            <Crown className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            LEGEND<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-purple-500 to-green-500">FLOW</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium">Channel the Legends. Create Your Sound.</p>
        </div>

        {/* Auth Card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm font-medium"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 via-purple-500 to-green-500 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : flow === "signIn" ? (
                "Enter the Studio"
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-zinc-400 hover:text-white transition-colors font-medium"
            >
              {flow === "signIn" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800">
            <button
              onClick={() => signIn("anonymous")}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium text-zinc-300 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Continue as Guest
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ArtistSelector({
  selected,
  onSelect,
}: {
  selected: Artist;
  onSelect: (a: Artist) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4">
      {ARTISTS.map((artist) => (
        <motion.button
          key={artist.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(artist.id)}
          className={`relative p-3 md:p-6 rounded-2xl border-2 transition-all ${
            selected === artist.id
              ? `border-transparent bg-gradient-to-br ${artist.gradient}`
              : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600"
          }`}
        >
          <div
            className={`text-2xl md:text-4xl font-black ${
              selected === artist.id ? "text-white" : "text-zinc-400"
            }`}
          >
            {artist.aka}
          </div>
          <div
            className={`text-xs md:text-sm mt-1 ${
              selected === artist.id ? "text-white/80" : "text-zinc-600"
            }`}
          >
            {artist.name}
          </div>
          {selected === artist.id && (
            <motion.div
              layoutId="artist-indicator"
              className="absolute inset-0 rounded-2xl ring-4 ring-white/30"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}

function GeneratorPanel() {
  const createTrack = useMutation(api.tracks.create);
  const generateLyrics = useAction(api.generate.generateLyrics);
  const generateAudio = useAction(api.generate.generateAudio);

  const [selectedArtist, setSelectedArtist] = useState<Artist>("tupac");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim() || !prompt.trim()) return;

    setIsGenerating(true);
    try {
      const trackId = await createTrack({
        title: title.trim(),
        artist: selectedArtist,
        prompt: prompt.trim(),
      });

      // Generate lyrics
      const result = await generateLyrics({
        trackId,
        artist: selectedArtist,
        prompt: prompt.trim(),
      });

      // Generate audio
      if (result.lyrics) {
        await generateAudio({
          trackId,
          lyrics: result.lyrics,
          artist: selectedArtist,
        });
      }

      setTitle("");
      setPrompt("");
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-4 md:p-8 border border-zinc-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-yellow-500 via-purple-500 to-green-500 flex items-center justify-center">
          <Mic2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Create a Track</h2>
          <p className="text-zinc-500 text-xs md:text-sm">Choose a legend, describe your vision</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-3">Select Your Legend</label>
          <ArtistSelector selected={selectedArtist} onSelect={setSelectedArtist} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-2">Track Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Streets of Gold"
            className="w-full px-4 py-3.5 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-2">Your Vision</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the theme, mood, or story for your track..."
            rows={3}
            className="w-full px-4 py-3.5 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={isGenerating || !title.trim() || !prompt.trim()}
          className="w-full py-4 bg-gradient-to-r from-yellow-500 via-purple-500 to-green-500 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Your Masterpiece...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Track
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

type TrackStatus = "generating_lyrics" | "generating_audio" | "completed" | "failed";

interface Track {
  _id: string;
  title: string;
  artist: Artist;
  prompt: string;
  lyrics?: string;
  audioUrl?: string;
  status: TrackStatus;
  createdAt: number;
}

function TrackCard({ track }: { track: Track }) {
  const deleteTrack = useMutation(api.tracks.remove);
  const [showLyrics, setShowLyrics] = useState(false);

  const artist = ARTISTS.find((a) => a.id === track.artist)!;
  const statusColors = {
    generating_lyrics: "text-yellow-400 bg-yellow-400/10",
    generating_audio: "text-purple-400 bg-purple-400/10",
    completed: "text-green-400 bg-green-400/10",
    failed: "text-red-400 bg-red-400/10",
  };

  const statusText = {
    generating_lyrics: "Writing Lyrics...",
    generating_audio: "Producing Beat...",
    completed: "Ready to Play",
    failed: "Generation Failed",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-800 overflow-hidden"
    >
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${artist.gradient} flex items-center justify-center flex-shrink-0`}
            >
              <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white text-base md:text-lg truncate">{track.title}</h3>
              <p className="text-zinc-500 text-xs md:text-sm">In the style of {artist.name}</p>
            </div>
          </div>
          <button
            onClick={() => deleteTrack({ id: track._id })}
            className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[track.status]}`}
          >
            {track.status === "generating_lyrics" || track.status === "generating_audio" ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                {statusText[track.status]}
              </span>
            ) : (
              statusText[track.status]
            )}
          </span>
        </div>

        {track.lyrics && (
          <div className="mt-4">
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showLyrics ? "rotate-180" : ""}`}
              />
              {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
            </button>
            <AnimatePresence>
              {showLyrics && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <pre className="mt-3 p-4 bg-black/50 rounded-xl text-sm text-zinc-300 whitespace-pre-wrap font-mono border border-zinc-800 max-h-64 overflow-y-auto">
                    {track.lyrics}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {track.status === "completed" && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`mt-4 w-full py-3 bg-gradient-to-r ${artist.gradient} rounded-xl font-semibold text-white flex items-center justify-center gap-2`}
          >
            <Play className="w-4 h-4" />
            Play Track
            <Volume2 className="w-4 h-4 ml-2" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function TracksLibrary() {
  const tracks = useQuery(api.tracks.list);

  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-4 md:p-8 border border-zinc-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
          <Music className="w-5 h-5 md:w-6 md:h-6 text-zinc-400" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Your Tracks</h2>
          <p className="text-zinc-500 text-xs md:text-sm">
            {tracks === undefined ? "Loading..." : `${tracks.length} track${tracks.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {tracks === undefined ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Mic2 className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-zinc-500">No tracks yet. Create your first masterpiece!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {tracks.map((track: Track) => (
              <TrackCard key={track._id} track={track} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function MainApp() {
  const { signOut } = useAuthActions();

  return (
    <div className="min-h-screen bg-black relative">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800/50 bg-black/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 via-purple-500 to-green-500 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black text-white">
              LEGEND<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-purple-500 to-green-500">FLOW</span>
            </span>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            Channel the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-purple-500 to-green-500">
              Legends
            </span>
          </h1>
          <p className="text-zinc-500 text-base md:text-lg max-w-2xl mx-auto px-4">
            Create original rap tracks in the style of hip-hop's greatest icons. Powered by AI, inspired by the greats.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GeneratorPanel />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TracksLibrary />
          </motion.div>
        </div>

        {/* Artist Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 md:mt-16"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-6 md:mb-8">The Legends</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {ARTISTS.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`relative p-6 md:p-8 rounded-2xl bg-gradient-to-br ${artist.gradient} overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">{artist.aka}</div>
                  <div className="text-white/80 text-sm md:text-base">{artist.name}</div>
                  <div className="mt-4 text-white/60 text-xs md:text-sm">
                    {artist.id === "tupac" && "West Coast Poetry • Social Commentary • Emotional Depth"}
                    {artist.id === "biggie" && "East Coast Flow • Smooth Storytelling • Intricate Wordplay"}
                    {artist.id === "50cent" && "Club Anthems • Hustler Narratives • Catchy Hooks"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 md:mt-24 border-t border-zinc-800/50 py-6 md:py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-zinc-600 text-xs">
            Requested by <span className="text-zinc-500">@stringer_kade</span> · Built by <span className="text-zinc-500">@clonkbot</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Crown className="w-12 h-12 text-purple-500" />
        </motion.div>
      </div>
    );
  }

  return isAuthenticated ? <MainApp /> : <AuthScreen />;
}
