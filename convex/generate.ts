import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const ARTIST_STYLES = {
  tupac: {
    name: "Tupac Shakur",
    style: "poetic, socially conscious, emotional depth, west coast flow, themes of struggle, survival, and social justice. Uses vivid imagery and metaphors. References to thug life, California, and street poetry.",
    keywords: ["California love", "keep ya head up", "thug life", "changes", "dear mama"],
  },
  biggie: {
    name: "The Notorious B.I.G.",
    style: "smooth storytelling, intricate wordplay, east coast flow, luxurious imagery mixed with street narratives. Effortless delivery with complex rhyme schemes and vivid storytelling.",
    keywords: ["Brooklyn", "hypnotize", "big poppa", "ready to die", "mo money"],
  },
  "50cent": {
    name: "50 Cent",
    style: "catchy hooks, club-ready beats, confident swagger, street hustler narratives. Direct and punchy lyrics with memorable one-liners and aggressive delivery.",
    keywords: ["get rich", "in da club", "candy shop", "G-Unit", "bulletproof"],
  },
};

export const generateLyrics = action({
  args: {
    trackId: v.id("tracks"),
    artist: v.union(v.literal("tupac"), v.literal("biggie"), v.literal("50cent")),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const artistStyle = ARTIST_STYLES[args.artist];

    // Note: In production, you'd use the actual Grok API
    // For demo, we'll generate sample lyrics
    const systemPrompt = `You are a legendary hip-hop lyricist channeling the spirit of ${artistStyle.name}.
Write original rap lyrics in their distinctive style: ${artistStyle.style}

Key elements to incorporate: ${artistStyle.keywords.join(", ")}

Rules:
- Write 2-3 verses with a hook/chorus
- Stay true to the artist's flow and themes
- Make it feel authentic to their era and style
- Include vivid imagery and wordplay`;

    try {
      // Simulated API response for demo
      // In production: call Grok API here
      const lyrics = generateSampleLyrics(args.artist, args.prompt);

      await ctx.runMutation(api.tracks.updateLyrics, {
        id: args.trackId,
        lyrics,
      });

      return { success: true, lyrics };
    } catch (error) {
      await ctx.runMutation(api.tracks.setFailed, {
        id: args.trackId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  },
});

export const generateAudio = action({
  args: {
    trackId: v.id("tracks"),
    lyrics: v.string(),
    artist: v.union(v.literal("tupac"), v.literal("biggie"), v.literal("50cent")),
  },
  handler: async (ctx, args) => {
    try {
      // Note: In production, you'd use the actual Suno API
      // For demo, we'll mark as completed with a placeholder

      // Simulated delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production: call Suno API here
      const audioUrl = "https://example.com/generated-track.mp3";

      await ctx.runMutation(api.tracks.updateAudio, {
        id: args.trackId,
        audioUrl,
      });

      return { success: true, audioUrl };
    } catch (error) {
      await ctx.runMutation(api.tracks.setFailed, {
        id: args.trackId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  },
});

// Sample lyrics generator for demo purposes
function generateSampleLyrics(artist: "tupac" | "biggie" | "50cent", prompt: string): string {
  const templates = {
    tupac: `[Verse 1]
Through the concrete grows a rose, defying all the odds
In these streets where dreams get lost, still I keep my eyes on God
${prompt} got me thinking 'bout the way we live our lives
California sun don't shine the same when homies say goodbye

[Chorus]
Keep ya head up, even when the road gets rough
Through the struggle and the pain, we show the world we tough enough
From the block to the top, thug life ain't no game
But we rise from the ashes, burning bright like flame

[Verse 2]
Mama told me there'd be days like this
When the world turns cold and love gets dismissed
But I carry her strength in every word I spit
Revolutionary minds don't quit, nah we don't quit

[Outro]
To all my soldiers holding it down in the struggle
Stay strong, stay true, we in this together`,

    biggie: `[Verse 1]
It was all a dream, I used to read Word Up magazine
${prompt} on my mind, now I'm living like a king
Brooklyn streets taught me everything I know
From the corner store stories to the penthouse flow

[Chorus]
Hypnotize ya with the flow, baby baby
Biggie Smalls is the illest, call me crazy
From the gutter to the glory, that's my story
Big Poppa rising, basking in the glory

[Verse 2]
Suede Timbs on my feet, Coogi sweater looking neat
Every bar I deliver, competition taste defeat
Players hate but they can't replicate this smooth delivery
Brooklyn's finest storyteller, making history

[Bridge]
Mo' money, mo' problems, that's the truth they say
But I'd rather cry in the Bentley any day`,

    "50cent": `[Verse 1]
Yeah, G-Unit in the building, you know how we do
${prompt} on the agenda, watch me push on through
Bulletproof mentality, I survived the game
50 Cent on the track, things ain't never the same

[Chorus]
In da club, bottle full of bub
Look homie, we about to turn it up
From the streets to the suites, we made it through
G-Unit riders, we coming for you

[Verse 2]
They shot me nine times, still I'm standing tall
Queens representative, I won't ever fall
Get rich or die trying, that's the motto we live
Every verse is a blessing, every bar is a gift

[Outro]
Southside, let's go!`,
  };

  return templates[artist];
}
