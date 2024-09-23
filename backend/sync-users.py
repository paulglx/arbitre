from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from keycloak import KeycloakAdmin
import environ
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "arbitre.settings")
django.setup()

# Reading .env file
env = environ.Env()
environ.Env.read_env(env_file=os.path.join(os.path.dirname(__file__), ".env"))

User = get_user_model()

# Keycloak connection details

# Initialize Keycloak admin client
keycloak_admin = KeycloakAdmin(
    server_url=env("KEYCLOAK_URL"),
    username=env("KEYCLOAK_ADMIN_USERNAME"),
    password=env("KEYCLOAK_ADMIN_PASSWORD"),
    realm_name=env("KEYCLOAK_REALM_NAME"),
    verify=True,
)

# Fetch users from Keycloak
keycloak_users = keycloak_admin.get_users()

created = 0

for keycloak_user in keycloak_users:
    username = keycloak_user["username"]
    email = keycloak_user.get("email", "")

    if not email:
        print(f"Skipping user {username} because it does not have an email address")
        continue

    # Create or update Django user
    user, created = User.objects.update_or_create(
        username=username, defaults={"email": email}
    )

    if created:
        created += 1
        print(f"Created user: {username}")

print()
print(f"Created {int(created)} users")
print(f"Total users: {User.objects.count()}")
