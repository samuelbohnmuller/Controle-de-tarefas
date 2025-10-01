using Microsoft.EntityFrameworkCore;
using ControleTarefasAPI.Models;

namespace ControleTarefasAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        
        public DbSet<Tarefa> Tarefas { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tarefa>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Titulo).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Descricao).HasMaxLength(500);
                entity.Property(e => e.DataCriacao).IsRequired();
                entity.Property(e => e.DataVencimento).IsRequired();
                entity.Property(e => e.Situacao).IsRequired();
            });
            
            base.OnModelCreating(modelBuilder);
        }
    }
}