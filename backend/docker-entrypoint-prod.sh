#!/bin/sh

echo "Starting application in production mode..."

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until nc -z mongodb 27017; do
  echo "MongoDB is unavailable - sleeping"
  sleep 2
done

echo "MongoDB is up - checking if seeding is needed..."

# Run the seed script (it handles checking if users already exist)
echo "Running database seeder..."
node dist/seed.js || echo "Seeder already ran or encountered an error (this is normal on subsequent runs)"

# Start the application
echo "Starting NestJS application in production mode..."
exec node dist/main
