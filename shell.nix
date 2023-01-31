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
      djangorestframework
      djangorestframework-simplejwt
      drf-yasg
      gunicorn
      pylama
      psycopg2
      mozilla-django-oidc
      packaging
      requests
      uvicorn
    ]))
    nodejs
    nodePackages.serve
    rabbitmq-server
  ];
}
