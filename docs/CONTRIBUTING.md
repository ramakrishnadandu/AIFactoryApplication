# Contributing to Project

## Branch Strategy
```
main          ← production (protected)
project/dev    ← integration (all PRs merge here)
project/feat-* ← features
project/fix-*  ← bug fixes
project/heal-* ← auto-heal
```

## Workflow
1. Branch from `project/dev`
2. Make changes + tests
3. PR → `project/dev`
4. CI must pass
5. Squash merge

## Local Setup
```bash
cp .env.example .env
docker compose up --build
```

## Commits
```
feat: add feature
fix: resolve bug
docs: update docs
chore: update deps
```
