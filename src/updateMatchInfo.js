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
    const matchDoc = await getDoc(doc(db, "matches", match.uid));
    if (matchDoc.exists()){
        const homeCountryElement = document.getElementById("homeCountry");
        const awayCountryElement = document.getElementById("awayCountry");
        const homePointsElement = document.getElementById("homePointsTextbox").value;
        const awayPointsElement = document.getElementById("awayPointsTextbox").value;
        const matchStatusElement = document.getElementById("matchStatusDropdown").value;

        homeCountryElement = matchDoc.homeCountry;
        awayCountryElement = matchDoc.awayCountry;
        homePointsElement = matchDoc.homePoints;
        awayPointsElement = matchDoc.homePoints;
        matchStatusElement = matchDoc.homePoints;
      
    } else {
    console.log("matchID not found in firestore");
    }
}

async function updateMatchInfo(match) {
    const homePointsUpdated = document.getElementById("homePointsTextbox").value;
    const awayPointsUpdated = document.getElementById("awayPointsTextbox").value;
    const matchStatusUpdated = document.getElementById("matchStatusDropdown").value;

    await setDoc(doc(db, "matches", match.uid),{
        homePoints: homePointsUpdated,
        awayPoints: awayPointsUpdated,
        matchStatus: matchStatusUpdated
    });
}