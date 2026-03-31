import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from './firebaseConfig.js';



function getDocId() {
    if (window.location.pathname == "/updateMatchInfo.html") {
        return localStorage.getItem('matchDocID');
    }
    else {
        const params = new URL(window.location.href).searchParams;
        return params.get("matchDocID");
    }
}

document.getElementById("saveUpdateInfo").addEventListener("click", async () => {
    await updateMatchInfo();
    await getMatchInfo();
    location.reload();
})
document.getElementById("cancelUpdate").addEventListener("click", () => {
    console.log("Cancelled update")
    history.back()
})

const updateMatchHCL = document.getElementById("homeCountry");
const updateMatchACL = document.getElementById("awayCountry");
const pointsInputH = document.getElementById("homePointsTextbox");
const pointsInputA = document.getElementById("awayPointsTextbox");
const statusSelect = document.getElementById("matchStatusDropdown");

export async function getMatchInfo(homeCountryLabel, awayCountryLabel, homePointsInput, awayPointsInput, matchStatusSelect) {
    const id = getDocId();
    try {
        const matchDoc = await getDoc(doc(db, "Match", id));
        const matchData = matchDoc.data();

        let homeCountryElement = homeCountryLabel;
        let awayCountryElement = awayCountryLabel;
        let homePointsElement = homePointsInput;
        let awayPointsElement = awayPointsInput;
        let matchStatusElement = matchStatusSelect;


        if (window.location.pathname == "/updateMatchInfo.html") {
            if (matchData.status == "upcoming") {
                homePointsElement.disabled = true;
                awayPointsElement.disabled = true;
            }

            else if (matchData.status == "done") {
                window.alert("Match is done, edit can not be made to match information.")
                history.back()
            }

        }

        homeCountryElement.textContent = `${matchData.home_team}'s Points:`;
        awayCountryElement.textContent = `${matchData.away_team}'s Points:`;
        homePointsElement.value = Number(matchData.home_points_scored);
        awayPointsElement.value = Number(matchData.away_points_scored);
        matchStatusElement.value = matchData.status;

    } catch(error) {
        console.log("Error loading match info: " + error );
    }
}

async function updateMatchInfo() {
    const id = getDocId();
    const matchStatusUpdated = document.getElementById("matchStatusDropdown").value;

    let homePointsUpdated;
    let awayPointsUpdated

    if (matchStatusUpdated == "upcoming") {
        homePointsUpdated = "0";
        awayPointsUpdated = "0";
    } else {
        homePointsUpdated = document.getElementById("homePointsTextbox").value;
        awayPointsUpdated = document.getElementById("awayPointsTextbox").value;
    }


    if (homePointsUpdated && awayPointsUpdated && matchStatusUpdated) {
        try {
            await updateDoc(doc(db, "Match", id), {
                home_points_scored: Number(homePointsUpdated),
                away_points_scored: Number(awayPointsUpdated),
                status: matchStatusUpdated
            });
            window.alert(`Sucessfully updated information for match`)
        } catch (error) {
            window.alert(error)
            console.error("Error updating document to firestore: " + error)
        }
    } else {
        window.alert("One of the input does not have a value. Please make sure each input has a valid value before saving.")
    }

}
document.addEventListener('DOMContentLoaded', getMatchInfo(updateMatchHCL, updateMatchACL, pointsInputH, pointsInputA, statusSelect));
