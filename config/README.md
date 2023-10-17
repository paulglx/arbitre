# Installing Arbitre

_Arbitre has been tested on Ubuntu Server 22.04.1_

## Ansible Playbook

### Setup your host servers

In the config directory, create an `inventory.yaml` file containing the host servers

Example :

```yaml
group:
  hosts:
    server01:
      ansible_host: 192.0.2.50
    server02:
      ansible_host: 192.0.2.51
      #...
```

### Run Playbook

```bash
ansible-playbook playbook.yaml -i inventory.yaml -u <username> -K
```

This command will run the playbook on the servers, logging in as \<username\> and prompting for the corresponding password.

All of the requirements will be installed on the servers.

# Deploying Arbitre

Add your prod server to the inventory file

```yaml
prod:
  hosts:
    nixos:
      ansible_host: [ARBITRE SERVER IP]
      ansible_user: [SUDOER USERNAME]
      ansible_ssh_pass: [PASSWORD]
```

Run the playbook

```bash

ansible-playbook deploy.yaml -i inventory.yaml 
```