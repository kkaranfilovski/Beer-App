const apiUrls = {
    baseUrl: `https://api.punkapi.com/v2/beers`,
    randomUrl: "https://api.punkapi.com/v2/beers/random",

}

const dropdownPageSizeMenu = [
    {
        value: 4,
        text: 'Show 4'
    },

    {
        value: 8,
        text: 'Show 8'
    },

    {
        value: 16,
        text: 'show 16'
    }
]

const dropdownSortByMenu = [
    {
        value: 'name',
        text: 'Name'        
    },

    {
        value: 'abvasc',
        text: 'Alcohol % (low to high)'
    },

    {
        value: 'abvdesc',
        text: 'Alcohol % (high to low)'
    },

    {
        value: 'ibuasc',
        text: 'Bitterness (low to high)'
    },

    {
        value: 'ibudesc',
        text: 'Bitterness (high to low)'
    },

    {
        value: 'first_brewed',
        text: 'Production Date'
    }
]

let pageNumber = 1;
let beersPerPage = 4;

function createDropdownMenu(name, data, htmlElement) {

    htmlElement.innerHTML = ""
    let button = document.createElement('div')
    button.setAttribute('class', 'btn-group')

    button.innerHTML = `
        <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"> ${name} </button>
        <ul class="dropdown-menu">
        ${data.map(x =>
        `<li><a class="dropdown-item" value="${x.value}">${x.text}</a></li>`).join('')}
        </ul>
    `
    htmlElement.appendChild(button)
}