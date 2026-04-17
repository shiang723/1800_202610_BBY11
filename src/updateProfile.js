import { isAdmin } from './app';
import { db } from '/src/firebaseConfig.js';        //Firebase authentication connection
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthReady, checkAuthState } from '/src/authentication.js';  //Perform logout action  


// Get and load the user information on updateProfile.html page.
// Called when page loads.
async function getUserInfo() {

    //The elements for each field on the html page.
    const emailElement = document.querySelector("#email");
    const userCountryElement = document.getElementById('country-select');
    const userProfilePicture = document.getElementById('profileImage');

    onAuthReady(async (user) => {
        if (user) {

            // Get the user's Firestore document from the "users" collection
            // Document ID is the user's unique UID
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const email = userDoc.exists()
                    ? user.email : "no email found";
                const country = userDoc.data().country;
                const profileImg = userDoc.exists() ?
                    "data:image/png;base64," + userDoc.data().profileImage :
                    "/images/user-square.png";

                // Update the elements with the data fetched from Firestore.
                if (emailElement) {
                    emailElement.innerHTML = String(email);
                }
                if (userCountryElement) {
                    userCountryElement.value = country;
                }
                if (userProfilePicture) {
                    document.getElementById("profileImage").src = profileImg;
                } else {
                    console.error("No image element found to display the profile image.");
                }
                if (await isAdmin()) {
                    document.getElementById("adminChoice").checked = true;
                } else {
                    document.getElementById("regularChoice").checked = true;
                }
            } catch (error) {
                console.error("Error loading user information: " + error);
            }
        } else {
            console.error("User not found: " + error);
        }
    });
}

//---------------------------------------------------
// Function to save the Base64 image to Firestore
// as a key value pair in the user's document. 
// (Template from Carly's tech tips (COMP 1800))
// Called when user chooses to update their profile img.
//---------------------------------------------------
async function saveProfileImage(base64String) {
    // Wait for the currently signed-in user
    onAuthReady(async (user) => {
        if (user) {
            const userId = user.uid;
            const userDocRef = doc(db, "users", userId);

            try {
                // Use setDoc with merge:true to avoid overwriting other fields
                await setDoc(userDocRef, { profileImage: base64String }, { merge: true });
            } catch (error) {
                console.error("Error saving profile image:", error);
            }
        } else {
            console.error("No user is signed in.");
        }
    });
}

//------------------------------------------------------------
// This function is an Event Listener for the file (image) picker
// When an image is chosen, it will then save that image into the
// user's document in Firestore
// (Template from Carly's tech tips (COMP 1800))
// Called when user chooses to update their profile img.
//-------------------------------------------------------------
function uploadImage() {
    console.log("Uploading img");
    // Attach event listener to the file input
    // Function to handle file selection and Base64 encoding
    var file = document.getElementById("profilePictureUploader").files[0]; // Get the selected file

    if (file) {
        var reader = new FileReader(); // Create a FileReader to read the file

        // When file reading is complete
        reader.onload = function (e) {
            var base64String = e.target.result.split(',')[1]; // Extract Base64 data

            // Save the Base64 string to Firestore under the user's profile
            saveProfileImage(base64String);
        };

        // Read the file as a Data URL (Base64 encoding)
        reader.readAsDataURL(file);
    }
}

// Listener for the Save button on the updateProfile.html page
// On click, update Firestore with the values on the page.
// Then reload page with new user information.
// Called when Save button is pressed.
document.getElementById("saveUpdateInfo").addEventListener("click", async () => {
    uploadImage();
    await updateProfileInfo();
    getUserInfo();
    window.alert("Your profile has been updated");
})

// Listener for the Cancel button on the updateProfile.html page
// On click, go back to previous page.
document.getElementById("cancelUpdate").addEventListener("click", () => {
    console.log("Cancelled update")  
    history.back()
})

// update the user information in Firestore.
// Called when save button is pressed.
async function updateProfileInfo() {
    
    //The elements for each relevant field on the html page.
    const country = document.getElementById('country-select').value;
    const accountType =  document.querySelector(`input[name="accountType"]:checked`).value;
    var admin;

    // Check which account type radio button is checked and assign boolean to admin.
    if (accountType == "admin") {
        admin = true;
    } else {
        admin = false;
    }

    onAuthReady(async (user) => {
        if (user) {
            try {
                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, { country: country, admin: admin })

            } catch (error) {
                console.error("Could not update user information: " + error);
            }
        }
    });
    location.reload();
}

// Check if user is logged in, redirect if no user found.
await checkAuthState(); 

// Load elements on the page.
getUserInfo();
