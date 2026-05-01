# Contributing to syhionce

## Branch Strategy
```
main          ← production (protected)
syhionce/dev    ← integration (all PRs merge here)
syhionce/feat-* ← features
syhionce/fix-*  ← bug fixes
syhionce/heal-* ← auto-heal
```

## Workflow
1. Branch from `syhionce/dev`
2. Make changes + tests
3. PR → `syhionce/dev`
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
