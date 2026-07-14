<div align="center">

# 🏥 mediSys

### Medical Appointment Management System

A full-stack web application for managing medical appointments, connecting patients with doctors, and streamlining healthcare workflows.

![Django](https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![DRF](https://img.shields.io/badge/DRF-3.15-A970FF?style=for-the-badge&logo=django&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-9-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br/>

**[Live Demo](https://medisys-demo.vercel.app)** · **[API Docs](#api-endpoints)** · **[Getting Started](#-getting-started)**

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 👤 Patient Portal
- Search doctors by specialty, name, or fee
- Book appointments with real-time slot availability
- View appointment history and status
- Reschedule or cancel upcoming visits
- Email confirmations for all actions

</td>
<td width="50%">

### 🩺 Doctor Dashboard
- Manage weekly availability schedule
- Confirm, complete, or reject appointments
- View today's schedule and upcoming patients
- Edit professional profile and consultation fee
- Approval-based onboarding system

</td>
</tr>
<tr>
<td>

### 🔧 Admin Panel
- System-wide dashboard with analytics
- Approve or block doctor accounts
- Manage medical specialties (CRUD)
- View and filter all appointments
- User management with role-based controls

</td>
<td>

### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- Email verification on registration
- Password reset via email flow
- Role-based route protection (Patient/Doctor/Admin)
- API throttling and CORS configuration

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (React)                    │
│  React 19 · MUI 9 · Redux Toolkit · React Router   │
│  Vite 8 · Axios · dayjs · react-hook-form           │
├─────────────────────────────────────────────────────┤
│                   Vite Dev Proxy                    │
│                    /api → :8000                      │
├─────────────────────────────────────────────────────┤
│                  Server (Django)                     │
│  Django 6 · DRF · SimpleJWT · CORS Headers          │
├──────────┬──────────┬───────────┬───────────────────┤
│  users   │ doctors  │appointments│      core         │
│  ─────── │ ──────── │ ──────────│ ──────────────── │
│ CustomUser│Specialty │Appointment│  Emails           │
│ Roles    │Profile   │Status     │  Middleware        │
│ JWT Auth │Availabil.│Actions    │  Seed Data        │
│ Confirm  │Signals   │Constrains │  Templates        │
├──────────┴──────────┴───────────┴───────────────────┤
│           SQLite (dev) / PostgreSQL (prod)           │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite 8 | SPA with HMR, fast builds |
| **UI Library** | MUI (Material UI) 9 | Consistent, accessible components |
| **State** | Redux Toolkit | Predictable state management |
| **Forms** | React Hook Form | Performant form handling |
| **HTTP** | Axios + interceptors | JWT-authenticated API calls |
| **Backend** | Django 6, DRF 3.15 | RESTful API with serialization |
| **Auth** | SimpleJWT | Access/refresh token pairs |
| **Email** | Django Email + Anymail | Transactional email delivery |
| **Database** | SQLite (dev) / PostgreSQL (prod) | Persistent data storage |
| **Deployment** | Gunicorn + WhiteNoise | Production WSGI server |

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Git**

### 1. Clone the repository

```bash
git clone git@github.com:omar1175/mediSys.git
cd mediSys
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp ../.env.example .env    # edit with your settings

# Run migrations
python manage.py migrate

# Seed the database with realistic data
python manage.py seed_data

# Create a superuser (optional)
python manage.py createsuperuser

# Start the development server
python manage.py runserver 0.0.0.0:8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the Application

| Page | URL |
|------|-----|
| Frontend | [http://localhost:5173](http://localhost:5173) |
| API | [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/) |
| Django Admin | [http://localhost:8000/admin/](http://localhost:8000/admin/) |

### 🔑 Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Doctor | `dr_smith` | `doctor123` |
| Patient | `alice_w` | `patient123` |

---

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/register/           Register new account
POST   /api/v1/auth/login/              Obtain JWT tokens
POST   /api/v1/auth/refresh/            Refresh access token
GET    /api/v1/auth/me/                 Get current user profile
PUT    /api/v1/auth/me/                 Update current user profile
POST   /api/v1/auth/confirm-email/      Confirm email address
POST   /api/v1/auth/resend-email/       Resend confirmation email
POST   /api/v1/auth/password-reset/     Request password reset
POST   /api/v1/auth/password-reset-confirm/  Confirm password reset
```

### Doctors
```
GET    /api/v1/doctors/                 List approved doctors (search, filter)
GET    /api/v1/doctors/{id}/            Doctor detail with availability
GET    /api/v1/specialties/             List all specialties
POST   /api/v1/specialties/             Create specialty (admin)
PUT    /api/v1/specialties/{slug}/      Update specialty (admin)
DELETE /api/v1/specialties/{slug}/      Delete specialty (admin)
GET    /api/v1/doctors/{id}/availability/  Doctor availability slots
POST   /api/v1/availability/            Add availability slot (doctor)
DELETE /api/v1/availability/{id}/       Remove availability slot
POST   /api/v1/doctors/{id}/approve/    Approve/unapprove doctor (admin)
```

### Appointments
```
GET    /api/v1/appointments/            List appointments (role-filtered)
POST   /api/v1/appointments/            Create appointment (patient)
GET    /api/v1/appointments/{id}/       Appointment detail
PATCH  /api/v1/appointments/{id}/       Update appointment
POST   /api/v1/appointments/{id}/confirm/   Confirm appointment (doctor)
POST   /api/v1/appointments/{id}/complete/  Complete appointment (doctor)
POST   /api/v1/appointments/{id}/cancel/    Cancel appointment
POST   /api/v1/appointments/{id}/reschedule/ Reschedule appointment
```

### Admin
```
GET    /api/v1/users/                  List all users (admin)
PATCH  /api/v1/users/{id}/             Update user (admin)
```

---

## 📁 Project Structure

```
mediSys/
├── backend/
│   ├── config/                 # Django project settings
│   │   ├── settings.py         # Base settings
│   │   ├── settings_dev.py     # Dev overrides (SQLite, SMTP)
│   │   └── settings_prod.py    # Prod overrides (PostgreSQL, Anymail)
│   ├── core/                   # Shared utilities
│   │   ├── choices.py          # Role & status constants
│   │   ├── emails.py           # Transactional email helpers
│   │   ├── middleware.py        # Request logging (dev)
│   │   ├── management/commands/seed_data.py
│   │   └── templates/core/email/  # Email templates (HTML + TXT)
│   ├── users/                  # Authentication & user management
│   │   ├── models.py           # CustomUser (role-based)
│   │   ├── views.py            # Register, login, profile, password reset
│   │   └── permissions.py      # IsPatient, IsDoctor, IsAdmin
│   ├── doctors/                # Doctor profiles & specialties
│   │   ├── models.py           # Specialty, DoctorProfile, Availability
│   │   ├── signals.py          # Auto-create profile on role change
│   │   └── views.py            # CRUD + approve action
│   ├── appointments/           # Appointment scheduling
│   │   ├── models.py           # Appointment with status constraints
│   │   └── views.py            # Confirm/complete/cancel/reschedule
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/         # AppLayout, ProtectedRoute, GuestRoute
│   │   │   └── common/         # AlertSnackbar, ConfirmDialog, ErrorBoundary
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Register, ForgotPassword, etc.
│   │   │   ├── patient/        # Dashboard, Doctors, Appointments, Booking
│   │   │   ├── doctor/         # Dashboard, Appointments, Profile, Availability
│   │   │   └── admin/          # Dashboard, Users, Specialties, Appointments
│   │   ├── services/           # Axios API layer with JWT interceptors
│   │   ├── store/slices/       # Redux slices (auth, doctors, appointments)
│   │   └── theme.js            # MUI theme configuration
│   ├── vite.config.js          # Dev proxy + build config
│   └── package.json
└── .gitignore
```

---

## 🎨 Screenshots

> Screenshots will be added after deployment.

| Patient Dashboard | Doctor Dashboard | Admin Dashboard |
|:---:|:---:|:---:|
| ![Patient](docs/patient-dashboard.png) | ![Doctor](docs/doctor-dashboard.png) | ![Admin](docs/admin-dashboard.png) |

---

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd backend
python manage.py test

# Frontend lint
cd frontend
npm run lint
```

### Re-seeding the Database

```bash
cd backend
python manage.py seed_data --flush
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3

# Email (dev)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# Email (production via Anymail)
EMAIL_BACKEND=anymail.backends.sendgrid.EmailBackend
ANYMAIL_API_KEY=your-api-key
DEFAULT_FROM_EMAIL=noreply@medisys.com
```

---

## 📋 Changelog

### v1.0.0 (Initial Release)
- Role-based authentication (Patient, Doctor, Admin)
- Doctor search with specialty and fee filtering
- Appointment booking with availability checking
- Status workflow: Pending → Confirmed → Completed/Cancelled
- Reschedule with conflict detection
- Email notifications (confirmation, booking, status change, password reset)
- Admin panel with user management and doctor approval
- Seed data with 10 specialties, 10 doctors, 66 appointments
- Production-ready settings with PostgreSQL and Anymail support

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Omar](https://github.com/omar1175)**

</div>
