using ControleTarefasAPI.Data;
using ControleTarefasAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleTarefasAPI.Services
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new AppDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>());

            // Verifica se já existem dados
            if (context.Tarefas.Any())
            {
                return; // Banco já tem dados
            }

            // Adiciona dados de exemplo
            context.Tarefas.AddRange(
                new Tarefa
                {
                    Titulo = "Implementar autenticação",
                    Descricao = "Adicionar sistema de login e logout ao sistema",
                    DataCriacao = DateTime.Now.AddDays(-5),
                    DataVencimento = DateTime.Now.AddDays(10),
                    Situacao = SituacaoTarefa.Andamento
                },
                new Tarefa
                {
                    Titulo = "Criar relatórios",
                    Descricao = "Desenvolver relatórios de produtividade das tarefas",
                    DataCriacao = DateTime.Now.AddDays(-3),
                    DataVencimento = DateTime.Now.AddDays(15),
                    Situacao = SituacaoTarefa.Pendente
                },
                new Tarefa
                {
                    Titulo = "Testes unitários",
                    Descricao = "Escrever testes para todas as funcionalidades",
                    DataCriacao = DateTime.Now.AddDays(-7),
                    DataVencimento = DateTime.Now.AddDays(-1),
                    Situacao = SituacaoTarefa.Encerrada
                },
                new Tarefa
                {
                    Titulo = "Deploy em produção",
                    Descricao = "Configurar ambiente de produção e fazer deploy",
                    DataCriacao = DateTime.Now.AddDays(-2),
                    DataVencimento = DateTime.Now.AddDays(5),
                    Situacao = SituacaoTarefa.Cancelada
                }
            );

            context.SaveChanges();
        }
    }
}