const selectedPoints = [];
const popup = document.getElementById("popup");
const body = document.body;
let selectedInputField = null;
let isTextSelectionActive = false; // Flag to track if text selection is active

function handleWordSelection(event) {
    if (!body.classList.contains("dragging") && isTextSelectionActive) {
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

                popup.style.display = "block";
                popup.textContent = "1 woord geselecteerd, selecteer nog 1 woord om te kopiëren.";
            }
        }

        if (selectedPoints.length === 2) {

            body.removeEventListener("click", handleWordSelection);
            body.classList.remove("selectable");
            body.classList.add("dragging");
            isTextSelectionActive = false;
            console.log("Word selection within the body is disabled.");
            popup.style.display = "none";

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

            popup.style.display = "block";
            popup.textContent = "De geselecteerde tekst is gekopieerd naar het klembord!";
            popup.classList.add("hide");

            // Reset selection
            selectedPoints.length = 0;
        }

        // popup.classList.add("hide");
    }
}

body.addEventListener('mousemove', function(event) {
    if (selectedPoints.length === 1) {
        const clickedPoint = document.caretRangeFromPoint(event.clientX, event.clientY);
        const selectionRange = document.createRange();
        selectionRange.setStart(selectedPoints[0].startContainer, selectedPoints[0].startOffset);
        selectionRange.setEnd(clickedPoint.startContainer, clickedPoint.startOffset);

        const selectedText = selectionRange.toString().trim();

        // Apply the selection to the document
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(selectionRange);
    }
});

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
        body.classList.remove("dragging");
        body.addEventListener("click", handleWordSelection);
        isTextSelectionActive = true;
        console.log("You can now select text within the body.");
    } else {
        // Remove event listener to prevent further selections
        body.classList.remove("selectable");
        body.classList.add("dragging");
        body.removeEventListener("click", handleWordSelection);
        isTextSelectionActive = false;
        console.log("Word selection within the body is disabled.");
    }
}

function pasteText() {
    if (selectedInputField) {
        navigator.clipboard.readText().then(text => {
            selectedInputField.value += text;

            popup.style.display = "block";
            popup.textContent = "De gekopieerde tekst is geplakt!";
            popup.classList.add("hide");

            // set a timeout of 6 seconds to remove the hide class of the popup
            setTimeout(() => {
                popup.classList.remove("hide");
                popup.style.display = "none";
            }, 7000);
        });
    }
}

function copyInput() {
    const textarea = document.getElementById('paste');
    event.stopPropagation();
    if (textarea) {
        textarea.select();
        document.execCommand("copy");

        popup.classList.add("hide");
        popup.style.display = "block";
        popup.textContent = "De nieuwe tekst is gekopieerd naar het klembord!";

        // set a timeout of 6 seconds to remove the hide class of the popup
        setTimeout(() => {
            popup.classList.remove("hide");
            popup.style.display = "none";
        }, 7000);
    }
}

function emptyInput() {
    const textarea = document.getElementById('paste');
    event.stopPropagation();
    if (textarea) {
        textarea.value = '';

        popup.classList.add("hide");
        popup.style.display = "block";
        popup.textContent = "het tekstveld is leeg gemaakt!";
    }
}

function sendToWhatsApp() {
    event.stopPropagation();
    const inputField = document.getElementById("paste").value;

    if (inputField === "") {
        popup.classList.add("hide");
        popup.style.display = "block";
        popup.textContent = "Je hebt geen tekst o te versturen!";
    } else {
        const encodedText = encodeURIComponent(inputField);
        const whatsappUrl = "https://api.whatsapp.com/send?text=" + encodedText;
        window.open(whatsappUrl, '_blank');
    }
    // const encodedText = encodeURIComponent(inputField);
    // const whatsappUrl = "https://api.whatsapp.com/send?text=" + encodedText;
    // window.open(whatsappUrl, '_blank');
}


const moveUpButton = document.getElementById("moveUp");
moveUpButton.addEventListener("click", () => {
    const mainElement = document.querySelector("main");
    mainElement.scrollTop -= 100; 
    event.stopPropagation();
});
const moveDownButton = document.getElementById("moveDown");
moveDownButton.addEventListener("click", () => {
    const mainElement = document.querySelector("main");
    mainElement.scrollTop += 100;
    event.stopPropagation();
});
const moveLeftButton = document.getElementById("moveLeft");
moveLeftButton.addEventListener("click", () => {
    const mainElement = document.querySelector("main");
    mainElement.scrollLeft -= 100;
    event.stopPropagation();
});
const moveRightButton = document.getElementById("moveRight");
moveRightButton.addEventListener("click", () => {
    const mainElement = document.querySelector("main");
    mainElement.scrollLeft += 100; 
    event.stopPropagation();
});


document.addEventListener('DOMContentLoaded', () => {
    let dragSrcEl = null;

    function handleDragStart(e) {
        if (!isTextSelectionActive) {
            this.style.opacity = '0.4';
            dragSrcEl = this;
            body.classList.add("dragging"); // Adding a class to body to indicate dragging
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        }
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';
        body.classList.remove("dragging"); // Removing the dragging class from body
        const items = document.querySelectorAll('.item');
        items.forEach(item => item.classList.remove('over'));
    }

    function handleDragOver(e) {
        if (e.preventDefault && !isTextSelectionActive) {
            e.preventDefault();
        }
        if (!isTextSelectionActive) {
            e.dataTransfer.dropEffect = 'move';
        }
        return false;
    }

    function handleDragEnter(e) {
        if (!isTextSelectionActive) {
            this.classList.add('over');
        }
    }

    function handleDragLeave(e) {
        if (!isTextSelectionActive) {
            this.classList.remove('over');
        }
    }

    function handleDrop(e) {
        if (e.stopPropagation && !isTextSelectionActive) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        if (!isTextSelectionActive && dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }

        return false;
    }

    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });

    const menuBtn = document.getElementById("menuToggle");
    const header = document.querySelector("header");

    menuBtn.addEventListener("click", function(event) {
        header.classList.toggle("open");
        event.stopPropagation();
    });

    const selectButton = document.getElementById("selectButton");
    selectButton.addEventListener("click", function(event) {
        event.stopPropagation();
        toggleWordSelection();
        popup.style.display = "none";
        popup.classList.remove("hide");
    });

    const pasteButton = document.getElementById("pasteButton");
    pasteButton.addEventListener("click", function(event) {
        event.stopPropagation();
        pasteText();
        popup.style.display = "none";
        popup.classList.remove("hide");
    });

    const pasteButtonInput = document.getElementById("copyField");
    pasteButtonInput.addEventListener("click", function(event) {
        popup.style.display = "none";
        popup.classList.remove("hide");
        event.stopPropagation();
        copyInput();
    });

    const clearButtonInput = document.getElementById("emptyField");
    clearButtonInput.addEventListener("click", function(event) {
        popup.style.display = "none";
        popup.classList.remove("hide");
        event.stopPropagation();
        emptyInput();
    });

    // Add event listener to all input fields
    const inputFields = document.querySelectorAll(".inputField");
    inputFields.forEach(inputField => {
        inputField.addEventListener("click", function() {
            selectedInputField = this;
            console.log(selectedInputField.dataset.textarea);
        });
    });
});
