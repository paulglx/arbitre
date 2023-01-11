#!/usr/bin/env bash

BLUE='\033[0;34m'
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
        echo "Error: $1"
        exit 0  # optional; use if you don't want to propagate (rethrow) error to outer shell
    }
    function _finally {
        echo -e "
${BLUE}Setup complete. Run './run.sh' to start Arbitre.${NC}"
    }

    trap _catch ERR
    trap _finally EXIT

    echo "Installing dependencies..."
    cd frontend
    npm install &> /dev/null
    echo "Setting up database..."
    cd ../backend
    python manage.py makemigrations > /dev/null
    python manage.py migrate > /dev/null

    echo "Starting queue messaging service..."
    rabbitmq-server -detached

    cd ..
    chmod +x run.sh
)