# Kotopedia

Nx monorepo for cat-focused Angular applications.

## Apps

### `baza-karm`

Main public application for browsing a cat food database.

- Angular 21 standalone app
- SSR + prerendering + hydration
- PWA/service worker support
- Supabase-backed data and auth
- NGXS state management
- Syncfusion grid for desktop data views
- Taiga UI, Tailwind CSS and DaisyUI for UI

Main routes include:

- `/wszystkie`
- `/polecane`
- `/monobialkowe`
- `/chore-nerki`
- `/chora-trzustka`
- `/kocieta`
- `/login`

### `kalkulator`

Secondary Angular app intended for cat-related calculator tooling. It currently remains a lightweight scaffolded application with SSR and PWA support enabled.

## Requirements

- Node `22.22.2`
- npm `10+`

`.nvmrc` is pinned to the required Node version.

## Install

```bash
npm install
```

## Development

Run the main app:

```bash
npx nx serve baza-karm --configuration=development
```

Run the calculator app:

```bash
npx nx serve kalkulator --configuration=development
```

SVG assets are generated automatically before `start` and `build` through the workspace `prestart` and `prebuild` scripts.

## Build

Production build for the main app:

```bash
npx nx build baza-karm
```

CI-safe build for the main app with fake environment values:

```bash
npx nx build baza-karm --configuration=ci
```

Build the calculator app:

```bash
npx nx build kalkulator
```

## Test

```bash
npx nx test baza-karm
npx nx test kalkulator
```

## Lint

```bash
npx nx lint baza-karm
npx nx lint kalkulator
```

`baza-karm` currently lints with warnings in legacy code paths, but without lint errors.

## Upgrade Notes

The workspace is updated to:

- Angular 21
- Nx 22
- Jest 30
- Taiga UI 5
- stable NGXS 21

Validation after the upgrade:

- `npx nx build kalkulator`
- `npx nx build baza-karm --configuration=ci`
- `npx nx test kalkulator`
- `npx nx test baza-karm`
- `npx nx lint kalkulator`
- `npx nx lint baza-karm`


