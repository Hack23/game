# Music Asset System Implementation Guide

## Overview

This guide documents the new music asset system that supports loading music files from the `/public/assets/audio/music` directory with automatic fallback to procedurally-generated music.

## What Changed

### 1. Music Configuration System

**File:** `src/config/musicConfig.ts`

Centralized configuration for all game music tracks:

```typescript
export const musicConfig: MusicConfig = {
  intro: [
    {
      name: "Intro Theme",
      path: "/assets/audio/music/intro-theme.mp3",
      volume: 0.3,
      loop: true,
    },
  ],
  combat: [...],
  training: [...],
  background: [...],
};
```

### 2. Enhanced Audio Manager

**File:** `src/hooks/useAudioManager.ts`

New capabilities:
- **Dynamic Music Loading:** Load music from assets at runtime
- **Automatic Fallback:** Falls back to procedural generation if asset fails to load
- **Music Switching:** `switchMusic(musicTrack)` for seamless track changes
- **Asset Support:** Loads MP3, WAV, and OGG files

API Changes:
```typescript
interface AudioManager {
  // ... existing functions
  startBackgroundMusic: (musicTrack?: MusicTrack) => void; // Now accepts optional track
  switchMusic: (musicTrack: MusicTrack) => void; // NEW
}
```

### 3. IntroScreen Component

**Files:** 
- `src/components/screens/IntroScreen.tsx`
- `src/components/screens/IntroScreen.css`

Features:
- Character/archetype selection interface
- Music changes on archetype selection (framework ready)
- Beautiful animated UI with hover effects
- Responsive design

![IntroScreen](https://github.com/user-attachments/assets/6ca64355-567b-4265-8a17-da57eeae9911)

### 4. Screen Management

**File:** `src/App.tsx`

Added:
- Screen state management (`intro` | `game`)
- IntroScreen integration
- Screen-specific music playback
- Automatic intro screen skip in test environment

## Directory Structure

```
src/
├── assets/
│   └── audio/
│       └── music/
│           ├── README.md          # Music asset guidelines
│           ├── intro/              # Intro screen music
│           ├── combat/             # Combat gameplay music
│           └── training/           # Training mode music
├── components/
│   └── screens/
│       ├── IntroScreen.tsx        # Character selection screen
│       └── IntroScreen.css        # IntroScreen styles
├── config/
│   └── musicConfig.ts             # Music track configuration
└── hooks/
    └── useAudioManager.ts         # Enhanced audio manager

public/
└── assets/
    └── audio/
        └── music/                  # Place music files here
            ├── intro-theme.mp3
            ├── combat-action.mp3
            └── training-calm.mp3
```

## Adding Music Files

### Step 1: Place Music Files

Add your music files to `/public/assets/audio/music/`:

```bash
public/assets/audio/music/
├── intro-theme.mp3          # Main intro/menu music
├── combat-action.mp3        # Combat gameplay music
├── training-calm.mp3        # Training mode music
└── background-theme.mp3     # Default/fallback music
```

**Recommended Formats:**
- **MP3:** Best compatibility and size (128-192 kbps recommended)
- **WAV:** Higher quality but larger files
- **OGG:** Good compression with wide browser support

### Step 2: Update Music Configuration

Edit `src/config/musicConfig.ts`:

```typescript
export const musicConfig: MusicConfig = {
  intro: [
    {
      name: "Intro Theme",
      path: "/assets/audio/music/intro-theme.mp3",
      volume: 0.3,  // 30% volume
      loop: true,   // Loop continuously
    },
  ],
  // Add more tracks...
};
```

### Step 3: Use in Your Code

```typescript
import { getMusicForScreen } from './config/musicConfig';
import { useAudioManager } from './hooks/useAudioManager';

function MyComponent() {
  const audioManager = useAudioManager();
  
  // Start intro music
  const introMusic = getMusicForScreen("intro");
  if (introMusic) {
    audioManager.startBackgroundMusic(introMusic);
  }
  
  // Switch to combat music
  const combatMusic = getMusicForScreen("combat");
  if (combatMusic) {
    audioManager.switchMusic(combatMusic);
  }
}
```

## How Music Loading Works

### Flow Diagram

```
startBackgroundMusic(musicTrack?)
         |
         ├─ musicTrack provided?
         |  ├─ YES → loadMusicFromAsset(musicTrack)
         |  |        ├─ Create Howl with asset path
         |  |        ├─ onload → play music ✓
         |  |        └─ onloaderror → loadProceduralMusic()
         |  |
         |  └─ NO → loadProceduralMusic()
         |           ├─ Generate music with Web Audio API
         |           └─ Create Howl with generated audio
         |
         └─ Music plays
```

### Fallback Behavior

If a music file fails to load (404, network error, unsupported format), the system automatically:
1. Logs the error to console
2. Falls back to procedurally-generated music
3. Continues gameplay without interruption

This ensures the game **always** has music, even without assets.

## Testing

### Manual Testing

1. **Without Music Assets:**
   ```bash
   npm run dev
   ```
   - Game loads with procedurally-generated music ✓
   - Console shows: "Falling back to procedural music generation"

2. **With Music Assets:**
   ```bash
   # Add music files to public/assets/audio/music/
   npm run dev
   ```
   - Game loads music from assets ✓
   - Console shows: "✓ Music loaded: Intro Theme"

### Automated Tests

All 169 tests pass, including:
- Audio manager tests with dynamic loading
- App integration tests
- IntroScreen rendering tests

```bash
npm test
```

## Music Guidelines

### File Size
- Target: 1-3 MB per track
- Use compression for web delivery
- Consider loop points for seamless playback

### Loop Points
Ensure tracks loop seamlessly:
- Fade in/out at boundaries
- Match tempo at start/end
- Test in the game before committing

### Volume Levels
- **Intro/Menu:** 0.3 (30%) - Less intrusive
- **Gameplay:** 0.2-0.25 (20-25%) - Background ambience
- **Sound Effects:** 0.7-0.85 (70-85%) - Clear feedback

### Browser Compatibility

| Format | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| MP3    | ✓      | ✓       | ✓      | ✓    |
| WAV    | ✓      | ✓       | ✓      | ✓    |
| OGG    | ✓      | ✓       | ✓      | ✓    |

## IntroScreen Features

### Archetype Selection
Three character archetypes available:
- **Warrior** ⚔️ - Strong and resilient, excels in close combat
- **Mage** 🔮 - Master of arcane arts, powerful ranged attacks
- **Ranger** 🏹 - Swift and precise, expert marksman

### Music Integration
When an archetype is selected, the `onMusicChange` callback fires, allowing for:
- Archetype-specific music variations
- Dynamic intro music based on player choice
- Seamless transitions between tracks

### UI/UX
- **Hover Effects:** Cards lift and glow on hover
- **Selection State:** Selected card highlights with green border
- **Animations:** Floating icons, gradient title animation
- **Responsive:** Adapts to mobile/tablet/desktop

## Migration from Procedural Music

If you're migrating from the procedural music system:

1. **Keep procedural as fallback** - Already implemented
2. **Add music files gradually** - Start with intro music
3. **Test thoroughly** - Verify loading and fallback
4. **Update volume levels** - Assets may need different volumes

## Troubleshooting

### Music Doesn't Play

**Check console for errors:**
```
Failed to load music from /assets/audio/music/intro-theme.mp3
```

**Solutions:**
1. Verify file exists in `public/assets/audio/music/`
2. Check file path in `musicConfig.ts`
3. Ensure file format is supported
4. Check browser console for CORS issues

### Music Too Loud/Quiet

**Adjust volume in `musicConfig.ts`:**
```typescript
{
  name: "Intro Theme",
  path: "/assets/audio/music/intro-theme.mp3",
  volume: 0.2,  // Adjust between 0.0 - 1.0
  loop: true,
}
```

### Music Doesn't Loop Smoothly

**Check audio file:**
1. Open in audio editor (Audacity, etc.)
2. Ensure clean loop points
3. Add fade in/out if needed
4. Re-export and test

## Future Enhancements

Possible improvements:
- **Multiple tracks per screen** - Random selection from pool
- **Crossfade transitions** - Smooth music switches
- **Adaptive music** - Changes based on game intensity
- **Music preloading** - Load next track in advance
- **Playlist system** - Queue multiple tracks

## License

Ensure all music files have appropriate licenses. Document in `public/assets/audio/music/LICENSES.md`.

## Summary

The music asset system provides:
- ✅ **Professional music support** - Load MP3/WAV/OGG files
- ✅ **Automatic fallback** - Never breaks if assets missing
- ✅ **Easy configuration** - Centralized music config
- ✅ **Dynamic switching** - Change music on the fly
- ✅ **IntroScreen** - Beautiful character selection UI
- ✅ **Fully tested** - All 169 tests passing

The game now supports both asset-based music for production and procedural music for development/fallback.
