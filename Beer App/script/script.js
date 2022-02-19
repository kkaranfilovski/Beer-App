// getting HTML elements

const homePage = document.getElementById('home-page')
const beerPage = document.getElementById('beer-page')
const detailsPage = document.getElementById('details-page')

const homePageBtn = document.getElementById('home-page-btn')
const beersPageBtn = document.getElementById('beers-page-btn')
const randomBeerBtn = document.getElementById('random-beer-btn')

const beerCards = document.getElementById('beer-cards')
const nextBtn = document.getElementById('next')
const prevBtn = document.getElementById('prev')

const searchField = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')

const showAndSort = document.getElementById('dropdowns')
const pageSizeContainer = document.getElementById('page-size-cont')
const sortByContainer = document.getElementById('sort-by-cont')
const pagination = document.getElementById('show-pages')

// functions

async function getBeers(url) {
    try {
        return await fetch(url).then(response => response.json());
    } catch (error) {
        console.log(error)
    }
}

async function sortBeers(url, sort) {

    try {
        let data = await getBeers(url)
        let sortedBeers = [];

        switch (sort) {
            case `${dropdownSortByMenu[0].value}`:
                sortedBeers = data.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case `${dropdownSortByMenu[1].value}`:
                sortedBeers = data.sort((a, b) => a.abv - b.abv);
                break;
            case `${dropdownSortByMenu[2].value}`:
                sortedBeers = data.sort((a, b) => b.abv - a.abv);
                break;
            case `${dropdownSortByMenu[3].value}`:
                sortedBeers = data.sort((a, b) => a.ibu - b.ibu);
                break;
            case `${dropdownSortByMenu[4].value}`:
                sortedBeers = data.sort((a, b) => b.ibu - a.ibu);
                break;
            case `${dropdownSortByMenu[5].value}`:
                sortedBeers = data.sort((a, b) =>
                    a.first_brewed.split('/').reverse().join('') - b.first_brewed.split('/').reverse().join(''));
                break;
        }

        return sortedBeers

    } catch (error) {
        console.log(error)
    }
}

function showBeers(beers) {

    beerCards.innerHTML = "";

    beers.forEach(beer => {
        let card = document.createElement('div')
        card.setAttribute('class', 'card')
        card.setAttribute('class', "col-3")
        card.innerHTML +=
            ` <img src="${beer.image_url}" class="card-img-top d-block mx-auto px-3 my-2" alt="beer" height="400px">
              <div class="card-body">
                <h5 class="card-title">${beer.name}</h5>
                <p class="card-text">${beer.description}</p>
                <a class="btn btn-primary" name="BUTTON" id='${beer.id}'>More details</a>
              </div>`

        beerCards.appendChild(card)
    })
}

function showMoreDetails(beer) {

    detailsPage.innerHTML = "";

    let detailsCard = document.createElement('div')
    detailsCard.setAttribute('class', 'card')
    detailsCard.setAttribute('class', 'mb-3')

    detailsCard.innerHTML += `
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${beer.image_url}" class="img rounded-start d-block mx-auto" alt="beer" height="500px">
            </div>
            <div class="col-md-8 border">
                <div class="card-header">
                    <b>${beer.name}</b> "${beer.tagline}"
                </div>  
                <div class="card-body">
                  <p class="card-text">${beer.description}</p>
                  <p class="card-text">Brewed: "${beer.first_brewed}"</p>
                  <p class="card-text">Alchohol: ${beer.abv}%</p>
                  <p class="card-text">Bitterness: ${beer.ibu} IBU</p>
                  <h4 class="card-text">Food pairing</h4>
                  <ul class="list-group list-group-flush border">
                     ${beer.food_pairing.map(element => `<li class="list-group-item">"${element}"</li>`).join('')}
                  </ul>
                </div>
            </div>
        </div> `
    detailsPage.appendChild(detailsCard)
}

function pageNumbers() {

    let lastPage = Math.ceil(325 / beersPerPage)  // dali 325(vkupen broj na piva vo APIto) moze da se dobie dinamicno ?
    pagination.innerText = `page: ${pageNumber}/${lastPage}`

    if (pageNumber === 1) {
        prevBtn.style.pointerEvents = 'none'
    } else {
        prevBtn.style.pointerEvents = 'auto'
    }

    if (pageNumber === lastPage) {
        nextBtn.style.pointerEvents = 'none'
    } else {
        nextBtn.style.pointerEvents = 'auto'
    }
}

// events 

// event for showing the home page

homePageBtn.addEventListener('click', () => {
    homePage.style.display = 'block'
    beerPage.style.display = 'none'
    detailsPage.style.display = 'none'
})

// event for showing the Beers page

beersPageBtn.addEventListener('click', async () => {
    homePage.style.display = 'none'
    beerPage.style.display = 'block'
    detailsPage.style.display = 'none'
    showAndSort.style.display = ''
    nextBtn.style.display = ''
    prevBtn.style.display = ''

    createDropdownMenu('Page size', dropdownPageSizeMenu, pageSizeContainer)
    createDropdownMenu('Sort by', dropdownSortByMenu, sortByContainer)

    let beerPageUrl = `${apiUrls.baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`

    let data = await getBeers(beerPageUrl)
    showBeers(data)
    pageNumbers()
})

// event for showing random beer page

randomBeerBtn.addEventListener('click', async () => {
    homePage.style.display = 'none'
    beerPage.style.display = 'none'
    detailsPage.style.display = 'block'

    let randomBeerUrl = `${apiUrls.randomUrl}`

    let data = await getBeers(randomBeerUrl)
    showMoreDetails(data[0])
})

// event for how much beers to be shown per page

pageSizeContainer.addEventListener('click', async (e) => {
    if (e.target.className === "dropdown-item") {

        beersPerPage = e.target.attributes[1].value;
        pageNumber = 1;
        let showPerPageUrl = `${apiUrls.baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`

        let data = await getBeers(showPerPageUrl)
        showBeers(data)
        pageNumbers()
    }
})

// event for sorting beers

sortByContainer.addEventListener('click', async (e) => {
    if (e.target.className === "dropdown-item") {

        let sortUrl = `${apiUrls.baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`
        let sortByChoice = e.target.attributes[1].value

        let data = await sortBeers(sortUrl, sortByChoice)
        showBeers(data)
    }
})

// event for next Page

nextBtn.addEventListener('click', async () => {

    pageNumber++
    let nextPageUrl = `${apiUrls.baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`

    let data = await getBeers(nextPageUrl)
    showBeers(data)
    pageNumbers()
})

// event for prev page

prevBtn.addEventListener('click', async () => {

    pageNumber--
    let prevPageUrl = `${apiUrls.baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`

    let data = await getBeers(prevPageUrl)
    showBeers(data)
    pageNumbers()

})

// event for showing more details about beer

beerCards.addEventListener('click', async (e) => {

    if (e.path[0].name === "BUTTON") {

        homePage.style.display = 'none'
        beerPage.style.display = 'none'
        detailsPage.style.display = 'block'

        let singleBeerUrl = `${apiUrls.baseUrl}/${e.path[0].id}`
        let data = await getBeers(singleBeerUrl)

        showMoreDetails(data[0])
    }
})

// event for search 

searchBtn.addEventListener('click', async (e) => {

    e.preventDefault()

    homePage.style.display = 'none'
    beerPage.style.display = 'block'
    detailsPage.style.display = 'none'

    let searchUrl = `${apiUrls.baseUrl}?beer_name=${searchField.value}`
    let data = await getBeers(searchUrl)

    showAndSort.style.display = 'none'
    nextBtn.style.display = 'none'
    prevBtn.style.display = 'none'

    if (data.length === 0) {
        document.getElementById('beer-cards').innerHTML = "";
        pagination.innerText = `No beers with that name.`
    } else if (searchField.value === '') {
        document.getElementById('beer-cards').innerHTML = "";
        pagination.innerText = `ERROR! PLEASE ENTER A NAME IN THE SEARCH FIELD`
    } else {
        pagination.innerText = `Found beers: ${data.length}`
        showBeers(data)
    }
})