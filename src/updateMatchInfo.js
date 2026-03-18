import { doc, setDoc, getDoc } from "firebase/firestore";
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
        const matchDoc = await getDoc(doc(db, "Match", id));
        const matchData = matchDoc.data();

        const homeCountryElement = document.getElementById("homeCountry");
        const awayCountryElement = document.getElementById("awayCountry");
        const homePointsElement = document.getElementById("homePointsTextbox").value;
        const awayPointsElement = document.getElementById("awayPointsTextbox").value;
        const matchStatusElement = document.getElementById("matchStatusDropdown").value;

        homeCountryElement = matchData.home_team + " Points";
        awayCountryElement = matchData.away_team + " Points";
        homePointsElement = matchData.home_points_scored;
        awayPointsElement = matchData.away_points_scored;
        matchStatusElement = matchData.status;

    } catch {
        console.error("Error loading match info", error);
    }
}

async function updateMatchInfo() {
    const id = getDocIdFromUrl();
    const homePointsUpdated = document.getElementById("homePointsTextbox").value;
    const awayPointsUpdated = document.getElementById("awayPointsTextbox").value;
    const matchStatusUpdated = document.getElementById("matchStatusDropdown").value;
    try{
        await setDoc(doc(db, "Match", id), {
        home_points_scored: homePointsUpdated,
        away_points_scored: awayPointsUpdated,
        status: matchStatusUpdated
    });} catch{
        console.error("Error updating document to firestore", error)
    }

    
}
document.addEventListener('DOMContentLoaded', getMatchInfo());
