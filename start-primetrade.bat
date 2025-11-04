@echo off
echo Starting Primetrade.ai Application...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd /d %~dp0 && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ✅ Both servers are starting!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo 📚 API Docs: http://localhost:5000/api-docs
echo.
pause