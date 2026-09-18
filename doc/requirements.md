# Requirements

> Copyright (c) 2016, 2026 Oliver Merkel. MIT License.

This document lists Functional Requirements (FR) and Non-Functional
Requirements (NFR) for the Oware / Ouril application, organized by the
software modules described in [software_architecture.md](software_architecture.md).

- Functional requirements are derived from the physical game rules in
  [rules.md](rules.md) (see cross references per requirement) and from the
  behavior actually implemented in `html5/src/js/`.
- Every requirement lists the test(s) that verify it. Unit tests live in
  `html5/src/tests/unit/*.test.js` (Vitest); end-to-end tests live in
  `html5/src/tests/e2e/game.spec.js` (Playwright). Requirements without an
  automated test are marked explicitly as **Not covered**.
- Requirement IDs are stable identifiers for cross-referencing; they do
  not imply an execution or priority order.

## 1. `js/common.js` - Shared Constants

### FR-COMMON-1: Board dimensions and initial seeding

The board has 12 bowls in 2 rows of 6; every bowl starts with 4 seeds
(48 seeds total). See [rules.md § What You Need](rules.md#what-you-need).

- Implementation: `BOWLS_TOTAL`, `SEEDS_PER_BOWL`, `SOUTH_ROW`, `NORTH_ROW`
  in `js/common.js`; consumed by `createBoard()` in `js/board.js`.
- Verified by: `common.test.js` › "defines the board size and initial seed
  count", "defines the row bowl indices"; `board.test.js` › "creates the
  standard initial Oware position".

### FR-COMMON-2: Two supported rule sets

The application supports exactly two rule sets, Oware and Ouril, and two
player kinds, Human and AI.

- Implementation: `RULES`, `PLAYERS` enums in `js/common.js`.
- Verified by: `common.test.js` › "defines rules and player-kind enums".

## 2. `js/board.js` - Game Rules Engine

### FR-BOARD-1: Picking up seeds

On a turn, the active player picks up all seeds from one non-empty bowl
in their own row, which then becomes empty. See
[rules.md § Step 1 - Pick Up](rules.md#step-1---pick-up).

- Implementation: `pickUp(board, bowl)`.
- Verified by: `board.test.js` › "empties the chosen bowl and remembers
  pick-up bookkeeping", "does not mutate the bowls array of the input
  board".

### FR-BOARD-2: Sowing direction and wrap-around

Picked-up seeds are sown one at a time into consecutive bowls, moving
counter-clockwise across both rows (own and opponent's), wrapping from
bowl 12 back to bowl 1. See [rules.md § Step 2 - Sow](rules.md#step-2---sow).

- Implementation: `sowOnce(board)`, `nextBowlIndex()` (internal) in
  `js/board.js`.
- Verified by: `board.test.js` › "sows exactly one seed into the next
  bowl on the path".

### FR-BOARD-3: Kroo rule (skip the starting bowl)

A bowl holding more than 11 seeds ("Kroo") sows enough seeds to
reach its own starting bowl again; that starting bowl is skipped every
time sowing reaches it, and ends the turn empty. See
[rules.md § Special Rule: Kroo](rules.md#special-rule-kroo-very-full-bowls).

- Implementation: `nextBowlIndex()` skip logic in `js/board.js`, driven
  by `board.initialBowl`.
- Verified by: `board.test.js` › "skips the initial bowl on wrap-around
  (Kroo rule)".

### FR-BOARD-4: Harvesting

If the last seed of a turn lands in an opponent's bowl that then holds
exactly 2 or 3 seeds, those seeds are harvested; harvesting continues
backwards through immediately preceding, still-opponent-row bowls as long
as each also holds exactly 2 or 3 seeds, and stops at the first bowl that
does not qualify. See [rules.md § Step 3 - Harvest](rules.md#step-3---harvest).

- Implementation: `harvest(board)` in `js/board.js`.
- Verified by: `board.test.js` › "harvests consecutive 2- or 3-seed bowls
  backwards in the opponent row", "does not harvest when landing in the
  own row", "does not harvest bowls outside 2 or 3 seeds", "harvests for
  the north player landing in the south row".

### FR-BOARD-5: Legal moves under Oware

Under Oware rules, every non-empty bowl in the active player's own row is
a legal pick-up.

- Implementation: `getActions(board)` (threshold 0) in `js/board.js`.
- Verified by: `board.test.js` › "returns all non-empty own bowls under
  Oware rules", "returns north row bowls when north is active", "returns
  an empty array when the active row is entirely empty".

### FR-BOARD-6: Legal moves under Ouril (single-seed restriction)

Under Ouril rules, a bowl holding exactly 1 seed is a legal pick-up only
if none of the active player's other own bowls holds more than 1 seed.
See [rules.md § Picking Up Single Seeds](rules.md#picking-up-single-seeds).

- Implementation: `getActions(board)` (threshold 1, single-seed fallback)
  in `js/board.js`.
- Verified by: `board.test.js` › "under Ouril rules, prefers bowls with
  more than 1 seed", "under Ouril rules, falls back to single-seed bowls
  when none has more than 1".

### FR-BOARD-7: Turn advancement, including the Ouril extra-turn case

After harvesting, the turn passes to the other player under Oware.
Under Ouril, if the player who just moved has no legal action available
afterward, they play again instead of passing.

- Implementation: `advanceTurn(board)` in `js/board.js`.
- Verified by: `board.test.js` › "always toggles the active player under
  Oware rules", "grants an extra turn under Ouril rules when the active
  player has no actions", "toggles under Ouril rules when the active
  player still has actions".

### FR-BOARD-8: One-shot and step-by-step move application

A full turn (pick-up, sow completely, harvest, advance) can be applied in
a single step, or sown one seed at a time for animation purposes; both
paths produce the same resulting state.

- Implementation: `doAction(board, bowl)` (one-shot) versus
  `pickUp`/`hasPickedUp`/`sowOnce`/`examineResult` (step-by-step) in
  `js/board.js`; `Board` adapter class exposes both.
- Verified by: `board.test.js` › "performs a full pick-up/sow/harvest/
  advance cycle", "never mutates the board passed in"; `Board adapter` ›
  "supports step-by-step pick up, sow and examine (animated sowing)",
  "supports one-shot doAction".

### FR-BOARD-9: Win/loss reward signal

Once a player's harvested score exceeds 24 seeds (a majority of the 48
seeds in play), the position is treated as decisively won for that
player. See [rules.md § Winning](rules.md#winning).

- Implementation: `getResult(board)` in `js/board.js` (consumed by the
  UCT engine, see FR-UCT-1).
- Verified by: `board.test.js` › "rewards the north player once south
  exceeds 24 points", "rewards the south player once north exceeds 24
  points", "returns a near-neutral result while the game is undecided".

### FR-BOARD-10: Board state is immutable / side-effect free

All pure board functions return a new state object and never mutate
their input; the `Board` adapter class is the only place that holds
mutable turn-to-turn state, and `copy()` detaches a snapshot from further
mutation.

- Implementation: `js/board.js` (spread/`slice()`/`map()`-based updates
  throughout; private `#state` field on `Board`).
- Verified by: `board.test.js` › "does not mutate the bowls array of the
  input board", "never mutates the board passed in"; `Board adapter` ›
  "copy() detaches the copy from further mutation of the original".

### NFR-BOARD-1: Grand Slam and forced-feed rules are not enforced by the engine

[rules.md § Special Rule: Grand Slam Is Forbidden](rules.md#special-rule-grand-slam-is-forbidden)
and
[§ You Must Leave Your Opponent Able to Play](rules.md#special-rule-you-must-leave-your-opponent-able-to-play)
describe additional restrictions on legal moves for physical play. The
current `getActions()`/`doAction()` implementation does **not** filter
out Grand Slam moves or enforce the forced-feed obligation; this is a
known, intentional gap between the documented physical rules and the
software engine, preserved as-is from the original implementation rather
than silently "fixed".

- Not covered by an automated test (there is no code path to test).
  Tracked here so the gap is explicit rather than silently assumed away.

## 3. `js/uct/uct.js` and `js/uct/uctnode.js` - AI Engine

### FR-UCT-1: Move selection via Monte-Carlo Tree Search

Given a board and a search budget, the engine returns a legal bowl to
play, chosen by running UCT/MCTS selection, expansion, simulation and
backpropagation until the iteration or time budget is exhausted, then
picking the most-visited root child.

- Implementation: `Uct.getActionInfo()`, `UctNode` in `js/uct/uct.js` and
  `js/uct/uctnode.js`. Algorithm details in
  [engine_mcts_ucb.md](engine_mcts_ucb.md).
- Verified by: `uct.test.js` › "runs Monte Carlo search and returns a
  legal action among several", "honors the iteration budget over the
  time budget when time is generous".

### FR-UCT-2: Immediate decisions with zero or one legal action

If no legal action exists, the engine reports `action: null` without
searching; if exactly one legal action exists, it is returned immediately
without searching.

- Implementation: early-return branches in `Uct.getActionInfo()`.
- Verified by: `uct.test.js` › "returns immediately when no action is
  available", "returns immediately when exactly one action is available".

### FR-UCT-3: Search tree bookkeeping

Each search node tracks its unexamined actions, child nodes, visit count
and accumulated reward for the player who was active at that node; a
child can be added from an unexamined action, selected by UCB score, and
updated with a simulation result.

- Implementation: `UctNode` class in `js/uct/uctnode.js`.
- Verified by: `uctnode.test.js` › "captures the unexamined actions and
  active player from the board", "addChild removes the action from
  unexamined and appends a child", "update accumulates visits and the
  active player reward", "selectChild picks the child with the highest
  UCT value", "mostVisitedChild returns the child visited most often".

### FR-UCT-4: Graceful handling of an empty child set

Selecting or picking a "most visited" child on a node with no children
yet returns `null` instead of throwing.

- Implementation: `UctNode.selectChild()`, `UctNode.mostVisitedChild()`.
- Verified by: `uctnode.test.js` › "selectChild returns null when there
  are no children", "mostVisitedChild returns null when there are no
  children".

### NFR-UCT-1: Fixed AI move budgets

The AI uses two fixed search budgets: a smaller one for the very first
AI move of a game (`AI_OPENING_BUDGET`), and a larger one for every
subsequent AI move (`AI_MOVE_BUDGET`). No per-side difficulty levels or
device-performance profile are exposed.

- Implementation: `AI_MOVE_BUDGET`, `AI_OPENING_BUDGET` constants in
  `js/controller.js`.
- Verified by: `controller.test.js` › "start immediately triggers the AI
  when south is configured as AI" (opening budget path), "requests an AI
  move and applies the returned action" (asserts the exact budget tuple
  passed to `getActionInfo`).

## 4. `js/controller.js` - Worker Orchestration

### FR-CTRL-1: Worker is the sole writer of board state

The controller owns a single `Board` instance for the lifetime of a game
and is the only component that mutates it; the main thread only ever
receives read-only board snapshots.

- Implementation: `Controller.board` in `js/controller.js`;
  `board.state` getter in `js/board.js` returns a plain, structured-clone
  friendly snapshot for `postMessage`.
- Verified by: `controller.test.js` (all test cases exercise `Controller`
  exclusively through its message-handling API, never by mutating
  `board` directly from the test).

### FR-CTRL-2: Start / restart a game

On `start` or `restart`, the controller resets the board to the standard
Oware initial position, applies the current settings, and either lets the
AI make the opening move (if south is AI) or signals that a human may
move.

- Implementation: `Controller.startGame()`.
- Verified by: `controller.test.js` › "start sets up the board and hands
  control to the human south player", "start immediately triggers the AI
  when south is configured as AI", "restart behaves like start".

### FR-CTRL-3: Validate and apply a requested move

A `move` request is only applied if the requested bowl is currently a
legal action for the active player; an illegal move is silently ignored
(the board is simply redrawn unchanged).

- Implementation: `Controller.move()`.
- Verified by: `controller.test.js` › "rejects illegal moves by simply
  redrawing the current board", "applies a legal move, animates sowing
  and hands off to the next player".

### FR-CTRL-4: Animated sowing

While seeds remain to be sown for the current turn, the controller sows
exactly one seed, notifies the main thread (`redraw_sowing`), and waits
`settings.sowingSpeed` milliseconds before sowing the next seed.

- Implementation: `Controller.distribute()`.
- Verified by: `controller.test.js` › "applies a legal move, animates
  sowing and hands off to the next player" (asserts 4 `redraw_sowing`
  messages for a 4-seed pick-up, using fake timers).

### FR-CTRL-5: Hand off to the correct next actor

After a turn completes, the controller tells the main thread whether the
next active player is human (`human_to_move`) or AI (`ai_to_move`), based
on the current per-side player-kind settings.

- Implementation: `Controller.distribute()` (tail branch).
- Verified by: `controller.test.js` › "applies a legal move, animates
  sowing and hands off to the next player", "hands off to the AI player
  when it becomes their turn".

### FR-CTRL-6: AI move request

On an `action_by_ai` request, the controller asks the UCT engine for a
move using the in-game AI budget and applies the returned action exactly
as if it were a validated human move.

- Implementation: `Controller.moveWithAi()`.
- Verified by: `controller.test.js` › "requests an AI move and applies
  the returned action".

### FR-CTRL-7: Settings are re-applied on every request

Every incoming request (`start`, `restart`, `move`, `action_by_ai`,
`sync`) carries the current player/rules/sowing-speed settings from the
options form, and the controller re-applies them (including the active
rule set) before acting.

- Implementation: `Controller.updateSettings()`, called from
  `processHmiRequest()`.
- Verified by: `controller.test.js` › "sync re-applies settings and
  redraws without changing the board" (and implicitly by every other
  test, which always supplies settings on each request).

### NFR-CTRL-1: Unknown requests/events are ignored, not thrown

Unrecognized event classes or request names are logged (only when
`verbose` is enabled) and otherwise ignored; they never throw.

- Implementation: `default` branches in `Controller.handleHmiEvent()` and
  `Controller.processHmiRequest()`.
- Verified by: `controller.test.js` › "ignores events that are not
  requests", "ignores unknown requests without throwing", "logs a
  message for unknown requests when verbose is enabled", "logs a message
  for unknown event classes when verbose is enabled".

## 5. `js/store.js` - Main-Thread State Container

### FR-STORE-1: Initial UI state

The application starts on the game view, with the side panel closed, no
board snapshot yet, `idle` phase, and default settings (both players
Human, Oware rules, slow sowing speed).

- Implementation: `createInitialState()` in `js/store.js`.
- Verified by: `store.test.js` › "starts on the game view with default
  settings".

### FR-STORE-2: Navigation and panel actions update view state only

`NAVIGATE` changes the active view and closes the side panel;
`SET_PANEL_OPEN` toggles the panel independently of the view;
`NEW_GAME` resets the turn phase to idle and closes the panel.

- Implementation: `reducer()` cases `NAVIGATE`, `SET_PANEL_OPEN`,
  `NEW_GAME` in `js/store.js`.
- Verified by: `store.test.js` › "handles NAVIGATE by changing the view
  and closing the panel", "handles SET_PANEL_OPEN", "handles NEW_GAME by
  resetting phase and closing the panel".

### FR-STORE-3: Engine events update the board snapshot and turn phase

`ENGINE_BOARD_UPDATE` replaces the board snapshot without changing phase;
`HUMAN_TURN_READY` and `AI_THINKING` both replace the board snapshot and
set the phase to `human_turn` or `ai_thinking` respectively.

- Implementation: `reducer()` cases `ENGINE_BOARD_UPDATE`,
  `HUMAN_TURN_READY`, `AI_THINKING` in `js/store.js`.
- Verified by: `store.test.js` › "handles ENGINE_BOARD_UPDATE by
  replacing the board snapshot", "handles HUMAN_TURN_READY by updating
  board and phase", "handles AI_THINKING by updating board and phase".

### FR-STORE-4: Settings can be partially merged

`SETTINGS_CHANGE` merges only the supplied settings fields into the
existing settings object, leaving the rest unchanged.

- Implementation: `reducer()` case `SETTINGS_CHANGE`.
- Verified by: `store.test.js` › "handles SETTINGS_CHANGE by merging
  settings".

### FR-STORE-5: Unknown actions are no-ops

Dispatching an action with an unrecognized `type` returns the exact same
state reference, unchanged.

- Implementation: `reducer()` `default` case.
- Verified by: `store.test.js` › "returns the same state for unknown
  actions".

### FR-STORE-6: Subscriptions receive every state update

`createStore()` exposes `getState`, `dispatch` and `subscribe`; every
dispatch notifies all current subscribers with the new state, and
unsubscribing stops further notifications.

- Implementation: `createStore()` in `js/store.js`.
- Verified by: `store.test.js` › "exposes getState reflecting the current
  state" (and the remaining `createStore` test cases covering
  subscribe/unsubscribe and multi-listener notification).

## 6. `js/renderer.js` - Board Rendering

### FR-RENDER-1: Render the 12-bowl board and both scores

The renderer builds one SVG board containing the board background image,
12 bowl images with north/south seed-count labels, and both players'
score displays.

- Implementation: `createRenderer()` in `js/renderer.js`.
- Verified by: `renderer.test.js` › "builds an SVG board with the board
  image, score display and 12 bowls".

### FR-RENDER-2: Bowl clicks report the bowl index

Clicking a bowl image invokes the `onBowlSelected` callback passed to
`createRenderer()` with that bowl's 0-based index.

- Implementation: click listener wiring in `createBowl()`.
- Verified by: `renderer.test.js` › "reports the clicked bowl index".

### FR-RENDER-3: Score display formatting

A player's score is rendered as its plain number, with a trailing "."
appended when the score is exactly 6 or 9 (to disambiguate these digits
when rendered upside-down for the rotated north-side score).

- Implementation: `formatScore()` in `js/renderer.js`.
- Verified by: `renderer.test.js` › "renders scores with a trailing dot
  for 6 and 9, plain otherwise".

### FR-RENDER-4: Bowl seed-count sprite and label

Each bowl shows a sprite selected by its seed count (clamped at 15 seeds
for the sprite), and a textual seed-count label only once a bowl holds 12
or more seeds.

- Implementation: `bonducSprite()`, `bowlLabel()` in `js/renderer.js`.
- Verified by: `renderer.test.js` › "shows bowl seed counts only from 12
  seeds upward and clamps sprite selection at 15".

### FR-RENDER-5: Re-creating the renderer replaces prior content

Calling `createRenderer()` again on the same container fully replaces any
previously rendered board, never leaving stale elements behind.

- Implementation: `container.replaceChildren(svg)` in `createRenderer()`.
- Verified by: `renderer.test.js` › "replaces any previous content in the
  container on repeated creation".

## 7. `js/hmi.js` - Main-Thread Composition

### FR-HMI-1: Application bootstrap requests a game start

On initialization, the application reads the current options form and
sends a `start` request to the worker with those settings.

- Implementation: `createApp().init()` in `js/hmi.js`.
- Verified by: `hmi.test.js` › "requests a game start with the default
  form settings".

### FR-HMI-2: Hamburger menu opens/closes the side panel

Clicking the menu button opens the side panel; clicking the backdrop or
the panel's close button closes it again.

- Implementation: `wireNavigation()` in `js/hmi.js`.
- Verified by: `hmi.test.js` › "opens the side panel from the menu button
  and closes it from the backdrop", "closes the panel from the close
  button"; `game.spec.js` › "hamburger menu opens the side panel and the
  backdrop closes it".

### FR-HMI-3: Navigating to a subpage hides the game board and vice versa

Activating a `[data-navigate]` link switches the visible view to the
matching subpage (rules/options/about), hiding the game board and every
other subpage, and closes the side panel; a `[data-navigate-back]`
control always returns to the game view.

- Implementation: `applyView()`, `wireNavigation()` in `js/hmi.js`.
- Verified by: `hmi.test.js` › "navigates to a subpage and hides the game
  board, closing the panel", "navigates back to the game board from a
  subpage"; `game.spec.js` › "navigates to the Rules subpage, hiding the
  game board, then back", "navigates to Options, switches rules to
  Ouril, and the header updates", "About subpage is reachable and shows
  legal information".

### FR-HMI-4: New Game requests a restart and closes the panel

Activating "New" dispatches a UI reset and sends a `restart` request to
the worker.

- Implementation: `newGame()` in `js/hmi.js`.
- Verified by: `hmi.test.js` › "sends a restart request and closes the
  panel when starting a new game"; `game.spec.js` › "new game restarts
  the board from the side panel".

### FR-HMI-5: Engine events drive board rendering and turn phase

`human_to_move` and `ai_to_move` engine events update the turn phase and
board snapshot in the store; `ai_to_move` additionally triggers an
`action_by_ai` request. `redraw`/`redraw_sowing` update only the board
snapshot. Every board update is forwarded to the renderer.

- Implementation: `handleEngineRequest()` in `js/hmi.js`.
- Verified by: `hmi.test.js` › "renders the board and enters human-turn
  phase on human_to_move", "requests an AI action when the engine
  reports ai_to_move", "re-renders the board on redraw and redraw_sowing
  without changing phase", "ignores unknown engine requests and
  non-request messages".

### FR-HMI-6: Bowl clicks are only forwarded during the human's turn

A bowl click is only turned into a `move` request while the store's phase
is `human_turn`; clicks at any other time (AI thinking, idle) are
ignored client-side.

- Implementation: `createRenderer(boardContainer, ...)` callback in
  `createApp()`.
- Verified by: `hmi.test.js` › "forwards a bowl click as a move request
  only during the human turn"; `game.spec.js` › "a human move sows seeds
  around the board and updates the display".

### FR-HMI-7: Header title reflects the selected rule set

The header title shows "Oware" or "Ouril" depending on the corresponding
options-form radio button, updated immediately on change.

- Implementation: `applyHeaderTitle()`, `wireOptions()` in `js/hmi.js`.
- Verified by: `hmi.test.js` › "updates the header title when switching
  between Oware and Ouril"; `game.spec.js` › "navigates to Options,
  switches rules to Ouril, and the header updates".

### FR-HMI-8: Active-player badge in the title bar

The title bar shows a badge with the currently active player's
configured kind and side: a Human (🧑) or AI (🤖) icon, followed by ▼ if
south is active or ▲ if north is active (for example 🧑▼ for an active
human south player, 🤖▲ for an active AI north player). The badge is
recomputed from the latest board snapshot and the current options-form
settings on every store update, so it is updated after each valid,
completed move (and while the AI is thinking about its move); it stays
hidden until the first board snapshot arrives.

- Implementation: `applyPlayerBadge()` in `js/hmi.js`, called from
  `render()`; `#player-badge`/`#player-badge-symbol` markup in
  `index.html`; badge styling (dark background, rounded corners,
  light-orange border, rotating spinner) in `css/index.css`.
- Verified by: `hmi.test.js` › "hides the player badge until a board
  snapshot is known", "shows a human/south badge for the active human
  south player", "shows an AI/north badge when the active AI north
  player is thinking", "tolerates a missing player badge markup without
  throwing"; `game.spec.js` › "loads the game board with the default
  Oware header" (asserts the default 🧑▼ badge).

## 8. `index.html` / `css/index.css` - Application Shell

### FR-UI-1: Exactly one of the game board or a subpage is visible

The game view and the rules/options/about subpages are mutually
exclusive: showing any one of them fully hides the other three.

- Implementation: `[data-view]` elements toggled via the `hidden`
  attribute in `applyView()` (`js/hmi.js`); `.page[hidden] { display:
  none; }` in `css/index.css`.
- Verified by: `game.spec.js` › "loads the game board with the default
  Oware header", "navigates to the Rules subpage, hiding the game board,
  then back".

### FR-UI-2: Options expose per-side player kind, sowing speed and rules

The options subpage exposes independent Human/AI radio choices for each
side, a sowing-speed checkbox, and an Oware/Ouril rules radio choice.

- Implementation: `#firstplayerhuman`/`#firstplayerai`,
  `#secondplayerhuman`/`#secondplayerai`, `#sowingspeed`,
  `#rulesoware`/`#rulesouril` in `index.html`, read by
  `readSettingsFromForm()` in `js/hmi.js`.
- Verified by: `hmi.test.js` › "requests a game start with the default
  form settings" (reads all four settings); `game.spec.js` › "navigates
  to Options, switches rules to Ouril, and the header updates".

### NFR-UI-1: Interactive controls are accessible

Icon-only controls (menu button, panel close, subpage close buttons) and
bowl images expose an accessible name (`aria-label`) and, for bowls, a
`role="button"`; purely script-driven actions use native `<button>`
elements rather than anchors with placeholder `href="#"` targets. The
active-player badge (FR-HMI-8) is a `role="status"` live region with an
`aria-label` describing its current side and player kind in words (e.g.
"South player: Human"), rather than relying on the emoji/arrow symbols
alone.

- Implementation: `index.html` markup; `createBowl()` in
  `js/renderer.js`.
- Verified by: `game.spec.js` › "accessibility smoke check: interactive
  controls expose labels/roles".

### NFR-UI-2: No third-party UI/runtime libraries

The application ships no jQuery, jQuery Mobile or Raphaël (or any other
third-party runtime dependency); navigation, the side panel and
collapsible sections are implemented with vanilla DOM APIs and native
`<details>`/`<summary>` elements.

- Implementation: absence of a `thirdparty/` folder; `js/hmi.js`,
  `js/renderer.js`, `index.html`.
- Not covered by an automated test; verified by repository inspection
  (no `thirdparty/` directory, no such `<script>`/`<link>` tags in
  `index.html`).

## 9. Cross-Cutting Non-Functional Requirements

### NFR-THREAD-1: Worker-owned authoritative state / single-writer threading model

Game rules, turn progression and AI computation run exclusively in a Web
Worker (`js/controller.js`); the main thread only renders snapshots and
handles UI/navigation, and never mutates board state directly.

- Implementation: `new Worker(new URL('./controller.js', import.meta.url),
  { type: 'module' })` in `js/hmi.js`; worker bootstrap guard in
  `js/controller.js`.
- Verified indirectly by every `controller.test.js` and `hmi.test.js`
  case, which exercise the two sides only through `postMessage`-shaped
  events, never through direct board mutation from the "other side".

### NFR-TEST-1: Automated unit test coverage

Statement, branch, function and line coverage of `html5/src/js/**/*.js`
must each be at least 96%, enforced by the Vitest coverage configuration.

- Implementation: `coverage.thresholds` in `html5/vitest.config.js`.
- Verified by: running `npm run test:coverage` in `html5/` (currently
  100% statements, 97.3% branches, 97.7% functions, 100% lines across
  all modules; `npm run test:coverage` fails the build if any threshold
  regresses below 96%).

### NFR-TEST-2: End-to-end regression coverage

Core user-facing flows (board load, hamburger menu, subpage navigation,
options, a human move animating seeds across the board, new game,
accessibility smoke check) are covered by browser-driven end-to-end
tests.

- Implementation: `html5/playwright.config.js`,
  `html5/src/tests/e2e/game.spec.js`.
- Verified by: running `npm run e2e` in `html5/` (8 Playwright test
  cases, listed under each relevant FR above).

### NFR-LINT-1: Linted and formatted source

All authored JavaScript, JSON and HTML under `html5/src/` (excluding
generated/third-party assets) is formatted and linted with Biome, with no
suppressed warnings.

- Implementation: `html5/biome.json`.
- Verified by: running `npm run check` in `html5/` (currently 0 issues
  across all included files).

### NFR-LINT-2: Linted documentation

All Markdown documentation in the repository is linted with markdownlint.

- Implementation: `.markdownlint.json`, `.markdownlint-cli2.jsonc` at the
  repository root.
- Verified by: running `npm run lint:md` at the repository root
  (currently 0 issues across all Markdown files).
