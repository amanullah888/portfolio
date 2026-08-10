# Character art brief — what to generate, and why

This is the full audit you asked for: current state of every character asset on the
site, what's actually still wrong, and exactly what to ask Gemini for so whatever
comes back drops straight into the pipeline we already built. Read the "how to
brief Gemini" section before generating anything — it's the difference between an
image I can use in five minutes and one that needs another round of fighting a bad
cutout.

## The most important thing: resolution is no longer the problem

Before you generate anything new, know this: every character currently on the site
(Robin, Robin-serious, Cyborg, Starfire, Raven, Beast Boy) is already running on the
higher-resolution art you sent last round, and none of them are hitting the upscale
ceiling anymore. Here's the actual measured data from the processing pipeline:

| Character | Trimmed source | Fills "giant" frame at | Notes |
|---|---|---|---|
| Robin (pointing pose) | 197×384px | 90% height, 62% width | Good |
| Robin-serious (arms crossed) | 226×499px | 90% height, 54% width | Good |
| Cyborg (fist pump) | 372×392px | 73% height, 92% width | Width-capped — see below |
| Starfire (floating) | 274×424px | 90% height, 78% width | Good |
| Beast Boy (arms out) | 334×324px | 67% height, 92% width | Width-capped — see below |
| Raven (spell-casting) | 323×376px | 80% height, 92% width | Good |

Nothing here is being stretched past 2.5x its native size — the days of Beast Boy
being forced to 8x upscale are over. So the "Beast Boy looks small" problem you saw
was actually two separate things, and I already fixed the bigger one:

1. **A real layout bug** (now fixed): five sections (Powers, About, Experience,
   Personality, Shift) pinned the giant character to the literal bottom of the
   *entire section*, while the text/grid content was separately centered inside
   that same section. When content (like your 16-item skills grid) ended up taller
   than one screen, the section grew to fit it, and the character stayed glued to
   that much-lower true bottom — landing far below the content, often mostly
   off-screen. I rebuilt all five sections so the character and the content share
   the same layout cell and the character's bottom edge always tracks the
   content's actual bottom, regardless of viewport size or content length.

2. **A framing/pose difference** (still true, and this is what the brief below is
   for): Beast Boy and Cyborg both stand with arms spread wide, which eats up
   *width* instead of *height*. In a frame that's sized by height, a wide pose
   necessarily reads shorter than a tall, arms-in pose like Robin's. This isn't a
   bug — it's just that "arms out" poses will always look stockier than "arms at
   sides" poses at the same frame height. If you want Beast Boy and Cyborg to read
   as tall as Robin, the fix is a different pose, not a bigger image.

## How to brief Gemini so I can actually use the result

Three rules that matter more than anything else:

**Ask for a plain white background, not "transparent."** Gemini (like basically
every general-purpose image model) can't reliably output a real alpha channel —
if you ask for "transparent background" it'll often just render a checkerboard
pattern *as pixels*, which is unusable. A solid, pure white (#FFFFFF) background is
something I can cut out automatically and cleanly, the same way I processed the six
character sheets you sent earlier. This is the single most important instruction.

**One character, one pose, one image.** Not a reference sheet with four poses
crammed into one canvas. Every time we've extracted from a multi-pose grid, the
per-pose resolution has been way lower than it looks at a glance, and the
extraction step (isolating one pose from its neighbors) has been the single
biggest source of errors this whole project. A dedicated single-pose image at
native generation resolution is strictly better and needs zero extraction risk.

**Full body, head to toe, camera straight-on, standing upright.** Not a 3/4 angle,
not a close-up, not a dynamic action crop. The site displays these as bottom-anchored
full-body figures — anything else won't frame correctly no matter how it's processed.

Generic prompt template you can reuse for each one below:

> A single full-body cartoon character in the style of Teen Titans Go — chibi
> proportions, thick bold black outlines, flat cel-shaded coloring, standing
> upright, facing forward, camera straight-on, head to toe fully in frame with a
> small even margin around the whole body. Plain solid pure white background, no
> shadow, no gradient, no other objects, no text, no watermark. High detail, sharp
> linework, largest possible canvas.

Then swap in the character-specific description from the list below.

## Per-character requests

**Beast Boy — recommended, not urgent.** He's technically fine now (no upscale
capping), but if you want him to read as tall/prominent as Robin, ask for a more
vertical stance: arms down at his sides or one arm raised in a wave, feet together
or in a relaxed stance — not the current wide "jazz-hands" T-pose. Green skin,
purple/black jumpsuit with magenta accents, pointed ears, single visible fang,
matching the character already on the site. This is the one pose swap I'd actually
prioritize if you're commissioning anything.

**Cyborg — optional.** Same width-vs-height tradeoff as Beast Boy. His current
fist-pump pose is wide (arms bent out at the elbows). A straighter stance — one arm
at his side, one raised in a fist rather than both out — would read taller. Gray
and white robotic half-body armor, red glowing eye, blue circuit details, matching
current design.

**Robin, Robin-serious, Starfire, Raven — no action needed.** All four are already
filling 78–90% of their frame height with no upscale capping. Only regenerate these
if you specifically want a different pose for aesthetic reasons, not for a technical
fix.

**Team shot (`team.png`) — currently unused.** It exists in the project but no
component actually renders it (`FooterOutro` renders the five characters
individually instead). If you want an actual team lineup somewhere on the site,
tell me where and I'll wire it in — otherwise this file is just sitting there and
doesn't need regenerating.

## Three orphaned files — decide before generating replacements

These exist in `public/characters/` but nothing on the site currently displays
them. No point commissioning upgrades for art that isn't shown:

- `robin-hero.png` (93×108, smallest/lowest-quality Robin file) — only used as a
  silent fallback if `robin.png` goes missing, which it won't. **Recommend
  deleting.**
- `cyborg-tech.png` (170×144) — completely unused. Could be wired into the
  AgentOps Studio project card as a visual variant of Cyborg if you want variety
  there. **Recommend deleting unless you want that.**
- `beastboy-cat.png` (121×96, lowest native resolution of anything in the
  project) — completely unused. **Recommend deleting.**

Tell me "delete them" or "wire in cyborg-tech" and I'll do it — no new art needed
either way.

## What happens after you send new images

Send them one file per message (or a batch, doesn't matter) and tell me which
character/pose each one is. I'll run them through the same pipeline used for
everything else: auto-trim the white background, verify the crop didn't clip
anything, check it against the 4x-upscale ceiling, generate all four size variants
(giant/footer/badge/boot) plus @2x and WebP, and show you a before/after contact
sheet before touching anything live. If anything comes back looking off — bad
edges, wrong proportions, clipped limbs — I'll say so and show you exactly what's
wrong rather than shipping it anyway.
