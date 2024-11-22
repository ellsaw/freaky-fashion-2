const formElement = document.getElementById("addProduct");

formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(formElement);

  fetch("/admin/products/new", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.href = "/admin/products";
      } else {
        displayError(data.error);
        console.error(data.error)
      }
    });
});

function displayError(message) {
  const errorElement = document.querySelector(".error");
  errorElement.textContent = message;
}
