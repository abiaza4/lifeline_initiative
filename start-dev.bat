@echo off
taskkill /f /im node.exe 2>nul
rmdir /s /q .next 2>nul
echo Starting dev server...
npm run dev
