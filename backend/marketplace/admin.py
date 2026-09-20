from django.contrib import admin
from .models import Tailor, Measurement, Order

# Register your models here so they show up on the admin dashboard
admin.site.register(Tailor)
admin.site.register(Measurement)
admin.site.register(Order)
from django.contrib import admin
from .models import Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'text', 'timestamp']
    search_fields = ['text', 'sender__username', 'receiver__username']