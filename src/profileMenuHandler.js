// Import specific functions from the Firebase Auth SDK
import {onAuthStateChanged} from "firebase/auth";     //Detect login state
import { auth, db } from '/src/firebaseConfig.js';        //Firebase authentication connection
import { logoutUser, onAuthReady } from '/src/authentication.js';  //Perform logout action  
import { doc, getDoc } from "firebase/firestore";

function initAuthUI() {

    const signOutBtn = document.getElementById('logoutButton');
  
    onAuthStateChanged(auth, (user) => {
        if (user) {
           signOutBtn?.addEventListener('click', logoutUser);
        // } else {
        //     updatedAuthControl = `<a class="btn btn-outline-light" id="loginBtn" href="/login.html" style="min-width: 80px;">Log in</a>`;
        //     authControls.innerHTML = updatedAuthControl;
            }
    });
}
function getUserInfo(){
    const usernameElement = document.getElementById('user_name')
    const userPoints = document.getElementById('user_point');
    const userCountry = document.getElementById('support_country');


    onAuthReady(async (user) => {
          if (!user && location.href == "main.html")  {
              // If no user is signed in → redirect back to login page.
              location.href = "index.html";
              return;
          }

            // Get the user's Firestore document from the "users" collection
            // Document ID is the user's unique UID
            const userDoc = await getDoc(doc(db, "users", user.uid)); 
            const name = userDoc.exists()
                ? userDoc.data().name
                : user.displayName || user.email;
            const points = userDoc.exists()
                ? userDoc.data().point
                :"None";
            const country = userDoc.exists()
                ? userDoc.data().country
                :"None";
                
          // Update the welcome message with their name/email.
          if (usernameElement) {
              usernameElement.textContent = name;
          }
          if (userPoints) {
              userPoints.textContent = points;
          }
           if (userCountry) {
              userCountry.textContent = country;
          }
    });
}
document.addEventListener('DOMContentLoaded', initAuthUI);
getUserInfo();