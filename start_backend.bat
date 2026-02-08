@echo off
:: Launches a new persistent command prompt window
start "Automated Attendance Backend" cmd /k "set PATH=C:\Program Files\nodejs;%PATH% && cd backend && npm run dev"
