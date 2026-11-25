# Design Notes — Desktop Reference

The site is designed for **100% browser zoom** on a **100% OS display scale**.

---

## Typography

| Element | Value |
|---|---|
| HTML root | `font-size: 15px` |
| Body text | `1rem` = 15px |
| Nav links | `0.94rem` ≈ 14.1px |
| Label spans | `0.72rem` ≈ 10.8px |
| Display headings | Bebas Neue, sized per component |

All rem-based values scale from the 15px root. To scale the whole UI
up or down, change the root font size and most spacing/text follows.

---

## Photo Cards (Gallery)

| Property | Value |
|---|---|
| Card width constant | `CARD_WIDTH = 220px` |
| Card height constant | `CARD_HEIGHT = 244px` (220 image + 24 caption) |
| Image area | `204 × 204px` (card minus 8px padding each side) |
| Desktop display scale | `mobileScale = 0.75` → 165 × 183px on screen |
| Mobile display scale | `mobileScale = 0.45` → 99 × 110px on screen |
| Border | `4px` |
| Inner padding | `8px` |
| Rotation | random ±10° |
| Stack overlap | `OVERLAP = 0.25` → step = `effCardH × 0.75` |
| Desktop down-shift | `window.innerHeight × 0.07` |

The cards' `CARD_WIDTH` / `CARD_HEIGHT` stay at the original values; the
display scale (`mobileScale`) is what shrinks them on screen.

---

## Layout

| Property | Value |
|---|---|
| Nav height | `--nav-height: 50px` |
| Hero height | `calc(100vh - 50px - 3rem)` |
| Sprocket strip | `1.5rem` ≈ 22.5px |
| Body top padding | `var(--nav-height)` = 50px |

---

## Note on Windows display scaling

If you're on a Windows machine with display scale set to anything other
than 100% (e.g. 150% recommended), your browser's "100% zoom" is already
scaled by the OS. To preview the site the way most users see it, set
Windows display scale to 100% while making design decisions.
