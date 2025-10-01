// Configuração da API
const API_BASE_URL = 'http://localhost:5030/api/tarefas';

// Estado da aplicação
let tarefaParaCancelar = null;

// Enum de situações
const SituacaoTarefa = {
    1: 'Pendente',
    2: 'Encerrada', 
    3: 'Andamento',
    4: 'Cancelada'
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarTarefas();
    configurarEventos();
});

// Configurar eventos
function configurarEventos() {
    document.getElementById('tarefaForm').addEventListener('submit', salvarTarefa);
    
    // Validação em tempo real
    document.getElementById('titulo').addEventListener('blur', validarTitulo);
    document.getElementById('descricao').addEventListener('blur', validarDescricao);
    document.getElementById('dataVencimento').addEventListener('blur', validarDataVencimento);
}

// Validações
function validarTitulo() {
    const titulo = document.getElementById('titulo');
    const error = document.getElementById('tituloError');
    
    if (!titulo.value.trim()) {
        error.textContent = 'O título é obrigatório';
        return false;
    } else if (titulo.value.length > 100) {
        error.textContent = 'O título deve ter no máximo 100 caracteres';
        return false;
    } else {
        error.textContent = '';
        return true;
    }
}

function validarDescricao() {
    const descricao = document.getElementById('descricao');
    const error = document.getElementById('descricaoError');
    
    if (descricao.value.length > 500) {
        error.textContent = 'A descrição deve ter no máximo 500 caracteres';
        return false;
    } else {
        error.textContent = '';
        return true;
    }
}

function validarDataVencimento() {
    const dataVencimento = document.getElementById('dataVencimento');
    const error = document.getElementById('dataVencimentoError');
    
    if (!dataVencimento.value) {
        error.textContent = 'A data de vencimento é obrigatória';
        return false;
    } else {
        const dataVenc = new Date(dataVencimento.value);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        if (dataVenc < hoje) {
            error.textContent = 'A data de vencimento não pode ser anterior a hoje';
            return false;
        } else {
            error.textContent = '';
            return true;
        }
    }
}

function validarFormulario() {
    const tituloValido = validarTitulo();
    const descricaoValida = validarDescricao();
    const dataValida = validarDataVencimento();
    
    return tituloValido && descricaoValida && dataValida;
}

// Operações CRUD
async function carregarTarefas() {
    try {
        mostrarLoading();
        
        // Construir URL com filtros
        const filtros = obterFiltros();
        const url = new URL(API_BASE_URL);
        
        if (filtros.situacao) {
            url.searchParams.append('situacao', filtros.situacao);
        }
        if (filtros.dataInicial) {
            url.searchParams.append('dataInicial', filtros.dataInicial);
        }
        if (filtros.dataFinal) {
            url.searchParams.append('dataFinal', filtros.dataFinal);
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar tarefas');
        }
        
        const tarefas = await response.json();
        renderizarTarefas(tarefas);
        
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao carregar tarefas. Verifique se o servidor está rodando.');
    } finally {
        esconderLoading();
    }
}

function obterFiltros() {
    return {
        situacao: document.getElementById('filtroSituacao').value,
        dataInicial: document.getElementById('filtroDataInicial').value,
        dataFinal: document.getElementById('filtroDataFinal').value
    };
}

async function salvarTarefa(event) {
    event.preventDefault();
    
    if (!validarFormulario()) {
        return;
    }
    
    const form = event.target;
    const formData = new FormData(form);
    const tarefaId = document.getElementById('tarefaId').value;
    
    const tarefa = {
        titulo: formData.get('titulo'),
        descricao: formData.get('descricao'),
        dataVencimento: formData.get('dataVencimento'),
        situacao: parseInt(formData.get('situacao'))
    };
    
    if (tarefaId) {
        tarefa.id = parseInt(tarefaId);
    }
    
    try {
        const url = tarefaId ? `${API_BASE_URL}/${tarefaId}` : API_BASE_URL;
        const method = tarefaId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefa)
        });
        
        if (!response.ok) {
            throw new Error('Erro ao salvar tarefa');
        }
        
        form.reset();
        document.getElementById('tarefaId').value = '';
        document.getElementById('formTitle').textContent = 'Nova Tarefa';
        document.getElementById('submitBtn').textContent = 'Cadastrar';
        
        carregarTarefas();
        mostrarSucesso(tarefaId ? 'Tarefa atualizada com sucesso!' : 'Tarefa cadastrada com sucesso!');
        
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao salvar tarefa');
    }
}

async function editarTarefa(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar tarefa');
        }
        
        const tarefa = await response.json();
        
        // Preencher formulário
        document.getElementById('tarefaId').value = tarefa.id;
        document.getElementById('titulo').value = tarefa.titulo;
        document.getElementById('descricao').value = tarefa.descricao || '';
        document.getElementById('dataVencimento').value = formatarDataParaInput(tarefa.dataVencimento);
        document.getElementById('situacao').value = tarefa.situacao;
        
        // Alterar título do formulário
        document.getElementById('formTitle').textContent = 'Editar Tarefa';
        document.getElementById('submitBtn').textContent = 'Atualizar';
        
        // Scroll para o formulário
        document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao carregar tarefa para edição');
    }
}

function solicitarCancelamento(id) {
    tarefaParaCancelar = id;
    document.getElementById('confirmModal').style.display = 'block';
}

async function confirmarCancelamento() {
    if (!tarefaParaCancelar) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/${tarefaParaCancelar}/cancelar`, {
            method: 'PUT'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao cancelar tarefa');
        }
        
        carregarTarefas();
        mostrarSucesso('Tarefa cancelada com sucesso!');
        
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao cancelar tarefa');
    } finally {
        fecharModal();
    }
}

function fecharModal() {
    document.getElementById('confirmModal').style.display = 'none';
    tarefaParaCancelar = null;
}

function cancelarEdicao() {
    document.getElementById('tarefaForm').reset();
    document.getElementById('tarefaId').value = '';
    document.getElementById('formTitle').textContent = 'Nova Tarefa';
    document.getElementById('submitBtn').textContent = 'Cadastrar';
    
    // Limpar erros
    document.querySelectorAll('.error').forEach(error => error.textContent = '');
}

function pesquisarTarefas() {
    carregarTarefas();
}

// Funções de renderização
function renderizarTarefas(tarefas) {
    const tbody = document.getElementById('tarefasTableBody');
    
    if (tarefas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Nenhuma tarefa encontrada
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = tarefas.map(tarefa => `
        <tr>
            <td>${tarefa.id}</td>
            <td title="${tarefa.descricao || ''}">${tarefa.titulo}</td>
            <td>${formatarData(tarefa.dataCriacao)}</td>
            <td>${formatarData(tarefa.dataVencimento)}</td>
            <td>
                <span class="situacao-badge situacao-${obterClasseSituacao(tarefa.situacao)}">
                    ${SituacaoTarefa[tarefa.situacao]}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    ${tarefa.situacao !== 4 ? `
                        <button class="btn-edit" onclick="editarTarefa(${tarefa.id})" title="Editar">
                            ✏️ Editar
                        </button>
                        <button class="btn-cancel" onclick="solicitarCancelamento(${tarefa.id})" title="Cancelar">
                            ❌ Cancelar
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Funções utilitárias
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatarDataParaInput(dataString) {
    const data = new Date(dataString);
    return data.toISOString().slice(0, 16);
}

function obterClasseSituacao(situacao) {
    const classes = {
        1: 'pendente',
        2: 'encerrada',
        3: 'andamento',
        4: 'cancelada'
    };
    return classes[situacao] || 'pendente';
}

function mostrarLoading() {
    const tbody = document.getElementById('tarefasTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="loading">
                Carregando tarefas...
            </td>
        </tr>
    `;
}

function esconderLoading() {
    // A função carregarTarefas já substitui o conteúdo
}

function mostrarSucesso(mensagem) {
    // Simples alert por enquanto - pode ser melhorado com toast/notification
    alert(mensagem);
}

function mostrarErro(mensagem) {
    // Simples alert por enquanto - pode ser melhorado com toast/notification
    alert(mensagem);
}

// Event listeners para o modal
document.addEventListener('click', function(event) {
    const modal = document.getElementById('confirmModal');
    if (event.target === modal) {
        fecharModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        fecharModal();
    }
});