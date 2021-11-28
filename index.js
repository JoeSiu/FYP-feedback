// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyD3UyYTi6GvbrM6P05EtGfRHHjKwq3J6Jw",
  authDomain: "botpulation.firebaseapp.com",
  projectId: "botpulation",
});

var db = firebase.firestore();
var data;
var prevDataLength = 0;

function init() {
  fetchData();

  setInterval(fetchData, 5000);
}

function fetchData() {
  console.log("Start fetching...");
  db.collection("feedback")
    .get()
    .then((querySnapshot) => {
      data = querySnapshot.docs.map((doc) => Object.assign(doc.data(), { id: doc.id }));
      
      if (prevDataLength != data.length) {
        createCard();
        prevDataLength = data.length;
      }
    });
}

function createCard() {
  console.log("Create card...");
  var parent = document.querySelector(".content");

  for (let index = prevDataLength; index < data.length; index++) {
    const element = data[index];
    // Create a card
    var card = document.createElement("div");
    card.className = "card";
    card.textContent = `#${index + 1} | `;
    card.textContent += `comment: ${element["comment"]} | `;
    card.textContent += `type: ${element["type"]} | `;
    card.textContent += `rating: ${element["rating"]}`;

    // Put the card into parent at start
    parent.prepend(card);
    console.log(element);
  }
}

window.onload = init();
