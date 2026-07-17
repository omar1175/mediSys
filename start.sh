#!/bin/bash
# Start Redis (if not running)
redis-server --daemonize yes 2>/dev/null || true

# Start Django backend with Daphne (ASGI for WebSockets)
cd /home/omar/ITI/Django/Project/backend
python -m daphne -p 8000 -b 0.0.0.0 config.asgi:application &

# Start frontend dev server
cd /home/omar/ITI/Django/Project/frontend
npm run dev &

echo "Project started!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
