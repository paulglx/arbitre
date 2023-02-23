from mozilla_django_oidc.auth import OIDCAuthenticationBackend


class CustomOIDCAuthenticationBackend(OIDCAuthenticationBackend):
    def create_user(self, claims):
        user = super(CustomOIDCAuthenticationBackend, self).create_user(claims)

        user.username = claims.get("preferred_username", "")
        user.save()

        return user

    def update_user(self, user, claims):
        user.username = claims.get("preferred_username", "")
        user.save()

        return user
