let selectText = document.getElementById("selectText");
let dropdownField = document.getElementsByClassName("dropdownField");
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

// display searched track data
document.getElementById("result").innerHTML = localStorage.getItem("searchedTrack");