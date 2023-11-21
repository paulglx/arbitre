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

## Installing Judge0

You need to run a [Judge0](https://judge0.com/) instance to use Arbitre.

See <https://github.com/judge0/judge0/blob/master/CHANGELOG.md#deployment-procedure>

