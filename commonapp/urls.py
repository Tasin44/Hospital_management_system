from django.urls import path
from .views import SignupView, LoginView, LogoutView, ActivateAccountView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('activate/<str:activation_token>/', ActivateAccountView.as_view(), name='activate_account'),
]



