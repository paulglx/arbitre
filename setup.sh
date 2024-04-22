#!/usr/bin/env bash

BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

cat << "EOF"

             _     _ _            
            | |   (_) |           
   __ _ _ __| |__  _| |_ _ __ ___ 
  / _` | '__| '_ \| | __| '__/ _ \
 | (_| | |  | |_) | | |_| | |  __/
  \__,_|_|  |_.__/|_|\__|_|  \___|

EOF

echo -e "${BLUE} Automated code correction platform ${NC}"

echo ""

(
    set -Ee

    function _catch {
        echo -e "${RED}Arbitre couldn't setup correctly"
        echo -e "${BLUE}Tip: Make sure Keycloak is up and running and .env file is correct${NC}"
        exit 0  # optional; use if you don't want to propagate (rethrow) error to outer shell
    }

    trap _catch ERR

    echo "Installing dependencies..."
    cd frontend
    npm ci &> /dev/null
    echo "Setting up database..."
    cd ../backend
    python manage.py makemigrations > /dev/null
    python manage.py migrate > /dev/null

    echo "Collecting static files..."
    python manage.py collectstatic --noinput > /dev/null

    echo "Starting queue messaging service..."
    rabbitmq-server -detached

    cd ..
    chmod +x run.sh

    echo -e "
${BLUE}Setup complete. Run './run.sh' to start Arbitre.${NC}"
)