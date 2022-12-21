#!/bin/bash

(trap 'kill 0' SIGINT; cd backend && python manage.py runserver & cd backend && celery -A arbitre worker -l info -B -E & cd frontend && npm start)