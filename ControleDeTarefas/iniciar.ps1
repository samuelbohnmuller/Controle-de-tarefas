# Script PowerShell para iniciar o Sistema de Controle de Tarefas
Write-Host "===================================="
Write-Host "  Sistema de Controle de Tarefas"
Write-Host "===================================="
Write-Host ""

# Parar processos existentes
Write-Host "1. Parando processos anteriores..."
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Start-Sleep -Seconds 2

# Limpar e compilar
Write-Host "2. Limpando e compilando projeto..."
dotnet clean
dotnet build

# Iniciar Backend
Write-Host "3. Iniciando Backend (API)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project Backend\ControleTarefasAPI\ControleTarefasAPI.csproj --launch-profile http"

Start-Sleep -Seconds 5

# Iniciar Frontend
Write-Host "4. Iniciando Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Frontend; npx http-server -p 8000 --cors"

Start-Sleep -Seconds 3

# Abrir navegador
Write-Host "5. Abrindo navegador..."
Start-Process "http://localhost:8000"

Write-Host ""
Write-Host "Sistema iniciado com sucesso!"
Write-Host ""
Write-Host "URLs do sistema:"
Write-Host "Frontend: http://localhost:8000"
Write-Host "Backend:  http://localhost:5030"
Write-Host "Teste API: http://localhost:8000/teste-api.html"
Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null