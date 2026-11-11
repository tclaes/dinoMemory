# Dino Memory Game

- create a new branch for new feature, named `<type>/<kebab-name>` with type `feature`, `fix`, `chore` or `ci`

## Where things live (`src/app/`)

- Import alias: `@game/*` → `src/app/game/*` (tsconfig `paths`); use it instead of `../../..` chains.
- Decks: `nav/navigation` (picker) → `game/playfield/services/game.service.ts` → `deck.service.ts`; models in `game/playfield/model/`.
- Auth: `core/auth/auth-ops.ts` → `services/auth.service.ts` → `guards/auth.guard.ts` → `app.routes.ts`; login UI in `user/components/`, shell in `ui/layout`.
- Scores: `game/scoreboard/` (`firestore-ops.ts` wraps Firestore).
- Game state: `game/global`, `game/game-status-bar` (timer, clicks, restart).
- Specs: `openspec/specs/<capability>/spec.md`; open changes in `openspec/changes/`.

## Running things

- Commands: `package.json` scripts. The shell starts in the repo root.
- e2e: `npm run e2e` boots the Auth and Firestore emulators and the dev server itself (needs JDK 21).
- `src/environments/` is gitignored; e2e uses `environment.e2e.ts` via an `angular.json` fileReplacement.
- CI: `test.yml` (lint, unit, e2e), `deploy.yml` (master → live), `firebase-hosting-pull-request.yml` (PR previews).
