@echo off
echo Starting Ngrok Tunnel for Backend (Port 3000)...
echo ------------------------------------------------
echo If it asks for a token, you need to go to dashboard.ngrok.com, login, and copy your authtoken.
echo Then run: ngrok config add-authtoken <TOKEN>
echo ------------------------------------------------
echo.
echo LOOK FOR THE URL THAT LOOKS LIKE: https://random-name.ngrok-free.app
echo COPY THAT URL AND SEND IT TO THE CHAT.
echo.
PowerShell -NoProfile -ExecutionPolicy Bypass -Command "ngrok http 3000"
pause
