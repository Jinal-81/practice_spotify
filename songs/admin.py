from django.contrib import admin

from songs.models import SongPlaylist, Songs

# Register your models here.
admin.site.register(Songs)
admin.site.register(SongPlaylist)