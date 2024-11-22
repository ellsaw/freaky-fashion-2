const loadProducts = document.querySelector("#loadProducts");
const tableBody = document.querySelector("#tableBody");

loadProducts.addEventListener("click", (event) => {
  loadProducts.classList.add("hidden")
  console.log("Loading products...");
  fetch("http://localhost:3000/admin/products/fetch")
    .then((response) => response.json())
    .then((data) => {
      const products = data.products;

      products.forEach((product) => {
        const tr = document.createElement("tr");
        tr.classList.add("tableRow")
        tr.innerHTML = `                       
        <td>${product.productName} - ${product.brand}</td>
        <td>${product.sku}</td>
        <td>${product.price}</td>
        <td class="buttonData">
        <form class="deleteButtonForm">
        <input type="hidden" name="id" value="${product.id}">
        <button>
        <i class="bi bi-trash-fill deleteButton"></i>
        </button>
        </form>
        </td>`;
        tableBody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      displayError(error)
    })
});

function deleteProduct(id, tableRow){
  fetch(("/admin/products"), {
    method: "DELETE",
    body: new URLSearchParams({ id: id }),
  }).then(response => response.json())
  .then((data) => {
    if(data.success){
      tableRow.remove();
    }else{
      console.error(data.error)
      displayError(data.error)
    }
  })
}

document.querySelector("#table").addEventListener("click", (event) => {
  if (event.target && event.target.matches(".deleteButton")){
    event.preventDefault()

    const tableRow = event.target.closest(".tableRow")

    const form = event.target.closest("form")
    const productId = form.querySelector("input[name='id']").value;

    deleteProduct(productId, tableRow)
  }
})

function displayError(message) {
  const errorElement = document.querySelector(".error");
  errorElement.textContent = message;
}