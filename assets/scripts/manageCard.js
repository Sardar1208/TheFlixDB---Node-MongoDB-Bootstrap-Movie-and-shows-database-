const section = document.querySelector(".results");
const view_form = document.querySelector(".view-form");

function createCard(item, index){
    const card = document.createElement('div');
    card.className = "card d-inline-block mt-0 xx";

    card.addEventListener('click', ()=>{
        // console.log(item);
        const id = item[index].imdbID;
        sendRequestForId(id);
    })

    const card_body = document.createElement('div');
    card_body.className = "card-body search-card";
    card.appendChild(card_body);

    const img = document.createElement('img');
    img.src = `${item[index].Poster}`;
    img.className = "img-fluid search-img mx-2";
    card_body.appendChild(img);

    const card_title = document.createElement('div');
    card_title.className = "search-title d-flex justify-content-center";
    card_body.appendChild(card_title);

    const title = document.createElement('h6');
    title.innerText = `${item[index].Title}`;
    title.className = "card-title pt-2";
    card_title.appendChild(title);

    const card_year = document.createElement('div');
    card_year.className = "search-year w-100 d-flex justify-content-center";
    card_body.appendChild(card_year);

    const bold = document.createElement('b');
    bold.innerText = "Year:";
    card_year.appendChild(bold);

    const year = document.createElement('span');
    year.innerText = `${item[index].Year}`;
    year.className = "year";
    card_year.appendChild(year);

    section.appendChild(card);
}

async function sendRequestForId(id){
    sessionStorage.setItem("search", id);
    view_form.requestSubmit();
}