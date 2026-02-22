# TGE Time Capsule MVP (Frontend Only)

A premium-style frontend MVP for a community **Time Capsule** experience:
- Name + avatar setup
- Write a letter (message / prediction / goal / wish)
- Seal capsule animation
- Locked capsule result
- Share card PNG export (download)
- Local demo board (locked capsules only)

## Current storage
This version stores capsules in **localStorage** (temporary).

Later you can connect:
- **Supabase Storage** for avatars
- **Supabase Postgres** for capsule records
- Reveal board / archive logic

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes for next step (Supabase)
- Replace local save in `src/App.jsx` (`saveLocalCapsule` / `loadLocalCapsules`)
- Keep the same UI flow and animation timing
- Add avatar upload + row insert in the sealing step

## Customize quickly
- Change TGE date in `src/App.jsx` (`TGE_DATE`)
- Update text copy / branding in `ShareCard`
- Replace stylized capsule visuals with your own PNG/WebM assets later
