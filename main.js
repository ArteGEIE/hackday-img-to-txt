let json_data = '';

function getValue() {
    const inputValue = document.getElementById("imgURL").value; 
    console.log(inputValue);
    return inputValue;
}

function displayImage() {
    const inputValue = getValue();
    const img = document.getElementById("img-to-txt");
    console.log(img);
    img.src = inputValue;
}

function sendURL(data) {
    const xhr = new XMLHttpRequest();
    console.log("UNSENT", xhr.readyState);
    const subKey= "";
    xhr.open("POST", "https://cv-eus-poc-01.cognitiveservices.azure.com/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&language=en&gender-neutral-caption=False&features=DenseCaptions");
    const desc = document.querySelector("figcaption");
    desc.innerHTML = "LOADING...";
    console.log("OPENED", xhr.readyState);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", subKey);
    const body = JSON.stringify({
        url: data
    });

    xhr.onload = () => {
        json_data = JSON.parse(xhr.responseText);
        const text = json_data.denseCaptionsResult.values[0].text;
        const desc = document.querySelector("figcaption");
        desc.innerHTML = text;
        console.log("Done")
    }

    xhr.send(body);
}

function getDesc() {
    const url = getValue();
    return sendURL(url)
}

function displayDesc() {    
    displayImage();
    getDesc();
    const desc = document.querySelector("figcaption");
    desc.classList.remove("hidden");
}

// https://api-cdn.arte.tv/img/v2/image/xz4kbUtZTD4QkMYYwMuN9B/1920x1080





