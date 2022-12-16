final: prev: {
  my_python = prev.python3.override {
    packageOverrides = self: super: {
      django = super.django_4.override { };
      django-cors-headers = super.django-cors-headers.override { django = self.django; };
      djangorestframework = super.djangorestframework.override { django = self.django; };
      djangorestframework-simplejwt = super.djangorestframework-simplejwt.override { django = self.django; djangorestframework = self.djangorestframework; };
      moto = super.moto.overridePythonAttrs { doCheck = false; };
      celery = super.celery.overridePythonAttrs { doCheck = false; };
    };
  };
}
