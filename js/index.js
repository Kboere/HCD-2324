let selectedPoints = [];
let isEventListenerAttached = false;
let paragraphs = document.querySelectorAll("#paragraph");
let selectButton = document.getElementById("selectButton");

// Function to handle word selection
function handleWordSelection(event) {
    let range = document.caretRangeFromPoint(event.clientX, event.clientY);
    let clickedPoint = range.cloneRange();
    clickedPoint.collapse(true);

    if (selectedPoints.length < 2) {
        selectedPoints.push(clickedPoint);
    }

    if (selectedPoints.length === 2) {
        // Remove the highlighted class from previously selected words
        document.querySelectorAll(".highlighted").forEach(element => {
            element.classList.remove("highlighted");
        });

        // Create a range that spans the two selected points
        let selectionRange = document.createRange();
        selectionRange.setStart(selectedPoints[0].startContainer, selectedPoints[0].startOffset);
        selectionRange.setEnd(selectedPoints[1].startContainer, selectedPoints[1].startOffset);

        // Log the selected text to the console
        let selectedText = selectionRange.toString();
        console.log("Selected Text:", selectedText);

        // Copy the selected text to the clipboard
        navigator.clipboard.writeText(selectedText)
            .then(() => console.log('Text copied to clipboard'))
            .catch(err => console.error('Could not copy text: ', err));

        // Highlight the selection
        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(selectionRange);

        // Reset selection
        selectedPoints = [];
    }
}

// Function to toggle word selection on all paragraphs
function toggleWordSelection() {
    paragraphs.forEach(paragraph => {
        if (isEventListenerAttached) {
            paragraph.removeEventListener("click", handleWordSelection);
            paragraph.classList.remove("selectable");
        } else {
            paragraph.addEventListener("click", handleWordSelection);
            paragraph.classList.add("selectable");
        }
    });

    isEventListenerAttached = !isEventListenerAttached;

    if (isEventListenerAttached) {
        console.log("je kunt selecteren");
    } else {
        console.log("je kunt niet selecteren");
    }
}

// Attach event listener to the select button
selectButton.addEventListener("click", toggleWordSelection);
