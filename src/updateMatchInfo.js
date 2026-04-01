import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from './firebaseConfig.js';


function getDocId() {
   const params = new URLSearchParams(window.location.search);
   let id = params.get("docID");


   // If not in URL, check localStorage
   if (!id) {
       id = localStorage.getItem('matchDocID');
   }


   console.log("Current Match ID being used:", id); // This will show in your console
   return id;
}


// Function to pull current info from Firebase and fill the textboxes
export async function getMatchInfo() {
   const id = getDocId();
   if (!id) {
       console.error("No Match ID found to load info.");
       return;
   }


   try {
       const matchDoc = await getDoc(doc(db, "Match", id));
       if (matchDoc.exists()) {
           const matchData = matchDoc.data();


           // Select elements
           const homeCountryElement = document.getElementById("homeCountry");
           const awayCountryElement = document.getElementById("awayCountry");
           const homePointsElement = document.getElementById("homePointsTextbox");
           const awayPointsElement = document.getElementById("awayPointsTextbox");
           const matchStatusElement = document.getElementById("matchStatusDropdown");


           // Logic for status
           if (matchData.status === "done") {
               window.alert("Match is done, edits cannot be made.");
               history.back();
               return;
           }


           if (matchData.status === "upcoming") {
               homePointsElement.disabled = true;
               awayPointsElement.disabled = true;
           }


           // Fill UI
           homeCountryElement.textContent = `${matchData.home_team}'s Points:`;
           awayCountryElement.textContent = `${matchData.away_team}'s Points:`;
           homePointsElement.value = Number(matchData.home_points_scored);
           awayPointsElement.value = Number(matchData.away_points_scored);
           matchStatusElement.value = matchData.status;
       }
   } catch (error) {
       console.error("Error loading match info:", error);
   }
}


// Function to save new info to Firebase
async function updateMatchInfo() {
   const id = getDocId();
   const matchStatusUpdated = document.getElementById("matchStatusDropdown").value;
   const homePointsRaw = document.getElementById("homePointsTextbox").value;
   const awayPointsRaw = document.getElementById("awayPointsTextbox").value;


   const hTeam = document.getElementById("homeCountry").textContent.replace("'s Points:", "").trim();
   const aTeam = document.getElementById("awayCountry").textContent.replace("'s Points:", "").trim();


   if (homePointsRaw !== "" && awayPointsRaw !== "" && matchStatusUpdated !== "") {
       try {
          
           await setDoc(doc(db, "Match", id), {
               away_points_scored: Number(awayPointsRaw),
               away_team: aTeam,
               home_points_scored: Number(homePointsRaw),
               home_team: hTeam,
               matchID: id,
               start_date: "2026-06-13T12:00:00", // You can replace with a date input value later
               status: matchStatusUpdated,
               time_start: "June 13, 26 12:00 P.M." // You can replace with a time input value later
           }, { merge: true });


           window.alert(`Successfully updated information for match`);
           window.location.href = `Match_Details.html?docID=${id}`;
       } catch (error) {
           console.error("Error updating document:", error);
           window.alert("Firebase Error: " + error.message);
       }
   } else {
       window.alert("Please make sure each input has a valid value.");
   }
}


// --- SINGLE INITIALIZATION BLOCK ---
document.addEventListener('DOMContentLoaded', () => {
   // 1. Load the initial data
   getMatchInfo();


   // 2. Attach Save Listener
   const saveBtn = document.getElementById("saveUpdateInfo");
   if (saveBtn) {
       saveBtn.addEventListener("click", async (e) => {
           e.preventDefault();
           await updateMatchInfo();
       });
   }


   // 3. Attach Cancel Listener
   const cancelBtn = document.getElementById("cancelUpdate");
   if (cancelBtn) {
       cancelBtn.addEventListener("click", (e) => {
           e.preventDefault();
           history.back();
       });
   }
});
