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
  ];

  shellHook = ''

    cd backend

    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver &

    celery -A arbitre worker -l info -B -E &

    cd ../frontend

    npm start &

    cd ..

  '';
}
