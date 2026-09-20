from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Tailor, Measurement, Order
from django.contrib.auth import get_user_model
from .models import Tailor
from .models import Tailor, Measurement, Order, PortfolioItem
from .models import Message
import json

class MessageSerializer(serializers.ModelSerializer):
    # These read-only fields will easily give Next.js the text names of the sender/receiver
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    receiver_name = serializers.CharField(source='receiver.username', read_only=True)
    sender_email = serializers.EmailField(source='sender.email', read_only=True)
    receiver_email = serializers.EmailField(source='receiver.email', read_only=True)
    sender_display_name = serializers.SerializerMethodField()
    receiver_display_name = serializers.SerializerMethodField()
    is_mine = serializers.SerializerMethodField()
    other_party_display_name = serializers.SerializerMethodField()
    other_party_email = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id',
            'sender',
            'sender_name',
            'sender_email',
            'sender_display_name',
            'receiver',
            'receiver_name',
            'receiver_email',
            'receiver_display_name',
            'is_mine',
            'other_party_display_name',
            'other_party_email',
            'text',
            'timestamp',
        ]
        # We make sender and receiver read_only in the form so we can securely set them in the backend
        read_only_fields = ['sender', 'receiver']

    def get_sender_display_name(self, obj):
        return obj.sender.username or obj.sender.email

    def get_receiver_display_name(self, obj):
        return obj.receiver.username or obj.receiver.email

    def get_is_mine(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False
        return obj.sender_id == request.user.id

    def get_other_party_display_name(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated and obj.sender_id == request.user.id:
            return obj.receiver.username or obj.receiver.email
        return obj.sender.username or obj.sender.email

    def get_other_party_email(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated and obj.sender_id == request.user.id:
            return obj.receiver.email
        return obj.sender.email


User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    is_tailor = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_tailor']
        read_only_fields = ['id', 'is_tailor']

    def get_is_tailor(self, obj):
        # Django checks: "Does this user have a linked tailor profile?"
        return hasattr(obj, 'tailor')

# 1. User Serializer (To send basic customer/tailor info)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Using create_user() automatically hashes the password securely!

        password = validated_data.pop('password', None)

        user = User(**validated_data)

        if password is not None:
            user.set_password(password)

            user.save()

        return user
    
# 2. Tailor Serializer
class TailorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) # Brings in the user details automatically

    class Meta:
        model = Tailor
        fields = ['id', 'user', 'business_name', 'bio', 'specialty', 'location', 'average_rating']

# 3. Measurement Serializer
class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measurement
        fields = '__all__' # This shortcut translates every column in the table!

class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    measurement_details = MeasurementSerializer(source='measurement', read_only=True)
    tailor_user_id = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_name', 'measurement_details','tailor', 'tailor_user_id', 'style_description', 'status', 'total_price']
        # 1. ADD THE MISSING FIELDS HERE: This tells DRF to skip validation for them
        # read_only_fields = ['customer', 'measurement', 'tailor', 'style_description', 'total_price']

    def create(self, validated_data):
        # Grab the current logged-in user making the request
        request = self.context.get('request')
        customer = request.user

        # Extract the stringified measurements and tailor ID from the FormData
        measurements_data = request.data.get('measurements')
        tailor_id = request.data.get('tailor_id')

        # Decode the measurements JSON string and create a Measurement object in the DB
        measurement_obj = None
        if measurements_data:
            try:
                measurements_dict = json.loads(measurements_data) 
                # ADDED THE USER HERE to prevent the IntegrityError
                measurement_obj = Measurement.objects.create(user=customer, **measurements_dict)
            except json.JSONDecodeError:
                raise serializers.ValidationError({"measurements": "Invalid JSON format."})

        # Find the correct tailor
        try:
            tailor = Tailor.objects.get(id=tailor_id)
        except Tailor.DoesNotExist:
            raise serializers.ValidationError({"tailor_id": "Tailor not found."})

        # 2. ADD DEFAULT VALUES HERE: Satisfy the database model requirements
        order = Order.objects.create(
            customer=customer,
            tailor=tailor,
            measurement=measurement_obj,
            style_description=request.data.get('style_description', 'No description provided'), # Default
            total_price=request.data.get('total_price', 0.00), # Default to 0 until the tailor sets a price
            **validated_data
        )

        return order
    
    def get_tailor_user_id(self, obj):
        # Safely check if a tailor is assigned and has a user attached
        if obj.tailor and hasattr(obj.tailor, 'user'):
            return obj.tailor.user.id
        return None


class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = '__all__'
        read_only_fields = ['tailor'] # We will set the tailor automatically in the view