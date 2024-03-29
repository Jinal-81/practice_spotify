from django.urls import path

from .views import (
    UserDetailView,
    UserRedirectView,
    UserUpdateView,
    DashboardView,
    SignupView
)

app_name = "user"
urlpatterns = [
    path("redirect/", view=UserRedirectView.as_view(), name="redirect"),
    path("dashboard/", view=DashboardView.as_view(), name="dashboard"),
    path("signup/", view=SignupView.as_view(), name="signup"),
    path("update/", view=UserUpdateView.as_view(), name="update"),
    path("<str:username>/", view=UserDetailView.as_view(), name="detail"),
]
