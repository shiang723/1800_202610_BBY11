// Import specific functions from the Firebase Auth SDK
import { onAuthStateChanged } from "firebase/auth";     //Detect login state
import { auth, db } from '/src/firebaseConfig.js';        //Firebase authentication connection
import { logoutUser, onAuthReady, checkAuthState } from '/src/authentication.js';  //Perform logout action  
import { doc, getDoc } from "firebase/firestore";
import { isAdmin } from "/src/app.js"

// Initialize and handles the log out action for the log out button on the profile menu.
// Is initialized when the DOMContent on the page are loaded.
function initAuthUI() {
    const signOutBtn = document.getElementById('logoutButton');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            signOutBtn?.addEventListener('click', logoutUser);
        }
    });
}

// The elements that display the user information on the page.
const usernameElement = document.getElementById('user_name')
const userPointsElement = document.getElementById('user_point');
const userCountryElement = document.getElementById('support_country');
const userProfilePicture = document.getElementById('profile_pic');

// Get and assign the user's information to display on the page.
// Is called when the page is loaded.
function getUserInfo() {
    onAuthReady(async (user) => {
        if (user) {
            try {
                // Get the user's Firestore document from the "users" collection
                // Document ID is the user's unique UID
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const name = userDoc.exists()
                    ? userDoc.data().name
                    : user.displayName || user.email;
                const points = userDoc.data().point;
                const country = userDoc.data().country;
                const profileImg = userDoc.exists() ?
                    "data:image/png;base64," + userDoc.data().profileImage :
                    "/images/user-square.png";

                // Assign values to html elements on page.
                if (usernameElement) {
                    usernameElement.textContent = name;
                }
                if (userPointsElement) {
                    userPointsElement.textContent = points;
                }
                if (userCountryElement) {
                    userCountryElement.textContent = country;
                }
                if (userProfilePicture) {
                    userProfilePicture.src = profileImg;
                    if (await isAdmin() == true) {
                        userProfilePicture.style.outline = "2px solid #009933";
                        document.getElementById('user_type').textContent = "User Status: Admin";
                    } else {
                        document.getElementById('user_type').textContent = "User Status: Regular User";
                    }

                } else {
                    console.error("No image element found to display the profile image.");
                }
            } catch (e) {
                console.error("Can't find user: " + e);
            }
        }

    });
}

// Check if user is logged in and redirect if they are not.
await checkAuthState();

// Load the elements on the page.
document.addEventListener('DOMContentLoaded', initAuthUI);
getUserInfo();