import { onAuthReady } from "./authentication.js"
import { doc, getDoc } from "firebase/firestore";
import { db } from '/src/firebaseConfig.js';
import { isAdmin } from '/src/app.js';

// Function to load the header
function loadHeader() {
    fetch("header.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not find header.html");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("Header").innerHTML = data;
            onAuthReady(async (user) => {
                if (user) {
                    try {
                        loadProfilePicture()
                        loadPoints()
                    } catch (error) {
                        console.log("No user found " + e);
                    }
                } else {
                    loadLogin()
                } 
            })
        })
        .catch(error => {
            console.error("Error loading header:", error);
        });
}

async function loadProfilePicture() {
    const profileImg = document.querySelector(".profile-pic");

    onAuthReady(async (user) => {
        if (user) {

            // Get the user's Firestore document from the "users" collection
            // Document ID is the user's unique UID
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const userProfilePicture = userDoc.exists() ?
                    "data:image/png;base64," + userDoc.data().profileImage :
                    "/images/user-square.png";
                if (profileImg) {
                    profileImg.src = userProfilePicture;
                    if (await isAdmin() == true) {
                        profileImg.style.outline = "2px solid #009933";
                    }
                } else {
                    console.error("No image element found to display the profile image.");
                }
            }
            catch (error) {
                console.error("Error loading user information: " + error);
            }
        }
    });
}

async function loadPoints() {
    const pointDisplay = document.getElementById("point-display");

    onAuthReady(async (user) => {
        if (user) {

            // Get the user's Firestore document from the "users" collection
            // Document ID is the user's unique UID
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const userPoint = userDoc.data().point;
                if (pointDisplay) {
                    pointDisplay.textContent = userPoint;
                } else {
                    console.error("No point text element found to display the points.");
                }
            }
            catch (error) {
                console.error("Error loading user information: " + error);
            }
        }
    });
}

async function loadLogin(){
    const userInfo = document.querySelector(".user-info");

    userInfo.style.display = "none";
    const loginButton = `<button class = "btn btn-light" id = "log-in-button">Log In</button>`
    document.querySelector(".navbar-top").insertAdjacentHTML("beforeend",loginButton);


    document.getElementById('log-in-button').addEventListener("click", ()=> {
        window.location = "login.html";
    })
}


// Runs the function when the page loads
window.onload = loadHeader;
