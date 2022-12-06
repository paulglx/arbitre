# Arbitre

![Django Logo](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![React Logo](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)


Arbitre is an automated code correction platform.

## Installation

See [installation](./config/README.md) for details on setting up Arbitre.

## Usage

### Start Arbitre

Simultaneously run these tasks :

#### Start backend server

From `./backend/`, run `python manage.py runserver`

#### Start test runner server

From `./backend/`, run `celery -A arbitre worker -l info -E`

#### Start frontend server

From `./frontend/`, run `npm start`.

#### Make sure the runner server is setup.

[See installation](./config/README.md)

## Credits

Arbitre comes from [Télécom SudParis](https://www.telecom-sudparis.eu/), an engineering school based near Paris, France.
