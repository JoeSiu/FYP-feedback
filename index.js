var data;
var currentDataIndex = 0;
var createCardAction;
const maxCardPerPage = 100;

function init() {
  queryData();
}

function queryData() {
  console.log("Start fetching...");

  var query;
  query = db.collection("feedback");

  // Temp
  // if (data == null) {
  //   query = db.collection("feedback");
  // } else {
  //   query = db.collection("feedback").startAfter(data);
  // }

  query
    .limit(maxCardPerPage + 1)
    .get()
    .then((querySnapshot) => {
      data = querySnapshot.docs.map((doc) => Object.assign(doc.data(), { id: doc.id }));
      // data = data.reverse();
      if (currentDataIndex != data.length) {
        createCardAction = setInterval(createCard, 100);
      }
    });
}

// Temp
function createCard() {
  if (currentDataIndex >= data.length) {
    clearInterval(createCardAction);
  } else {
    console.log("Create card...");
    var parent = document.querySelector(".content");

    const element = data[currentDataIndex];
    // Create a card
    var card = document.createElement("div");
    card.className = "card animate__animated animate__fadeInDown";
    
    card.appendChild(document.createTextNode(`#${currentDataIndex + 1}`));
    card.appendChild(document.createElement("br"));
    card.appendChild(document.createElement("br"));
    card.appendChild(document.createTextNode(`comment: ${element["comment"]}`));
    card.appendChild(document.createElement("br"));
    card.appendChild(document.createElement("br"));
    card.appendChild(document.createTextNode(`type: ${element["type"]}`));
    card.appendChild(document.createElement("br"));
    card.appendChild(document.createElement("br"));
    card.appendChild(document.createTextNode(`rating: ${element["rating"]}`));

    // Put the card into parent at start
    parent.prepend(card);
    console.log(element);

    currentDataIndex++;
  }
}

window.onload = init();
