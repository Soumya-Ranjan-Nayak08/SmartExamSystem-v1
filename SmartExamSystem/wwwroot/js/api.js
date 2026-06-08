const API_URL = "https://localhost:7121/api";

// ================= REGISTER =================

async function register() {

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("regEmail").value;

    const password =
        document.getElementById("regPassword").value;

    const role =
        document.getElementById("role").value;

    try {

        const response =
            await fetch(
                `${API_URL}/Auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        role
                    })
                });

        const result =
            await response.text();

        if (response.ok) {

            alert("Registration Successful");

            window.location.href =
                "login.html";
        }
        else {

            alert(result);
        }
    }
    catch (error) {

        console.error(error);

        alert("Registration Failed");
    }
}

// ================= LOGIN =================

async function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        const response =
            await fetch(
                `${API_URL}/Auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                });

        if (!response.ok) {

            alert("Invalid Credentials");

            return;
        }

        const data =
            await response.json();

        localStorage.setItem(
            "token",
            data.token
        );

        const payload =
            JSON.parse(
                atob(
                    data.token.split('.')[1]
                )
            );

        const role =
            payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];

        const userId =
            payload["UserId"];

        localStorage.setItem(
            "role",
            role
        );

        localStorage.setItem(
            "userId",
            userId
        );

        if (role === "Admin") {

            window.location.href =
                "admin.html";
        }
        else {

            window.location.href =
                "dashboard.html";
        }
    }
    catch (error) {

        console.error(error);

        alert("Cannot Connect To API");
    }
}

// ================= LOGOUT =================

function logout() {

    localStorage.clear();

    window.location.href =
        "login.html";
}

// ================= STUDENT CHECK =================

function checkStudent() {

    const role =
        localStorage.getItem("role");

    if (role !== "Student") {

        alert("Access Denied");

        window.location.href =
            "login.html";
    }
}

// ================= LOAD EXAMS =================

async function loadExams() {

    try {

        const response =
            await fetch(
                `${API_URL}/Exam`
            );

        const exams =
            await response.json();

        let html = "";

        exams.forEach(exam => {

            html += `
            <div class="card shadow p-3 mb-3">

                <h3>${exam.title}</h3>

                <p>${exam.description}</p>

                <p>
                    Duration:
                    ${exam.duration} Minutes
                </p>

                <button
                    class="btn btn-primary"
                    onclick="startExam(${exam.id})">

                    Start Exam

                </button>

            </div>
            `;
        });

        document.getElementById(
            "examList"
        ).innerHTML = html;
    }
    catch (error) {

        console.error(error);
    }
}

// ================= START EXAM =================

function startExam(examId) {

    localStorage.setItem(
        "examId",
        examId
    );

    window.location.href =
        "exam.html";
}

// ================= LOAD QUESTIONS =================

async function loadQuestions() {

    const examId =
        localStorage.getItem(
            "examId"
        );

    try {

        const response =
            await fetch(
                `${API_URL}/Question/exam/${examId}`
            );

        const questions =
            await response.json();

        let html = "";

        questions.forEach(q => {

            html += `
            <div class="card shadow p-3 mb-3">

                <h5>
                    ${q.questionText}
                </h5>

                <label>
                    <input
                        type="radio"
                        name="${q.id}"
                        value="${q.optionA}">
                    ${q.optionA}
                </label>

                <br>

                <label>
                    <input
                        type="radio"
                        name="${q.id}"
                        value="${q.optionB}">
                    ${q.optionB}
                </label>

                <br>

                <label>
                    <input
                        type="radio"
                        name="${q.id}"
                        value="${q.optionC}">
                    ${q.optionC}
                </label>

                <br>

                <label>
                    <input
                        type="radio"
                        name="${q.id}"
                        value="${q.optionD}">
                    ${q.optionD}
                </label>

            </div>
            `;
        });

        document.getElementById(
            "questions"
        ).innerHTML = html;
    }
    catch (error) {

        console.error(error);
    }
}

// ================= SUBMIT EXAM =================

async function submitExam() {

    const examId =
        parseInt(
            localStorage.getItem(
                "examId"
            )
        );

    const userId =
        parseInt(
            localStorage.getItem(
                "userId"
            )
        );

    const token =
        localStorage.getItem(
            "token"
        );

    const answers = [];

    document
        .querySelectorAll(
            "input[type='radio']:checked"
        )
        .forEach(option => {

            answers.push({

                questionId:
                    parseInt(option.name),

                selectedOption:
                    option.value
            });
        });

    try {

        const response =
            await fetch(
                `${API_URL}/Result/submit`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({

                        userId,
                        examId,
                        answers
                    })
                });

        const result =
            await response.json();

        localStorage.setItem(
            "score",
            result.score
        );

        localStorage.setItem(
            "percentage",
            result.percentage
        );

        localStorage.setItem(
            "status",
            result.status
        );

        window.location.href =
            "result.html";
    }
    catch (error) {

        console.error(error);

        alert(
            "Failed To Submit Exam"
        );
    }
}

// ================= RESULT PAGE =================

function loadResult() {

    document.getElementById(
        "score"
    ).innerHTML = `

        <div class="card shadow p-4 text-center">

            <h2>
                Score:
                ${localStorage.getItem("score")}
            </h2>

            <h3>
                Percentage:
                ${localStorage.getItem("percentage")}%
            </h3>

            <h3>
                Status:
                ${localStorage.getItem("status")}
            </h3>

        </div>
    `;
}

// ================= TIMER =================

let timerInterval;

async function startTimer() {

    const examId =
        localStorage.getItem(
            "examId"
        );

    const response =
        await fetch(
            `${API_URL}/Exam/${examId}`
        );

    const exam =
        await response.json();

    let minutes =
        exam.duration;

    let seconds = 0;

    timerInterval =
        setInterval(() => {

            if (
                minutes === 0 &&
                seconds === 0
            ) {

                clearInterval(
                    timerInterval
                );

                alert(
                    "Time Up!"
                );

                submitExam();

                return;
            }

            if (seconds === 0) {

                minutes--;
                seconds = 59;
            }
            else {

                seconds--;
            }

            document
                .getElementById("timer")
                .innerText =
                `${minutes}:${seconds
                    .toString()
                    .padStart(2, '0')}`;

        }, 1000);
}