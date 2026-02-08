@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd mobile-app
echo Fixing dependencies to match Expo SDK version...
call npx expo install --fix
echo.
echo Dependencies fixed! You can now close this window and run start_mobile.bat again.
pause
