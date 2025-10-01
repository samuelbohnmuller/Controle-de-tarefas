using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleTarefasAPI.Data;
using ControleTarefasAPI.Models;

namespace ControleTarefasAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TarefasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TarefasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Tarefas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tarefa>>> GetTarefas(
            [FromQuery] SituacaoTarefa? situacao = null,
            [FromQuery] DateTime? dataInicial = null,
            [FromQuery] DateTime? dataFinal = null)
        {
            var query = _context.Tarefas.AsQueryable();

            if (situacao.HasValue)
            {
                query = query.Where(t => t.Situacao == situacao.Value);
            }

            if (dataInicial.HasValue)
            {
                query = query.Where(t => t.DataVencimento >= dataInicial.Value);
            }

            if (dataFinal.HasValue)
            {
                query = query.Where(t => t.DataVencimento <= dataFinal.Value);
            }

            return await query.OrderBy(t => t.DataVencimento).ToListAsync();
        }

        // GET: api/Tarefas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tarefa>> GetTarefa(int id)
        {
            var tarefa = await _context.Tarefas.FindAsync(id);

            if (tarefa == null)
            {
                return NotFound();
            }

            return tarefa;
        }

        // POST: api/Tarefas
        [HttpPost]
        public async Task<ActionResult<Tarefa>> PostTarefa(Tarefa tarefa)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            tarefa.DataCriacao = DateTime.Now;
            _context.Tarefas.Add(tarefa);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTarefa), new { id = tarefa.Id }, tarefa);
        }

        // PUT: api/Tarefas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTarefa(int id, Tarefa tarefa)
        {
            if (id != tarefa.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(tarefa).State = EntityState.Modified;
            _context.Entry(tarefa).Property(x => x.DataCriacao).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TarefaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Tarefas/5/cancelar
        [HttpPut("{id}/cancelar")]
        public async Task<IActionResult> CancelarTarefa(int id)
        {
            var tarefa = await _context.Tarefas.FindAsync(id);
            if (tarefa == null)
            {
                return NotFound();
            }

            tarefa.Situacao = SituacaoTarefa.Cancelada;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TarefaExists(int id)
        {
            return _context.Tarefas.Any(e => e.Id == id);
        }
    }
}