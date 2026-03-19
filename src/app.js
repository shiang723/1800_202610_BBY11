import { doc, getDoc, query, where, getDocs, increment, collection, writeBatch } from "firebase/firestore";
import { auth, db } from '/src/firebaseConfig.js';        //Firebase authentication connection

// Get the button by ID
const signUpBtn = document.getElementById('signUpBtn');

// Only run this if the button exists on the current page
if (signUpBtn) {
    signUpBtn.addEventListener('click', () => {
        // Redirect to your signup.html file
        window.location.href = 'SignUp.html';
    });
}

//for linking to updateMatchpage
export function saveMatchDocumentIDandRedirect() {
    const updateMatchButton = document.getElementById("updateInfoButton");

    if (updateMatchButton) {
        updateMatchButton.addEventListener("click", () => {
            const params = new URL(window.location.href);
            const matchID = params.searchParams.get("docID");

            if (!matchID) {
                console.warn("No match ID found in URL. Cannot continue.");
                return;
            }

            // Save the hike ID locally;  provide the key, and the value
            localStorage.setItem('matchDocID', matchID);

            // Redirect to the review page
            window.location.href = 'updateMatchInfo.html';
        })
    }

}


export async function payOutUser() {
    var user = auth.currentUser;

    if (!user) return;

    // Get the user's Firestore document from the "users" collection
    // Document ID is the user's unique UID
    try {
        const batch = writeBatch(db);
        const userRef = doc(db, "users", user.uid);
        const betsCollectionRef = collection(db, "users",user.uid, "user_bets");
        const queryUnpaidBets = query(betsCollectionRef, where("payment_status", "==", "pending"));
        const unpaidBets = await getDocs(queryUnpaidBets);

        for (const betdoc of unpaidBets.docs) {
            const unpaidBet = betdoc.data()
            const matchRef = await getDoc(doc(db, "Match", unpaidBet.matchID));
            const match = matchRef.data();

            if (match?.status === 'done') {
                if (unpaidBet.team === match.winner) {
                    const total_pool = match.home_pool + match.away_pool
                    const team_pool = (unpaidBet.team === match.home_team) ? match.home_pool : match.away_pool
                    const payoutPoints = Math.floor((unpaidBet.amount / team_pool) * total_pool);

                    batch.update(userRef, { point: increment(payoutPoints) })
                    console.log("user_bet: " + betdoc.id + " have been paid, user won " + payoutPoints)
                } else {
                    console.log("user_bet: " + betdoc.id + " have been paid, user lose")
                }
                batch.update(betdoc.ref, { payment_status: "paid" })
            }
        }
        await batch.commit();

    } catch (error) {
        console.error("Payout process failed:", error)
    }
}