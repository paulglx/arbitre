{ pkgs ? import <nixpkgs> }:
pkgs.mkShell {
  buildInputs = with pkgs; [
    procps
    (my_python.withPackages (ps: with ps; [
      celery
      coverage
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
      requests
      uvicorn
    ]))
    nodejs
    nodePackages.serve
    rabbitmq-server
  ];
}
