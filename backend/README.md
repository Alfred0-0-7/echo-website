# ECHO — The Signal Guardian · Backend

FastAPI backend for the ECHO superhero help portal. It powers the ECHO chatbot
(Google Gemini), saves grievances to Supabase, and emails a notification to you
via Brevo.

> "I hear what others ignore."

## Stack

- Python 3.12+ · FastAPI · Pydantic v2
- Supabase (PostgreSQL)
- Google Gemini (`google-genai` SDK, model `gemini-2.5-flash`)
- Brevo transactional email (REST API via httpx)
- Uvicorn · python-dotenv · CORS

## Project structure

```
backend/
├── app/
│   ├── main.py            # FastAPI app, CORS, error handlers
│   ├── config.py          # env-driven settings
│   ├── routes/            # health, chat, grievance
│   ├── services/          # ai_service, email_service, grievance_service
│   ├── schemas/           # Pydantic models
│   ├── database/          # Supabase client
│   └── utils/             # validation helpers
├── requirements.txt
├── .env.example
├── .gitignore
├── schema.sql
├── render.yaml
└── README.md
```

## API

| Method | Path            | Purpose                                   |
| ------ | --------------- | ----------------------------------------- |
| GET    | `/api/health`   | Health check                              |
| POST   | `/api/chat`     | ECHO chatbot reply + category suggestion  |
| POST   | `/api/grievance`| Validate → save → email → return result   |

There is intentionally **no** endpoint to list or read grievances.

## Local setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

```bash
# macOS / Linux
source venv/bin/activate
# Windows
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your env file from the template and fill in the values:

```bash
cp .env.example .env
```

Run the server:

```bash
uvicorn app.main:app --reload
```

Interactive API docs: http://localhost:8000/docs

## Getting the credentials

Fill each value in `.env`. **Never commit `.env`.**

### 1. Google Gemini API key
1. Go to https://aistudio.google.com/app/apikey
2. Create an API key (free tier is fine).
3. Set `GEMINI_API_KEY`. Keep `GEMINI_MODEL=gemini-2.5-flash` (or another
   available free-tier model).

### 2. Supabase project + table
1. Create a project at https://supabase.com.
2. Open **SQL Editor** and run the contents of `schema.sql`.
3. In **Project Settings → API**, copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** → `SUPABASE_KEY` (server-side only; never expose it to
     the frontend).

### 3. Brevo email
1. Create a free account at https://www.brevo.com.
2. **Senders, Domains & Dedicated IPs → Senders**: add and verify a sender
   address. Use it as `EMAIL_FROM`.
3. **SMTP & API → API Keys**: create a key → `BREVO_API_KEY`.
4. Set `CANDIDATE_EMAIL` to your personal inbox that should receive alerts.

### 4. Frontend URL (CORS)
- Local: `FRONTEND_URL=http://localhost:3000`
- Production: set it to your deployed Vercel URL, e.g.
  `https://your-app.vercel.app` (no trailing slash).

If a credential is missing the backend fails safely: chat returns an
`AI_SERVICE_ERROR`, saving returns a `DATABASE_ERROR`, and email returns
`email_sent: false`. It never fakes success.

## Connecting the frontend

The Next.js frontend reads the backend URL from `NEXT_PUBLIC_API_URL`
(see the root `.env.example`). Set:

- Local: `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Production: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

The frontend calls `POST /api/chat` and `POST /api/grievance`.

## Testing

Health:

```bash
curl http://localhost:8000/api/health
# {"status":"ok","service":"ECHO — The Signal Guardian"}
```

Chat:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "There is a garbage collection problem in my area.",
    "conversation": [],
    "visitor": {"name":"Alfred","age":20,"location":"Thrissur","email":"alfred@example.com"},
    "stage": "grievance"
  }'
```

Empty chat message (expect `VALIDATION_ERROR`):

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"   ","conversation":[]}'
```

Grievance (saves + emails):

```bash
curl -X POST http://localhost:8000/api/grievance \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Alfred","age":20,"location":"Thrissur",
    "email":"alfred@example.com",
    "grievance":"There is a garbage collection problem in my area.",
    "category":"COMMUNITY","priority":"NORMAL"
  }'
```

Invalid email / invalid age / empty grievance all return:

```json
{ "success": false, "error": "...", "code": "VALIDATION_ERROR" }
```

Failure modes to verify:
- **Gemini down / bad key** → `/api/chat` returns `AI_SERVICE_ERROR` (503) or
  `AI_RATE_LIMIT_ERROR` (429).
- **Supabase down / bad key** → `/api/grievance` returns `DATABASE_ERROR` (502),
  no success.
- **Brevo down / bad key** → grievance still saves; response has
  `email_sent: false`.
- **CORS** → requests from an origin other than `FRONTEND_URL` are rejected by
  the browser.

## Deploy to Render (free)

1. Push this repo to GitHub.
2. On https://render.com create a **New → Web Service** from the repo.
   - Root Directory: `backend`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Instance Type: Free
   (Or let Render read the included `render.yaml` as a Blueprint.)
3. Add all environment variables from `.env.example` under **Environment**.
   Set `ENVIRONMENT=production` and `FRONTEND_URL` to your Vercel URL.
4. Deploy. Your API is at `https://your-backend.onrender.com`.
5. Update the frontend's `NEXT_PUBLIC_API_URL` to that URL and redeploy it.

Notes:
- The app binds to Render's `$PORT` automatically.
- No localhost URLs are used in production.
- CORS is restricted to `FRONTEND_URL` — never wide open.

## Error codes

`VALIDATION_ERROR` · `AI_SERVICE_ERROR` · `AI_RATE_LIMIT_ERROR` ·
`DATABASE_ERROR` · `EMAIL_ERROR` · `INTERNAL_SERVER_ERROR`

Raw Python exceptions and stack traces are never returned to clients.
