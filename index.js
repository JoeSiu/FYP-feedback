const maxCardPerPage = 5;

var data;
var nextQuery;
var loading = false;
var currentDataIndex = 0;
var currentPage = 0;
var createCardAction;

function init() {
  queryData();
}

function queryData() {
  console.log(`Start fetching page ${currentPage}...`);

  loading = true;
  showloader(true);

  // Query options
  if (!nextQuery) {
    nextQuery = db.collection("feedback").orderBy("timestamp", "desc").limit(maxCardPerPage);
  }

  // Get query
  nextQuery.get().then((querySnapshot) => {
    data = querySnapshot.docs.map((doc) => Object.assign(doc.data(), { id: doc.id }));

    loading = false;
    showloader(false);

    // Construct next query
    var lastDataID = querySnapshot.docs[querySnapshot.docs.length - 1];
    try {
      nextQuery = db.collection("feedback").orderBy("timestamp", "desc").startAfter(lastDataID).limit(maxCardPerPage);
    } catch (error) {
      setEnd();
    }

    createCardAction = setInterval(createCard, 100);
    currentPage++;
  });
}

// End of data
function setEnd() {
  console.log("End of data");
  document.querySelector(".loader").style.display = "none";
  document.querySelector(".end").style.display = "block";
  document.removeEventListener("scroll", lazyLoad);
}

function showloader(isShow) {
  if (isShow) {
    document.querySelector(".loader").style.visibility = "visible";
  } else {
    document.querySelector(".loader").style.visibility = "hidden";
  }
}

function createCard() {
  if (currentDataIndex >= data.length) {
    clearInterval(createCardAction);
    currentDataIndex = 0;
  } else {
    const element = data[currentDataIndex];
    var cardIndex = (maxCardPerPage * (currentPage - 1) + currentDataIndex);

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

    var image = card.querySelector(".card-image");
    storageRef
      .child(`feedback/${element.id}`)
      .getDownloadURL()
      .then((url) => {
        image.src = url;
      })
      .catch(() => console.log(`No image available for feedback #${cardIndex} (${element.id})`));

    // Put the card into parent at start
    var parent = document.querySelector(".content");
    parent.append(card);

    console.log(`loaded feedback #${cardIndex} (${element.id})`);

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

  var offset = 10;
  if (getDocHeight() <= window.pageYOffset + window.innerHeight + offset) {
    if (!loading) {
      queryData();
    }
  }
}

document.addEventListener("scroll", lazyLoad);
