{ pkgs ? import <nixpkgs> }:
pkgs.mkShell {
  buildInputs = with pkgs; [
    procps
    (my_python.withPackages (ps: with ps; [
      celery
      channels
      channels-redis
      coverage
      daphne
      django
      django-celery-beat
      django-cors-headers
      django-environ
      django-extensions
      djangorestframework
      djangorestframework-api-key
      djangorestframework-simplejwt
      drf-yasg
      gunicorn
      mozilla-django-oidc
      packaging
      psycopg2
      pylama
      python-keycloak
      pyyaml
      pyjwt
      redis
      requests
      uvicorn
    ]))
    nodejs
    nodePackages.serve
    rabbitmq-server
  ];
}
