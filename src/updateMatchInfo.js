import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from './firebaseConfig.js';


function getDocIdFromUrl() {
    const params = new URL(window.location.href).searchParams;
    return params.get("docID");
}

document.getElementById("saveUpdateInfo").addEventListener("click", () => {
    updateMatchInfo();
})
document.getElementById("cancelUpdate").addEventListener("click", () => {
    console.log("Cancelled update")
    history.back()
})

async function getMatchInfo() {
    const id = getDocIdFromUrl();
    try {
        const matchDoc = await getDoc(doc(db, "Match",id));
        const matchData = matchDoc.data();

        let homeCountryElement = document.getElementById("homeCountry");
        let awayCountryElement = document.getElementById("awayCountry");
        let homePointsElement = document.getElementById("homePointsTextbox");
        let awayPointsElement = document.getElementById("awayPointsTextbox");
        let matchStatusElement = document.getElementById("matchStatusDropdown");

        homeCountryElement.textContent = `${matchData.home_team}'s Points`;
        awayCountryElement.textContent = `${matchData.away_team}'s Points`;
        homePointsElement.value = Number(matchData.home_points_scored);
        awayPointsElement.value = Number(matchData.away_points_scored);
        matchStatusElement.value = matchData.status;

    } catch {
        console.log("Error loading match info");
    }
}

async function updateMatchInfo() {
    const id = getDocIdFromUrl();
    const homePointsUpdated = document.getElementById("homePointsTextbox").value;
    const awayPointsUpdated = document.getElementById("awayPointsTextbox").value;
    const matchStatusUpdated = document.getElementById("matchStatusDropdown").value;
    try{
        await updateDoc(doc(db, "Match", id), {
        home_points_scored: Number(homePointsUpdated),
        away_points_scored: Number(awayPointsUpdated),
        status: matchStatusUpdated
    });} catch{
        console.error("Error updating document to firestore")
    }

    
}
document.addEventListener('DOMContentLoaded', getMatchInfo());
