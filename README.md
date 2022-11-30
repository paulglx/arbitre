# Arbitre

Arbitre is an automated code correction platform built using Django and React.

## Installation

See [installation](./config/README.md) for details on setting up Arbitre.

## Usage

### Start Arbitre

Simultaneously run these tasks :

#### Run backend server

From `./backend/`, run `python manage.py runserver`

#### Test runner server

From `./backend/`, run `celery -A arbitre worker -l info -E`

#### Run frontend server

From `./frontend/`, run `npm start`.

#### Make sure the runner server is setup. [See installation](./config/README.md)

## Credits

Arbitre comes from [Télécom SudParis](https://www.telecom-sudparis.eu/), an engineering school based near Paris, France.
