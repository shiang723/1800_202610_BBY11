
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { checkAuthState } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import {collection, getDocs, addDoc } from "firebase/firestore";

// Helper function to add the sample quiz documents.
// Called when needed to seed quiz data into Firestore.
async function addQuizData() {
    const quizRef = collection(db, "quiz");

    console.log("Adding quiz data...");
    const quizDocRef = await addDoc(quizRef, { name: "FIFA Trivia", num_of_questions: 5, type: "trivia"});
    const questionsRef = await collection(db, "quiz", quizDocRef.id, "questions");
    addDoc(questionsRef, {
        question: "What year was FIFA founded?", 
        type: "multiple_choice_single",
        option_a: "1934",
        option_b: "1977",
        option_c: "1904",
        option_d: "1920",
        ans: "option_c",
        reward: 10 
    });

    addDoc(questionsRef, {
        question: "Who won the FIFA World Cup in 2022?", 
        type: "multiple_choice_single",
        option_a: "Morocco",
        option_b: "Argentina",
        option_c: "France",
        option_d: "Croatia",
        ans: "option_b", 
        reward: 10
    });

    addDoc(questionsRef, {
        question: "Where is FIFA World Cup 2026 Final being played?", 
        type: "multiple_choice_single",
        option_a: "New Jersey",
        option_b: "Mexico City",
        option_c: "Toronto",
        option_d: "Vancouver",
        ans: "option_a", 
        reward: 10
    });

    addDoc(questionsRef, {
        question: "How often is the World Cup held?", 
        type: "multiple_choice_single",
        option_a: "Every 2 years",
        option_b: "Every 4 years",
        option_c: "Every 1 year",
        option_d: "Every 6 years",
        ans: "option_b", 
        reward: 10
    });

    addDoc(questionsRef, {
        question: "Who is the all-time leading World Cup goalscorer?", 
        type: "multiple_choice_single",
        option_a: "Ronaldo",
        option_b: "Lionel Messi",
        option_c: "Gerd Muller",
        option_d: "Miroslav Klose",
        ans: "option_d", 
        reward: 10
    });

    
    const quizDocRef2 = await addDoc(quizRef, { name: "Survey", num_of_questions: 4, type:"survey"});
    const questionsRef2 = await collection(db, "quiz", quizDocRef2.id, "questions");

    addDoc(questionsRef2, {
        question: "How much time do you use our app for?", 
        type: "multiple_choice_single",
        option_a: "1 to 30 mins",
        option_b: "31 mins to 1 hr",
        option_c: "more than 1 hr",
        ans: "none",
        reward: 5
    });

    addDoc(questionsRef2, {
        question: "How many matches have you betted on?", 
        type: "multiple_choice_single",
        option_a: "none",
        option_b: "1-3",
        option_c: "4+",
        ans: "none",
        reward: 5
    });

    addDoc(questionsRef2, {
        question: "How would you rate our app currently?", 
        type: "multiple_choice_single",
        option_a: "1 star",
        option_b: "2 star",
        option_c: "3 star",
        option_d: "4 star",
        option_e: "5 star",
        ans: "none",
        reward: 5
    });

    addDoc(questionsRef2, {
        question: "Any comment?", 
        type: "text_large",
        ans: "none",
        reward: 5
    });


}

// Seeds the "quiz" collection with initial data if it is empty
async function seedQuiz() {

    // Get a reference to the "quiz" collection
    const quizRef = collection(db, "quiz");
    // Retrieve all documents currently in the collection
    const querySnapshot = await getDocs(quizRef);

    // If no documents exist, the collection is empty
    if (querySnapshot.empty) {

        console.log("Quiz collection is empty. Seeding data...");

        // Call function to insert default quiz documents
        addQuizData();

    } else {

        // If documents already exist, do not reseed
        console.log("Quiz collection already contains data. Skipping seed.");
    }
}

// Gets the quiz collection from Firestore and display each as a card using
// the quiz card template.
async function displayCardsDynamically() {
    let cardTemplate = document.getElementById("quizCardTemplate");
    const quizCollectionRef = collection(db, "quiz");

    try {
        const querySnapshot = await getDocs(quizCollectionRef);
        querySnapshot.forEach(docSnap => {
            // Clone the card template
            let newcard = cardTemplate.content.cloneNode(true);
            const quiz = docSnap.data(); // Get quiz data once

            // Populate the card with hike data
            newcard.querySelector('.card-title').textContent = quiz.name;
            newcard.querySelector('.card-text').textContent = quiz.type.charAt(0).toUpperCase() + quiz.type.slice(1);;
            newcard.querySelector('.card-length').textContent = quiz.num_of_questions;


            // Add the link with the document ID
            newcard.querySelector(".card").href = `quiz.html?docID=${docSnap.id}`;
            
            // Attach the new card to the container
            document.getElementById("quizMenu").appendChild(newcard);
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

// Check that user is logged in, redirect them if they are not.
await checkAuthState(); 

// try seeding quiz collection.
await seedQuiz();

// get and display the cards on the page.
await displayCardsDynamically();
