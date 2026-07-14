"""Shared model choice constants live here so that models, serializers and
the admin all reference a single source of truth."""


# User roles
PATIENT = "PATIENT"
DOCTOR = "DOCTOR"
ADMIN = "ADMIN"

ROLE_CHOICES = [
    (PATIENT, "Patient"),
    (DOCTOR, "Doctor"),
    (ADMIN, "Admin"),
]


# Appointment status
APPOINTMENT_STATUS_PENDING = "PENDING"
APPOINTMENT_STATUS_CONFIRMED = "CONFIRMED"
APPOINTMENT_STATUS_COMPLETED = "COMPLETED"
APPOINTMENT_STATUS_CANCELLED = "CANCELLED"

APPOINTMENT_STATUS_CHOICES = [
    (APPOINTMENT_STATUS_PENDING, "Pending"),
    (APPOINTMENT_STATUS_CONFIRMED, "Confirmed"),
    (APPOINTMENT_STATUS_COMPLETED, "Completed"),
    (APPOINTMENT_STATUS_CANCELLED, "Cancelled"),
]
