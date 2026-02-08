@echo off
echo Starting Alternative Tunnel (Serveo)...
echo ----------------------------------------------------
echo IF THIS ASKS FOR "Are you sure you want to continue connecting", TYPE yes AND PRESS ENTER.
echo.
echo COPY THE URL THAT LOOKS LIKE: https://something.serveo.net
echo (It will be shown in green or white text)
echo ----------------------------------------------------
ssh -R 80:localhost:3000 serveo.net
pause
