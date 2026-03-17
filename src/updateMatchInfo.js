import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { db } from '/src/firebaseConfig.js'; 

document.getElementById("updateInfoButton").addEventListener("click", () =>{
    getMatchInfo(match);
})

document.getElementById("saveUpdateInfo").addEventListener("click", () =>{
    updateMatchInfo(match);
})
document.getElementById("cancelUpdate").addEventListener("click", () =>{
    history.back()
})

async function getMatchInfo(match) {
    const matchDoc = await getDoc(doc(db, "Match", match.uid));
    if (matchDoc.exists()){
        const homeCountryElement = document.getElementById("homeCountry");
        const awayCountryElement = document.getElementById("awayCountry");
        const homePointsElement = document.getElementById("homePointsTextbox").value;
        const awayPointsElement = document.getElementById("awayPointsTextbox").value;
        const matchStatusElement = document.getElementById("matchStatusDropdown").value;

        homeCountryElement = matchDoc.home_team + " Points";
        awayCountryElement = matchDoc.away_team + " Points";
        homePointsElement = matchDoc.home_points_scored;
        awayPointsElement = matchDoc.away_points_scored;
        matchStatusElement = matchDoc.status;
      
    } else {
    console.log("matchID not found in firestore");
    }
}

async function updateMatchInfo(match) {
    const homePointsUpdated = document.getElementById("homePointsTextbox").value;
    const awayPointsUpdated = document.getElementById("awayPointsTextbox").value;
    const matchStatusUpdated = document.getElementById("matchStatusDropdown").value;

    await setDoc(doc(db, "Match", match.uid),{
        home_points_scored: homePointsUpdated,
        away_points_scored: awayPointsUpdated,
        status: matchStatusUpdated
    });
}