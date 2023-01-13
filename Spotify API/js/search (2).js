const form = document.getElementById("searchForm");
const input = document.getElementById("input");

// spotify api token 
const spotifyAccess = (function() {
    const clientID = 'accae6b6c5604b8b9793c93ce82dcb73';
    const clientSecret = 'c131cb4ca8954077bfd42c7b87b0b8d4';

    const getToken = async () => {

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientID + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        })

        const data = await response.json();
        return data.access_token;
    }

    return {
        getAccessToken() {
            return getToken();
        }
    }
})();


// fetch api
async function search(API) {

    const token = await API.getAccessToken();
    const songDisplay = document.querySelector(".songDisplay");
    
    // search for tracks
    let searchID = await fetch('https://api.spotify.com/v1/search?q=' + input.value + '&type=track&access_token=' + token)
    .then(response =>  response.json())
    .then(data => {
        let trackName = data.tracks.items[0].name;

        if (trackName = input.value) {
            console.log(`Searched for:  ${input.value}`)
            console.log(data.tracks.items);

            songDisplay.innerHTML = getTracks(data.tracks.items);
        } 
    });
}

// display tracks
const getTracks = (tracks) => {
    const results = tracks
    .map((track) => 
        `
        <div class="tracks">

            <a href="payment.html" id="${track.id})">

                <div class="track-row">
                    <img src="${track.album.images[2].url}">

                    <div class="track-info">
                        <ul class="info">
                            <li class="title" id="trackName">${track.name}</li>
                            <li class="artist">${track.artists[0].name}</li>
                        </ul>
                    </div>

                    <div class="track-time">
                        <p class="time">${msToMinutesAndSeconds(track.duration_ms)}</p>
                    </div>
                </div>
            </a>
        </div>
        `

    ).join("\n");

    return results; 
}

// converting track duration from ms to minutes and seconds 
function msToMinutesAndSeconds(ms) {
  let minutes = Math.floor(ms / 60000);
  let seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// when search bar is clicked
input.onkeypress = function () {
    let timer;

    // if existing timer exists, then reset
    if (timer != undefined) clearTimeout(timer);
    // call function when timer ends
    timer = setTimeout(showBtnDelete, 2);
};

const btnDelete = document.getElementById("btnDelete");

// delete btn shows only when typing
function showBtnDelete() {
    if (input.value != "") {

        btnDelete.style.display = "block";
    }
}

// when delete btn is clicked
function emptyInput() {
    input.value = "";

    btnDelete.style.display = "none";
}

// input validation
function hasValue(input) {

    // check if the value is not empty
    if (input.value.trim() === "") {
        input.placeholder = "Please fill in the input to request";
        return false;
    }

    return true;
}

// form validation when submit
form.addEventListener("submit", function (event) {
    event.preventDefault();

    // validate the search
    let inputValid = hasValue(input);

    // if valid, submit the form
    if (inputValid) {
        search(spotifyAccess);

        localStorage.setItem("searchedTrack", input.value)
    }
});

