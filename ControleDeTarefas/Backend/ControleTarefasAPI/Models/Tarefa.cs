using System.ComponentModel.DataAnnotations;

namespace ControleTarefasAPI.Models
{
    public class Tarefa
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "O título é obrigatório")]
        [StringLength(100, ErrorMessage = "O título deve ter no máximo 100 caracteres")]
        public string Titulo { get; set; } = string.Empty;
        
        [StringLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres")]
        public string? Descricao { get; set; }
        
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        
        [Required(ErrorMessage = "A data de vencimento é obrigatória")]
        public DateTime DataVencimento { get; set; }
        
        [Required(ErrorMessage = "A situação é obrigatória")]
        public SituacaoTarefa Situacao { get; set; } = SituacaoTarefa.Pendente;
    }
    
    public enum SituacaoTarefa
    {
        Pendente = 1,
        Encerrada = 2,
        Andamento = 3,
        Cancelada = 4
    }
}