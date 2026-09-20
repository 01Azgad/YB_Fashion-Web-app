# YB Fashion - Complete Setup Guide

This guide covers all dependencies and steps to run the YB Fashion app (backend, frontend, and chat server) on another PC.

---

## System Requirements

- **OS**: Windows 10+ / macOS / Linux
- **Node.js**: v18+ (for frontend and chat-server)
- **Python**: 3.8+
- **MySQL**: 5.7+ or MariaDB
- **RAM**: Minimum 4GB

---

## Part 1: Backend Setup

### 1.1 Install Python & MySQL

- Download Python from [python.org](https://www.python.org/downloads/) (3.8+)
- Download MySQL from [mysql.com](https://www.mysql.com/downloads/) or use **XAMPP** (includes Apache, MySQL, PHP)

### 1.2 Create Virtual Environment

```bash
cd backend
python -m venv env
```

**Activate on Windows:**
```bash
env\Scripts\activate
```

**Activate on macOS/Linux:**
```bash
source env/bin/activate
```

### 1.3 Install Python Dependencies

```bash
pip install django==4.2.11
pip install djangorestframework==3.17.1
pip install django-cors-headers==4.9.0
pip install djangorestframework-simplejwt==5.5.1
pip install pillow==12.2.0
pip install pyjwt==2.12.1
pip install pymysql==1.1.2
pip install sqlparse==0.5.5
pip install asgiref==3.11.1
pip install tzdata==2025.3
```

**Or use the requirements file (if created):**
```bash
pip install -r requirements.txt
```

### 1.4 Configure Database

1. **Create MySQL Database:**
   - Open MySQL command line or phpMyAdmin
   - Create database:
   ```sql
   CREATE DATABASE yb_fashion_db;
   ```

2. **Update Backend Settings:**
   - Edit `backend/backend/settings.py`
   - Update `DATABASES` section with your MySQL credentials:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'yb_fashion_db',
           'USER': 'root',          # Your MySQL username
           'PASSWORD': '',          # Your MySQL password
           'HOST': '127.0.0.1',     # Your MySQL host
           'PORT': '3306',          # Your MySQL port
       }
   }
   ```

### 1.5 Run Migrations

```bash
cd backend
python manage.py migrate
```

### 1.6 Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 1.7 Start Backend Server

```bash
python manage.py runserver
```

Server runs at: **http://127.0.0.1:8000**

---

## Part 2: Chat Server Setup

### 2.1 Install Node.js

Download from [nodejs.org](https://nodejs.org/) (v18+)

### 2.2 Install Chat Server Dependencies

```bash
cd chat-server
npm install
```

**Dependencies:**
- `cors@^2.8.6`
- `express@^5.2.1`
- `socket.io@^4.8.3`

### 2.3 Start Chat Server

```bash
cd chat-server
npm run dev
# or
node server.js
```

Server runs at: **http://localhost:4000**

---

## Part 3: Frontend Setup

### 3.1 Install Node Dependencies

```bash
cd frontend
npm install
```

**Key Dependencies:**
- `next@16.1.6`
- `react@19.2.4`
- `tailwindcss@^4.2.0`
- `socket.io-client@^4.8.3`
- Radix UI components
- `lucide-react` (icons)
- `zod` (validation)

### 3.2 Add Videos to Public Folder

Place your hero videos in:
```
frontend/public/videos/
├── hero-1.mp4
├── hero-2.mp4
├── hero-3.mp4
└── hero-4.mp4
```

### 3.3 Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## Part 4: Running All Services

### Option A: Run in Separate Terminals

**Terminal 1 (Backend):**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 (Chat Server):**
```bash
cd chat-server
node server.js
```

**Terminal 3 (Frontend):**
```bash
cd frontend
npm run dev
```

### Option B: Create a Startup Script

**Windows (`start.bat`):**
```batch
@echo off
start "Backend" cmd /k "cd backend && python manage.py runserver"
start "Chat Server" cmd /k "cd chat-server && node server.js"
start "Frontend" cmd /k "cd frontend && npm run dev"
```

**macOS/Linux (`start.sh`):**
```bash
#!/bin/bash
cd backend && python manage.py runserver &
cd chat-server && node server.js &
cd frontend && npm run dev &
wait
```

---

## Part 5: Environment Variables & Configuration

### Backend Configuration

Edit `backend/backend/settings.py`:
- `ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'your-domain.com']`
- `DEBUG = True` (for development, set to `False` for production)
- `CORS_ALLOWED_ORIGINS` to allow frontend requests

### Frontend Configuration

The frontend connects to:
- Backend API: `http://127.0.0.1:8000`
- Chat Server: `http://localhost:4000`

Update URLs if deploying to a different server.

---

## Part 6: Production Build

### Frontend Build:
```bash
cd frontend
npm run build
npm start
```

### Backend Production:
Use a production-grade server like **Gunicorn** + **Nginx**:
```bash
pip install gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MySQL connection refused | Ensure MySQL is running; check credentials in `settings.py` |
| Port already in use (3000, 4000, 8000) | Change port or kill existing process |
| Module not found error | Ensure virtual environment is activated; reinstall dependencies |
| CORS errors | Update `CORS_ALLOWED_ORIGINS` in Django settings |
| Socket.IO connection fails | Verify chat-server is running on port 4000 |

---

## Quick Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js v18+ installed
- [ ] MySQL database created (`yb_fashion_db`)
- [ ] Backend virtual environment activated
- [ ] Django migrations run (`python manage.py migrate`)
- [ ] Frontend videos added to `public/videos/`
- [ ] All dependencies installed (`pip install -r requirements.txt`, `npm install`)
- [ ] Backend running on `http://127.0.0.1:8000`
- [ ] Chat server running on `http://localhost:4000`
- [ ] Frontend running on `http://localhost:3000`

---

## Support

For issues or questions, refer to:
- [Django Docs](https://docs.djangoproject.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Socket.IO Docs](https://socket.io/docs/)
- [Node.js Docs](https://nodejs.org/docs/)

Enjoy building! 🚀
