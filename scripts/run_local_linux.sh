#!/bin/bash

set -e

# Constants
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT_DIR="$(cd "${SCRIPTS_DIR}/.." && pwd)"
LOG_FILE="${PROJECT_ROOT_DIR}/logs/run_local_linux.log"
DOCKER_COMPOSE_FILE="${PROJECT_ROOT_DIR}/docker-compose.yml"
ENV_FILE="${PROJECT_ROOT_DIR}/.env"

# Ensure the log directory exists
mkdir -p "$(dirname "${LOG_FILE}")"

# Functions
log() {
    local message="$1"
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $message" | tee -a "$LOG_FILE"
}

check_dependency() {
    local dependency="$1"
    if ! command -v "$dependency" &> /dev/null; then
        log "ERROR: $dependency is required but not installed."
        exit 1
    fi
}

load_env_vars() {
    if [ -f "$ENV_FILE" ]; then
        export $(grep -v '^#' "$ENV_FILE" | xargs)
        log "Environment variables loaded from $ENV_FILE"
    else
        log "Warning: .env file not found, proceeding without loading environment variables."
    fi
}

start_services() {
    log "Starting services using Docker Compose..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
}

stop_services() {
    log "Stopping services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
}

clean_up() {
    log "Cleanup initiated..."
    stop_services
}

trap clean_up EXIT

main() {
    log "Script execution started."

    check_dependency "docker"
    check_dependency "docker-compose"

    load_env_vars

    start_services

    log "All services started successfully. Visit http://localhost to access the application."

    # Wait indefinitely
    while :; do
        sleep 60
    done
}

main "$@"