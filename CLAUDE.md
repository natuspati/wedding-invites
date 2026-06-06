# Wedding Invites - Claude Guide

Small wedding invitation app: React frontend (root) + FastAPI backend (`api/`), deployed to AWS Lightsail via nginx.

---

## Repo Structure

```
src/          # React frontend (pages/, components/, hooks/, utils/, assets/)
api/src/      # FastAPI backend (routes/, models/, schemas/, services/, repos/, migrations/)
plans/        # Feature plans
```

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + TypeScript, Vite, CSS Modules |
| Backend | FastAPI, uv, SQLite (SQLAlchemy), Ruff |
| Infra | AWS Lightsail, nginx, GitHub Actions |

---

## Branching

- Work on **`dev`** branch - merging `dev` → `main` triggers CI/CD
- Never push directly to `main`

---

## Planning

**Before implementing any feature:**
1. Write a plan as a Markdown file in `plans/` (e.g. `plans/feature-name.md`)
2. The plan should cover: what changes, which files, approach
3. **Ask for confirmation before writing any code**

---

## TypeScript

Always use modern, strict TypeScript - no `any`, use explicit types, interfaces, `satisfies`, `const` assertions.

---

## Code Quality (run after every feature)

```bash
# Python
cd api && uv run ruff check --fix .

# Frontend
npm run lint && npm run format
```

---

## No Tests

Do not create or run tests.
