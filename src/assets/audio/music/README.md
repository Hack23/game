# Music Assets

This directory contains music assets for the game.

## Directory Structure

- `intro/` - Music for the intro/character selection screen
- `combat/` - Music for combat gameplay
- `training/` - Music for training mode

## File Format Guidelines

**Supported Formats:**
- MP3 (recommended for compatibility and size)
- WAV (higher quality but larger file size)
- OGG (good compression, wide browser support)

**Recommendations:**
- **Bitrate:** 128-192 kbps for MP3
- **Sample Rate:** 44.1 kHz
- **Channels:** Stereo
- **Loop Points:** Ensure tracks loop seamlessly for continuous playback

## Adding Music Files

1. Place music files in the appropriate subdirectory
2. Use descriptive filenames (e.g., `intro-theme-1.mp3`, `combat-intense.mp3`)
3. Update `src/config/musicConfig.ts` with the new track information
4. Consider file size - aim for 1-3 MB per track for web performance

## Current Tracks

### Intro Screen
- Add your intro music files here (e.g., `intro-theme.mp3`)

### Combat Screen  
- Add your combat music files here (e.g., `combat-action.mp3`)

### Training Screen
- Add your training music files here (e.g., `training-calm.mp3`)

## Fallback Behavior

If music assets are not found, the game will automatically fall back to procedurally-generated music to ensure the game remains functional.

## License

Ensure all music files have appropriate licenses for use in this project. Add license information in `MUSIC_LICENSES.md`.
