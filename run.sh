#!/bin/bash

# Go to the 'backend' directory
cd backend

# Start the Django backend server
echo -e "#### [\033[1;30mDJANGO\033[0m] Starting Django server...\n"
python manage.py runserver | while read line; do echo -e "[\033[1;30mDJANGO\033[0m] $line"; done &

# Start the Celery server
echo -e "#### [\033[1;32mCELERY\033[0m] Starting Celery server...\n"
celery -A arbitre worker -l info -E -B | while read line; do echo -e "[\033[1;32mCELERY\033[0m] $line"; done &

# Go to the 'frontend' directory
cd ../frontend

# Start the React frontend server
echo -e "#### [\033[1;36mREACT\033[0m] Starting React server...\n"
npm start | while read line; do echo -e "[\033[1;36mREACT\033[0m] $line"; done &

# Wait for all the processes to finish
wait
