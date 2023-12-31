let url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

let search = document.querySelector(".searchBar label");
let playAudio = document.querySelector(".wordSpell i");
let main = document.querySelector("main");
let meaning = document.createElement("div");
let errorMsg = document.createElement("para");
let myAudio = document.querySelector(".wordSpell button");
let audio = document.querySelector("audio");

search.addEventListener("click", async () => {
    let inp = document.querySelector(".searchBar input");
    let wordSearched = document.querySelector("#wordSearch");
    let str = inp.value + "";
    let searchUrl = url + str;
    meaning.innerText = "";

    audio.pause();
    audio.currentTime = 0;
    audio.innerHTML = "";

    wordSearched.classList.add("inactive");

    try {
        let config = { headers: { "content-type": "application/json;" } };
        let res = await axios.get(searchUrl, config);
        wordSearched.classList.remove("inactive");
        let sources = res.data[0].phonetics;
        for (let i in sources) {
            let source = document.createElement("source");
            source.src = sources[i].audio;
            console.log(sources[i].audio);
            audio.appendChild(source);
        }
        displayInfo(res);
        console.log(res);
    } catch (err) {
        errorMsg.innerText = '"Please search for a valid word"';
        errorMsg.classList.add("exampleStyle");
        main.appendChild(errorMsg);
    }
});

async function displayInfo(response) {
    let word = document.querySelector(".word");
    word.innerText = response.data[0].word;
    let spellings = document.querySelector(".spelling");
    spellings.innerText = response.data[0].phonetic;

    let meanings = response.data[0].meanings;
    displayMeanings(meanings);
}

async function displayMeanings(meanings) {
    for (let i in meanings) {
        meaning.classList.add("explanation");
        let wordSpeech = document.createElement("div");
        wordSpeech.classList.add("wordSpeach");
        wordSpeech.innerText = meanings[i].partOfSpeech;
        main.appendChild(meaning);
        meaning.appendChild(wordSpeech);
        let definitions = meanings[i].definitions;
        let defList = document.createElement("ol");

        let synonyms = meanings[i].synonyms;
        let synDiv = document.createElement("div");
        synDiv.classList.add("synDivStyle");
        synDiv.innerText = "Similar ";
        for (let syn in synonyms) {
            let synonym = document.createElement("button");
            synonym.classList.add("buttonStyle");
            synonym.innerText = meanings[i].synonyms[syn];
            synDiv.appendChild(synonym);
        }
        meaning.appendChild(synDiv);
        meaning.appendChild(defList);

        for (let def in definitions) {
            let listItem = document.createElement("li");
            let definition = document.createElement("div");
            definition.classList.add("defStyle");
            definition.innerText = `${definitions[def].definition}:`;
            listItem.appendChild(definition);
            let example = document.createElement("div");
            example.innerText = `"${definitions[def].example}"`;
            example.classList.add("exampleStyle");
            listItem.appendChild(example);

            defList.appendChild(listItem);

            if (def == 4) {
                break;
            }
        }
    }
}

playAudio.addEventListener("click", async () => {
    audio.load();
    audio.play();
});