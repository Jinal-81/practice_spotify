from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import SongListView, SongListViewSet

app_name = "songs_api"

router = DefaultRouter()
router.register(r'songsplaylist', SongListViewSet)

urlpatterns = [
    path('songs_list/', SongListView.as_view(), name='songs_list'),
    path('', include(router.urls)),
]
