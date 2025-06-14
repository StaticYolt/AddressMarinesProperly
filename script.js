const ranksJson = {}
const ranks = [
"PFC", "LCpl", "Cpl", "Sgt", "SSgt",
"GySgt", "MSgt", "1stSgt", "MGySgt", "SgtMaj",
"SgtMajMC", "CWO2", "CWO3", "CWO4", "CWO5",
"2ndLt", "1stLt", "Capt", "Maj", "LtCol",
"Col", "BGen", "LtGen", "Gen"
];
ranks.forEach(rank => {
fetch(`./data/${rank}.json`)
    .then(response => {
        if (!response.ok) throw new Error(`Failed to load ${rank}.json`);
        return response.json();
    })
    .then(data => {
        ranksJson[rank] = data;
        // const section = document.createElement("div");
        // section.innerHTML = `
        //     <h2>${rank}</h2>
        //     <pre>${JSON.stringify(data, null, 2)}</pre>
        // `;
        // outputDiv.appendChild(section);
    })
    .catch(error => {
        console.error(`Error fetching ${rank}:`, error);
    });
});
console.log("Ranks JSON:", ranksJson);


const refreshButton = document.getElementById('refresh-button');

// Make sure there's an output div to display the results:
const outputDiv = document.createElement("div");
outputDiv.id = "output";
document.body.appendChild(outputDiv);

refreshButton.addEventListener('click', () => {
    generateMarine();
    // Clear previous results
    // outputDiv.innerHTML = '';

    // ranks.forEach(rank => {
    //     fetch(`./data/${rank}.json`)
    //         .then(response => {
    //             if (!response.ok) throw new Error(`Failed to load ${rank}.json`);
    //             return response.json();
    //         })
    //         .then(data => {
    //             const section = document.createElement("div");
    //             section.innerHTML = `
    //                 <h2>${rank}</h2>
    //                 <pre>${JSON.stringify(data, null, 2)}</pre>
    //             `;
    //             outputDiv.appendChild(section);
    //         })
    //         .catch(error => {
    //             console.error(`Error fetching ${rank}:`, error);
    //         });
    // });
});
function generateMarine() {
    const marine = getRandomMarine();
    console.log(`Generated Marine: ${marine.rank} ${marine.f_name} ${marine.l_name}`);
}
function getRandomMarine() {
    const randomIndex = Math.floor(Math.random() * ranks.length);
    const randomRank = ranks[randomIndex];
    console.log("Random Rank:", randomRank);
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
        f_name: randomMarine.first_name,
    };
    
}