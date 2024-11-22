const searchElement = document.getElementById("search")

searchElement.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(searchElement)

    let query = formData.get('searchData')

    query = query.trim().replace(/\s+/g, ' ');

    location.href = `/search?q=${query}`
})