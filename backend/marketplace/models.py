from django.db import models
from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth import get_user_model

# Gets whatever User model you are currently using in Django
User = get_user_model()

class Message(models.Model):
    # Who is sending the message?
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    
    # Who is receiving the message?
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    
    # The actual chat text
    text = models.TextField()
    
    # Automatically saves the exact date and time the message was created
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        # This ensures messages are always loaded in chronological order (oldest to newest)
        ordering = ['timestamp']

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username} - {self.timestamp.strftime('%H:%M')}"

# 1. TAILORS TABLE
class Tailor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    specialty = models.CharField(max_length=100) # e.g., 'Senator Styles, Agbada'
    location = models.CharField(max_length=100)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)

    def __str__(self):
        return self.business_name

# 2. MEASUREMENTS TABLE
class Measurement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profile_name = models.CharField(max_length=50) # e.g., 'My Agbada Size'
    neck = models.DecimalField(max_digits=5, decimal_places=2)
    chest = models.DecimalField(max_digits=5, decimal_places=2)
    waist = models.DecimalField(max_digits=5, decimal_places=2)
    sleeve_length = models.DecimalField(max_digits=5, decimal_places=2)
    trouser_length = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.profile_name}"

# 3. ORDERS TABLE
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('ready', 'Ready for Delivery'),
        ('delivered', 'Delivered'),
    ]

    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    tailor = models.ForeignKey(Tailor, on_delete=models.CASCADE)
    measurement = models.ForeignKey(Measurement, on_delete=models.SET_NULL, null=True)
    style_description = models.TextField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer.username}"
    

class PortfolioItem(models.Model):
    tailor = models.ForeignKey(Tailor, on_delete=models.CASCADE, related_name='portfolio_items')
    title = models.CharField(max_length=100) # e.g., "Classic Navy Blue Senator"
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='portfolio_images/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.tailor.business_name}"