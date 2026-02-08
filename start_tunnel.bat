@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
echo Starting Tunnel for Backend...
echo ----------------------------------------------------
echo YOUR BACKEND IS NOW ONLINE AT A PUBLIC URL!
echo COPY THE URL BELOW THAT LOOKS LIKE: https://some-random-name.loca.lt
echo.
echo === IMPORTANT ===
echo IF ASKED FOR A PASSWORD, YOUR TUNNEL PASSWORD IS:
echo (Wait... Fetching your IP...)
curl -s https://loca.lt/mytunnelpassword
echo.
echo COPY THE NUMBER ABOVE AND PASTE IT ON YOUR PHONE.
echo =================
echo.
call lt --port 3000
pause
