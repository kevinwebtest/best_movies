import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://best-movies-db-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const movieListDB = ref(database, "movieList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const movieListEl = document.getElementById("movie-list")


addButtonEl.addEventListener("click", function() { //only updates if the movie written is not in the list
    let inputValue = inputFieldEl.value
    let allMovies = movieListEl.innerText.toLowerCase().split('\n')
    
    if(allMovies.length>0 && allMovies.includes(inputValue.toLowerCase())) {
        alert("Already Added!")
    } 
    else if (inputValue.trim().length!==0){
        push(movieListDB, inputValue)
    }
    clearInputFieldEl()
})

onValue(movieListDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearMovieListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendToMovieListEl(currentItem)
        }    
    } else {
        movieListEl.innerHTML = "No titles has been inputted"
    }
})

function clearMovieListEl() {
    movieListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendToMovieListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    // Delete Item from DB
    newEl.addEventListener("click", function() {
        navigator.clipboard.writeText(newEl.textContent)
        newEl.classList.add("active")
        setTimeout(function(){
            newEl.classList.remove("active")
        },1500)
        // let exactLocationOfItemInDB = ref(database, `movieList/${itemID}`)
        
        // remove(exactLocationOfItemInDB)
    })
    
    movieListEl.append(newEl)
}