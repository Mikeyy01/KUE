// call function on page load
window.onload = function() {
    spotify.start();
}

const spotifyAccess = (function() {
    const clientID = 'accae6b6c5604b8b9793c93ce82dcb73';
    const clientSecret = 'c131cb4ca8954077bfd42c7b87b0b8d4';

    // private method for spotify api token
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

    // private method for spotify top 50 global tracks playlist
    const getGlobalPlaylist = async (token) => {
        const result = await fetch('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF', {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json', 
                'Authorization' : 'Bearer ' + token
            }
        });

        const data = await result.json();
        
        return data;
    }

    // private method for spotify searched tracks
    const getTrack = async (token, trackId) => {
        const result = await fetch('https://api.spotify.com/v1/tracks/' + trackId, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json', 
                'Authorization' : 'Bearer ' + token
            }
        });

        const data = await result.json();

        return data;
    }

    return {
        getAccessToken() {
            return getToken();
        },
        getPlaylist(token) {
            return getGlobalPlaylist(token);
        },
        getTrackDetails(token, trackId) {
            return getTrack(token, trackId);
        }
    }
})();

// display playlist tracks
const fetchedData = (function() {

    // object references
    const DOMElements = {
        searchForm: '#searchForm',
        searchSongDisplay: '.songDisplay',
        searchInput: '#input',
        buttonDelete: '#btnDelete',
        textTitle: '#topTitle'
    }

    // public methods
    return {

        elements() {
            return {
                form: document.querySelector(DOMElements.searchForm),
                songDisplay: document.querySelector(DOMElements.searchSongDisplay),
                input: document.querySelector(DOMElements.searchInput),
                btnDelete: document.querySelector(DOMElements.buttonDelete),
                title: document.querySelector(DOMElements.textTitle)
            }
        },

        // create playlist details
        createPlaylistTracks(playlists) {
            return getPlaylistTracks(playlists);
            
        },

        // create track list
        createTracks(tracks){
            return getTracks(tracks);
        }
    }

})();

const spotify = (function(createData, accessAPI) {
    // get object ref
    const DOMElements = createData.elements();

    // get top 50 global playlist 
    const loadRecommendations = async () => {
        // get token
        const token = await accessAPI.getAccessToken();
        // get top 50 global playlist
        const playlist = await accessAPI.getPlaylist(token);

        // insert into HTML
        DOMElements.songDisplay.innerHTML = createData.createPlaylistTracks(playlist.tracks.items.slice(0, 10));

        // show playlist title
        DOMElements.title.style.display = "block";
    }

    // create form submit event listener
    DOMElements.form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // validate the search
        let inputValid = hasValue(DOMElements.input);

        // if input is valid, submit the form
        if (inputValid) {
            const token = await accessAPI.getAccessToken();
    
            // search for tracks
            let searchID = await fetch('https://api.spotify.com/v1/search?q=' + DOMElements.input.value + '&type=track&access_token=' + token)
            .then(response =>  response.json())
            .then(data => { 
                let trackName = data.tracks.items[0].name;
                // if track exists
                if (trackName = DOMElements.input.value) {
                    console.log(`Searched for:  ${DOMElements.input.value}`)
                    console.log(data.tracks.items);

                    DOMElements.title.style.display = "none";
                    // insert into HTML
                    DOMElements.songDisplay.innerHTML = createData.createTracks(data.tracks.items);
                } 
            });
        }
    });

    // function for input validation
    function hasValue(input) {

        // check if the value is not empty
        if (input.value.trim() === "") {
            input.placeholder = "Please fill in the input to request";
            return false;
        }

        return true;
    }

    // create button x click event listener
    DOMElements.btnDelete.addEventListener('click', async (event) => {
        event.preventDefault();
        // empty input whenever clicked
        DOMElements.input.value = "";

        DOMElements.btnDelete.style.display = "none";
    });

    return {
        start() {
            console.log('start');
            loadRecommendations();
        }
    }

})(fetchedData, spotifyAccess);

// display playlist
const getPlaylistTracks = (playlists) => {
    const results = playlists
    // iterate over array
    .map((playlist) => 

        `
        <div class="tracks">
            <div id="${playlist.track.id}" onclick="saveData(this.id)">
                <div class="track-row">
                    <img src="${playlist.track.album.images[2].url}">

                    <div class="track-info">
                        <ul class="info">
                            <li class="title" id="trackName">${playlist.track.name}</li>
                            <li class="artist">${playlist.track.artists[0].name}</li>
                        </ul>
                    </div>

                    <div class="track-time">
                        <p class="time">${msToMinutesAndSeconds(playlist.track.duration_ms)}</p>
                    </div>
                </div>
            </div>
        </div>
        `

    ).join("\n");

    return results; 
}

// display tracks
const getTracks = (tracks) => {
    const results = tracks
    // iterate over array
    .map((track) => 

        `
        <div class="tracks">

            <div id="${track.id}" onclick="saveData(this.id)">

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
            </div>
        </div>
        `

    ).join("\n");

    return results; 
}

// store clicked track's data
async function saveData(savedId) {
    const savedID = savedId; 
    // get token
    const token = await spotifyAccess.getAccessToken();
    // get clicked track's data
    const track = await spotifyAccess.getTrackDetails(token, savedID);

    // store data
    localStorage.setItem("searchedTrackName", track.name);
    localStorage.setItem("searchedTrackArtist", track.artists[0].name);
    localStorage.setItem("searchedTrackImg", track.album.images[2].url);

    // direct to payment page
    window.location.href = "payment.html";
}

// converting track duration from ms to minutes and seconds 
function msToMinutesAndSeconds(ms) {
  let minutes = Math.floor(ms / 60000);
  let seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}






