{ pkgs ? import <nixpkgs> }:
pkgs.mkShell {
  buildInputs = with pkgs; [
    procps
    (my_python.withPackages (ps: with ps; [
      celery
      coverage
      django
      django-cors-headers
      django-environ
      djangorestframework
      djangorestframework-simplejwt
      drf-yasg
      gunicorn
      pylama
      psycopg2
      packaging
      requests
      uvicorn
    ]))
    nodejs
    nodePackages.serve
    rabbitmq-server
  ];
}
