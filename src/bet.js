import { db, auth } from "./firebaseConfig.js";
import {
    doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp
} from "firebase/firestore";

// Helper: Get match document ID
// from URL param or localStorage
function getDocId() {
    const params = new URL(window.location.href).searchParams;
    return params.get("matchDocID") ?? localStorage.getItem("matchDocID");
}

// Load Match Info from Firestore
async function showMatchInfo() {
    const id = getDocId();

    // show team names
    const params = new URLSearchParams(window.location.search);
    const match = params.get("matchDocID");
    if (match) {
        const [team1, team2] = match.split("vs");
        document.getElementById("team1-name").textContent = team1;
        document.getElementById("team2-name").textContent = team2;
        document.getElementById("team1-label").textContent = team1;
        document.getElementById("team2-label").textContent = team2;
        document.getElementById("team1").value = team1;
        document.getElementById("team2").value = team2;
    }

    // Firestore for pool amounts
    try {
        const matchDoc = await getDoc(doc(db, "Match", id));
        if (!matchDoc.exists()) return;

        const matchData = matchDoc.data();

        // Overwrite with Firestore data if available
        document.getElementById("team1-name").textContent = matchData.home_team;
        document.getElementById("team2-name").textContent = matchData.away_team;
        document.getElementById("team1-label").textContent = matchData.home_team;
        document.getElementById("team2-label").textContent = matchData.away_team;
        document.getElementById("team1").value = matchData.home_team;
        document.getElementById("team2").value = matchData.away_team;
        document.getElementById("team1-pool").textContent = matchData.home_pool ?? 0;
        document.getElementById("team2-pool").textContent = matchData.away_pool ?? 0;

    } catch (error) {
        console.error("Error loading match info:", error);
    }
}

async function updateMatchPools(teamName, amount) {
    try {
        const matchId = getDocId();
        const matchRef = doc(db, "Match", matchId);

        const homeTeam = document.getElementById("team1-label").textContent;

        if (teamName === homeTeam) {
            await updateDoc(matchRef, { home_pool: increment(amount) });
        } else {
            await updateDoc(matchRef, { away_pool: increment(amount) });
        }

        console.log("Match pools updated");

    } catch (error) {
        console.error("Error updating match pools:", error);
    }
}

// user_bet subcollection
async function addNewUserBet(teamName, amount) {
    try {
        const user = auth.currentUser;
        const matchId = getDocId();

        const betsRef = collection(db, "users", user.uid, "user_bets");

        await addDoc(betsRef, {
            matchID: matchId,
            team: teamName,
            amount: amount,
            payment_status: "pending",
            result: null,
            created_at: serverTimestamp()
        });

        console.log("User bet saved");

    } catch (error) {
        console.error("Error saving bet:", error);
    }
}

// main
document.addEventListener("DOMContentLoaded", function () {

    showMatchInfo();

    document.getElementById("toBet").addEventListener("click", async function () {

        const selected = document.querySelector("input[name='bet']:checked");

        if (!selected) {
            alert("Please select a team!");
            return;
        }

        // Radio values are set to actual team names by showMatchInfo()
        const teamName = selected.value;

        const amount = parseInt(document.getElementById("bet").value);

        if (!amount || amount <= 0) {
            alert("Enter a valid bet amount!");
            return;
        }

        const user = auth.currentUser;

        if (!user) {
            alert("User not logged in.");
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);

            // Deduct points from user
            await updateDoc(userRef, {
                point: increment(-amount)
            });

            // Add amount to the correct team pool
            await updateMatchPools(teamName, amount);

            // Save the bet record under the user
            await addNewUserBet(teamName, amount);

            alert(`You bet ${amount} points on ${teamName}!`);

        } catch (error) {
            console.error("Error placing bet:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});