var USER_WORD = "";
const keyboard = document.querySelector(".keyboard");
const beginBox = document.querySelector(".begin-box");
const display = document.querySelector(".display-word");
const display2 = document.querySelector(".display-word2");
var gameWon = false;

document.getElementById("go-user-word").addEventListener("click", function(){
    USER_WORD = document.getElementById("user-word").value;
    start_game();
})

document.getElementById("begin-form").addEventListener("submit", (e)=>{
    e.preventDefault();
})

function createKeyboard(){
    keyboard.style.display = "flex";
    const keyboardRows = document.querySelectorAll(".keyboard .row")
    const keyboardRow1 = keyboardRows[0]
    const keyboardRow2 = keyboardRows[1]
    const keyboardRow3 = keyboardRows[2]

    keyboardRow1.innerHTML = ""
    keyboardRow2.innerHTML = ""
    keyboardRow3.innerHTML = ""

    const keyboardRow1Keys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
    const keyboardRow2Keys = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
    const keyboardRow3Keys = ["Z", "X", "C", "V", "B", "N", "M"];

    for(var i = 0; i < keyboardRow1Keys.length; i++){
        const key = document.createElement("div");
        key.classList.add("key");
        key.innerText = keyboardRow1Keys[i];
        key.setAttribute("onclick", `guess('${keyboardRow1Keys[i]}')`)
        key.id = `key-${keyboardRow1Keys[i]}`
        keyboardRow1.append(key);
    }

    for(var i = 0; i < keyboardRow2Keys.length; i++){
        const key = document.createElement("div");
        key.classList.add("key");
        key.innerText = keyboardRow2Keys[i];
        key.setAttribute("onclick", `guess('${keyboardRow2Keys[i]}')`)
        key.id = `key-${keyboardRow2Keys[i]}`
        keyboardRow2.append(key);
    }

    for(var i = 0; i < keyboardRow3Keys.length; i++){
        const key = document.createElement("div");
        key.classList.add("key");
        key.innerText = keyboardRow3Keys[i];
        key.setAttribute("onclick", `guess('${keyboardRow3Keys[i]}')`)
        key.id = `key-${keyboardRow3Keys[i]}`
        keyboardRow3.append(key);
    }
    document.querySelector(".lives").innerText = "Lives " + lives;
}

var words = [];
var guessed = [];
var lives
function start_game(){
    gameWon = false;
    lives = 7;
    display.style.display = null;
    display2.style.display = null;
    words = [];
    guessed = [];
    display.innerHTML = "";
    display2.innerHTML = "";
    beginBox.style.display = "none";
    createKeyboard();
    USER_WORD = USER_WORD.toUpperCase();
    for(var i = 0; i < USER_WORD.length; i++){
        words.push(USER_WORD[i])
        if(USER_WORD[i] == " "){
            guessed.push("1");
        }else{
            guessed.push("0");
        }
    }

    
    const baseValue = 70;
    const maxSize = 14;
    const minSize = 5;
    var GRID_SIZE = words.length
    var GRID_SIZE2 = 0;
    var WORD_SIZE = baseValue/words.length;
    var GRID_GAP = 1;
    if(WORD_SIZE > maxSize){
        WORD_SIZE = maxSize;
    }
    
    var currentRow = 1;
    var currentWord = 0;
    var wordLimit = 0;
    var split = false;
    if(WORD_SIZE < minSize){
        var space = USER_WORD.indexOf(" ", Math.floor(baseValue/minSize))
        if(space != -1){
            console.log(space);
            split = true;
            wordLimit = space;
            GRID_SIZE = space;
            WORD_SIZE = baseValue/space + 1;
            GRID_SIZE2 = words.length - space;
        }
    }

    display.style.setProperty("--grid-size", `${GRID_SIZE}`)
    display.style.setProperty("--word-size", `${WORD_SIZE}vmin`)
    display.style.setProperty("--grid-gap", `${GRID_GAP}vmin`)

    display2.style.setProperty("--grid-size", `${GRID_SIZE2}`)
    display2.style.setProperty("--word-size", `${WORD_SIZE}vmin`)
    display2.style.setProperty("--grid-gap", `${GRID_GAP}vmin`)

    for(var i = 0; i < words.length; i++){
        const word = document.createElement("div");
        word.classList.add("word");
        if(words[i] == " "){
            word.classList.add("empty");
        }else{
            word.classList.add(`word-${words[i]}`);
        }
        
        if(split == false){
            display.append(word)
        }else{
            if(currentRow == 1 && currentWord < wordLimit){
                display.append(word)
                console.log(currentWord)
                currentWord++;
            }else{
                currentRow = 2;
                currentWord = 0;
            }



            if(currentRow == 2){
                display2.append(word)
            }
        }
}


}

function guess(key){
    if(gameWon == false && lives > 0){
        
        const currentKey = document.getElementById(`key-${key}`);
        currentKey.classList.add("disabled-key")
        currentKey.classList.remove("key")
        currentKey.removeAttribute("onclick")


        for(var i = 0; i < words.length; i++){
            if(key == words[i]){
                const correctWords = document.querySelectorAll(`.word-${key}`)
                for(var x = 0; x < correctWords.length; x++){
                    correctWords[x].innerText = key
                }
                break;
            }
        }

        var pullLife = true;

        for(var i = 0; i < words.length; i++){
        if(key == words[i]){
            pullLife = false;
            break;
        }
        }

        if(pullLife == true){
            lives--;
        }
        document.querySelector(".lives").innerText = "Lives " + lives;

        if(lives == 0){
            loseGame();
        }

        for(var i = 0; i < words.length; i++){
            if(key==words[i]){
                guessed[i] = "1";
            }
        }

        var win = true;
        for(var i = 0; i < guessed.length; i++){
            if(guessed[i] != "1"){
                win = false;
                break;
            }
        }

        if(win == true){
            gameWon = true;
            winGame();
        }
        }else{
            console.log("Because win = " + gameWon)
        }


}

function winGame(){

    const words = document.querySelectorAll(".word");
    var delay = 0;
    for(var i = 0; i < words.length; i++){
        words[i].style.animation = `bounce 0.5s infinite ${delay}ms`;
        delay += 200;
    }
    const winText = document.createElement("p");
    setTimeout(() => {
        keyboard.style.display = "none";
        beginBox.style.display = "none";
        display.style.display = "none";
        display2.style.display = "none";

        
        winText.classList.add("win-text");
        winText.innerText = "You won!";
        document.body.append(winText)

        setTimeout(() => {
            beginBox.style.display = "flex"
            beginBox.style.animation = "rotate-in 0.5s forwards";
        }, 3500);
    }, delay + 2000);
    document.getElementById("user-word").value = "";
    setTimeout(() => {
        winText.remove();
    }, delay + 6000);
}

function loseGame(){
    console.log(words);

    const gameWords = document.querySelectorAll(".word");
    var delay = 0;
    delay = 0;
    for(var i = 0; i < gameWords.length; i++){
        if(gameWords[i].innerHTML == ""){
            gameWords[i].classList.add("no-guess")
            gameWords[i].style.setProperty("--animation-delay", `${delay}ms`);
            gameWords[i].innerText = words[i];
            delay += 200;
        }
    }
    const winText = document.createElement("p");
    setTimeout(() => {
        keyboard.style.display = "none";
        beginBox.style.display = "none";
        display.style.display = "none";
        display2.style.display = "none";

        
        winText.classList.add("win-text");
        winText.innerText = "You lost!";
        document.body.append(winText)

        setTimeout(() => {
            beginBox.style.display = "flex"
            beginBox.style.animation = "rotate-in 0.5s forwards";
        }, 3500);
    }, delay + 2000);

    setTimeout(() => {
        winText.remove();
    }, delay + 6000);
    
    document.getElementById("user-word").value = "";
}
