# Tangle Tail Town — Cast Structure

_Word and Whiskers_ stories all take place in **Tangle Tail Town**. Every story
follows the same cast rules so the world stays consistent.

## Roles

### Narrator (permanent)
- **Willa the Wandering Warbler** (`willa_warbler`) is the single, permanent
  narrator for the whole _Word and Whiskers_ series.
- She travels the world collecting words in her **WORDS satchel** and flies into
  Tangle Tail Town to tell each story.
- Willa is **NOT a detective** — she is the storyteller.
- Every story's Scene 1 opens with a small flying-Willa intro: _"Willa flies in
  from her travels..."_
- Assets live in `public/characters/narrator/`:
  - `willa_the_wandering_warbler.png` — standing narrator portrait
  - `willa_flying.png` — flying intro (with map scroll)
  - `willa.json` — character metadata
- Willa replaces the previous narrators (Ted the Turtle / Mabel Mouse). The code
  default narrator in `src/data/characterAvatars.ts` is now `willa_warbler`.

### Detectives (max 1–2 per story)
- Each story has **1–2 detectives** who wear the ON DUTY detective kit
  (deerstalker hat, scarf, magnifier, badge).
- The player picks one of **9 detectives** in "Meet the Detectives"; their chosen
  detective is overlaid on the `detective` dialogue lines dynamically.

### Town characters
- Residents of Tangle Tail Town who are part of a story but are **not** detectives.
- They wear their everyday clothes only (no detective kit).

## Art style
Watercolor storybook, thick brown outline, big sparkle eyes, rosy cheeks —
matching the locked references `jake_snake_baker_final.png` and
`milo_red_tabby_detective.png`.

## "The Case of the Missing Cake Recipe" (-ake story)
- **Jake the Snake** — TOWN CHARACTER, baker/owner of Jake's Bakery. Chef hat +
  apron only, not a detective.
- **Pancake the Cat** — the story's DETECTIVE (`milo_red_tabby_detective.png`),
  ON DUTY hat/scarf/magnifier.
- **Willa the Warbler** — NARRATOR, all narrator dialogue lines.
- **Player** — can be Pancake or any 1 of the 9 detectives; the story lead is
  Pancake.
