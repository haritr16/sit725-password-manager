const AddWall = document.querySelector('.add-wall');
const BtnSet1 = document.querySelector('.btn-set1');

document.querySelector('.add-record').addEventListener('click', function () {
  AddWall.style.display = 'flex';
});

document.querySelector('.add-cancel').addEventListener('click', function () {
  AddWall.style.display = 'none';
});
document.addEventListener('DOMContentLoaded', fetchRecords);


function addRecord(event) {
  event.preventDefault();

  var platform = document.querySelector(".add-platform").value;
  var username = document.querySelector(".add-username").value;
  var password = document.querySelector(".add-password").value;
  var retypePassword = document.querySelector(".add-retype-password").value;

  if (password !== retypePassword) {
    alert("Passwords do not match!");
    return;
  }

  var tableBody = document.querySelector(".styled-table tbody");
  var newRow = tableBody.insertRow();
  newRow.innerHTML = `
      <tr>
      <th class="selection">Selection</th>
      <td>${platform}</td>
      <td>${username}</td>
      <td>${password}</td>
      </tr>
  `;


  document.querySelector(".add-platform").value = "";
  document.querySelector(".add-username").value = "";
  document.querySelector(".add-password").value = "";
  document.querySelector(".add-retype-password").value = "";

  hideAddRecordWindow();
}

function confirmLogout() {
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "login.html";
  }
}