{
  description = "Development Environment for Arbitre";
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-22.11";

  };

  outputs = { self, nixpkgs }: with import nixpkgs { system = "aarch64-darwin"; overlays = [ ]; }; {
    devShell.aarch64-darwin =
      mkShell {
        buildInputs = [
          procps
          (python3.withPackages (ps: with ps; [
            celery
            django
            django-cors-headers
            djangorestframework
            djangorestframework-simplejwt
            drf-yasg
            packaging
            requests
          ]))
          nodejs
          nodePackages.node2nix
          yarn
        ];
      };
  };
}
