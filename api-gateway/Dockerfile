# Use a specific version of node:18-alpine for reproducibility
FROM node:18.20.8-alpine

WORKDIR /usr/src/app

# Create a non-root user to run the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package files first to leverage Docker cache
COPY --chown=appuser:appgroup package*.json ./

# Install dependencies using npm ci for reproducible builds
# Using --only=production will only install production dependencies
RUN npm ci --only=production

# Copy the rest of the application files
COPY --chown=appuser:appgroup services.json services.json
COPY --chown=appuser:appgroup ./global ./global
# COPY --chown=appuser:appgroup .env.example .env
COPY --chown=appuser:appgroup ./src ./src

# Switch to the non-root user
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/health || exit 1

CMD [ "node", "src/app.js" ]
