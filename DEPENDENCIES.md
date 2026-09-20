# YB Fashion - Complete Dependencies List

## Summary

To run the YB Fashion app on another PC, you need:

1. **Python 3.8+** (Backend)
2. **Node.js v18+** (Frontend + Chat Server)
3. **MySQL 5.7+** (Database)
4. All listed dependencies below

---

## Backend Dependencies (Python)

### Core Framework
- `Django==4.2.11` - Web framework
- `djangorestframework==3.17.1` - REST API framework
- `django-cors-headers==4.9.0` - CORS support for frontend requests

### Authentication & JWT
- `djangorestframework-simplejwt==5.5.1` - JWT authentication
- `PyJWT==2.12.1` - JWT encoding/decoding

### Database
- `PyMySQL==1.1.2` - MySQL database driver
- `sqlparse==0.5.5` - SQL parsing utility

### Image Processing
- `Pillow==12.2.0` - Image handling (portfolio items, uploads)

### Utilities
- `asgiref==3.11.1` - ASGI utilities for async Django
- `tzdata==2025.3` - Timezone data

### Installation
```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
```

---

## Frontend Dependencies (Node.js)

### Core
- `next@16.1.6` - React framework
- `react@19.2.4` - UI library
- `react-dom@19.2.4` - React DOM

### Styling & UI
- `tailwindcss@^4.2.0` - Utility-first CSS framework
- `postcss@^8.5` - CSS transformation
- `autoprefixer@^10.4.20` - Autoprefixer for PostCSS
- `tailwind-merge@^3.3.1` - Merge Tailwind classes
- `class-variance-authority@^0.7.1` - CSS class composition

### Component Library (Radix UI)
- `@radix-ui/react-accordion@1.2.12`
- `@radix-ui/react-alert-dialog@1.1.15`
- `@radix-ui/react-avatar@1.1.11`
- `@radix-ui/react-button` (via Radix UI)
- `@radix-ui/react-checkbox@1.3.3`
- `@radix-ui/react-collapsible@1.1.12`
- `@radix-ui/react-dialog@1.1.15`
- `@radix-ui/react-dropdown-menu@2.1.16`
- `@radix-ui/react-hover-card@1.1.15`
- `@radix-ui/react-label@2.1.8`
- `@radix-ui/react-menubar@1.1.16`
- `@radix-ui/react-navigation-menu@1.2.14`
- `@radix-ui/react-popover@1.1.15`
- `@radix-ui/react-progress@1.1.8`
- `@radix-ui/react-radio-group@1.3.8`
- `@radix-ui/react-scroll-area@1.2.10`
- `@radix-ui/react-select@2.2.6`
- `@radix-ui/react-separator@1.1.8`
- `@radix-ui/react-slider@1.3.6`
- `@radix-ui/react-slot@1.2.4`
- `@radix-ui/react-switch@1.2.6`
- `@radix-ui/react-tabs@1.1.13`
- `@radix-ui/react-toast@1.2.15`
- `@radix-ui/react-toggle@1.1.10`
- `@radix-ui/react-toggle-group@1.1.11`
- `@radix-ui/react-tooltip@1.2.8`

### Forms & Validation
- `react-hook-form@^7.54.1` - Form state management
- `@hookform/resolvers@^3.9.1` - Form validation resolvers
- `zod@^3.24.1` - Schema validation library

### Icons & Utilities
- `lucide-react@^0.564.0` - Icon library
- `clsx@^2.1.1` - Class name utility
- `cmdk@1.1.1` - Command menu component
- `vaul@^1.1.2` - Drawer component
- `sonner@^1.7.1` - Toast notifications

### Date & Time
- `date-fns@4.1.0` - Date formatting
- `react-day-picker@9.13.2` - Date picker

### Charting
- `recharts@2.15.0` - Charts & graphs

### Real-time Communication
- `socket.io-client@^4.8.3` - WebSocket client for chat

### UI Components
- `embla-carousel-react@8.6.0` - Carousel/slider
- `input-otp@1.4.2` - OTP input component
- `react-resizable-panels@^2.1.7` - Resizable panels

### Theme & Analytics
- `next-themes@^0.4.6` - Dark/light theme switching
- `@vercel/analytics@1.6.1` - Analytics integration

### Development
- `typescript@5.7.3` - TypeScript support
- `@types/node@^22` - Node types
- `@types/react@19.2.14` - React types
- `@types/react-dom@19.2.3` - React DOM types
- `eslint` (if configured) - Linting
- `@tailwindcss/postcss@^4.2.0` - Tailwind PostCSS
- `tw-animate-css@1.3.3` - Animation utilities

### Installation
```bash
cd frontend
npm install
```

---

## Chat Server Dependencies (Node.js)

### Core
- `express@^5.2.1` - Web framework
- `socket.io@^4.8.3` - Real-time communication
- `cors@^2.8.6` - CORS middleware

### Installation
```bash
cd chat-server
npm install
```

---

## Database Setup

### MySQL Database
```sql
CREATE DATABASE yb_fashion_db;
USE yb_fashion_db;
```

### Configuration
Update `backend/backend/settings.py`:
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

---

## System-Level Requirements

### Windows
- Visual C++ Build Tools (for some Python packages)
- MySQL Community Server or XAMPP

### macOS
- Xcode Command Line Tools: `xcode-select --install`
- Homebrew (optional but recommended)

### Linux
- Build tools: `sudo apt-get install build-essential python3-dev`
- MySQL server: `sudo apt-get install mysql-server`

---

## Quick Installation Script

### Windows (PowerShell)
```powershell
# Backend
cd backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate

# Chat Server (new terminal)
cd chat-server
npm install
node server.js

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### macOS/Linux (Bash)
```bash
# Backend
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python manage.py migrate

# Chat Server (new terminal)
cd chat-server
npm install
node server.js

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## Ports Used

| Service | Port | URL |
|---------|------|-----|
| Backend | 8000 | http://127.0.0.1:8000 |
| Chat Server | 4000 | http://localhost:4000 |
| Frontend | 3000 | http://localhost:3000 |
| MySQL | 3306 | localhost:3306 |

---

## Environment Variables

Create `.env.local` in frontend folder (if needed):
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_CHAT_SERVER_URL=http://localhost:4000
```

---

## File Structure for Reference

```
YB_Fashion/
├── backend/
│   ├── requirements.txt          (Python dependencies)
│   ├── manage.py
│   ├── backend/
│   ├── marketplace/
│   └── ...
├── frontend/
│   ├── package.json              (Node dependencies)
│   ├── package-lock.json
│   ├── next.config.mjs
│   ├── public/
│   │   └── videos/               (Hero videos)
│   ├── app/
│   ├── components/
│   └── ...
├── chat-server/
│   ├── package.json              (Node dependencies)
│   ├── server.js
│   └── ...
└── SETUP_GUIDE.md
```

---

## Verification Checklist

- [ ] Python 3.8+ installed: `python --version`
- [ ] Node.js 18+ installed: `node --version` and `npm --version`
- [ ] MySQL running: Can connect with MySQL client
- [ ] Backend dependencies: `pip list` shows all packages
- [ ] Frontend dependencies: `npm list` shows all packages
- [ ] Chat server dependencies: `npm list` in chat-server shows packages
- [ ] Database created: `yb_fashion_db` exists in MySQL
- [ ] Migrations run: `python manage.py showmigrations` shows all applied
- [ ] Services running:
  - Backend: `http://127.0.0.1:8000/api/` returns API
  - Chat: `http://localhost:4000` accepts connections
  - Frontend: `http://localhost:3000` loads page

---

## Support

Refer to individual project READMEs or documentation:
- Django: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- Next.js: https://nextjs.org/docs
- Express.js: https://expressjs.com/
- Socket.IO: https://socket.io/docs/
