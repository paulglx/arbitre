"""
Django settings for arbitre project.

Generated by 'django-admin startproject' using Django 4.1.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from pathlib import Path
import environ
import os

env = environ.Env()
env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
environ.Env.read_env(env_file=env_file)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env(
    "SECRET_KEY"
)  # "django-insecure-9p0it%1(1)sv%+s&bv0n@8330j*_)qm76ejwrzg(nea-m=v278"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG", default="False") == "True"

ALLOWED_HOSTS = ["localhost", "127.0.0.1", env("HOSTNAME", default="")]

# Application definition
INSTALLED_APPS = [
    "api.apps.ApiConfig",
    "corsheaders",
    "django_celery_beat",
    "django_extensions",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.messages",
    "django.contrib.sessions",
    "django.contrib.staticfiles",
    "drf_yasg",
    "mozilla_django_oidc",
    "rest_framework_simplejwt.token_blacklist",
    "rest_framework_simplejwt",
    "rest_framework",
    "rest_framework_api_key",
    "runner.apps.RunnerConfig",
]

# Add 'mozilla_django_oidc' authentication backend
# https://mozilla-django-oidc.readthedocs.io/en/stable/installation.html#changing-how-django-users-are-created

AUTHENTICATION_BACKENDS = (
    "arbitre.oidc.CustomOIDCAuthenticationBackend",
    "django.contrib.auth.backends.ModelBackend",
)

KEYCLOAK_URL = env("KEYCLOAK_URL", default="http://localhost:8080")
KEYCLOAK_REALM_NAME = env("KEYCLOAK_REALM_NAME", default="master")

OIDC_OP_AUTHORIZATION_ENDPOINT = (
    f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM_NAME}/protocol/openid-connect/auth"
)
OIDC_OP_JWKS_ENDPOINT = (
    f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM_NAME}/protocol/openid-connect/certs"
)
OIDC_OP_TOKEN_ENDPOINT = (
    f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM_NAME}/protocol/openid-connect/token"
)
OIDC_OP_USER_ENDPOINT = (
    f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM_NAME}/protocol/openid-connect/userinfo"
)
OIDC_RP_CLIENT_ID = env("OIDC_RP_CLIENT_ID", default="arbitre-backend")
OIDC_RP_CLIENT_SECRET = env("OIDC_RP_CLIENT_SECRET", default="")
OIDC_RP_SIGN_ALGO = "RS256"

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.security.SecurityMiddleware",
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

CSRF_ORIGIN_PREFIX = "https://" if env("USE_HTTPS") == "true" else "http://"
CSRF_TRUSTED_ORIGINS = [
    CSRF_ORIGIN_PREFIX + env("HOSTNAME"),
    env("KEYCLOAK_URL", default="http://localhost:8080"),
]
CSRF_COOKIE_SECURE = env("USE_HTTPS", default="True") == "True"
SESSION_COOKIE_SECURE = env("USE_HTTPS", default="True") == "True"

ROOT_URLCONF = "arbitre.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "arbitre.wsgi.application"

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env("DB_PORT"),
        "CONN_MAX_AGE": 10,
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Europe/Paris"
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = "static-backend/"
STATIC_ROOT = "static/static-backend/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Django Rest Framework Settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "mozilla_django_oidc.contrib.drf.OIDCAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}

# Celery Settings
CELERY_ACCEPT_CONTENT = ["application/json"]
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"
CELERY_BROKER_URL = "amqp://guest:guest@localhost//"
CELERY_RESULT_BACKEND = "rpc://"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TASK_SERIALIZER = "json"
