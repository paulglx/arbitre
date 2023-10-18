# Arbitre Configuration Tools

## Deploying Arbitre

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

## Installing Camisole

There is a playbook, `install-camisole.yaml`,  that was used to install camisole on a Ubuntu 22.02 server. It is **deprecated** and kept for reference only.