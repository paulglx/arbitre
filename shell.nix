{ pkgs ? import <nixpkgs> }:
pkgs.mkShell {
  buildInputs = with pkgs; [
    procps
    (my_python.withPackages (ps: with ps; [
      celery
      coverage
      daphne
      django
      django-celery-beat
      django-cors-headers
      django-environ
      django-extensions
      django-eventstream
      djangorestframework
      djangorestframework-api-key
      djangorestframework-simplejwt
      drf-yasg
      gripcontrol
      mozilla-django-oidc
      packaging
      pubcontrol
      psycopg2
      pylama
      python-keycloak
      pyyaml
      requests
    ]))
    nodejs
    nodePackages.serve
    rabbitmq-server
  ];
}
