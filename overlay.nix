final: prev: {
  my_python = prev.python3.override {
    packageOverrides = self: super: {
      mozilla-django-oidc = self.buildPythonPackage
        rec {
          pname = "mozilla-django-oidc";
          version = "4.0.0";
          src = self.fetchPypi {
            inherit pname version;
            sha256 = "sha256-frnQWgM6xhp06jvjPT+CKBi8jcq4HEcf75TA1lx8vhw=";
          };
          propagatedBuildInputs = [
            self.josepy
            self.requests
            self.cryptography
          ];

          doCheck = false;
        };
      djangorestframework-api-key = self.buildPythonPackage
        rec {
          pname = "djangorestframework-api-key";
          version = "3.0.0";
          src = self.fetchPypi {
            inherit pname version;
            sha256 = "sha256-8YzfpFquoQ/U2q6/+mBIHOQALJue9sVR7x/CHa3yiEU=";
          };
          propagatedBuildInputs = [
            self.django
            self.djangorestframework
          ];
          doCheck = false;
        };
    };
  };
}
