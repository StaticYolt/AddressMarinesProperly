const ranksJson = {}
const enlistedRanks = [
    "PFC", "LCpl", "Cpl", "Sgt", "SSgt",
"GySgt", "MSgt", "1stSgt", "MGySgt", "SgtMaj",
"SgtMajMC"
]
const officerRanks = [
    "2ndLt", "1stLt", "Capt", "Maj", "LtCol", "Col"
];
const ranks = [enlistedRanks, officerRanks].flat();

const dataPromises = ranks.map(rank => {
    return fetch(`./data/${rank}.json`)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${rank}.json`);
            return response.json();
        })
        .then(data => {
            ranksJson[rank] = data;
        })
        .catch(error => {
            console.error(`Error fetching ${rank}:`, error);
        });
});
console.log("Ranks JSON:", ranksJson);


const refreshButton = document.getElementById('refresh-button');
const timeOfDay = document.getElementById('time-of-day');
const marines= document.getElementsByClassName('marine');
const revealButton = document.getElementById('reveal-button');
const answer = document.getElementById('answer');
let currScenario = [];
// Make sure there's an output div to display the results:
const outputDiv = document.createElement("div");
outputDiv.id = "output";
document.body.appendChild(outputDiv);

refreshButton.addEventListener('click', generateRandomScenario);

document.addEventListener('keydown', (event) => {
    // Check if Space was pressed and avoid input elements
    if (event.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault(); // prevent scrolling
        generateRandomScenario();
    }
    if (event.code === 'KeyR' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault(); // prevent form submission
        revealAnswer();
    }
});

function generateMarine(marineElement, shouldGenerate=false) {
    const marine = getRandomMarine();
    console.log(`Generated Marine: ${marine.rank} ${marine.f_initial} ${marine.l_name}`);
    const gender =  Math.random() < 0.5 ? "Male" : "Female"
    if(shouldGenerate === true) {
        marineElement.innerHTML = `
            <h3>${marine.rank}</h3>
            <p>${marine.f_initial}. ${marine.l_name} | ${gender}</p>
            <img src="./images/${marine.rank}.png" alt="${marine.rank} insignia" class="insignia">
        `;
        currScenario.push({
            rank: marine.rank,
            f_initial: marine.f_initial,
            l_name: marine.l_name,
            gender: gender
        });
    }
    else {
        marineElement.innerHTML = ``;
    }
    // return {
    //     rank: marine.rank,
    //     f_initial: marine.f_initial,
    //     l_name: marine.l_name,
    //     gender: gender
    // };
}
function getRandomMarine() {
    const randomIndex = Math.floor(Math.random() * ranks.length);
    const randomRank = ranks[randomIndex];
    const rankList = ranksJson[randomRank];
    if (!rankList || rankList.length === 0) {
        console.error(`No data available for rank: ${randomRank}`);
        return null;
    }
    const randomRankIndex = Math.floor(Math.random() * rankList.length);
    const randomMarine = rankList[randomRankIndex];
    
    return {
        rank: randomRank,
        l_name: randomMarine.last_name,
        f_initial: randomMarine.first_name[0].toUpperCase(),
    };   
}
const marineCountWeights = [
    1, 1, 1, 1, 1,       // weight for 1 marine
    2, 2, 2,             // weight for 2 marines
    3, 3,                // weight for 3 marines
    4,                  // weight for 4 marines
    5                   // weight for 5 marines
];
function generateRandomScenario() {    
    revealButton.style.visibility = 'visible';
    answer.innerHTML = ""; // Clear previous answer
    currScenario = [];
    const timeOfDayOptions = ["Morning", "Afternoon", "Evening"];
    const randomTimeOfDay = Math.floor(Math.random() * timeOfDayOptions.length);
    timeOfDay.innerHTML = timeOfDayOptions[randomTimeOfDay];
    
    
    const randomNum = marineCountWeights[Math.floor(Math.random() * marineCountWeights.length)];
    console.log("Random Number of Marines to Generate:", randomNum);
    for(let i = 0; i < marines.length; i++) {
        generateMarine(marines[i], i < randomNum);
    }
}
function sortCurrentScenario() {
    currScenario.sort((a, b) => {
        const rankIndexA = ranks.indexOf(a.rank);
        const rankIndexB = ranks.indexOf(b.rank);
        return rankIndexA - rankIndexB;
    });
}

/*
Rules:
 if there are 2 enlisted marines then greet in order of high to low rank 
 if there is one enlisted marine then greet that marine
 if there are 2 or more enlisted marines of the same gender, greet them as gentlemen or ladies
 if there is one officer greet them as sir or ma'am
 if officer rank is above general, greet them as General lastname

*/
function getAnswer() {
    let answer = ""    
    const isOfficer = marine => officerRanks.includes(marine.rank);
    let males = currScenario.filter(m => m.gender === "Male");
    let females = currScenario.filter(m => m.gender === "Female");
    const dayPeriod = timeOfDay.innerHTML;
    const rankIndex = rank => ranks.indexOf(rank);

    if (males.length > 1 ) {
        answer += currScenario.length === males.length ? `Good ${dayPeriod} gentlemen` : `Good ${dayPeriod} gentlemen, `;
        males.forEach((m, index) => {
            let idx = currScenario.indexOf(m);
            if (idx !== -1)  // Check if the marine is still in the scenario
            {
                currScenario.splice(idx, 1);
            }
        });
    }
    if (females.length > 1) {
        answer += currScenario.length === females.length ? `Good ${dayPeriod} ladies` : `Good ${dayPeriod} ladies, `;
        females.forEach((m, index) => {
            let idx = currScenario.indexOf(m);
            if (idx !== -1)  // Check if the marine is still in the scenario
            {
                currScenario.splice(idx, 1);
            }
        });
    }
    if (currScenario.length === 1) {
        let l_marine = currScenario[0];
        if (isOfficer(l_marine)) {
            answer += `Good ${dayPeriod} ${l_marine.gender === "Male" ? "Sir" : "Ma'am"} ${currScenario[0].l_name}`;
        }
        else {
            answer += `Good ${dayPeriod} ${l_marine.rank} ${l_marine.l_name}`;
        }
    }
    else if (currScenario.length === 2) {
        currScenario.sort((a, b) => rankIndex(b.rank) - rankIndex(a.rank));
        let marine1 = currScenario[0];
        let marine2 = currScenario[1];
        answer += isOfficer(marine1) ? `Good ${dayPeriod} ${marine1 === "Male" ? "Sir" : "Ma'am"}, ` : `Good ${dayPeriod} ${marine1.rank} ${marine1.l_name}, `;
        answer += isOfficer(marine2) ? `Good ${dayPeriod} ${marine2 === "Male" ? "Sir" : "Ma'am"}` : `Good ${dayPeriod} ${marine2.rank} ${marine2.l_name}`;
    }
    return answer;
}

function revealAnswer() {
    answer.innerHTML = "Answer: " + getAnswer(); 
     // Disable the reveal button after revealing the answer
    revealButton.style.visibility = 'hidden';
}
revealButton.addEventListener('mouseenter', revealAnswer);

Promise.all(dataPromises).then(() => {
    console.log("All rank data loaded.");
    generateRandomScenario(); // safe to call now
});