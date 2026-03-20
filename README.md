# KSENSE

Next.js + TypeScript project for:

- Fetching patient data from the assessment backend
- Computing risk alerts
- Submitting assessment results

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```env
ASSESSMENT_API_KEY=your_api_key_here
```

3. Run locally:

```bash
npm run dev
```

## API Routes

- `GET /api/patients?page=1&limit=5`
- `POST /api/assessment`
