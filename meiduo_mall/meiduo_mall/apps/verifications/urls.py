from django.urls import path
from . import views

urlpatterns = [
    path("image_codes/<slug:image_code_id>/", views.ImageCodeView.as_view()),
    path("sms_codes/<int:mobile>/", views.SMSCodeView.as_view()),
]
