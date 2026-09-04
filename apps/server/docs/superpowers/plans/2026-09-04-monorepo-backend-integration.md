# Monorepo Backend Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the NestJS backend as `apps/server` in `p-v-dev/PIM-IV` without committing secrets or generated files.

**Architecture:** The existing NestJS application becomes the monorepo server application unchanged. A root README documents the three apps and the server's local commands; its environment is supplied exclusively through an untracked `.env` derived from `.env.example`.

**Tech Stack:** GitHub, Git, Node.js 22, npm, NestJS 12, TypeScript, SQL Server, Docker Compose.

## Global Constraints

- Target repository: `https://github.com/p-v-dev/PIM-IV.git`.
- Target directory: `apps/server`.
- Do not copy or commit `node_modules`, `dist`, `.env`, `*.tsbuildinfo`, or the backend's nested `.git` directory.
- `.env.example` must contain `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `NODE_ENV`, `JWT_SECRET`, `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`, with no secret values.
- Do not convert the backend to C#, configure CI/CD or deployment, or change web/mobile apps.
- Do not overwrite `apps/server` if it contains tracked files at execution time.

---

## File Structure

- Create: `<monorepo>/apps/server/` - NestJS application copied from the current `backend/` directory.
- Create: `<monorepo>/apps/server/.env.example` - safe local environment template.
- Modify: `<monorepo>/README.md` - correct the backend stack and document server commands.

### Task 1: Create the Server Application in the Monorepo

**Files:**
- Create: `<monorepo>/apps/server/**`
- Exclude: `<monorepo>/apps/server/node_modules/**`, `<monorepo>/apps/server/dist/**`, `<monorepo>/apps/server/.env`, `<monorepo>/apps/server/*.tsbuildinfo`, `<monorepo>/apps/server/.git/**`

**Interfaces:**
- Consumes: the current local backend directory and the empty `apps/server` directory on `main`.
- Produces: a tracked NestJS application runnable from `<monorepo>/apps/server`.

- [ ] **Step 1: Clone the monorepo and create an integration branch**

Run:
```bash
git clone https://github.com/p-v-dev/PIM-IV.git /home/pedrobrito/projects/PIM-IV
git -C /home/pedrobrito/projects/PIM-IV switch -c chore/add-nest-backend
```

Expected: `/home/pedrobrito/projects/PIM-IV` is a clean clone and the current branch is `chore/add-nest-backend`.

- [ ] **Step 2: Verify the destination is still empty**

Run:
```bash
git -C /home/pedrobrito/projects/PIM-IV ls-files apps/server
```

Expected: no output. Stop if files are listed; do not overwrite another contributor's server implementation.

- [ ] **Step 3: Copy only versionable backend files**

Run:
```bash
rsync -a --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='.env' --exclude='*.tsbuildinfo' /home/pedrobrito/projects/pim-backend/backend/ /home/pedrobrito/projects/PIM-IV/apps/server/
```

Expected: source files, tests, `package.json`, `package-lock.json`, Docker files and project configuration appear in `apps/server`; excluded paths do not.

- [ ] **Step 4: Verify the staged server content has no excluded paths**

Run:
```bash
git -C /home/pedrobrito/projects/PIM-IV status --short
git -C /home/pedrobrito/projects/PIM-IV check-ignore -v apps/server/.env apps/server/node_modules apps/server/dist
```

Expected: `apps/server` files are untracked additions, and `check-ignore` reports the copied server `.gitignore` rules for the three ignored paths.

- [ ] **Step 5: Commit the server application**

Run:
```bash
git -C /home/pedrobrito/projects/PIM-IV add apps/server
git -C /home/pedrobrito/projects/PIM-IV diff --cached --check
git -C /home/pedrobrito/projects/PIM-IV commit -m "feat: add NestJS backend"
```

Expected: one commit contains the NestJS application and excludes local environment and generated files.

### Task 2: Document Runtime Configuration and the Monorepo Layout

**Files:**
- Create: `<monorepo>/apps/server/.env.example`
- Modify: `<monorepo>/README.md`

**Interfaces:**
- Consumes: `apps/server/src/main.ts`, `apps/server/src/app.module.ts`, `apps/server/src/auth/auth.module.ts`, and `apps/server/docker-compose.yml`.
- Produces: a secret-free configuration template and accurate root-level setup instructions.

- [ ] **Step 1: Create the server environment template**

Create `apps/server/.env.example` with exactly this content:
```dotenv
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASS=replace-with-a-local-sql-server-password
DB_NAME=eduquest-db
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_NAME=Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-an-initial-admin-password
```

Expected: the template contains every variable read by the application or its local Compose setup and contains no real credential.

- [ ] **Step 2: Replace the backend stack entry and add server setup commands to the root README**

Replace `- C# -> backend` with `- NestJS/TypeScript -> backend` in the `## Stack` section. Append this section:
```markdown
## Backend

O backend está em `apps/server`.

```bash
cd apps/server
cp .env.example .env
npm ci
npm run start:dev
```

A API estará disponível em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/api`.
```

Expected: the root README identifies the actual backend stack and gives a developer enough information to run it locally.

- [ ] **Step 3: Verify that no secret was staged**

Run:
```bash
git -C /home/pedrobrito/projects/PIM-IV status --short
git -C /home/pedrobrito/projects/PIM-IV diff --no-index /dev/null /home/pedrobrito/projects/PIM-IV/apps/server/.env.example
```

Expected: `.env.example` is listed; `.env` is not. The displayed template uses only the placeholder values above.

- [ ] **Step 4: Commit the environment template and README update**

Run:
```bash
git -C /home/pedrobrito/projects/PIM-IV add apps/server/.env.example README.md
git -C /home/pedrobrito/projects/PIM-IV diff --cached --check
git -C /home/pedrobrito/projects/PIM-IV commit -m "docs: document backend setup"
```

Expected: one commit contains only `.env.example` and the root README update.

### Task 3: Validate and Publish the Integration

**Files:**
- Modify: tracked files under `<monorepo>/apps/server/**` and `<monorepo>/README.md`

**Interfaces:**
- Consumes: the copied NestJS app and `.env.example` from Tasks 1 and 2.
- Produces: a validated commit and pull request for the monorepo maintainers.

- [ ] **Step 1: Prepare local environment values without staging them**

Run:
```bash
cp /home/pedrobrito/projects/PIM-IV/apps/server/.env.example /home/pedrobrito/projects/PIM-IV/apps/server/.env
```

Replace the three placeholder secret values in `/home/pedrobrito/projects/PIM-IV/apps/server/.env` with valid local values before running the app. Do not add this file to Git.

- [ ] **Step 2: Install deterministic dependencies**

Run:
```bash
npm ci
```

Working directory: `/home/pedrobrito/projects/PIM-IV/apps/server`

Expected: dependencies install from `package-lock.json` without modifying it.

- [ ] **Step 3: Run static analysis and automated tests**

Run:
```bash
npm run lint
npm test
```

Working directory: `/home/pedrobrito/projects/PIM-IV/apps/server`

Expected: both commands exit with status 0.

- [ ] **Step 4: Build the production server**

Run:
```bash
npm run build
```

Working directory: `/home/pedrobrito/projects/PIM-IV/apps/server`

Expected: exits with status 0 and creates ignored output in `apps/server/dist`.

- [ ] **Step 5: Review commit candidates and ignored paths**

Run:
```bash
git -C /home/pedrobrito/projects/PIM-IV status --short
git -C /home/pedrobrito/projects/PIM-IV check-ignore -v apps/server/.env apps/server/node_modules apps/server/dist
```

Expected: only application source/configuration, `.env.example`, and `README.md` are candidates for commit; local environment and generated paths remain ignored.

- [ ] **Step 6: Push the branch and open the pull request**

Run:
```bash
git -C /home/pedrobrito/projects/PIM-IV push -u origin chore/add-nest-backend
gh pr create --repo p-v-dev/PIM-IV --base main --head chore/add-nest-backend --title "feat: add NestJS backend" --body "Adds the NestJS API under apps/server, documents local setup, and provides a secret-free environment template."
```

Expected: a pull request against `main` is created. Do not run this step if any prior validation failed.
