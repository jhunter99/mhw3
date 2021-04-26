function onJson_API1(json){
    console.log('JSON1 ricevuto');
    console.log(json);
    const lista_ord = document.querySelector('.lista ol');
    const item = document.createElement('li');
    const barra = document.querySelector('#barra');
    const text_barra = barra.value;
    
    /*Se l'alimento NON ha zero calorie, allora vuol dire che è presente nel server*/
    if(json.calories!==0){
        item.textContent = text_barra;
        lista_ord.appendChild(item);
        KCAL = KCAL + json.calories;
        FATS = FATS + json.totalNutrients.FAT.quantity;
        SATURATED_FATS = SATURATED_FATS + json.totalNutrients.FASAT.quantity;
        CARBS = CARBS + json.totalNutrients.CHOCDF.quantity;
        SUGARS = SUGARS + json.totalNutrients.SUGAR.quantity;
        PROTEINS = PROTEINS + json.totalNutrients.PROCNT.quantity;
    }
    /*Se ha zero calorie, allora NON è nel server*/
    else{
        item.textContent = 'Alimento non trovato! Controlla la sintassi';
        item.classList.add('red');
        lista_ord.appendChild(item);
    }
}

function onResponse_API1(response) {
    console.log('Risponse1 ricevuta!');
    return response.json();
}

function onJson_API2(json){
    console.log('JSON2 ricevuto');
    console.log(json);
    const testo_tradotto = json.responseData.translatedText;

    fetch("https://edamam-edamam-nutrition-analysis.p.rapidapi.com/api/nutrition-data?ingr=" + testo_tradotto, {
	    "method": "GET",
	    "headers": {
		    "x-rapidapi-key": "9d774d61bdmsh348f077b5608a7cp19a621jsncdfc223328d2",
		    "x-rapidapi-host": "edamam-edamam-nutrition-analysis.p.rapidapi.com"
	    }
    }).then(onResponse_API1).then(onJson_API1);
}

function onResponse_API2(response){
    console.log('Response2 ricevuta');
    return response.json();
}

function translateFromItaToEng(text){
    fetch("https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?q=" + text + "&langpair=it%7Cen&de=a%40b.c&onlyprivate=0&mt=1", {
	    "method": "GET",
	    "headers": {
		    "x-rapidapi-key": "9d774d61bdmsh348f077b5608a7cp19a621jsncdfc223328d2",
		    "x-rapidapi-host": "translated-mymemory---translation-memory.p.rapidapi.com"
	    }
    }).then(onResponse_API2).then(onJson_API2);
}

function inserisciIngrediente(event){
    event.preventDefault();

    const barra = document.querySelector('#barra');
    let text_barra = encodeURIComponent(barra.value);
    const lang = document.querySelector('#lingua').value;
    if(lang === 'ITA'){
        translateFromItaToEng(text_barra);
    }

    else {
        fetch("https://edamam-edamam-nutrition-analysis.p.rapidapi.com/api/nutrition-data?ingr=" + text_barra, {
	        "method": "GET",
	        "headers": {
		        "x-rapidapi-key": "9d774d61bdmsh348f077b5608a7cp19a621jsncdfc223328d2",
		        "x-rapidapi-host": "edamam-edamam-nutrition-analysis.p.rapidapi.com"
	        }
        }).then(onResponse_API1).then(onJson_API1);
    }
}

function stampa(){
   const output_box = document.querySelector('#output .contents');
   const blocchi = output_box.querySelectorAll('div');

   /*Svuoto la tabella prima di fare nuovi inserimenti*/
   for(blocco of blocchi){
       blocco.remove();
   }

   const CALORIE = document.createElement('div');
   const GRASSI = document.createElement('div');
   const GRASSI_SATURI = document.createElement('div');
   const CARBOIDRATI = document.createElement('div');
   const ZUCCHERI = document.createElement('div');
   const PROTEINE = document.createElement('div');

   CALORIE.textContent = 'Calorie: ' + KCAL + 'kcal';
   GRASSI.textContent = 'Grassi: ' + FATS + 'g';
   GRASSI_SATURI.textContent = 'di cui acidi grassi saturi: ' + SATURATED_FATS + 'g';
   CARBOIDRATI.textContent = 'Carboidrati: ' + CARBS + 'g';
   ZUCCHERI.textContent = 'di cui zuccheri: ' + SUGARS + 'g';
   PROTEINE.textContent = 'Proteine: ' + PROTEINS + 'g';

   CALORIE.classList.add('moreSpace');
   GRASSI_SATURI.classList.add('moreSpace');
   ZUCCHERI.classList.add('moreSpace');

   output_box.appendChild(CALORIE);
   output_box.appendChild(GRASSI);
   output_box.appendChild(GRASSI_SATURI);
   output_box.appendChild(CARBOIDRATI);
   output_box.appendChild(ZUCCHERI);
   output_box.appendChild(PROTEINE);
}

function rimuovi(){
    const lista_ord = document.querySelector('.lista ol');
    lista_ord.innerHTML = '';

    /*Setto nuovamente a 0 le variabili globali*/
    KCAL = 0;
    FATS = 0;
    SATURATED_FATS = 0;
    CARBS = 0;
    SUGARS = 0;
    PROTEINS = 0;
}

let KCAL = 0;
let FATS = 0;
let SATURATED_FATS = 0;
let CARBS = 0;
let SUGARS = 0;
let PROTEINS = 0;

const form = document.querySelector('form');
form.addEventListener('submit',inserisciIngrediente);

const bottone_calcola = document.querySelector('#calculate');
bottone_calcola.addEventListener('click',stampa);

const bottone_rimuovi = document.querySelector('#remove');
bottone_rimuovi.addEventListener('click',rimuovi);

