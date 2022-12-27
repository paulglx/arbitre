![Arbitre](docs/static/img/banner.png)

![Django Logo](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![React Logo](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

Arbitre allows computer science teachers to create and grade assignments for their students. Create exercises, share them with students, and view the results of automated testing in real time.

## Installation 🧑‍💻

To install Arbitre on a server, follow these steps:

### 1. Set up the worker server

Set up the runner, on the same server or on a remote server, using the Ansible playbook in the `config` directory. [More details](./config/README.md)

### 2. Install Nix package manager

For more information, see [the official Nix website](https://nixos.org/download.html)

```bash
sh <(curl -L https://nixos.org/nix/install) --daemon
# remove '--daemon' for macOS
```

### 3. Run Nix shell

```bash
nix develop -i
```

### 4. Install dependencies

```bash
./setup.sh
```

### 5. Run the application

```bash
./run.sh
```

## Features ✨

- Support for a wide range of programming languages
- Automated unit testing for fast, accurate grading
- Easy setup for teachers, with the option to self-host or have their organization host the application
- Secure storage of student solutions on a secure server, with code execution in an isolated virtual machine
- Modern, fast UI built with React and Django

## License 📖

Arbitre is licensed under the GPL 3.0 License. See [LICENSE](LICENSE) for more information.

## Credits 🙋‍♂️

Arbitre comes from [Télécom SudParis](https://www.telecom-sudparis.eu/), an engineering school based near Paris, France.
