{ pkgs ? import <nixpkgs> }:
pkgs.mkShell {
  buildInputs = with pkgs; [
    procps
    (my_python.withPackages (ps: with ps; [
      celery
      coverage
      django
      django-cors-headers
      djangorestframework
      djangorestframework-simplejwt
      drf-yasg
      pylama
      packaging
      requests
    ]))
    nodejs
    nodePackages.serve
  ];
}
