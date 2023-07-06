# Makefile

# Define variables
COMPOSE = docker-compose
DOCKER_COMPOSE_FILE = docker-compose.yml

# Default target
.PHONY: all
all: up

# Start the containers
.PHONY: up
up:
	$(COMPOSE) -f $(DOCKER_COMPOSE_FILE) up

# Build the containers
.PHONY: build
build:
	$(COMPOSE) -f $(DOCKER_COMPOSE_FILE) build

# Stop and remove the containers
.PHONY: down
down:
	$(COMPOSE) -f $(DOCKER_COMPOSE_FILE) down

# Restart the containers
.PHONY: restart
restart: down up

# View container logs
.PHONY: logs
logs:
	$(COMPOSE) -f $(DOCKER_COMPOSE_FILE) logs -f