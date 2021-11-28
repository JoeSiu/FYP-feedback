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

  if (data == null) {
    query = db.collection("feedback");
  } else {
    query = db.collection("feedback").startAfter(data);
  }

  query
    .limit(maxCardPerPage + 1)
    .get()
    .then((querySnapshot) => {
      data = querySnapshot.docs.map((doc) => Object.assign(doc.data(), { id: doc.id }));

      if (currentDataIndex != data.length) {
        createCardAction = setInterval(createCard, 100);
      }
    });
}

function createCard() {
  if (currentDataIndex >= data.length - 1) {
    clearInterval(createCardAction);
  } else {
    console.log("Create card...");
    var parent = document.querySelector(".content");

    const element = data[currentDataIndex];
    // Create a card
    var card = document.createElement("div");
    card.className = "card animate__animated animate__fadeInDown";
    card.textContent = `#${currentDataIndex + 1} | `;
    card.textContent += `comment: ${element["comment"]} | `;
    card.textContent += `type: ${element["type"]} | `;
    card.textContent += `rating: ${element["rating"]}`;

    // Put the card into parent at start
    parent.append(card);
    console.log(element);

    currentDataIndex++;
  }
}

window.onload = init();
