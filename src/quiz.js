import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { checkAuthState, onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { collection, doc, getDoc, getAggregateFromServer, sum, getDocs, updateDoc, increment, addDoc } from "firebase/firestore";

// To get the document ID of the quiz
// Is used in functions below to access the quiz document.
function getDocId() {
    const params = new URLSearchParams(window.location.search);
    let id = params.get("docID");

    // If not in URL, check localStorage
    if (!id) {
        id = localStorage.getItem('docID');
    }

    return id;
}

// Get the document of the given quiz docID.
// Get and display the data from Firestore on the page.
// Is called when page loads.
async function loadQuizPage() {
    const quizID = getDocId();
    const quizRef = await getDoc(doc(db, "quiz", quizID));

    const questionCollectionRef = collection(db, "quiz", quizID, "questions");

    var quizTitle = document.querySelector(".pageTitle");
    var quizLength = document.querySelector("#quizLength");
    var quizWorth = document.querySelector("#maxPoints");

    if (quizRef) {
        quizTitle.textContent = quizRef.data().name;
        quizLength.textContent = quizRef.data().num_of_questions;

        if (questionCollectionRef) {

            const maxPoints = await getAggregateFromServer(questionCollectionRef, {
                totalReward: sum('reward')
            });
            quizWorth.textContent = maxPoints.data().totalReward;
        }

    }
}

// Dynamically get and display the questions of the quiz
// Get the questions subcollection from Firestore and display them according to its type.
// Is called when page loads.
async function displayQuestionsDynamically() {
    const quizID = getDocId();
    const quizRef = await getDoc(doc(db, "quiz", quizID));
    const questionCollectionRef = collection(db, "quiz", quizID, "questions");
    let questionTemplate = document.getElementById("quizQuestion");;
    try {
        const querySnapshot = await getDocs(questionCollectionRef);
        querySnapshot.forEach((q) => {
            var questionData = q.data();

            let newQuestion = questionTemplate.content.cloneNode(true);

            newQuestion.querySelector(".questionTitle").textContent = questionData.question;
            newQuestion.querySelector(".maxReward").textContent = questionData.reward;

            if (questionData.type == "multiple_choice_single") {
                createMultipleChoiceQuestion(newQuestion, q, questionData, quizRef);
            }

            else if (questionData.type == "text_large") {

                createLargeTextQuestion(newQuestion, q);
            }
        })
    } catch (error) {
        console.error("Error getting documents: ", error);
    }

}

// Helper function that uses the multipleChoiceOption template to create a multiple question to display
// on the page given the data from Firestore
// Is used when the question is a multiple_choice_single type.
function createMultipleChoiceQuestion(newQuestion, q, questionData, quizRef) {
    newQuestion.querySelector(".questionType").textContent = "Multiple Choice (Select One)";
    let optionTemplate = newQuestion.getElementById('multpleChoiceOption');

    Object.keys(questionData).sort().forEach(key => {
        if (key.startsWith('option_')) {
            let newOption = optionTemplate.content.cloneNode(true);
            newOption.querySelector(".form-check-input").name = q.id;
            newOption.querySelector(".form-check-input").id = `${q.id}${key}`;
            newOption.querySelector(".form-check-label").htmlFor = `${q.id}${key}`;
            newOption.querySelector(".form-check-label").textContent = questionData[key];
            if (quizRef.data().type == "trivia") {
                newOption.querySelector(".form-check-input").value = key;
            } else {
                newOption.querySelector(".form-check-input").value = questionData[key];
            }

            newQuestion.appendChild(newOption);
        }
    })
    document.getElementById("quizForm").appendChild(newQuestion);
}

// Helper function that uses the quizTextInput template to create a large text question to display
// on the page given the data from Firestore
// Is used when the question is a text_large type.
function createLargeTextQuestion(newQuestion, q) {
    newQuestion.querySelector(".questionType").textContent = "Type your answer in the box below.";
    let optionTemplate = newQuestion.getElementById('quizTextInput');

    let newTextBox = optionTemplate.content.cloneNode(true);
    newTextBox.querySelector(".form-text").rows = 3;
    newTextBox.querySelector(".form-text").id = q.id;
    newTextBox.querySelector(".form-text").name = q.id;

    newQuestion.appendChild(newTextBox);
    document.getElementById("quizForm").appendChild(newQuestion);
}

// Get the answers from the quiz form and tallies up the amount of points the user earned.
// Add that amount of points to the user's account and exit out of the quiz.
// Is called when the user submits the quiz form.
async function updatePoints(form) {
    const quizID = getDocId();
    const quizRef = await getDoc(doc(db, "quiz", quizID));
    const formData = new FormData(form)
    const quizData = quizRef.data();
    const questionCollectionRef = collection(db, "quiz", quizID, "questions");

    onAuthReady(async (user) => {
        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                if (quizData.type === "survey") {
                    const payOutPoints = getAggregateFromServer(questionCollectionRef, {
                        totalReward: sum('reward')
                    });
                    updateDoc(userRef, { point: increment((await payOutPoints).data().totalReward) });

                    const questionsRef = await collection(db, "quiz", quizID, "entries");
                    await addDoc(questionsRef, {
                        userID: user.uid,
                        answers: Array.from(formData.values())
                    });

                    window.alert("You have earned " + (await payOutPoints).data().totalReward + " points. Thank you for taking our survey.");
                }
                else if (quizData.type === "trivia") {
                    let totalPoints = 0;
                    let correct = 0;
                    for (const [key, value] of formData.entries()) {
                        const questionDoc = await getDoc(doc(db, "quiz", quizID, "questions", key));
                        if (String(value) === questionDoc.data().ans) {
                            totalPoints += questionDoc.data().reward;
                            correct += 1;
                        }
                    }
                    await updateDoc(userRef, { point: increment(totalPoints) });
                    window.alert("You have earned " + totalPoints + " points. You got " + correct + " correct.");
                }
                window.history.back();
            } catch (e) {
                console.error("Could not find a user: " + e);
            }
        }
    })
}

// Add a listener for the document.
// When DOM Contents are loaded, add a listener to the submit button.
// Prevent default submission action give form data to updatePoints.
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("quizFormFull").addEventListener('submit', function (event) {
        event.preventDefault();
        const form = document.querySelector('#quizFormFull');
        updatePoints(form)
    })
})

// Check if user is logged in, redirect if no user.
await checkAuthState();

// Load the elements of the page.
await loadQuizPage();
await displayQuestionsDynamically();