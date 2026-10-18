# KSENSE

KSENSE is a Next.js application built with TypeScript for patient assessment workflows. It integrates with an assessment backend to retrieve patient data, calculate risk alerts, and submit assessment results.

## Features

- **Patient Data Retrieval** — Fetch patient records from the assessment backend with pagination.
- **Risk Assessment** — Compute risk alerts based on assessment data.
- **Assessment Submission** — Submit assessment results through an API endpoint.
- **API Routes** — Use Next.js API routes to handle patient retrieval and assessment submissions.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- REST API integration

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js (a version compatible with the project's dependencies)
- npm
- An API key for the assessment backend

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ksense
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
ASSESSMENT_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual assessment backend API key.

**Security note:** Keep `.env.local` private. Do not commit API keys or other secrets to version control. Ensure `.env.local` is included in `.gitignore`.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

### 1. Retrieve Patients

**Endpoint:** `GET /api/patients`

Fetch patient data from the assessment backend with pagination support.

**Query Parameters**

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `page`    | `number` | Page number to retrieve     |
| `limit`   | `number` | Number of patients per page |

**Example Request**

```http
GET /api/patients?page=1&limit=5
```

### 2. Submit an Assessment

**Endpoint:** `POST /api/assessment`

Submit assessment results for processing by the application backend.

**Example Request**

```http
POST /api/assessment
Content-Type: application/json
```

The request body should follow the assessment payload schema expected by the API.

## Available Scripts

Run the following commands as defined in `package.json`:

```bash
npm run dev      # Start the development server
npm run build    # Build the application for production
npm run start    # Start the production server
npm run lint     # Run linting, if configured
```

## Project Structure

A typical Next.js project structure may look like this:

```text
ksense/
├── app/                 # Application pages and API routes
│   └── api/
│       ├── patients/    # Patient retrieval endpoint
│       └── assessment/  # Assessment submission endpoint
├── public/              # Static assets
├── .env.local           # Local environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

The actual structure may differ depending on the project's Next.js routing convention and implementation.

## Development Notes

- Keep API credentials in environment variables.
- Validate request parameters and assessment payloads.
- Handle API errors and unexpected responses gracefully.
- Avoid exposing sensitive patient information in logs or client-side responses.
- Add tests for patient retrieval, risk calculations, and assessment submission.

## License

Specify the project's license here if applicable.
