from rest_framework import viewsets
from rest_framework.generics import ListAPIView

from .serializers import SongSerializer, SongPlaylistSerializer
from ..models import Songs, SongPlaylist


class SongListView(ListAPIView):
    queryset = Songs.objects.all()
    serializer_class = SongSerializer


class SongListViewSet(viewsets.ModelViewSet):
    queryset = SongPlaylist.objects.all()
    serializer_class = SongPlaylistSerializer