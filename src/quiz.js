
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { checkAuthState, onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { collection, doc, getDoc, getAggregateFromServer, sum, getDocs, updateDoc, increment, addDoc } from "firebase/firestore";



function getDocId() {
    const params = new URLSearchParams(window.location.search);
    let id = params.get("docID");


    // If not in URL, check localStorage
    if (!id) {
        id = localStorage.getItem('docID');
    }

    return id;
}


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

            else if (questionData.type == "text_large") {

                newQuestion.querySelector(".questionType").textContent = "Type your answer in the box below.";
                let optionTemplate = newQuestion.getElementById('quizTextInput');

                let newTextBox = optionTemplate.content.cloneNode(true);
                newTextBox.querySelector(".form-text").rows = 3;
                newTextBox.querySelector(".form-text").id = q.id;
                newTextBox.querySelector(".form-text").name = q.id;

                newQuestion.appendChild(newTextBox);
                document.getElementById("quizForm").appendChild(newQuestion);
            }
        })
    } catch (error) {
        console.error("Error getting documents: ", error);
    }

}

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
                        totalReward: sum('reward')})
                    updateDoc(userRef, { point: increment((await payOutPoints).data().totalReward) });

                    const questionsRef = await collection(db, "quiz", quizID, "entries");
                    await addDoc(questionsRef, {
                        userID: user.uid,
                        answers:  Array.from(formData.values())
                    })

                    window.alert("You have earned " + (await payOutPoints).data().totalReward + " points. Thank you for taking our survey.");
                }
                else if (quizData.type === "trivia") {
                    let totalPoints = 0;
                    let correct = 0;
                    for (const [key, value] of formData.entries()) {
                        const questionDoc = await getDoc(doc (db, "quiz", quizID, "questions", key));
                        if (String(value) === questionDoc.data().ans){
                            totalPoints+= questionDoc.data().reward;
                            correct += 1;
                            
                        }
                    }
                    await updateDoc(userRef, { point: increment(totalPoints)});
                    window.alert("You have earned " + totalPoints + " points. You got " + correct + " correct.");
                }
                window.history.back();
                
            } catch (e) {
                console.error("Could not find a user: " + e);
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("quizFormFull").addEventListener('submit', function (event) {
        event.preventDefault();
        const form = document.querySelector('#quizFormFull');
        updatePoints(form)
    })
})
await checkAuthState();
await loadQuizPage();
await displayQuestionsDynamically();