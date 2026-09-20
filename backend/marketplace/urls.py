from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, TailorViewSet, MeasurementViewSet, OrderViewSet, UserProfileView, register_tailor, CustomTokenObtainPairView, PortfolioItemViewSet, ChatHistoryView, TailorDetailView



# 1. Create the router FIRST
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tailors', TailorViewSet)
router.register(r'measurements', MeasurementViewSet)
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'portfolio', PortfolioItemViewSet, basename='portfolio')

# 2. THEN define the urlpatterns, using the router we just created
urlpatterns = [
    # VIP Route: 'me' must go above the router so it doesn't get confused as an ID
    path('users/me/', UserProfileView.as_view(), name='user-profile'),
    path('tailors/register/', register_tailor, name='register-tailor'),
    # Catch-all for the router paths
    path('', include(router.urls)),
    path('messages/<int:user_id>/', ChatHistoryView.as_view(), name='chat-history'),
    path('api/tailors/<int:pk>/', TailorDetailView.as_view(), name='tailor-detail'),
]