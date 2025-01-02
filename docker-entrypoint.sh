#!/bin/bash
# docker-entrypoint.sh

# Run prisma migration
npx prisma migrate dev --skip-seed

# Inicialice the container with the default command (npm run dev)
exec "$@"
