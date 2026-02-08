@echo off
:: Launches a new persistent command prompt window, clears cache, and runs in TUNNEL mode
set "PATH=C:\Program Files\nodejs;%PATH%"
cd mobile-app
echo Starting Mobile App in TUNNEL MODE...
echo (This enables the app to load even if you are on a different network)
start "Automated Attendance App (Tunnel)" cmd /k "npx expo start --tunnel -c"
pause
