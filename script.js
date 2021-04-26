function inserisciContenuto(){
    const grid = document.querySelector('.griglia');
    for(let i=0;i<contenuti.length;i++){
        const blocco = document.createElement('div');
        const title = document.createElement('h1');
        const image = document.createElement('img');
        const description = document.createElement('div');
        const moreDetails = document.createElement('button');
        const lessDetails = document.createElement('button');
        const star = document.createElement('button');

        title.textContent = contenuti[i].titolo;
        image.src = contenuti[i].immagine;
        description.textContent = contenuti[i].descrizione;
        moreDetails.textContent = bottonePiùDettagli;
        lessDetails.textContent = bottoneMenoDettagli;
    
        description.classList.add('hidden');
        lessDetails.classList.add('hidden');
        moreDetails.classList.add('dettagli_più');
        lessDetails.classList.add('dettagli_meno');
        star.classList.add('star');
        
        grid.appendChild(blocco);
        blocco.appendChild(image);
        blocco.appendChild(title);
        blocco.appendChild(description);
        blocco.appendChild(star);
        blocco.appendChild(moreDetails);
        blocco.appendChild(lessDetails);
    }
}

function onJson(json){
    console.log('JSON ricevuto');
    console.log(json);
    const container = document.querySelector('#container');
    for(let i=0;i<json.length;i++){
        const product = json[i];

        const blocco = document.createElement('div');
        const image = document.createElement('img');
        const title = document.createElement('span');
        const price = document.createElement('span');

        image.src = product.image_url;
        title.textContent = product.product_name;
        price.textContent = '$' + product.current_price;
        price.classList.add('bold');

        blocco.appendChild(image);
        blocco.appendChild(title);
        blocco.appendChild(price);

        container.appendChild(blocco);
    }
}

function onResponse(response) {
    console.log('Risposta ricevuta!');
    return response.json();
}

function inserisciPubblicità(){
    fetch("https://amazon-product-price-data.p.rapidapi.com/product/B000GISTZ4,B01LZ2UP91,B07N64YD2Y,B009VV7G60,B0734CCWGR", {
	    "method": "GET",
	    "headers": {
		    "x-rapidapi-key": "9d774d61bdmsh348f077b5608a7cp19a621jsncdfc223328d2",
		    "x-rapidapi-host": "amazon-product-price-data.p.rapidapi.com"
	    }
    }).then(onResponse).then(onJson);
}

function mostraTesto(event) {
    const bottone = event.currentTarget;
    const testo = bottone.parentNode.querySelector('div');
    const lessDetails = bottone.parentNode.querySelector('.dettagli_meno')

    bottone.classList.add('hidden');
    testo.classList.remove('hidden');
    lessDetails.classList.remove('hidden');
}

function nascondiTesto(event){
    const bottone = event.currentTarget;
    const testo = bottone.parentNode.querySelector('div');
    const moreDetails = bottone.parentNode.querySelector('.dettagli_più')

    bottone.classList.add('hidden');
    testo.classList.add('hidden');
    moreDetails.classList.remove('hidden');
}

function rimuoviPreferiti(event){
    const button = event.currentTarget;
    const titoli = document.querySelectorAll('.griglia div h1')

    /*Prima di rimuovere il blocco dai preferiti, DEVO riabilitare l'aggiunta ai preferiti al corrispodente blocco della Section*/
    for(titolo of titoli){
        if((titolo.textContent.indexOf(button.parentNode.querySelector('h1').textContent))!==-1){
            titolo.parentNode.querySelector('.star').addEventListener('click',aggiungiPreferiti);
            break;
        }
    }
    
    button.parentNode.remove();

    const prefer = document.querySelector('#preferences');
    const blocchi_pref = prefer.querySelector('div');
    if(!blocchi_pref){
        prefer.classList.remove('preferiti');
        prefer.classList.add('hidden');
        document.querySelector('.intestazione').classList.add('hidden');
    } 
}

function aggiungiPreferiti(event){
    const bottone_pref = event.currentTarget;
    const sezione_pref = document.querySelector('#preferences');
    const titolo = bottone_pref.parentNode.querySelector('h1');
    let blocco_pref = document.createElement('div');
    const titolo_pref = document.createElement('h1');
    const img_pref = document.createElement('img');
    const star_selected = document.createElement('button');
    const intestaz = document.querySelector('.intestazione');

    for(contenuto of contenuti){
        if ((contenuto.titolo.indexOf(titolo.textContent))!==-1){
            sezione_pref.classList.remove('hidden');
            sezione_pref.classList.add('preferiti');
            intestaz.classList.remove('hidden');
            sezione_pref.appendChild(blocco_pref);

            titolo_pref.textContent = contenuto.titolo;
            img_pref.src = contenuto.immagine;
            star_selected.classList.add('selected');

            blocco_pref.appendChild(img_pref);
            blocco_pref.appendChild(titolo_pref);
            blocco_pref.appendChild(star_selected);
            bottone_pref.removeEventListener('click',aggiungiPreferiti);
            star_selected.addEventListener('click',rimuoviPreferiti);
        }
    }
}

function search(event) {
    const text_barra = event.currentTarget.value;
    const titoli = document.querySelectorAll('.griglia div h1');

    for(titolo of titoli){
        titolo.parentNode.classList.add('hidden')
    }

    for(titolo of titoli){
        if((titolo.textContent.toUpperCase().indexOf(text_barra.toUpperCase()))!==-1){
            titolo.parentNode.classList.remove('hidden');
        }
    }
}

inserisciContenuto();
inserisciPubblicità();

const bottoni_dettagliPiù = document.querySelectorAll('.dettagli_più');
for(bottone of bottoni_dettagliPiù){
    bottone.addEventListener('click',mostraTesto);
}

const bottoni_dettagliMeno = document.querySelectorAll('.dettagli_meno');
for(bottone of bottoni_dettagliMeno){
    bottone.addEventListener('click',nascondiTesto);
}

const star_button_unselected = document.querySelectorAll('.star');
for(star of star_button_unselected){
    star.addEventListener('click',aggiungiPreferiti);
}

const barra = document.querySelector('#cerca input');
barra.addEventListener('keyup',search);




