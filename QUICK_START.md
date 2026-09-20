# YB Fashion - Quick Start Checklist

## Pre-Installation (Do Once)

### 1. Install System Tools
- [ ] Python 3.8+ from python.org
- [ ] Node.js v18+ from nodejs.org
- [ ] MySQL 5.7+ (or XAMPP for Windows)
- [ ] Git (optional)

### 2. Clone/Copy Project
```bash
cd your-workspace
# Copy the YB_Fashion folder here
```

---

## Backend Setup (5 minutes)

```bash
cd backend

# Create virtual environment
python -m venv env

# Activate (choose one based on your OS)
env\Scripts\activate              # Windows
source env/bin/activate           # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

**Expected Output:** `Starting development server at http://127.0.0.1:8000/`

---

## Chat Server Setup (2 minutes)

```bash
cd chat-server

# Install dependencies
npm install

# Start server
node server.js
```

**Expected Output:** `Socket.io server running on port 4000`

---

## Frontend Setup (5 minutes)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Expected Output:** `✓ Ready in X.X s at http://localhost:3000`

---

## Running All Services

**Open 3 terminals and run:**

| Terminal 1 | Terminal 2 | Terminal 3 |
|-----------|-----------|-----------|
| `cd backend` | `cd chat-server` | `cd frontend` |
| `python manage.py runserver` | `node server.js` | `npm run dev` |
| **http://127.0.0.1:8000** | **http://localhost:4000** | **http://localhost:3000** |

---

## Database Setup (One-Time)

1. **Open MySQL:**
   - XAMPP: Click "Admin" next to MySQL
   - Or: `mysql -u root`

2. **Create Database:**
   ```sql
   CREATE DATABASE yb_fashion_db;
   ```

3. **Verify in Django settings** (`backend/backend/settings.py`):
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'yb_fashion_db',
           'USER': 'root',
           'PASSWORD': '',
           'HOST': '127.0.0.1',
           'PORT': '3306',
       }
   }
   ```

4. **Run Migrations:**
   ```bash
   cd backend
   python manage.py migrate
   ```

---

## Dependencies Summary

### Backend (Python)
- Django 4.2.11
- djangorestframework 3.17.1
- django-cors-headers 4.9.0
- djangorestframework-simplejwt 5.5.1
- PyMySQL 1.1.2
- Pillow 12.2.0
- + 4 more (see requirements.txt)

### Frontend (Node)
- Next.js 16.1.6
- React 19.2.4
- Tailwind CSS 4.2.0
- Socket.io-client 4.8.3
- Radix UI components
- + 50+ more (see package.json)

### Chat Server (Node)
- Express 5.2.1
- Socket.io 4.8.3
- CORS 2.8.6

---

## Ports Used

| Service | Port | Purpose |
|---------|------|---------|
| Backend API | 8000 | Django REST API |
| Chat Server | 4000 | WebSocket for real-time chat |
| Frontend | 3000 | Next.js dev server |
| MySQL | 3306 | Database |

---

## Troubleshooting

### Python: "Module not found"
```bash
# Make sure virtual env is activated, then:
pip install -r requirements.txt
```

### Node: "Port already in use"
```bash
# Kill process on port (example: port 3000)
# Windows:
taskkill /F /IM node.exe
# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### MySQL: "Connection refused"
- Ensure MySQL is running (XAMPP → Start MySQL)
- Verify credentials in settings.py
- Check that database `yb_fashion_db` exists

### Frontend: "Cannot connect to backend"
- Verify backend is running on http://127.0.0.1:8000
- Check CORS settings in Django if needed

### Chat: "Socket connection failed"
- Ensure chat-server is running on port 4000
- Check firewall settings

---

## Useful Commands

### Backend
```bash
# Create superuser
python manage.py createsuperuser

# Run migrations
python manage.py migrate

# Create new app
python manage.py startapp appname

# Admin panel
http://127.0.0.1:8000/admin
```

### Frontend
```bash
# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Chat Server
```bash
# Install packages
npm install

# Run
node server.js
```

---

## Next Steps

1. ✅ Install system dependencies
2. ✅ Set up database
3. ✅ Install backend, chat server, frontend
4. ✅ Run all services
5. ✅ Visit http://localhost:3000
6. ✅ Test login/signup
7. ✅ Test chat functionality

---

## Additional Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **DEPENDENCIES.md** - Complete dependencies list
- **backend/requirements.txt** - Python packages
- **frontend/package.json** - Node packages
- **chat-server/package.json** - Chat server packages

---

## Important Files

```
YB_Fashion/
├── backend/backend/settings.py          (Database config here)
├── backend/requirements.txt              (Python deps)
├── frontend/package.json                 (Node deps)
├── frontend/public/videos/               (Place hero videos here)
├── chat-server/server.js                 (Chat server)
├── SETUP_GUIDE.md                        (Full guide)
└── DEPENDENCIES.md                       (All dependencies)
```

---

## Final Checklist

- [ ] All services running
- [ ] Can access http://localhost:3000
- [ ] Backend API responding at http://127.0.0.1:8000
- [ ] Can log in/sign up
- [ ] Chat works between users
- [ ] Videos show on homepage

**You're ready to go! 🚀**
