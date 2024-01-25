from django.contrib.auth.models import AbstractUser
from django.db.models import CharField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):

    def get_absolute_url(self):
        return reverse("user:detail", kwargs={"username": self.username})