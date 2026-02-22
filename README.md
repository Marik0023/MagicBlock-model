# Custom Figure Builder (Frontend-Only MVP)

A starter **React + Vite** project for a custom figure builder (2D layered SVG preview) with:

- figure customization (base, skin, hair, eyes, brows, mouth, outfit, accessories)
- box personalization (theme + title + subtitle)
- localStorage autosave
- randomize / reset
- **Download PNG** (full scene)
- **Download PNG (transparent)** (figure only)
- save/load preset as `.json`

## Start

```bash
npm install
npm run dev
```

## Notes

- This MVP uses an **original placeholder art style** (SVG shapes) and can be replaced later with your own PNG/SVG assets.
- To switch to image layers later, replace the rendering inside `PreviewStage.jsx` and keep the same state/catalog logic.
