# GitHub Copilot instructions for LEXPAL

Purpose: give AI coding agents the minimal, actionable context to be productive when editing or extending this repository.

## Big picture (quick)
- Monorepo with two main parts:
  - `front-end/` — Next.js (App Router) React app (TypeScript + CSS Modules + Tailwind). Dev server: `npm run dev` (port 3000).
    - Key files: `front-end/app/*`, `front-end/package.json`, `front-end/.env` (uses `NEXT_PUBLIC_DEV_SERVER_URL`).
  - `server/` — Express (ES modules) API + WebSocket server and AI services. Launch with `npm run dev` from `server/` (nodemon). Default port 5001.
    - Key files: `server/server.js`, `server/app.js`, `server/src/routes/*`, `server/src/ws/*`, `server/src/services/ai/*`, `server/src/infra/*`.

## Run & debug workflows (exact)
- Start backend: cd `server/` && `npm install` && `npm run dev` (uses `nodemon server.js`). Backend must run before the front-end to ensure WebSocket endpoints and API are available.
- Start frontend: cd `front-end/` && `npm install` && `npm run dev`.
- Environment files:
  - Backend relies on: `OPENAI_API_KEY`, `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*` (see `server/src/infra/*`).
  - Frontend uses `NEXT_PUBLIC_DEV_SERVER_URL` to point at backend (e.g. `http://localhost:5001/`).
- Useful log points: server console prints DB connection (`✅ 🔗 connected to mongodb`), server start, WebSocket upgrades, and explicit logs in `server/src/ws/*` and `server/src/ws/ai-chat/handlers/message.handler.js`.

## Authentication & sessions
- Authentication uses JWT stored in an HTTP cookie named `jwt`.
  - Server-side route protection: `server/src/middlewares/auth.middleware.js` reads `req.cookies.jwt` and sets `req.client_data` after verification.
  - WebSocket auth: cookie is parsed in `server/src/utils/wsAuth.util.js`; decoded JWT becomes `socket.client_data`.
- Frontend fetch calls must include cookies: look for `fetch(..., { credentials: "include" })` in `front-end/app/*`.

## WebSocket patterns (AI & user chat)
- WS server is mounted on the same HTTP server (see `server/src/ws/initiator.js`).
- Endpoints:
  - `/ws/ai-chat` — AI conversation gateway (see `server/src/ws/ai-chat/chat.gateway.js`).
  - `/ws/user-chat` — user chat gateway (`server/src/ws/user-chat/*`).
- Message contract:
  - Client -> server: JSON payload with `{ content: "..." }` (see `front-end/app/Lex-AI/[convoId]/page.tsx` and `server/src/ws/ai-chat/handlers/message.handler.js`).
  - Server -> client: events like `{ type: "ai_message", content: "..." }` and `{ type: "convo_title_updated", title }`.
- WebSocket notes: connections require authentication cookie; on server the websocket handler attaches `socket.convo_id`, `socket.msg_count`, `socket.convo_title` for context.

## AI & vector pipeline specifics
- The AI pipeline is modular under `server/src/services/ai/`:
  - `chatRouting.service.js` decides route (EXACT_LAW_QUERY vs CHAT)
  - `metadataExtractor.service.js` pulls law-specific metadata
  - `dataQueryDecision.service.js` determines if legal data should be used
  - `responseComposer.service.js` prepares prompts and selects LLM calls
  - `titleGenerator.service.js` creates conversation titles
- Vector DB: Chroma use is implemented in `server/src/infra/vector/chroma.client.js` and `server/src/infra/vector/chroma.query.js`.
  - Embeddings use OpenAI (`server/src/infra/llm/openai.client.js`) — `OPENAI_API_KEY` required.
  - NOTE: the repo currently contains an in-file Chroma `apiKey` (hard-coded). Treat this as sensitive/hardcoded and prefer using environment management when modifying code.

## Data persistence & APIs
- Conversations and messages are persisted via Mongoose models under `server/src/models/` (e.g., `AIConversation.model.js`, `AImessage.model.js`).
- Key HTTP endpoints:
  - `POST /api/auth/*` — signup/login for users and lawyers (`server/src/routes/auth.route.js`).
  - `GET /api/AI/convo-history/:id` — paginated conversation history (used by front-end). Supports `?cursor=` for pagination.
  - `POST /api/upload` — file/image upload uses `multer` + Cloudinary (`server/src/routes/upload.route.js`, `server/src/infra/cloudinary.js`).

## Conventions & patterns to follow when editing
- Use ES modules (import/export) in `server/` (the repo sets `"type": "module"`).
- Cookie-based auth: set `jwt` cookie on login flows; `protectRoute` relies on cookies rather than Authorization headers.
- Frontend communicates with backend using absolute URLs formed from `NEXT_PUBLIC_DEV_SERVER_URL` and includes credentials.
- WebSocket payloads are JSON strings (ws sends/receives raw stringified JSON). Use `JSON.parse` / `JSON.stringify` accordingly.
- Use existing service decomposition for AI logic (keep routing, metadata extraction, and response composition separated).

## Files to read for examples (quick links)
- WebSocket & message flow: `server/src/ws/ai-chat/chat.gateway.js`, `server/src/ws/ai-chat/handlers/message.handler.js`.
- AI orchestration: `server/src/services/ai/ai.service.js` and all files in `server/src/services/ai/`.
- Auth & cookies: `server/src/middlewares/auth.middleware.js`, `server/src/utils/wsAuth.util.js`, `server/src/routes/auth.route.js`.
- Frontend WS & history usage: `front-end/app/Lex-AI/[convoId]/page.tsx`.
- Chroma & embeddings: `server/src/infra/vector/chroma.client.js` and `server/src/infra/llm/openai.client.js`.

## Security & maintenance notes for agents
- Do NOT accidentally commit secrets (API keys or DB URIs). The repo already contains a Chroma key in source — flag these instances and suggest moving them to env vars.
- Tests are not present; keep changes small and manually verify by running the dev servers and reproducing flows (login → open `/lex-ai` → start a conversation → confirm bot messages and DB persistence).

## Typical quick tasks an agent might be asked to do
- Add a new WS message type: follow pattern in `message.handler.js` and add client-side handling in `front-end/app/Lex-AI/[convoId]/page.tsx`.
- Add telemetry/logging: place small logs in `server/src/ws/*` and `server/src/services/ai/*` to trace events.
- Fix missing env handling: replace hard-coded keys in `server/src/infra/vector/chroma.client.js` with env var lookups and add a note in `.env.example`.

---
If any of the above sections are unclear or you'd like me to expand examples (e.g., sample WebSocket session messages or detailed env variable doc), tell me which area to expand and I will iterate. ✅