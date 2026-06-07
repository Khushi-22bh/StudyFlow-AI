
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
};

document.getElementById("todayDate").innerText =
    new Date().toLocaleDateString("en-IN", options);
    if(progress === 100){
    document.getElementById("progressMessage").innerText =
    "🎉 All tasks completed!";
}
else{
    document.getElementById("progressMessage").innerText =
    `${progress}% of your study plan completed`;
}
displayTasks();

function addTask() {

    const subject = document.getElementById("subject").value;
    const examDate = document.getElementById("examDate").value;
    const hours = document.getElementById("hours").value;
    const priority = document.getElementById("priority").value;

    if (!subject || !examDate || !hours) {
        alert("Please fill all fields!");
        return;
    }

    const task = {
        subject: subject,
        examDate: examDate,
        hours: Number(hours),
        priority: priority,
        completed: false
    };

    tasks.push(task);

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    document.getElementById("subject").value = "";
    document.getElementById("examDate").value = "";
    document.getElementById("hours").value = "";

    displayTasks();
}
tasks.sort((a,b)=>{

    const order = {
        High:3,
        Medium:2,
        Low:1
    };

    return order[b.priority] - order[a.priority];
});

function displayTasks() {

    const taskList =
        document.getElementById("taskList");

    const recommendations =
        document.getElementById("recommendations");

    taskList.innerHTML = "";
    recommendations.innerHTML = "";

    let totalHours = 0;
    let completedCount = 0;

    tasks.forEach(task => {
        totalHours += Number(task.hours);

        if (task.completed) {
            completedCount++;
        }
    });

    document.getElementById("subjectCount").innerText =
        tasks.length;

    document.getElementById("examCount").innerText =
        tasks.length;

    document.getElementById("totalHours").innerText =
        totalHours;

    const progress =
        tasks.length === 0
        ? 0
        : Math.round(
            (completedCount / tasks.length) * 100
        );

    document.getElementById("progressPercent").innerText =
        progress + "%";
        document.getElementById("progressFill").style.width =
progress + "%";

    tasks.forEach((task, index) => {

       taskList.innerHTML += `
<div class="task">

    <h3>${getPriorityEmoji(task.priority)} ${task.subject}</h3>

    <p><strong>Exam:</strong> ${task.examDate}</p>

    <p><strong>Hours:</strong> ${task.hours}</p>

    <p><strong>Priority:</strong> ${task.priority}</p>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:15px;">

        <label>
            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleComplete(${index})">
            Completed
        </label>

        <button
            class="delete-btn"
            onclick="deleteTask(${index})">
            Delete
        </button>

    </div>

</div>
`;

        const today = new Date();

        const exam =
            new Date(task.examDate);

        const diff =
            exam - today;

        const daysLeft =
            Math.ceil(
                diff / (1000 * 60 * 60 * 24)
            );

        const safeDays =
            Math.max(daysLeft, 1);

        const hoursPerDay =
            (task.hours / safeDays)
            .toFixed(1);

        recommendations.innerHTML += `
        <div class="${task.completed ? 'task completed' : 'task'}">

            <h3>
                ${getPriorityEmoji(task.priority)}
                ${task.subject}
            </h3>

            <p>
                ${getCountdownMessage(daysLeft)}
            </p>

            <p>
                Recommended:
                <b>${hoursPerDay} hrs/day</b>
            </p>
<p>
📅 Daily Plan:
${Math.ceil(task.hours / safeDays)}
 hr each day
</p>
            <p>
                ${getUrgency(
                    task.hours,
                    safeDays
                )}
            </p>

        </div>
        `;
    });
}

function deleteTask(index) {

    tasks.splice(index, 1);

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    displayTasks();
}

function toggleComplete(index) {

    tasks[index].completed =
        !tasks[index].completed;

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    displayTasks();
}

function getPriorityEmoji(priority) {

    if (priority === "High") {
        return "🔴";
    }

    if (priority === "Medium") {
        return "🟡";
    }

    return "🟢";
}

function getCountdownMessage(daysLeft) {

    if (daysLeft < 0) {
        return "❌ Exam Passed";
    }

    if (daysLeft === 0) {
        return "🚨 Exam Today";
    }

    if (daysLeft === 1) {
        return "⚠️ Exam Tomorrow";
    }

    if (daysLeft <= 3) {
        return `🔥 Exam in ${daysLeft} Days`;
    }

    return `📅 ${daysLeft} Days Left`;
}

function getUrgency(hours, daysLeft) {

    const score = hours / daysLeft;

    if (score >= 4) {
        return "🚨 Critical";
    }

    if (score >= 2) {
        return "🔥 High";
    }

    return "📖 Normal";
}
function toggleTheme(){
    document.body.classList.toggle("dark");
}
function exportPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("StudyFlow AI", 20, 20);
    doc.text(
    `Generated on: ${new Date().toLocaleDateString()}`,
    20,
    40
);

    doc.setFontSize(12);
    doc.text("Personalized Study Plan", 20, 30);

    let y = 60;

    tasks.forEach((task, index) => {

        const today = new Date();
        const examDate = new Date(task.examDate);

        const daysLeft = Math.ceil(
            (examDate - today) /
            (1000 * 60 * 60 * 24)
        );

        const safeDays = Math.max(daysLeft, 1);

        const hoursPerDay =
            (task.hours / safeDays).toFixed(1);

        doc.setFontSize(14);
        doc.text(
            `${index + 1}. ${task.subject}`,
            20,
            y
        );

        y += 10;

        doc.setFontSize(11);

        doc.text(
            `Exam Date: ${task.examDate}`,
            25,
            y
        );

        y += 8;

        doc.text(
            `Hours Needed: ${task.hours}`,
            25,
            y
        );

        y += 8;

        doc.text(
            `Priority: ${task.priority}`,
            25,
            y
        );

        y += 8;

        doc.text(
            `Days Left: ${daysLeft > 0 ? daysLeft : 0}`,
            25,
            y
        );

        y += 8;

        doc.text(
            `Recommended Study Time: ${hoursPerDay} hrs/day`,
            25,
            y
        );

        y += 15;

        if (y > 260) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save("StudyFlow-Plan.pdf");
}