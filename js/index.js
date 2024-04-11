const selectedPoints = [];
const body = document.body;
const selectButton = document.getElementById("selectButton");
const pasteButton = document.getElementById("pasteButton");

// Function to handle word selection
function handleWordSelection(event) {
    const range = document.caretRangeFromPoint(event.clientX, event.clientY);
    const clickedPoint = range.cloneRange();
    clickedPoint.collapse(true);

    const firstClickIndicator = body.querySelector(".first-click-indicator");

    if (selectedPoints.length < 2) {
        selectedPoints.push(clickedPoint);

        // If the indicator node doesn't exist, create and insert it
        if (!firstClickIndicator) {
            const newIndicator = document.createElement("span");
            newIndicator.classList.add("first-click-indicator");
            clickedPoint.insertNode(newIndicator);
        }
    }

    if (selectedPoints.length === 2) {
        // Remove the indicator node if it exists
        if (firstClickIndicator) {
            firstClickIndicator.remove();
        }

        // Create a range that spans the two selected points
        const selectionRange = document.createRange();
        selectionRange.setStart(selectedPoints[0].startContainer, selectedPoints[0].startOffset);
        selectionRange.setEnd(selectedPoints[1].startContainer, selectedPoints[1].startOffset);

        // Log the selected text to the console
        const selectedText = selectionRange.toString();
        console.log("Selected Text:", selectedText);

        // Call the function to copy the selected text
        copyToClipboard(selectedText);

        // Highlight the selection
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(selectionRange);

        // Reset selection
        selectedPoints.length = 0;
    }
}

function copyToClipboard(text) {
    // Remove line breaks and extra whitespace
    const cleanText = text.replace(/\s+/g, " ").trim();

    // Console log the clean text
    console.log("Clean Text:", cleanText);

    const textarea = document.createElement("textarea");
    textarea.value = cleanText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

// Function to toggle word selection on the body
function toggleWordSelection() {
    if (!body.classList.contains("selectable")) {
        // Add event listener to allow word selection
        body.classList.add("selectable");
        body.addEventListener("click", handleWordSelection);
        console.log("You can now select text within the body.");
    } else {
        // Remove event listener to prevent further selections
        body.classList.remove("selectable");
        body.removeEventListener("click", handleWordSelection);
        console.log("Word selection within the body is disabled.");
    }
}

// Attach event listener to the select button
selectButton.addEventListener("click", function (event) {
    // Prevent the button click from being registered as the first click
    event.stopPropagation();
    // Toggle word selection
    toggleWordSelection();
});


// TODO: make paste button work
// TODO: create a function to handle pasting text
// TODO: test if images can be copied and pasted

let selectedInputField = null;

// Add event listener to all input fields
const inputFields = document.querySelectorAll(".inputField");
inputFields.forEach(inputField => {
    inputField.addEventListener("click", function () {
        selectedInputField = this;

        console.log(selectedInputField.dataset.textarea);
    });
});

function pasteText() {
    if (selectedInputField) {
        navigator.clipboard.readText().then(text => {
            selectedInputField.value += text;
        });
    }
}

if (pasteButton) {
    pasteButton.addEventListener("click", function (event) {
        pasteText();
    });
}

const menuBtn = document.getElementById("menuToggle");
const header = document.querySelector("header");
const main = document.querySelector("main");


menuBtn.addEventListener("click", function() {
    header.classList.toggle("open");
    // if (header.classList.contains("open")) {
    //     main.style.width = "calc(100dvw + 50%)";
    // } else {
    //     main.style.width = "100dvw";
    // }
    event.stopPropagation();
});

document.addEventListener("keyup", function(event) {
    // Check if the 't' key was pressed
    if (event.key === "t") {
        header.classList.toggle("open");
    }
});