var data;
var currentDataIndex = 0;
var createCardAction;

function init() {
  fetchData();

  // setInterval(fetchData, 5000);
}

function fetchData() {
  console.log("Start fetching...");
  db.collection("feedback")
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
    parent.prepend(card);
    console.log(element);

    currentDataIndex++;
  }
}

window.onload = init();
