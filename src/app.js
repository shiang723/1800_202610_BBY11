import { doc, setDoc, getDoc, query, where, getDocs } from "firebase/firestore"; 
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
const updateMatchButton = document.getElementById("updateInfoButton");

if (updateMatchButton)
    updateMatchButton.addEventListener("click", () =>{
    window.location.href = "./updateMatchInfo.html"
})

async function payOutUser() {
        onAuthReady(async (user) => {
          if (!user && location.href == "main.html")  {
              // If no user is signed in → redirect back to login page.
              location.href = "index.html";
              return;
          }

            // Get the user's Firestore document from the "users" collection
            // Document ID is the user's unique UID
            const userDoc =  await getDoc(doc(db, "users", user.uid)); 
            const userBetsCollection = await collection(db, "users", user.uid, "user_bets"); 
            const queryUnpaidBets = query(userBetsCollection, where("payment_status", "==", "pending"));
            const unpaidBets = await getDocs(queryUnpaidBets);
            
            unpaidBets.forEach((doc) =>{
                const unpaidBet = doc.data()
                const match = getDoc(doc(db, "Match", unpaidBet.matchID)).data();
                if (match.status == 'done' && unpaidBet.team == match.winner){
                    const total_pool = match.home_pool + match.away_pool
                    var payoutPoints;
                    const userPoints = userDoc.data().points
                    if (unpaidBet.team == home_team){
                        payoutPoints = Math.floor((unpaidBet.amount/(match.home_pool))*total_pool)
                    }
                    else if (unpaidBet.team == away_team){
                        payoutPoints = Math.floor((unpaidBet.amount/(match.away_pool))*total_pool)
                    }
                    else{
                        console.error("No payout amount found", error)
                    }
                    setDoc(userDoc, {points: payoutPoints+userPoints})
                    setDoc(doc, {payment_status: "paid"})
                    console.log("user_bet: " + doc.id +  " have been paid, user won")
                } else {
                    setDoc(doc, {payment_status: "paid"})
                    console.log("user_bet: " + doc.id +  " have been paid, user lose")
                }
            })


            
    });
    
}