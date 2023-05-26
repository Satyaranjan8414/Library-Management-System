// --- do not touch  ↓↓↓↓↓↓↓↓↓↓↓↓ ----------
const baseServerURL = `http://localhost:${
  import.meta.env.REACT_APP_JSON_SERVER_PORT
}`
// --- do not touch  ↑↑↑↑↑↑↑↑↑↑↑↑ ----------

// ** Constants / Variables ** //
const bookURL = `${baseServerURL}/books`
let mainSection = document.getElementById('data-list-wrapper')

async function getData() {
  const response = await fetch(`${bookURL}`)
  const result = await response.json()
  //  console.log(result)
  showCard(result)
}
getData()

function showCard(data) {
  mainSection.innerHTML = null
  let cardList = document.createElement('div')
  cardList.classList.add('card-list')
  data.forEach((ele) => {
    const { author, category, id, image, price, title } = ele

    let card = document.createElement('div')
    card.classList.add('card')
    card.setAttribute('data-id', id)

    let cardImg = document.createElement('div')
    cardImg.classList.add('card-img')
    cardImg.innerHTML = `<img src="${image}" alt="book" />`

    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    let cardTitle = document.createElement('h4')
    cardTitle.classList.add('card-title')
    cardTitle.innerText = title
    let cardAuthor = document.createElement('p')
    cardAuthor.classList.add('card-author')
    cardAuthor.innerText = author
    let cardCategory = document.createElement('p')
    cardCategory.classList.add('card-category')
    cardCategory.innerText = category
    let cardPrice = document.createElement('p')
    cardPrice.classList.add('card-price')
    cardPrice.innerText = price
    let cardLink = document.createElement('a')
    cardLink.classList.add('card-link')
    cardLink.href = `#`
    cardLink.addEventListener('click', (event) => {
      event.preventDefault()
      editBook(ele)
      updatePrice(ele)
    })
    cardLink.innerText = 'Edit'
    let cardDelete = document.createElement('button')
    cardDelete.classList.add('card-button')
    cardDelete.innerText = 'Delete'
    cardDelete.addEventListener('click', () => {
      deleteBook(id, title)
    })

    cardBody.append(
      cardTitle,
      cardAuthor,
      cardCategory,
      cardPrice,
      cardLink,
      cardDelete,
    )

    card.append(cardImg, cardBody)
    cardList.append(card)
  })

  mainSection.append(cardList)
}

// delete

async function deleteBook(id) {
  const response = await fetch(`${bookURL}/${id}`, {
    method: 'DELETE',
  })
  const result = await response.json()
  getData()
}

// book

document.getElementById('add-book').addEventListener('click', () => {
  let bookTitleInput = document.getElementById('book-title').value
  let bookImageInput = document.getElementById('book-image').value
  let bookCategoryInput = document.getElementById('book-category').value
  let bookAuthorInput = document.getElementById('book-author').value
  let bookPriceInput = document.getElementById('book-price').value

  const newBookData = {
    title: bookTitleInput,
    image: bookImageInput,
    category: bookCategoryInput,
    author: bookAuthorInput,
    price: bookPriceInput,
  }

  postData(newBookData)
})

async function postData(book) {
  const response = await fetch(`${bookURL}`, {
    method: 'POST',
    body: JSON.stringify(book),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  // const result = await response.json();
  getData()
}

// Update book
let updateBookIdInput = document.getElementById('update-book-id')
let updateBookTitleInput = document.getElementById('update-book-title')
let updateBookImageInput = document.getElementById('update-book-image')
let updateBookAuthorInput = document.getElementById('update-book-author')
let updateBookCategoryInput = document.getElementById('update-book-category')
let updateBookPriceInput = document.getElementById('update-book-price')
let upadatedBookId
function editBook(ele) {
  upadatedBookId = ele.id
  updateBookIdInput.value = ele.id
  updateBookTitleInput.value = ele.title
  updateBookImageInput.value = ele.image
  updateBookAuthorInput.value = ele.author
  updateBookCategoryInput.value = ele.category
  updateBookPriceInput.value = ele.price
}

document.getElementById('update-book').addEventListener('click', () => {
  let id = updateBookIdInput.value
  let title = updateBookTitleInput.value
  let image = updateBookImageInput.value
  let author = updateBookAuthorInput.value
  let category = updateBookCategoryInput.value
  let price = +updateBookPriceInput.value

  //  console.log(id)
  const updateInfo = { id, title, image, author, category, price }

  updateData(updateInfo)
})

async function updateData(updateInfo) {
  const response = await fetch(`${bookURL}/${upadatedBookId}`, {
    method: 'PATCH',
    body: JSON.stringify(updateInfo),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  const result = await response.json()
  getData()
}

//Update price
let updatePriceBookId = document.getElementById('update-price-book-id')
let updatePriceBookPrice = document.getElementById('update-price-book-price')
let updatePriceBookPriceButton = document.getElementById('update-price-book')

function updatePrice(ele) {
  updatePriceBookId.value = ele.id
  updatePriceBookPrice.value = ele.price
  upadatedBookId = ele.id
}
updatePriceBookPriceButton.addEventListener('click', () => {
  let price = +updatePriceBookPrice.value
  const updatedInfo = { price }
  updateData(updatedInfo)
})
//sort and filter

async function sortBook(sortOrder = 'asc') {
  // /posts?_sort=views&_order=asc
  const response = await fetch(`${bookURL}?_sort=price&_order=${sortOrder}`)
  const result = await response.json()
  // console.log(result)
  showCard(result)
}

async function fillterBook(category) {
  // http://localhost:9090/books?category=Classic
  const response = await fetch(`${bookURL}?category=${category}`)
  const result = await response.json()
  // console.log(result)
  showCard(result)
}

let sortAtoZBtn = document.getElementById('sort-low-to-high')
sortAtoZBtn.addEventListener('click', () => {
  sortBook('asc')
})
let sortZtoABtn = document.getElementById('sort-high-to-low')
sortZtoABtn.addEventListener('click', () => {
  sortBook('desc')
})
let filterClassic = document.getElementById('filter-Classic')
filterClassic.addEventListener('click', () => {
  fillterBook('Classic')
})

let filterFantasy = document.getElementById('filter-Fantasy')
filterFantasy.addEventListener('click', () => {
  fillterBook('Fantasy')
})

let filterMystery = document.getElementById('filter-Mystery')
filterMystery.addEventListener('click', () => {
  fillterBook('Mystery')
})

//Search by title/author

let searchBySelect = document.getElementById('search-by-select')
let searchByInput = document.getElementById('search-by-input')
let searchByButton = document.getElementById('search-by-button')

// ?title_like=${titleToSearch}
async function searchBook(searchBy, Input) {
  // ?${title/author}_like=${title name/author name}
  const response = await fetch(`${bookURL}?${searchBy}_like=${Input}`)
  const result = await response.json()
  // console.log(result)
  showCard(result)
  // console.log(searchBy,Input)
}

searchByButton.addEventListener('click', () => {
  let searchBy = searchBySelect.value
  let Input = searchByInput.value
  searchBook(searchBy, Input)
})

//Books Data
let booksData = []