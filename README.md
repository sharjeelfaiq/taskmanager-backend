# Task Manager — Backend

Node.js + Express REST API with MongoDB for the Task Manager application.

---

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 4
- **Database:** MongoDB via Mongoose
- **Validation:** Joi + envalid
- **Logging:** Winston
- **Dev tools:** Nodemon, ESLint, Prettier

---

## Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

The server starts at `http://localhost:5000`.

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Port to listen on | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/taskmanager` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |
| `BACKEND_URL` | Backend base URL (for logs) | `http://localhost:5000` |

---

## API Routes

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks (newest first) |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

**POST / PUT body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

### GitHub

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/github/:username` | Fetch a GitHub user's public profile |

**Response:**
```json
{
  "success": true,
  "data": {
    "login": "torvalds",
    "name": "Linus Torvalds",
    "avatarUrl": "https://avatars.githubusercontent.com/...",
    "profileUrl": "https://github.com/torvalds",
    "publicRepos": 8,
    "followers": 230000,
    "following": 0
  }
}
```

---

## Task Schema

```js
{
  title:       String   // required
  description: String   // optional
  completed:   Boolean  // default: false
  createdAt:   Date     // auto
  updatedAt:   Date     // auto
}
```

---

## GitHub API Integration

The `/api/github/:username` endpoint proxies requests to `https://api.github.com/users/:username`. By routing through the backend:

- CORS is not an issue (browser-to-backend, then backend-to-GitHub)
- GitHub tokens or rate-limit headers can be added server-side without exposing secrets to the client
- Error codes (404 user not found, 502 GitHub unavailable) are normalized before the client sees them

---

## Code Review & Architecture

### 1. Securing a Web Application

Input validation is the first line of defense — every endpoint validates the request body with Joi schemas before touching the database. On the auth layer, use JWTs with short expiry and refresh token rotation rather than long-lived sessions. All secrets (DB credentials, API keys) live in environment variables, never in code.

CORS is locked to the known frontend origin. Helmet sets secure HTTP headers (HSTS, X-Frame-Options, Content-Security-Policy). Express-rate-limit prevents brute-force attacks on sensitive endpoints. Dependencies are kept current with `npm audit` and automated tools like Dependabot.

In production, TLS terminates at the load balancer or reverse proxy (nginx/Caddy). Logging with Winston captures errors without leaking sensitive data in responses. Monitoring (Datadog, Sentry) catches anomalies in real time.

### 2. How Would You Improve a Slow React Application?

Start with profiling: React DevTools Profiler identifies which components re-render unnecessarily. Then apply targeted fixes. `React.memo` prevents re-renders when props haven't changed; `useMemo` and `useCallback` stabilize expensive values and event handlers passed as props.

Code splitting with `dynamic(() => import('./HeavyComponent'))` reduces the initial bundle. Images use `next/image` with lazy loading and correct `sizes`. API responses are cached — either with React Query's stale-while-revalidate strategy or Next.js `fetch` cache tags.

Pagination or virtual scrolling replaces rendering 1,000 items in a single list. Bundle analysis (`next build --analyze`) reveals oversized third-party imports that can be replaced with lighter alternatives. Finally, move to Server Components for data-fetching-heavy views to eliminate client-side waterfalls entirely.

### 3. SQL vs NoSQL — When to Use Each

**SQL (PostgreSQL, MySQL):** Best when data has clear relationships (users → orders → products), integrity is critical (financial transactions, inventory), and complex queries with JOINs are needed. ACID transactions ensure data consistency across multiple tables. Schema enforcement catches data quality problems early. Use SQL when correctness and consistency matter more than flexibility.

**NoSQL (MongoDB, DynamoDB):** Best when the data shape varies per record (e-commerce product catalog, CMS content), write throughput must scale horizontally, or you're storing documents that are always read together. MongoDB's document model maps naturally to JSON APIs — no ORM impedance mismatch. Use NoSQL when flexibility, horizontal scale, or developer speed are the primary drivers.

This app uses MongoDB because tasks are self-contained documents with no relational joins required, and the flexible schema lets us add fields later without migrations.

### 4. Deploying a Full-Stack App to AWS

**Frontend (Next.js):** Deploy to Vercel (preferred) or AWS Amplify. Both handle SSR, ISR, and edge functions automatically. Set `NEXT_PUBLIC_API_URL` as an environment variable in the deployment dashboard.

**Backend (Express):** Containerize with Docker, push to Amazon ECR, and run on ECS Fargate (serverless containers) or a small EC2 instance. Use an Application Load Balancer to terminate TLS and forward to the container. Store secrets in AWS Secrets Manager or SSM Parameter Store — never in the container image.

**Database:** MongoDB Atlas on AWS. Free tier covers dev; M10+ for production. Atlas handles replication, backups, and point-in-time recovery. Whitelist only the backend's security group.

**CI/CD:** GitHub Actions pipeline — on push to `main`, run lint + tests, build the Docker image, push to ECR, and trigger an ECS rolling deployment. Frontend deploys automatically via Vercel's GitHub integration.

**Monitoring:** CloudWatch for backend logs and metrics. Sentry for error tracking on both frontend and backend. Set alarms on p95 latency and error rate.
