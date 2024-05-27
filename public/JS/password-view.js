const AddWall = document.querySelector('.add-wall');
const DelWall = document.querySelector('.delete-wall');
const Pwdgen = document.querySelector('.password-generator-wall');

const BtnSet1 = document.querySelector('.btn-set1');

document.querySelector('.add-record').addEventListener('click', function () {
  AddWall.style.display = 'flex';
});

document.querySelector('.add-cancel').addEventListener('click', function () {
  AddWall.style.display = 'none';
});
// document.addEventListener('DOMContentLoaded', fetchRecords);


document.querySelector('.remove-record').addEventListener('click', function () {
  DelWall.style.display = 'flex';
});

document.querySelector('.delete-cancel').addEventListener('click', function () {
  DelWall.style.display = 'none';
});

document.querySelector('.password-gen').addEventListener('click', function () {
  Pwdgen.style.display = 'flex';
});

document.querySelector('.close-button').addEventListener('click', function () {
  Pwdgen.style.display = 'none';
});

function updatePasswordLengthDisplay() {
  const length = document.getElementById('password-length').value;
  document.getElementById('password-length-value').textContent = length;
}

function generatePassword() {
  const includeNumbers = document.getElementById('include-numbers').checked;
  const includeUppercase = document.getElementById('include-uppercase').checked;
  const includeLowercase = document.getElementById('include-lowercase').checked;
  const includeSpecial = document.getElementById('include-special').checked;
  const length = document.getElementById('password-length').value;

  let charset = '';
  if (includeNumbers) charset += '0123456789';
  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (includeSpecial) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
  if (charset === '') {
      alert('Please select at least one character set.');
      return;
  }

  let password = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
  }

  document.getElementById('generated-password').value = password;
}

function copyPassword() {
  const passwordField = document.getElementById('generated-password');
  passwordField.select();
  passwordField.setSelectionRange(0, 99999); 
  document.execCommand('copy');
  alert('Password copied to clipboard!');
}

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