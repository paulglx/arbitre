# Arbitre

![Django Logo](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![React Logo](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

Arbitre is an automated code correction platform.

## Usage

### 1. Set up the worker server

[See installation](./config/README.md)

### 2. Install Nix package manager

For more information, see [the official Nix website](https://nixos.org/download.html)

#### Linux, Windows (WSL2)

```bash
sh <(curl -L https://nixos.org/nix/install) --daemon
```

#### macOS

```bash
sh <(curl -L https://nixos.org/nix/install)
```



### 3. Run Nix shell

```bash
nix develop -i
```

This will install all the dependencies and run the shell.

## Credits

Arbitre comes from [Télécom SudParis](https://www.telecom-sudparis.eu/), an engineering school based near Paris, France.
