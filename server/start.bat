@echo off
chcp 65001 >nul
title Shenzhen Airlines AI Backend (Qwen)
echo ========================================================
echo 正在启动 深圳航空数字化实训平台 · AI 大模型后端服务...
echo 接口地址: http://127.0.0.1:5001
echo ========================================================
"C:\Users\Sihan\AppData\Local\Programs\Python\Python310\python.exe" app.py
if %errorlevel% neq 0 (
    python app.py
)
pause
