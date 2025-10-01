@echo off
echo ====================================
echo   Sistema de Controle de Tarefas
echo ====================================
echo.
echo Iniciando o sistema...
echo.

echo 1. Parando processos anteriores...
taskkill /f /im dotnet.exe 2>nul
taskkill /f /im python.exe 2>nul

echo 2. Limpando e compilando o projeto...
dotnet clean
dotnet build

echo 3. Iniciando o Backend (API)...
start "Backend API" cmd /k "dotnet run --project Backend\ControleTarefasAPI\ControleTarefasAPI.csproj --launch-profile http"

timeout /t 5 /nobreak >nul

echo 4. Iniciando o Frontend...
start "Frontend Server" cmd /k "cd Frontend && python -m http.server 8000"

timeout /t 3 /nobreak >nul

echo 5. Abrindo o navegador...
start http://localhost:8000

echo.
echo Sistema iniciado com sucesso!
echo.
echo URLs do sistema:
echo Frontend: http://localhost:8000
echo Backend:  http://localhost:5030
echo Teste API: http://localhost:8000/teste-api.html
echo.
echo Pressione qualquer tecla para continuar...
pause >nul