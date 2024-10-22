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

      # django-eventstream
      django-eventstream = self.buildPythonPackage
        rec {
          pname = "django-eventstream";
          version = "5.3.1";
          src = self.fetchPypi {
            inherit pname version;
            sha256 = "sha256-Qi41NOK1WI2g3JdGfqqwIPo/lC9wcKBvwXHRjHVznEE=";
          };
          propagatedBuildInputs = [
            self.django
            self.djangorestframework
          ];
          doCheck = false;
        };
      gripcontrol = self.buildPythonPackage
        rec {
          pname = "gripcontrol";
          version = "4.2.0";
          src = self.fetchPypi {
            inherit pname version;
            sha256 = "sha256-8VMqlNX30qLuz47NOguwmRcordwCtrr+nIsFC2Z7e4Y=";
          };
          propagatedBuildInputs = [
            self.django-eventstream
          ];
          doCheck = false;
        };
      pubcontrol = self.buildPythonPackage
        rec {
          pname = "pubcontrol";
          version = "3.5.0";
          src = self.fetchPypi {
            inherit pname version;
            sha256 = "sha256-pexrP1Pt/QBWdVGOXkzCOzQSJ3aDWufG29HbFz0f8Ms=";
          };
          propagatedBuildInputs = [
            self.gripcontrol
          ];
          doCheck = false;
        };
    };
  };
}
