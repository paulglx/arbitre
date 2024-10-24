#!/usr/bin/env bash

# Create .env file
echo "# Generated .env file" > .env

# Loop through all environment variables
while IFS='=' read -r -d '' name value; do
    # Skip internal Docker environment variables
    if [[ $name != HOSTNAME* ]] && [[ $name != PATH ]] && [[ $name != PWD ]] && \
       [[ $name != SHLVL ]] && [[ $name != HOME ]] && [[ $name != TERM ]]; then
        # Properly quote the value to handle special characters
        printf '%s=%q\n' "$name" "$value" >> .env
    fi
done < <(env -0)

# Make sure the file has correct permissions
chmod 600 .env

python manage.py collectstatic --noinput
python manage.py migrate --noinput
daphne -b 0.0.0.0 -p 8000 arbitre.asgi:application
