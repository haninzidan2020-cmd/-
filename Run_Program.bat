@echo off
cd /d %~dp0
echo جاري تشغيل برنامج "حافظ علي صحتك"...
:: السطر ده بيفتح المتصفح على الرابط فوراً
start http://localhost:3000
:: السطر ده بيشغل البرنامج
npm run dev
pause