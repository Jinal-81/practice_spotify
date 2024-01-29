from rest_framework import serializers

from songs.models import Songs, SongPlaylist


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Songs
        fields = ('title', 'profile_pic', 'singer_name')


class SongPlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = SongPlaylist
        fields = '__all__'
