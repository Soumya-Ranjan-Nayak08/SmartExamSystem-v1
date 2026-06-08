using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartExamSystem.Data;
using SmartExamSystem.Models;

namespace SmartExamSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Add Question
        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddQuestion(Question question)
        {
            _context.Questions.Add(question);
            _context.SaveChanges();

            return Ok("Question Added Successfully");
        }

        // Get All Questions
        [HttpGet]
        public IActionResult GetQuestions()
        {
            var questions = _context.Questions.ToList();

            return Ok(questions);
        }

        // Get Question By Id
        [HttpGet("{id}")]
        public IActionResult GetQuestion(int id)
        {
            var question = _context.Questions.Find(id);

            if (question == null)
                return NotFound("Question Not Found");

            return Ok(question);
        }

        // Get Questions By Exam Id
        [HttpGet("exam/{examId}")]
        public IActionResult GetQuestionsByExam(int examId)
        {
            var questions = _context.Questions
                .Where(q => q.ExamId == examId)
                .OrderBy(q => Guid.NewGuid())
                .ToList();

            return Ok(questions);
        }

        // Update Question
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateQuestion(int id, Question updatedQuestion)
        {
            var question = _context.Questions.Find(id);

            if (question == null)
                return NotFound("Question Not Found");

            question.QuestionText = updatedQuestion.QuestionText;
            question.OptionA = updatedQuestion.OptionA;
            question.OptionB = updatedQuestion.OptionB;
            question.OptionC = updatedQuestion.OptionC;
            question.OptionD = updatedQuestion.OptionD;
            question.CorrectAnswer = updatedQuestion.CorrectAnswer;
            question.ExamId = updatedQuestion.ExamId;

            _context.SaveChanges();

            return Ok("Question Updated Successfully");
        }

        // Delete Question
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteQuestion(int id)
        {
            var question = _context.Questions.Find(id);

            if (question == null)
                return NotFound("Question Not Found");

            _context.Questions.Remove(question);
            _context.SaveChanges();

            return Ok("Question Deleted Successfully");
        }
    }
}