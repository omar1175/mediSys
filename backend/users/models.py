from django.contrib.auth.models import AbstractUser
from django.db import models

from core.choices import ADMIN, DOCTOR, PATIENT, ROLE_CHOICES


class CustomUser(AbstractUser):
    """User account with a role used to gate features across the app."""

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default=PATIENT,
    )
    email = models.EmailField(unique=True)
    is_email_confirmed = models.BooleanField(default=False)

    class Meta:
        db_table = "users_customuser"
        verbose_name = "user"
        verbose_name_plural = "users"

    def __str__(self):
        return f"{self.get_full_name() or self.username} <{self.email}>"

    @property
    def is_patient(self):
        return self.role == PATIENT

    @property
    def is_doctor(self):
        return self.role == DOCTOR

    @property
    def is_admin_role(self):
        return self.role == ADMIN
