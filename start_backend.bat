@echo off
echo ========================================================
echo Starting A8Fusion Django Backend (MySQL 8.0 on Port 3306)
echo ========================================================
cd backend
python manage.py runserver 127.0.0.1:8000
pause

