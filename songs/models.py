from django.db import models
from django_extensions.db.models import TitleDescriptionModel, ActivatorModel, TimeStampedModel

from user.models import User


# Create your models here.


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