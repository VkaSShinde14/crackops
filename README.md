# CrackOps

Learn. Practice. Crack.

Mobile-first DevOps interview operating system for Azure DevOps, Cloud DevOps, Platform Engineering, SRE, and DevOps Architect preparation. It is a local-first React + TypeScript PWA with a dashboard, interview profile setup, learning topics, practice Q&A, revision queue, mock interviewer, tool encyclopedia, incident playbooks, cost optimization, company packs, project stories, and a knowledge graph.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

The production output is generated in `dist/`.

## PWA Notes

- Manifest: `public/manifest.webmanifest`
- Service worker: `public/sw.js`
- Placeholder app icons: `public/icons/`
- The app uses local storage for interview profile and question progress.
- Push notifications are not part of Phase 1; revision reminders are shown inside the app UI.

## Folder Structure

```text
src/
  App.tsx                 Main app shell, routes, and screens
  data/content.ts         Phase 1 topics and question base
  data/phase2.ts          Phase 2 enriched tools, incidents, costs, packs, graph, follow-ups
  hooks/useLocalStorage.ts
  styles.css
  types.ts
public/
  manifest.webmanifest
  sw.js
  icons/
```

## Product Scope

- Mobile-first dashboard with readiness, days left, weak topics, and daily study plan.
- Role and target setup with persisted local profile.
- Structured Azure DevOps topic content.
- Practice questions with layered answers, bookmarks, status, search, and filters.
- Weak/bookmarked revision workflow with simple spaced revision buckets.
- Recursive follow-up question engine from basic to architect level.
- Architecture explorer for topics and tools.
- Tool encyclopedia covering Azure DevOps, Pipelines, YAML, Agents, Service Connections, Key Vault, Repos, Artifacts, Terraform, Docker, Kubernetes, AKS, Helm, and Monitoring.
- Troubleshooting library for pipeline, agent, artifact, permission, service connection, secret, AKS, image pull, and Terraform state incidents.
- Cost optimization modules for agents, AKS, VMs/storage, and monitoring.
- Reusable MNC company packs.
- Project story builder for common Azure DevOps project combinations.
- Mock interviewer with typed answer notes, follow-up prompts, scoring signals, and suggestions.
- Knowledge graph connecting topics, tools, incidents, costs, and questions.

## Enterprise Content Volume

- 1,000+ practical Azure DevOps / Cloud DevOps interview questions generated from enterprise scenarios.
- 100+ production incident playbooks plus 100+ troubleshooting scenarios.
- 50+ architecture explanations.
- 50+ cost optimization topics.
- 50+ security topics.
- Recursive follow-up trees go 20+ levels deep across basic, intermediate, advanced, senior, and architect levels.
