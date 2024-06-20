
const DECISION_THRESHOLD = 120;
let isAnimating = false;
let pullDeltaX = 0; // distance moved during the pull

function handleTouchStart(event) {
  if (isAnimating) return;

  // get the first article element
  const currentCard = event.target.closest("article");
  if(!currentCard) return;

  // get initial position of mouse or finger when the touch starts
  const initialX = event.pageX ?? event.touches[0].pageX;

  // listen the mouse movements
  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleMoveEnd);

  // listen the touch movements
  document.addEventListener("touchstart", handleMove, { passive: true });
  document.addEventListener("touchend", handleMoveEnd, { passive: true });

  function handleMove(event) {
    const currentX = event.pageX ?? event.touches[0].pageX;
    pullDeltaX = currentX - initialX;

    if(pullDeltaX === 0) return;

    isAnimating = true;

    // calcutalate the degrees to rotate the card based on the distance moved
    const degrees = pullDeltaX / 14;

    currentCard.style.transform = `translate(${pullDeltaX}px) rotate(${degrees}deg)`;
    currentCard.style.cursor = "grabbing";
    // changing the choice opacity
    const opacity = Math.abs(pullDeltaX) / 100;
    const isRight = pullDeltaX > 0;

    const choiceEl = isRight 
        ? currentCard.querySelector(  ".choice.like" )
        : currentCard.querySelector( ".choice.nope" );

    choiceEl.style.opacity = opacity;
  }

  function handleMoveEnd(event) {
    // remove the event listeners
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleMoveEnd);

    document.removeEventListener("touchmove", handleMove);
    document.removeEventListener("touchend", handleMoveEnd);

    // reset the card position
    const decisionMade = Math.abs(pullDeltaX) > DECISION_THRESHOLD;

    if (decisionMade) {
        const goRight = pullDeltaX > 0;

        currentCard.classList.add(goRight ? "go-right" : "go-left");
        currentCard.addEventListener("transitionend", function() {
            currentCard.remove();
        }, { once: true });
    } else {
        currentCard.classList.add("reset");
        const choicesElements = currentCard.querySelectorAll(".choice");
        choicesElements.forEach((choice) => {
            choice.style.opacity = 0;
        });
        currentCard.classList.remove("go-right", "go-left");
    }

    // reset the variables
    currentCard.addEventListener("transitionend", function() {
        currentCard.removeAttribute("style");
        currentCard.classList.remove("reset");

        pullDeltaX = 0;
        isAnimating = false;
    }, { once: true });
  }
}

document.addEventListener("mousedown", handleTouchStart);
// passive true ignores the default behavior of the touch start event and adds it to the background
document.addEventListener("touchstart", handleTouchStart, { passive: true });
