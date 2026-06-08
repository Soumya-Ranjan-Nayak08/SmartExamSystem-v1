using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartExamSystem.Data;
using SmartExamSystem.DTOs;
using SmartExamSystem.Models;

namespace SmartExamSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExamController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Create Exam
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateExam(CreateExamDto model)
        {
            var exam = new Exam
            {
                Title = model.Title,
                Description = model.Description,
                Duration = model.Duration
            };

            _context.Exams.Add(exam);
            _context.SaveChanges();

            return Ok("Exam Created Successfully");
        }

        // Get All Exams
        [HttpGet]
        public IActionResult GetAllExams()
        {
            var exams = _context.Exams.ToList();

            return Ok(exams);
        }

        // Get Exam By Id
        [HttpGet("{id}")]
        public IActionResult GetExam(int id)
        {
            var exam = _context.Exams
                               .Include(e => e.Questions)
                               .FirstOrDefault(e => e.Id == id);

            if (exam == null)
                return NotFound("Exam Not Found");

            return Ok(exam);
        }

        // Update Exam
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateExam(int id, Exam updatedExam)
        {
            var exam = _context.Exams.Find(id);

            if (exam == null)
                return NotFound("Exam Not Found");

            exam.Title = updatedExam.Title;
            exam.Description = updatedExam.Description;
            exam.Duration = updatedExam.Duration;

            _context.SaveChanges();

            return Ok("Exam Updated Successfully");
        }

        // Delete Exam
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteExam(int id)
        {
            var exam = _context.Exams.Find(id);

            if (exam == null)
                return NotFound("Exam Not Found");

            _context.Exams.Remove(exam);
            _context.SaveChanges();

            return Ok("Exam Deleted Successfully");
        }
    }
}