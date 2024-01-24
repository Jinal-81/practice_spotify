from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import CharField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django_extensions.db.models import TimeStampedModel, ActivatorModel, TitleDescriptionModel


class User(AbstractUser):

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = CharField(_("Name of User"), blank=True, max_length=255)

    def get_absolute_url(self):
        return reverse("user:detail", kwargs={"username": self.username})


class Songs(TitleDescriptionModel, TimeStampedModel, ActivatorModel):
    """
    model for the songs.
    """
    singer_name = models.CharField(max_length=25, null=True, blank=True)
    profile_pic = models.ImageField(blank=True, null=True, upload_to='images/')


class SongPlaylist(TitleDescriptionModel, TimeStampedModel, ActivatorModel):
    """
    model for the user's song playlist.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='users')
    song = models.ManyToManyField(Songs)