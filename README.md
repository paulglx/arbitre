# Arbitre

Arbitre is an automated code correction platform built using Django and React.

## Installation

See [installation](./config/README.md) for details on setting up Arbitre.

## Usage

### Start Arbitre

#### Start backend server

From `./backend/`, run `python manage.py runserver`

#### Start frontend server

From `./frontend/`, run `npm start`.

#### Start test runner server

celery -A arbitre worker -l info -E -B

## Credits

Arbitre comes from [Télécom SudParis](https://www.telecom-sudparis.eu/), an engineering school based near Paris, France.
