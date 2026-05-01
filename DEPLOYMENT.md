# Deployment — sayhi

## Local Docker
```bash
cp .env.example .env
bash deploy-local.sh
```

## CI/CD (Auto)
Push to `sayhi/dev` → test → build → staging → prod (manual gate)

## GitHub Secrets
| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub user |
| `DOCKERHUB_TOKEN` | Docker Hub token |
| `STAGING_URL` | Staging URL |
| `PROD_URL` | Production URL |

## AWS (Terraform)
```bash
cd infra/terraform && terraform init && terraform apply
```

## Health Checks
- Backend: `GET /health` → 200
- Frontend: `GET /health` → 200

## Rollback
```bash
docker compose pull --tag <prev-sha> && docker compose up -d
```
