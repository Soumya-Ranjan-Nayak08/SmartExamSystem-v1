namespace SmartExamSystem.DTOs
{
    public class SubmitExamDto
    {
        public int UserId { get; set; }

        public int ExamId { get; set; }

        public List<AnswerDto> Answers { get; set; }
    }
}