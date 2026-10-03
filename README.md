# Unfazed — Therapist Management Platform

> A full-stack therapist management platform designed to help mental-health professionals manage clients, appointments, therapy sessions, notes, packages, payments, invoices, and practice analytics from a centralized dashboard.

## Overview

**Unfazed** is a full-stack web application built to simplify the administrative side of running a therapy practice.

The platform provides therapists with a centralized workspace where they can manage their clients, create and manage therapy packages, configure availability, schedule appointments, communicate through chat, record session notes, process payments, generate invoices, and monitor practice-level analytics.

The application follows a client-server architecture with a React-based frontend and a Node.js/Express backend connected to MongoDB.

## Features

### Therapist Authentication

* Therapist registration and login
* Password hashing with `bcryptjs`
* JWT-based authentication
* Protected therapist routes
* Therapist profile management
* Public therapist profiles using unique slugs

### Dashboard

The therapist dashboard provides an overview of practice activity and important information in one place.

It includes areas for:

* Client management
* Upcoming bookings
* Practice analytics
* Payments
* Packages
* Availability
* Session notes

### Client Management

Therapists can manage their clients from a dedicated client management interface.

Features include:

* Add new clients
* View client lists
* View individual client profiles
* Store client contact information
* Record therapy intake information
* Store therapy goals and reasons for seeking therapy
* Track previous therapy information
* Record client consent

### Appointment & Booking Management

Unfazed provides functionality for managing therapy appointments.

The booking system supports:

* Appointment creation
* Date and time selection
* Session duration
* Timezone information
* Prevention of past-date bookings
* Prevention of duplicate bookings
* Booking status tracking
* Booking confirmation notifications

### Availability Management

Therapists can configure their availability so that appointment scheduling can be organized around their working hours.

### Real-Time Chat

The application includes real-time communication functionality powered by **Socket.IO**.

This provides the foundation for real-time therapist-client communication without requiring the application to continuously refresh the page.

### Session Notes

Therapists can maintain session-related notes for their clients.

This provides a dedicated space for recording information associated with therapy sessions and keeping client records organized.

### Therapy Packages

Therapists can create therapy packages containing:

* Package name
* Number of sessions
* Price per session
* Total package price
* Package validity period

The application also includes subscription/entitlement logic for controlling certain platform limits.

### Online Payments

Unfazed integrates **Razorpay** for payment processing.

The payment workflow includes:

1. Creating a Razorpay order
2. Recording the payment in MongoDB
3. Opening Razorpay Checkout
4. Receiving the payment response
5. Verifying the Razorpay signature on the backend
6. Updating the payment status
7. Sending payment confirmation
8. Providing invoice access

The backend also calculates platform fees and net amounts for recorded payments.

### Invoices

Successful payments can be associated with generated invoices.

The backend uses **PDFKit** to support PDF invoice generation.

### Analytics

The platform includes an analytics section for monitoring therapist/practice activity.

Analytics functionality is implemented through dedicated backend controllers and frontend dashboard views.

### Notifications

The backend includes a notification service for events such as:

* Booking confirmations
* Payment confirmations

Email functionality is supported through **Nodemailer**.

## Tech Stack

### Frontend

* React
* Vite
* JavaScript / JSX
* CSS
* Fetch API
* Socket.IO client functionality
* Razorpay Checkout integration

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Socket.IO
* Nodemailer
* Razorpay
* PDFKit
* Multer
* Express Validator
* CORS
* dotenv

## Architecture

```text
Unfazed
│
├── unfazed-frontend
│   ├── src
│   │   ├── layouts
│   │   ├── pages
│   │   ├── assets
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── unfazed-backend
    ├── config
    ├── controllers
    ├── middleware
    ├── models
    ├── routes
    ├── scripts
    ├── services
    ├── sockets
    ├── app.js
    ├── server.js
    └── package.json
```

## Backend Structure

The backend follows a modular structure separating responsibilities between controllers, models, routes, middleware, services, and real-time communication.

### Controllers

The project contains dedicated controllers for:

* Therapist authentication and profiles
* Clients
* Bookings
* Availability
* Payments
* Packages
* Invoices
* Session notes
* Analytics

### Models

MongoDB/Mongoose models are used for entities including:

* Therapist
* Client
* Booking
* Availability
* Payment
* Package
* Session Note
* Subscription Tier Configuration

### Routes

API routes are separated by feature:

```text
/api/therapists
/api/clients
/api/bookings
/api/availability
/api/payments
/api/packages
/api/invoices
/api/notes
/api/analytics
/api/webhooks
```

### Authentication

Protected requests use JWT authentication.

The authentication middleware extracts the bearer token from the request and uses it to identify the authenticated therapist.

## Frontend Pages

The React frontend contains dedicated views for:

* Login
* Signup
* Dashboard
* Clients
* Client Profile
* Booking
* Availability
* Chat
* Notes
* Packages
* Payments
* Analytics
* Therapist Profile
* Public Therapist Profile

## Database

The application uses **MongoDB** with **Mongoose** as the object data modeling layer.

The backend establishes the database connection before starting the HTTP server.

## Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

> Never commit your real `.env` file, database credentials, JWT secrets, Razorpay secrets, or email credentials to GitHub.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/anshikarair20-design/Unfazed__Therapist.git
```

```bash
cd Unfazed__Therapist
```

### 2. Set up the backend

```bash
cd unfazed/unfazed-backend
```

Install dependencies:

```bash
npm install
```

Create the `.env` file and configure the required environment variables.

Start the backend:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Set up the frontend

Open another terminal:

```bash
cd unfazed/unfazed-frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at the URL provided by Vite, typically:

```text
http://localhost:5173
```

## Payment Flow

The payment system uses Razorpay.

The general flow is:

```text
Therapist
    │
    ▼
Create Payment
    │
    ▼
Backend creates Razorpay Order
    │
    ▼
Razorpay Checkout
    │
    ▼
Payment Completed
    │
    ▼
Backend Signature Verification
    │
    ▼
Payment marked Successful
    │
    ▼
Invoice / Payment History
```

## Real-Time Communication

The backend creates a Socket.IO server alongside the Express HTTP server.

```text
React Frontend
       │
       │ Socket.IO
       ▼
Node.js Server
       │
       ▼
Chat Socket
```

This enables real-time communication functionality within the application.

## Security Considerations

The project implements several security-related mechanisms:

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Backend payment signature verification
* Therapist-specific data access
* Environment-based configuration for sensitive credentials
* Input validation through Express Validator

For production deployment, additional security hardening should be applied, including stricter CORS configuration, secure cookies/token handling where appropriate, rate limiting, production secret management, HTTPS, logging, and stronger validation policies.

## Current Development Status

Unfazed is an actively developed full-stack application containing the core functionality required for therapist practice management.

The repository currently contains both frontend and backend implementations and can be extended with additional production features, UI refinement, testing, deployment configuration, and security hardening.

## Future Enhancements

Potential future improvements include:

* Video therapy sessions
* Automated appointment reminders
* Calendar synchronization
* Advanced therapist analytics
* Client self-service portal
* Automated recurring payments
* Improved notification preferences
* File/document management
* Enhanced role-based access control
* Automated testing
* Production deployment configuration
* Improved responsive/mobile experience

## Disclaimer

Unfazed is a software project intended to support the administrative and organizational workflow of therapists.

It is **not a replacement for professional medical or psychological care**, and software functionality should not be interpreted as medical advice, diagnosis, or treatment.

When handling real client information, appropriate privacy, security, consent, data-protection, and regulatory requirements must be considered before using the application in a production healthcare environment.

## Project Structure

```text
Unfazed__Therapist/
│
└── unfazed/
    │
    ├── unfazed-frontend/
    │   ├── public/
    │   ├── src/
    │   │   ├── assets/
    │   │   ├── layouts/
    │   │   └── pages/
    │   │
    │   ├── package.json
    │   └── vite.config.js
    │
    └── unfazed-backend/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        ├── scripts/
        ├── services/
        ├── sockets/
        ├── app.js
        ├── server.js
        └── package.json
```

## Author

Developed as a full-stack web application project for therapist practice management.

---

**Built with React, Node.js, Express, MongoDB, Socket.IO and Razorpay.**
