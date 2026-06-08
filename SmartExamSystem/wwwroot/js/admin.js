const API_URL = "https://localhost:7121/api";

// ================= ADMIN CHECK =================

window.onload = function () {

    const role = localStorage.getItem("role");

    if (role !== "Admin") {

        alert("Access Denied");

        window.location.href = "login.html";

        return;
    }

    loadExams();
};

// ================= SECTION NAVIGATION =================

function showSection(id) {

    document.querySelectorAll(".section")
        .forEach(section => {
            section.classList.add("hidden");
        });

    document.getElementById(id)
        .classList.remove("hidden");
}

// ================= CREATE EXAM =================

async function createExam() {

    const token = localStorage.getItem("token");

    try {

        const response =
            await fetch(`${API_URL}/Exam`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify({

                    title:
                        document.getElementById("title").value,

                    description:
                        document.getElementById("description").value,

                    duration:
                        parseInt(
                            document.getElementById("duration").value
                        )
                })
            });

        const result =
            await response.text();

        alert(result);

        loadExams();

    }
    catch (error) {

        console.error(error);

        alert("Failed To Create Exam");
    }
}

// ================= ADD QUESTION =================

async function addQuestion() {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                `${API_URL}/Question/add`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({

                        questionText:
                            document.getElementById("questionText").value,

                        optionA:
                            document.getElementById("optionA").value,

                        optionB:
                            document.getElementById("optionB").value,

                        optionC:
                            document.getElementById("optionC").value,

                        optionD:
                            document.getElementById("optionD").value,

                        correctAnswer:
                            document.getElementById("correctAnswer").value,

                        examId:
                            parseInt(
                                document.getElementById("examId").value
                            )
                    })
                });

        const result =
            await response.text();

        alert(result);

    }
    catch (error) {

        console.error(error);

        alert("Failed To Add Question");
    }
}

// ================= LOAD EXAMS =================

async function loadExams() {

    try {

        const response =
            await fetch(`${API_URL}/Exam`);

        const exams =
            await response.json();

        document.getElementById("examCount")
            .innerText = exams.length;

        let html = "";

        exams.forEach(exam => {

            html += `
            <div class="card shadow-sm p-3 mb-3">

                <h4>${exam.title}</h4>

                <p>${exam.description}</p>

                <p>
                    Duration:
                    ${exam.duration} Minutes
                </p>

                <button
                    class="btn btn-danger"
                    onclick="deleteExam(${exam.id})">

                    Delete

                </button>

            </div>
            `;
        });

        document.getElementById("examList")
            .innerHTML = html;
    }
    catch (error) {

        console.error(error);
    }
}

// ================= DELETE EXAM =================

async function deleteExam(id) {

    const token =
        localStorage.getItem("token");

    if (!confirm("Delete this exam?"))
        return;

    try {

        const response =
            await fetch(
                `${API_URL}/Exam/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                });

        alert(await response.text());

        loadExams();

    }
    catch (error) {

        console.error(error);

        alert("Delete Failed");
    }
}

// ================= LOGOUT =================

function logout() {

    localStorage.clear();

    window.location.href =
        "login.html";
}