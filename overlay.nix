final: prev: {
  /* my_python = prev.python3.override {
    packageOverrides = self: super: {
      django = super.django_4.override { };
      django-cors-headers = super.django-cors-headers.override { django = self.django; };
      djangorestframework = super.djangorestframework.override { django = self.django; };
      djangorestframework-simplejwt = super.djangorestframework-simplejwt.override { django = self.django; djangorestframework = self.djangorestframework; };
      moto = super.moto.overridePythonAttrs { doCheck = false; };
      celery = super.celery.overridePythonAttrs { doCheck = false; };
      mozilla-django-oidc = self.buildPythonPackage rec {
        pname = "mozilla-django-oidc";
        version = "3.0.0";
        src = self.fetchPypi {
          inherit pname version;
          sha256 = "sha256-p9RHr4PLWqFnGiQAmwzmsvDSWenFjYyIx6jQwnwFwE0=";
        };
        propagatedBuildInputs = [
          self.django_4
          self.josepy
          self.requests
          self.cryptography
        ];

        doCheck = false;
      };
    };
  }; */
  my_python = prev.python3.override {
    packageOverrides = self: super: {
      mozilla-django-oidc = self.buildPythonPackage rec {
        pname = "mozilla-django-oidc";
        version = "3.0.0";
        src = self.fetchPypi {
          inherit pname version;
          sha256 = "sha256-p9RHr4PLWqFnGiQAmwzmsvDSWenFjYyIx6jQwnwFwE0=";
        };
        propagatedBuildInputs = [
          self.django_4
          self.josepy
          self.requests
          self.cryptography
        ];

        doCheck = false;
      };
    };
  };
}
