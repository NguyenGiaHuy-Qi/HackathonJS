// Khởi tạo mảng sinh viên
let studentList = [];
let editIndex = -1; 
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
function loadFromLocal() {
  const data = localStorage.getItem("studentList");
  if (data) {
    studentList = JSON.parse(data);
  }
}
function saveToLocal() {
  localStorage.setItem("studentList", JSON.stringify(studentList));
}
function renderStudentList(list) {
  let html = "";
  for (let i = 0; i < list.length; i++) {
    html += `
      <tr>
        <td>${list[i].fullName}</td>
        <td>${list[i].studentId}</td>
        <td>${list[i].email}</td>
        <td>${list[i].className}</td>
        <td>
          <button onclick="loadEditStudent(${i})" class="btn-edit">Sửa</button>
          <button onclick="deleteStudent(${i})" class="btn-delete">Xoá</button>
        </td>
      </tr>
    `;
  }
  studentTableBody.innerHTML = html;
}
function validateForm(formData) {
  let isValid = true;
  const inputs = studentForm.querySelectorAll("input[type=text], input[type=email]");
  const smalls = studentForm.querySelectorAll("small.error");
  inputs.forEach(input => input.style.borderColor = "#ccc");
  smalls.forEach(small => small.innerText = "");
  if (formData.fullName.trim() === "") {
    smalls[0].innerText = "Họ tên không được để trống";
    inputs[0].style.borderColor = "red";
    isValid = false;
  }
  if (formData.studentId.trim() === "") {
    smalls[1].innerText = "Mã số sinh viên không được để trống";
    inputs[1].style.borderColor = "red";
    isValid = false;
  }
  if (formData.email.trim() === "") {
    smalls[2].innerText = "Email không được để trống";
    inputs[2].style.borderColor = "red";
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    smalls[2].innerText = "Email không hợp lệ";
    inputs[2].style.borderColor = "red";
    isValid = false;
  }
  if (formData.className.trim() === "") {
    smalls[3].innerText = "Lớp không được để trống";
    inputs[3].style.borderColor = "red";
    isValid = false;
  }
  return isValid;
}
studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = {
    fullName: studentForm.fullName.value,
    studentId: studentForm.studentId.value,
    email: studentForm.email.value,
    className: studentForm.className.value
  };
  if (!validateForm(formData)) {
    return;
  }
  if (editIndex === -1) {
    studentList.push({ id: Date.now(), ...formData });
  } else {
    studentList[editIndex] = { id: studentList[editIndex].id, ...formData };
    editIndex = -1;
  }
  studentForm.reset();
  saveToLocal();
  renderStudentList(studentList);
});
function deleteStudent(index) {
  if (confirm("Bạn có chắc chắn muốn xoá sinh viên này không?")) {
    studentList.splice(index, 1);
    saveToLocal();
    renderStudentList(studentList);
  }
}
function loadEditStudent(index) {
  const student = studentList[index];
  studentForm.fullName.value = student.fullName;
  studentForm.studentId.value = student.studentId;
  studentForm.email.value = student.email;
  studentForm.className.value = student.className;
  editIndex = index;
}
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const keyword = searchInput.value.toLowerCase().trim();
    const searchResult = studentList.filter(student =>
      student.fullName.toLowerCase().includes(keyword)
    );
    renderStudentList(searchResult);
  }
});
searchInput.addEventListener("input", function () {
  if (searchInput.value.trim() === "") {
    renderStudentList(studentList);
  }
});
loadFromLocal();
renderStudentList(studentList);
