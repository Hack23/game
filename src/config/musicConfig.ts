/**
 * Music configuration for the game
 * Maps game screens/modes to their respective music tracks
 */

export interface MusicTrack {
  name: string;
  path: string;
  volume?: number;
  loop?: boolean;
}

export interface MusicConfig {
  intro: MusicTrack[];
  combat: MusicTrack[];
  training: MusicTrack[];
  background: MusicTrack[];
}

/**
 * Music configuration
 * 
 * To add music files:
 * 1. Place audio files in /public/assets/audio/music/
 * 2. Add track configuration below
 * 3. Supported formats: MP3, WAV, OGG
 */
export const musicConfig: MusicConfig = {
  // Intro screen music - plays during character selection
  intro: [
    {
      name: "Intro Theme",
      path: "/assets/audio/music/intro-theme.mp3",
      volume: 0.3,
      loop: true,
    },
  ],
  
  // Combat music - plays during combat gameplay
  combat: [
    {
      name: "Combat Action",
      path: "/assets/audio/music/combat-action.mp3",
      volume: 0.25,
      loop: true,
    },
  ],
  
  // Training music - plays during training mode
  training: [
    {
      name: "Training Calm",
      path: "/assets/audio/music/training-calm.mp3",
      volume: 0.25,
      loop: true,
    },
  ],
  
  // Background/default music - fallback or general gameplay
  background: [
    {
      name: "Background Theme",
      path: "/assets/audio/music/background-theme.mp3",
      volume: 0.2,
      loop: true,
    },
  ],
};

/**
 * Get music track for a specific screen/mode
 * Returns the first track from the list (can be extended for random selection)
 */
export function getMusicForScreen(screen: keyof MusicConfig): MusicTrack | undefined {
  const tracks = musicConfig[screen];
  return tracks.length > 0 ? tracks[0] : undefined;
}

/**
 * Get random music track for a specific screen/mode
 */
export function getRandomMusicForScreen(screen: keyof MusicConfig): MusicTrack | undefined {
  const tracks = musicConfig[screen];
  if (tracks.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * tracks.length);
  return tracks[randomIndex];
}
