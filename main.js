let json_data = '';

function getValue() {
    const inputValue = document.getElementById("imgURL").value; 
    return inputValue;
}

function displayImage() {
    const inputValue = getValue();
    const img = document.getElementById("img-to-txt");
    img.src = inputValue;
}

function sendURL(data) {
    const xhr = new XMLHttpRequest();    
    xhr.open("GET", "https://europe-west3-summer-hackday.cloudfunctions.net/altitude?url=" + data);

    let container = document.querySelector("figcaption");
    container.innerHTML = "LOADING...";
    
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = () => {

        json_data = JSON.parse(xhr.responseText);

        // json_data = {
        //     "French": "Une femme chantant dans un microphone",
        //     "German": "Eine Frau singt in ein Mikrofon",
        //     "English": "A woman singing into a microphone",
        //     "Spanish": "Una mujer cantando en un micrófono",
        //     "Polish": "Kobieta śpiewająca do mikrofonu",
        //     "Italian": "Una donna che canta in un microfono"
        // };
      
        container.innerHTML = container.innerHTML.replace('LOADING...', '');
        
        Object.keys(json_data).forEach(function(k){
            let p = document.createElement("p");
            p.innerText = k + ' - ' + json_data[k]; 
            container.appendChild(p);
        });
    }

    xhr.send();
}

function getDesc() {
    const url = getValue();
    return sendURL(url)
}

function displayDesc() {    
    displayImage();
    getDesc();
}




