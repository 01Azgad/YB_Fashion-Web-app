from rest_framework import viewsets
from django.contrib.auth.models import User
from .models import Tailor, Measurement, Order
from .serializers import UserSerializer, TailorSerializer, MeasurementSerializer, OrderSerializer
from rest_framework import generics, permissions
from .serializers import UserProfileSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Tailor, Measurement, Order, PortfolioItem
from .serializers import UserSerializer, TailorSerializer, MeasurementSerializer, OrderSerializer, PortfolioItemSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import generics, permissions
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Message
from .serializers import MessageSerializer

User = get_user_model()

class ChatHistoryView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Grab the ID of the person we are chatting with from the URL
        other_user_id = self.kwargs['user_id']
        current_user = self.request.user
        
        # Find messages where:
        # (I sent it AND they received it) OR (They sent it AND I received it)
        return Message.objects.filter(
            (Q(sender=current_user) & Q(receiver_id=other_user_id)) | 
            (Q(sender_id=other_user_id) & Q(receiver=current_user))
        )

    def perform_create(self, serializer):
        # Securely set the sender to the logged-in user, and receiver to the user ID in the URL
        other_user_id = self.kwargs['user_id']
        receiver = User.objects.get(id=other_user_id)
        
        serializer.save(sender=self.request.user, receiver=receiver)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Check if the user has a related Tailor profile
        token['is_tailor'] = hasattr(user, 'tailor')

        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    # This ensures only logged-in users with a valid token can access this
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Instead of looking up a user by an ID in the URL, 
        # we simply return the user attached to the current token!
        return self.request.user

# --- WE RESTORED THIS MISSING VIEW ---
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TailorViewSet(viewsets.ModelViewSet):
    queryset = Tailor.objects.all()
    serializer_class = TailorSerializer

# Add this under your existing TailorListView
class TailorDetailView(generics.RetrieveAPIView):
    queryset = Tailor.objects.all()
    serializer_class = TailorSerializer

class MeasurementViewSet(viewsets.ModelViewSet):
    queryset = Measurement.objects.all()
    serializer_class = MeasurementSerializer

# --- THIS IS THE UPDATED ORDER VIEW ---
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated] # Must be logged in
    
    # ADD THIS LINE: Tells Django to accept FormData with files and text
    parser_classes = [MultiPartParser, FormParser, JSONParser] 

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'tailor'):
            return Order.objects.filter(tailor=user.tailor)
        return Order.objects.filter(customer=user)


@api_view(['POST'])
@permission_classes([AllowAny]) # Anyone can access this to sign up
def register_tailor(request):
    data = request.data
    
    try:
        # 1. Create the User account first
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )
        
        # 2. Create the connected Tailor profile
        Tailor.objects.create(
            user=user,
            business_name=data['business_name'],
            specialty=data['specialty'],
            location=data['location'],
            bio=data.get('bio', '')
        )
        
        return Response({"message": "Tailor account created successfully!"}, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        # If anything goes wrong (e.g., username already taken), tell the frontend
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PortfolioItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser) # Required for image uploads

    def get_queryset(self):
        if self.request.method == 'GET':
            return PortfolioItem.objects.all()

        user = self.request.user
        # Only show the logged-in tailor's portfolio items
        if hasattr(user, 'tailor'):
            return PortfolioItem.objects.filter(tailor=user.tailor)
        return PortfolioItem.objects.none()

    def perform_create(self, serializer):
        # Automatically attach this portfolio item to the logged-in tailor
        serializer.save(tailor=self.request.user.tailor)