/*import { db, auth } from "./firebaseConfig.js"; // Added ./ to fix the path
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

async function saveGameHighlight(gameName, description) {
    try {
        // Gets the current user's UID
        const user = auth.currentUser;
        if (!user) {
            console.log("No user signed in!");
            alert("Please log in to post a highlight.");
            return;
        }

        // Performs the "Write" operation
        const docRef = await addDoc(collection(db, "highlights"), {
            game: gameName,
            desc: description,
            userID: user.uid,           
            timestamp: serverTimestamp() 
        });

        console.log("Highlight saved with ID: ", docRef.id);
        alert("Highlight successfully posted!");
        
        // Clears the form fields after successful write
        document.getElementById("gameInput").value = "";
        document.getElementById("descInput").value = "";

    } catch (error) {
        console.error("Error adding document: ", error);
    }
} 

// Triggers the function when the button is clicked
document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            const gameName = document.getElementById("gameInput").value;
            const description = document.getElementById("descInput").value;
            
            if (gameName && description) {
                saveGameHighlight(gameName, description);
            } else {
                alert("Please fill in both fields!");
            }
        });
    }
});*/