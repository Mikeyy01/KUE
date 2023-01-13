let selectText = document.getElementById("selectText");
let options = document.getElementsByClassName("options");
let selectList = document.getElementById("select");
let arrow = document.getElementById("arrow");
let submitBtn = document.getElementById("submit")

// when dropdown is clicked
function clicked() {
    selectList.classList.toggle("hide");
    arrow.classList.toggle("rotate");
}

// add click event for each option
for(option of options) {
    option.onclick = function() {
        selectText.innerHTML = this.innerHTML;
        selectList.classList.toggle("hide");
        arrow.classList.toggle("rotate");
        submitBtn.style.display = 'block';
    }
}

let searchedTrackName = document.getElementById("searchedTrackName");
let searchedTrackArtist = document.getElementById("searchedTrackArtist");
let searchedTrackImg = document.getElementById("searchedTrackImg");

// display searched track data
searchedTrackName.innerHTML = localStorage.getItem("searchedTrackName");
searchedTrackArtist.innerHTML = localStorage.getItem("searchedTrackArtist");

let trackImg = localStorage.getItem("searchedTrackImg");

searchedTrackImg.setAttribute("src", trackImg);