# Feature Roadmap

Planned features for MediSys v2.0, assigned to the development team.

---

## Youssif — Backend & Business Logic

### 1. 💳 Payment Integration (Stripe)

**Description:** Enable patients to pay consultation fees online via Stripe. Support one-time payments, payment history, and invoice generation.

**Scope:**
- New `Payment` model (amount, status, Stripe payment intent ID, appointment FK)
- Stripe Checkout Session API integration
- Webhook handler for payment confirmation
- Payment history page (patient + admin)
- Invoice PDF generation (using WeasyPrint or ReportLab)
- Refund handling for cancelled appointments

**Tech Stack:** `stripe-python`, `djangorestframework`, Webhooks

**Affected Routes:** `POST /api/v1/payments/`, `GET /api/v1/payments/history/`, Webhook endpoint

---

### 2. 🔔 Push Notifications (Firebase Cloud Messaging)

**Description:** Send real-time browser push notifications for appointment reminders, status changes, and doctor approvals.

**Scope:**
- Firebase Admin SDK integration (backend)
- Service Worker registration (frontend)
- Notification preferences per user (toggle on/off)
- Scheduled reminders (24h before, 1h before appointment)
- Notification bell icon with unread count in navbar
- Notification history/inbox page

**Tech Stack:** `firebase-admin`, Service Workers, `web-push`

**Affected Routes:** `POST /api/v1/notifications/register/`, `GET /api/v1/notifications/`, `PATCH /api/v1/notifications/{id}/read/`

---

### 3. ⭐ Rating & Review System

**Description:** Allow patients to rate and review doctors after completed appointments. Build trust and transparency.

**Scope:**
- New `Review` model (rating 1-5, text, patient, doctor, appointment)
- One review per completed appointment constraint
- Average rating displayed on doctor cards and profiles
- Review moderation (admin can flag/remove)
- Sorting doctors by rating in search results
- Review response (doctor can reply to a review)

**Tech Stack:** `djangorestframework`, MUI components

**Affected Routes:** `POST /api/v1/reviews/`, `GET /api/v1/doctors/{id}/reviews/`, `DELETE /api/v1/reviews/{id}/`

---

### 4. 🏥 Insurance Integration

**Description:** Let patients link their insurance provider and verify coverage before booking. Calculate copays automatically.

**Scope:**
- New `InsuranceProvider` model (name, coverage rules)
- New `PatientInsurance` model (patient, provider, policy number, expiry)
- Coverage verification endpoint (mock API initially)
- Copay calculation on booking page
- Insurance info displayed on appointment details
- Admin panel for managing insurance providers

**Tech Stack:** `djangorestframework`, mock external API

**Affected Routes:** `GET /api/v1/insurance/providers/`, `POST /api/v1/insurance/verify/`, `GET /api/v1/patients/{id}/insurance/`

---

## Mostafa — Frontend & Security

### 5. 💬 Real-time Chat (Doctor ↔ Patient)

**Description:** In-app messaging between doctors and patients. Secure, real-time communication around appointments.

**Scope:**
- New `Conversation` and `Message` models
- WebSocket layer via Django Channels + Redis
- Chat sidebar in dashboard (patient and doctor views)
- Online/offline status indicator
- Read receipts (double checkmarks)
- File/image sharing in chat
- Unread message badge in navigation
- Typing indicator

**Tech Stack:** `channels`, `channels-redis`, WebSocket, MUI Chat components

**Affected Routes:** WebSocket `ws/chat/{conversation_id}/`, `GET /api/v1/conversations/`, `POST /api/v1/messages/`

---

### 6. 🌙 Dark Mode

**Description:** Add a dark/light theme toggle with system preference detection and persistent user preference.

**Scope:**
- MUI dark palette (colors, shadows, backgrounds)
- Theme toggle button in navbar and settings
- `prefers-color-scheme` system detection
- Persist preference in `localStorage`
- Smooth CSS transition on theme switch
- Update all page components for dark-mode compatibility
- Dark variant for stat cards, tables, and dialogs

**Tech Stack:** MUI `ThemeProvider`, `createTheme`, CSS variables

**Affected Files:** `theme.js`, `AppLayout.jsx`, all page components

---

### 7. 📊 Analytics Dashboard (Admin)

**Description:** Rich analytics dashboard with interactive charts showing appointment trends, revenue, and doctor performance.

**Scope:**
- Appointment trends (line chart — daily/weekly/monthly)
- Revenue tracking (bar chart — by specialty, by doctor)
- Patient demographics (pie chart — age groups)
- Doctor performance (table — completed, cancelled, rating)
- Date range filter (7d, 30d, 90d, custom)
- Export to CSV/PDF
- Real-time stats (auto-refresh every 30s)
- New backend endpoints for aggregated data

**Tech Stack:** `Recharts` or `Chart.js`, `date-fns`, Django aggregation queries

**Affected Routes:** `GET /api/v1/admin/analytics/`, `GET /api/v1/admin/analytics/revenue/`, `GET /api/v1/admin/analytics/trends/`

---

### 8. 🔐 Two-Factor Authentication (2FA)

**Description:** Add an extra layer of security with TOTP-based two-factor authentication for all user roles.

**Scope:**
- Enable/disable 2FA in user settings
- QR code generation for authenticator apps (Google Authenticator, Authy)
- Backup recovery codes (10 single-use codes)
- 2FA verification step on login
- SMS fallback option (via Twilio)
- 2FA enforcement option (admin can require for all doctors)
- Session management (view active sessions, revoke)

**Tech Stack:** `pyotp`, `qrcode`, `django-otp`, Twilio SDK

**Affected Routes:** `POST /api/v1/auth/2fa/enable/`, `POST /api/v1/auth/2fa/verify/`, `POST /api/v1/auth/2fa/disable/`

---

## Abdo — Integration & Media

### 9. 📹 Video Consultation (Telemedicine)

**Description:** Built-in video calling for remote consultations. Doctors can conduct telemedicine appointments directly in the browser.

**Scope:**
- WebRTC peer-to-peer video/audio calls
- Signaling server via Django Channels or Twilio
- "Join Call" button on confirmed appointments
- Call history and duration tracking
- Screen sharing capability
- Mute/unmute audio, toggle video
- Connection quality indicator
- Post-call summary form

**Tech Stack:** `Twilio Video` or `Agora SDK`, WebSockets, WebRTC

**Affected Routes:** `POST /api/v1/calls/create/`, `POST /api/v1/calls/token/`, WebSocket signaling

---

### 10. 📁 Medical Records & Prescriptions

**Description:** Allow doctors to upload medical records and write digital prescriptions. Patients can view and download their documents.

**Scope:**
- New `MedicalRecord` model (title, file, doctor, patient, appointment)
- New `Prescription` model (medications, dosage, notes, doctor, patient)
- File upload (PDF, images) with size limits (10MB)
- Secure file storage (S3 or local media)
- PDF prescription generation (formatted template)
- Download records as ZIP archive
- Patient records timeline view
- Doctor can attach records to completed appointments

**Tech Stack:** `django-storages`, `boto3` (S3), `WeasyPrint` (PDF), file upload components

**Affected Routes:** `POST /api/v1/records/`, `GET /api/v1/patients/{id}/records/`, `POST /api/v1/prescriptions/`, `GET /api/v1/prescriptions/{id}/download/`

---

### 11. 📅 Calendar Sync (Google / Apple)

**Description:** Let patients and doctors export their appointments to external calendar apps (Google Calendar, Apple Calendar, Outlook).

**Scope:**
- Google Calendar OAuth2 integration
- iCal (.ics) file generation for Apple/Outlook
- "Add to Google Calendar" button on appointment cards
- "Download .ics" button for any appointment
- Bulk export (all upcoming appointments)
- Calendar subscription URL (auto-sync)
- Timezone-aware scheduling

**Tech Stack:** `google-api-python-client`, `icalendar` library, OAuth2 flow

**Affected Routes:** `GET /api/v1/appointments/{id}/calendar/google/`, `GET /api/v1/appointments/{id}/calendar/ics/`, `GET /api/v1/appointments/calendar/subscribe/`

---

### 12. 🌍 Multi-language Support (i18n)

**Description:** Full Arabic and English language support with RTL layout. Make the app accessible to Arabic-speaking users.

**Scope:**
- `react-i18next` integration
- Arabic (ar) and English (en) translation files
- Language switcher in navbar
- RTL layout support (MUI `ThemeProvider` + CSS)
- Persist language preference in localStorage
- Backend: translate email templates, error messages
- Arabic-friendly typography (Noto Sans Arabic)
- Date formatting in Arabic locale

**Tech Stack:** `react-i18next`, `i18next`, `i18next-browser-languagedetector`

**Affected Files:** All page components, `theme.js`, email templates, error messages

---

## Summary

| Member   | Features                                          | Focus Area            |
|----------|---------------------------------------------------|-----------------------|
| **Youssif** | Payment, Push Notifications, Reviews, Insurance | Backend & Business    |
| **Mostafa** | Chat, Dark Mode, Analytics, 2FA                 | Frontend & Security   |
| **Abdo**    | Video Calls, Records, Calendar Sync, i18n       | Integration & Media   |

### Priority Order (Suggested)

| Phase | Features | Effort |
|-------|----------|--------|
| **Phase 1** | Dark Mode, Rating & Reviews, Push Notifications | 1-2 weeks |
| **Phase 2** | Payment, Chat, Medical Records | 2-3 weeks |
| **Phase 3** | Analytics, 2FA, Calendar Sync | 2-3 weeks |
| **Phase 4** | Video Consultation, Insurance, Multi-language | 3-4 weeks |
