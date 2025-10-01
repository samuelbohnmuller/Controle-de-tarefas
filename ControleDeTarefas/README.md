# Sistema de Controle de Tarefas

Este é um sistema completo de controle de tarefas desenvolvido com:

- **Backend**: ASP.NET Core Web API com Entity Framework Core e SQLite
- **Frontend**: HTML, CSS e JavaScript vanilla
- **Banco de Dados**: SQLite

## Como Executar

### Opção 1: Script PowerShell (Recomendado)

1. Clique com botão direito no arquivo `iniciar.ps1`
2. Selecione "Executar com PowerShell"
3. Ou execute no terminal: `powershell -ExecutionPolicy Bypass -File iniciar.ps1`

O script irá:
- Parar processos anteriores automaticamente
- Limpar e compilar o projeto
- Iniciar backend e frontend em janelas separadas
- Abrir o navegador automaticamente

### Opção 2: Script Batch (Alternativo)

1. Clique duas vezes no arquivo `iniciar.bat`

### Opção 3: Execução Manual

#### Backend (Terminal 1):
```powershell
dotnet run --project Backend\ControleTarefasAPI\ControleTarefasAPI.csproj --launch-profile http
```

#### Frontend (Terminal 2):
```powershell
cd Frontend
npx http-server -p 8000 --cors
```

### URLs do Sistema

- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:5030
- **Documentação da API**: http://localhost:5030/openapi (quando executando)
- **Teste da API**: http://localhost:8000/teste-api.html

## Solução de Problemas

### Erro de Conexão Recusada (ERR_CONNECTION_REFUSED)

Se você receber o erro "ERR_CONNECTION_REFUSED", siga estes passos:

1. **Parar todos os processos**:
   ```
   taskkill /f /im dotnet.exe
   taskkill /f /im python.exe
   ```

2. **Limpar e recompilar**:
   ```
   dotnet clean
   dotnet build
   ```

3. **Iniciar manualmente**:
   - Backend: `dotnet run --project Backend\ControleTarefasAPI\ControleTarefasAPI.csproj --launch-profile http`
   - Frontend: `cd Frontend && python -m http.server 8000`

4. **Verificar se os serviços estão rodando**:
   - Acesse http://localhost:5030/api/tarefas (deve retornar JSON)
   - Acesse http://localhost:8000 (deve mostrar a interface)

### Problemas de CORS

Se houver problemas de CORS, verifique se:
- O backend está configurado para aceitar requisições do frontend
- Ambos os serviços estão rodando nas portas corretas
- Use o arquivo `teste-api.html` para diagnosticar problemas de conexão

## Funcionalidades Implementadas

### ✅ CRUD Completo
- **Criar tarefa**: Cadastro com título, descrição, data de vencimento e situação
- **Listar tarefas**: Visualização em tabela com todos os dados
- **Editar tarefa**: Edição de todas as informações da tarefa
- **Cancelar tarefa**: Cancelamento lógico (não exclusão física)

### ✅ Validações
- Título obrigatório (máximo 100 caracteres)
- Descrição opcional (máximo 500 caracteres)
- Data de vencimento obrigatória (não pode ser anterior à data atual)
- Situação obrigatória

### ✅ Filtros
- Filtro por situação (Pendente, Andamento, Encerrada, Cancelada)
- Filtro por intervalo de datas (data inicial e final)
- Combinação de filtros

### ✅ Interface
- Design baseado no layout fornecido
- Responsivo para dispositivos móveis
- Validação em tempo real
- Modal de confirmação para cancelamento
- Feedback visual para ações do usuário

### ✅ Tecnologias
- Backend: C# com ASP.NET Core
- Banco de dados: SQLite com Entity Framework Core
- Frontend: HTML5, CSS3 e JavaScript ES6
- API RESTful com CORS habilitado

## Estrutura do Projeto

```
ControleDeTarefas/
├── Backend/
│   └── ControleTarefasAPI/
│       ├── Controllers/
│       │   └── TarefasController.cs
│       ├── Data/
│       │   └── AppDbContext.cs
│       ├── Models/
│       │   └── Tarefa.cs
│       └── Program.cs
└── Frontend/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

## Endpoints da API

- `GET /api/tarefas` - Listar tarefas (com filtros opcionais)
- `GET /api/tarefas/{id}` - Obter tarefa específica
- `POST /api/tarefas` - Criar nova tarefa
- `PUT /api/tarefas/{id}` - Atualizar tarefa
- `PUT /api/tarefas/{id}/cancelar` - Cancelar tarefa

## Situações das Tarefas

1. **Pendente** - Tarefa criada, aguardando início
2. **Encerrada** - Tarefa finalizada com sucesso
3. **Andamento** - Tarefa em execução
4. **Cancelada** - Tarefa cancelada (não pode ser editada)

## Observações

- O banco de dados SQLite é criado automaticamente na primeira execução
- As validações são feitas tanto no frontend quanto no backend
- O sistema não permite exclusão física de tarefas, apenas cancelamento
- A interface é responsiva e funciona em dispositivos móveis
- Todas as datas são exibidas no formato brasileiro (dd/mm/aaaa hh:mm)