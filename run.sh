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

(
    set -Ee

    function _catch {
        echo "Error: $1"
        exit 0  # optional; use if you don't want to propagate (rethrow) error to outer shell
    }
    function _finally {
        echo -e "${BLUE}Arbitre has been stopped successfully.${NC}"
    }

    trap _catch ERR
    trap _finally EXIT
    (trap 'kill 0' SIGINT; cd backend && python manage.py runserver & cd backend && celery -A arbitre worker -l info -B -E & cd frontend && npm start)
)