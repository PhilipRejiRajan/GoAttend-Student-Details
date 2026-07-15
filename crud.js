
const STORAGE_KEY = "goattendStudents";

const openAddModalBtn = document.getElementById("open-add-modal-nav");
const addModal = document.getElementById("add-modal");
const addForm = document.getElementById("add-student-form");
const cancelAddBtn = document.getElementById("cancel-add-modal");
const addFormError = document.getElementById("add-form-error");

const viewModal = document.getElementById("view-modal");
const closeViewBtn = document.getElementById("close-view-modal");

const tableBody = document.getElementById("student-table-body");
const studentTable = document.getElementById("student-table");
const emptyState = document.getElementById("empty-state");

const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-student-form");
const editFormError = document.getElementById("edit-form-error");
const cancelEditBtn = document.getElementById("cancel-edit-modal");
const openEditBtn = document.getElementById("open-edit-modal");

let currentViewId = null;

function getStudents() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data === null) {
        return [];
    }
    return JSON.parse(data);
}

function saveStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function renderTable() {
    const students = getStudents();

    tableBody.innerHTML = "";

    if (students.length === 0) {
        emptyState.style.display = "block";
        studentTable.style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    studentTable.style.display = "table";

    students.forEach(function (student) {
        const row = document.createElement("tr");
        row.setAttribute("data-id", student.id);

        row.innerHTML =
            "<td>" + student.name + "</td>" +
            "<td>" + student.email + "</td>" +
            "<td>" + student.programme + "</td>" +
            "<td><button class=\"btn-delete\" data-id=\"" + student.id + "\">Delete</button></td>";

        tableBody.appendChild(row);
    });
}

openAddModalBtn.addEventListener("click", function () {
    addForm.reset();
    addFormError.textContent = "";
    addModal.showModal();
});

cancelAddBtn.addEventListener("click", function () {
    addModal.close();
});

addForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("input-name").value.trim();
    const email = document.getElementById("input-email").value.trim();
    const phone = document.getElementById("input-phone").value.trim();
    const dob = document.getElementById("input-dob").value;
    const department = document.getElementById("input-department").value;
    const programme = document.getElementById("input-programme").value;

    if (name === "" || email === "" || phone === "" || dob === "" || department === "" || programme === "") {
        addFormError.textContent = "Please fill in every field.";
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        addFormError.textContent = "Phone number must be exactly 10 digits.";
        return;
    }

    const newStudent = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        department: department,
        programme: programme
    };

    const students = getStudents();
    students.push(newStudent);
    saveStudents(students);

    renderTable();
    addModal.close();
});

function openViewModal(student) {
    currentViewId = student.id;

    document.getElementById("view-name").textContent = student.name;
    document.getElementById("view-email").textContent = student.email;
    document.getElementById("view-phone").textContent = student.phone;
    document.getElementById("view-dob").textContent = student.dob;
    document.getElementById("view-department").textContent = student.department;
    document.getElementById("view-programme").textContent = student.programme;

    viewModal.showModal();
}

closeViewBtn.addEventListener("click", function () {
    viewModal.close();
});

openEditBtn.addEventListener("click", function () {
    const students = getStudents();
    const student = students.find(function (s) {
        return s.id === currentViewId;
    });
    if (!student) {
        return;
    }

    // Pre-fill the edit form with this student's current details
    document.getElementById("edit-id").value = student.id;
    document.getElementById("edit-name").value = student.name;
    document.getElementById("edit-email").value = student.email;
    document.getElementById("edit-phone").value = student.phone;
    document.getElementById("edit-dob").value = student.dob;
    document.getElementById("edit-department").value = student.department;
    document.getElementById("edit-programme").value = student.programme;

    editFormError.textContent = "";
    viewModal.close();
    editModal.showModal();
});

cancelEditBtn.addEventListener("click", function () {
    editModal.close();
});

editForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = Number(document.getElementById("edit-id").value);
    const name = document.getElementById("edit-name").value.trim();
    const email = document.getElementById("edit-email").value.trim();
    const phone = document.getElementById("edit-phone").value.trim();
    const dob = document.getElementById("edit-dob").value;
    const department = document.getElementById("edit-department").value;
    const programme = document.getElementById("edit-programme").value;

    if (name === "" || email === "" || phone === "" || dob === "" || department === "" || programme === "") {
        editFormError.textContent = "Please fill in every field.";
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        editFormError.textContent = "Phone number must be exactly 10 digits.";
        return;
    }

    const students = getStudents();
    const index = students.findIndex(function (s) {
        return s.id === id;
    });

    if (index !== -1) {
        students[index] = {
            id: id,
            name: name,
            email: email,
            phone: phone,
            dob: dob,
            department: department,
            programme: programme
        };
        saveStudents(students);
        renderTable();
    }

    editModal.close();
});

function deleteStudent(id) {
    const confirmed = confirm("Delete this student record?");
    if (!confirmed) {
        return;
    }

    let students = getStudents();
    students = students.filter(function (student) {
        return student.id !== id;
    });

    saveStudents(students);
    renderTable();
}

tableBody.addEventListener("click", function (event) {
    const clickedId = Number(event.target.getAttribute("data-id"));

    if (event.target.classList.contains("btn-delete")) {
        deleteStudent(clickedId);
        return;
    }

    const row = event.target.closest("tr");
    if (row) {
        const students = getStudents();
        const rowId = Number(row.getAttribute("data-id"));
        const student = students.find(function (s) {
            return s.id === rowId;
        });
        if (student) {
            openViewModal(student);
        }
    }
});

renderTable();