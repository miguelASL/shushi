# Shushi

Contador de sushi toon premium: modo solitario, batalla libre (sin tiempo) y estadísticas.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy en Vercel

1. Importa la carpeta `contador-sushi` (o el monorepo con root directory `contador-sushi`).
2. Build: `npm run build`
3. Output: `dist`

`vercel.json` ya define framework Vite y `outputDirectory: dist`.

## Stack

- Vite + React 18
- Tailwind CSS 3
- Web Audio API + localStorage
