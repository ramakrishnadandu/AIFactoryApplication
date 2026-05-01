# Contributing to sayhi

## Branch Strategy
```
main          ← production (protected)
sayhi/dev    ← integration (all PRs merge here)
sayhi/feat-* ← features
sayhi/fix-*  ← bug fixes
sayhi/heal-* ← auto-heal
```

## Workflow
1. Branch from `sayhi/dev`
2. Make changes + tests
3. PR → `sayhi/dev`
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
