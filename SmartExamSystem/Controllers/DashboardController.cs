using Microsoft.AspNetCore.Mvc;
using SmartExamSystem.Data;

namespace SmartExamSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            var totalStudents = _context.Users.Count(x => x.Role == "Student");
            var totalExams = _context.Exams.Count();
            var totalQuestions = _context.Questions.Count();
            var totalResults = _context.Results.Count();

            return Ok(new
            {
                TotalStudents = totalStudents,
                TotalExams = totalExams,
                TotalQuestions = totalQuestions,
                TotalResults = totalResults
            });
        }
    }
}