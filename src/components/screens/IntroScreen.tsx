import { useState } from "react";
import type { JSX } from "react";
import "./IntroScreen.css";

interface IntroScreenProps {
  onStart: (archetype?: string) => void;
  onMusicChange?: (archetype: string) => void;
}

/**
 * Intro/Character Selection Screen
 * Allows players to select their archetype before starting the game
 * Music changes based on archetype selection
 */
export function IntroScreen({ onStart, onMusicChange }: IntroScreenProps): JSX.Element {
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);

  const archetypes = [
    {
      id: "warrior",
      name: "Warrior",
      description: "Strong and resilient, excels in close combat",
      icon: "⚔️",
    },
    {
      id: "mage",
      name: "Mage",
      description: "Master of arcane arts, powerful ranged attacks",
      icon: "🔮",
    },
    {
      id: "ranger",
      name: "Ranger",
      description: "Swift and precise, expert marksman",
      icon: "🏹",
    },
  ];

  const handleArchetypeSelect = (archetypeId: string): void => {
    setSelectedArchetype(archetypeId);
    if (onMusicChange) {
      onMusicChange(archetypeId);
    }
  };

  const handleStart = (): void => {
    onStart(selectedArchetype ?? undefined);
  };

  return (
    <div className="intro-screen" data-testid="intro-screen">
      <div className="intro-content">
        <h1 className="intro-title">🎯 Target Shooter</h1>
        <p className="intro-subtitle">Select Your Archetype</p>

        <div className="archetype-grid">
          {archetypes.map((archetype) => (
            <div
              key={archetype.id}
              className={`archetype-card ${
                selectedArchetype === archetype.id ? "selected" : ""
              }`}
              onClick={() => handleArchetypeSelect(archetype.id)}
              data-testid={`archetype-${archetype.id}`}
            >
              <div className="archetype-icon">{archetype.icon}</div>
              <h3 className="archetype-name">{archetype.name}</h3>
              <p className="archetype-description">{archetype.description}</p>
            </div>
          ))}
        </div>

        <button
          className="start-button"
          onClick={handleStart}
          disabled={!selectedArchetype}
          data-testid="start-button"
        >
          {selectedArchetype ? "Start Game" : "Select an Archetype"}
        </button>

        <div className="intro-footer">
          <p className="intro-hint">💡 Music changes based on your selection</p>
        </div>
      </div>
    </div>
  );
}
