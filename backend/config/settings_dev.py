"""Development settings. Imports the shared base and loosens safety for local work."""

from .settings import *  # noqa: F401,F403

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "*"]

# Frontend dev server (Vite) + any other local origins.
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Send emails via Gmail SMTP.
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "omarabdelstar2002@gmail.com"
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "YOUR_APP_PASSWORD_HERE")
DEFAULT_FROM_EMAIL = "MediSys <omarabdelstar2002@gmail.com>"

# Stripe test keys for development
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "sk_test_YOUR_KEY_HERE")
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY", "pk_test_YOUR_KEY_HERE")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "whsec_YOUR_SECRET_HERE")
