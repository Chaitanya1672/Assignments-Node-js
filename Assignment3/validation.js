const fname = document.getElementById("fname");

const errorDiv = document.getElementById("error");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let messages = [];

  if (fname.value.length <= 6) {
    messages.push("Fname must be longer than 6 char");
  }

  if (messages.length > 0) {
    e.preventDefault();
    errorDiv.innerText = messages.join(", ");
  }
});
