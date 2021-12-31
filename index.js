const maxCardPerPage = 5;

var data;
var nextQuery;
var currentDataIndex = 0;
var currentPage = 0;
var createCardAction;

function init() {
  queryData();
}

function queryData() {
  console.log(`Start fetching page ${currentPage}...`);

  // Query options
  if (!nextQuery) {
    nextQuery = db.collection("feedback").orderBy("timestamp", "desc").limit(maxCardPerPage);
  }

  // Get query
  nextQuery.get().then((querySnapshot) => {
    data = querySnapshot.docs.map((doc) => Object.assign(doc.data(), { id: doc.id }));
  
    // Construct next query
    var lastDataID = querySnapshot.docs[querySnapshot.docs.length - 1];
    try {
      nextQuery = db.collection("feedback").orderBy("timestamp", "desc").startAfter(lastDataID).limit(maxCardPerPage);
    } catch (error) {
      // End of data
      console.log("End of data");
      document.querySelector(".loader").style.display = "none";
      document.removeEventListener("scroll", lazyLoad);
    }

    createCardAction = setInterval(createCard, 100);
    currentPage++;
  });
}

function createCard() {
  if (currentDataIndex >= data.length) {
    clearInterval(createCardAction);
    currentDataIndex = 0;
  } else {
    const element = data[currentDataIndex];

    // Create a card
    var cardTemplate = document.getElementsByTagName("template")[0];
    var card = cardTemplate.content.cloneNode(true);

    var type = card.querySelector(".card-type strong");
    type.innerHTML = element["type"];

    var timestamp = card.querySelector(".card-timestamp strong");
    timestamp.innerHTML = formatTimestamp(element["timestamp"].toString());

    var comment = card.querySelector(".card-comment");
    comment.innerHTML = element["comment"];

    var rating = card.querySelector(".card-rating");
    rating.innerHTML = formatRating(element["rating"]);

    // Put the card into parent at start
    var parent = document.querySelector(".content");
    parent.append(card);

    console.log("loaded feedback #" + (maxCardPerPage * (currentPage - 1) + currentDataIndex));

    currentDataIndex++;
  }
}

function formatTimestamp(timestamp) {
  return (
    timestamp.substring(0, 4) +
    "/" +
    timestamp.substring(4, 6) +
    "/" +
    timestamp.substring(6, 8) +
    " " +
    timestamp.substring(8, 10) +
    ":" +
    timestamp.substring(10, 12) +
    ":" +
    timestamp.substring(12, 14)
  );
}

function formatRating(rating) {
  switch (rating) {
    case 1:
      return "★☆☆☆☆";
    case 2:
      return "★★☆☆☆";
    case 3:
      return "★★★☆☆";
    case 4:
      return "★★★★☆";
    case 5:
      return "★★★★★";
    default:
      return "☆☆☆☆☆";
  }
}

window.onload = init();

function lazyLoad() {
  function getDocHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  }

  if (getDocHeight() <= window.pageYOffset + window.innerHeight) {
    queryData();
  }
}


document.addEventListener("scroll", lazyLoad);
