function getValue() {
    const inputValue = document.getElementById("imgURL").value; 
    console.log(inputValue);
    return inputValue;
}

function displayImage() {
    const inputValue = getValue();
    const img = document.querySelector("img");
    img.src = inputValue;
}

function displayDesc() {
    const desc = document.querySelector("figcaption");
    desc.classList.remove("hidden");
}

function getDesc() {    
    displayImage();
    displayDesc();
}



// https://api-cdn.arte.tv/img/v2/image/xz4kbUtZTD4QkMYYwMuN9B/1920x1080



