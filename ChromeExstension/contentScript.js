const selectedPoints = [];
let selectable = false;

function handleWordSelection(event) {
    if (!selectable) return;

    const range = document.caretRangeFromPoint(event.clientX, event.clientY);
    const clickedPoint = range.cloneRange();
    clickedPoint.collapse(true);

    if (selectedPoints.length < 2) {
        selectedPoints.push(clickedPoint);

        // Highlight clicked point
        clickedPoint.insertNode(document.createElement("span"));
    }

    if (selectedPoints.length === 2) {
        const selectionRange = document.createRange();
        selectionRange.setStart(selectedPoints[0].startContainer, selectedPoints[0].startOffset);
        selectionRange.setEnd(selectedPoints[1].startContainer, selectedPoints[1].startOffset);

        const selectedText = selectionRange.toString().trim();
        console.log("Selected Text:", selectedText);

        if (selectedText) {
            copyToClipboard(selectedText);
            resetSelection();
        } else {
            console.log("No text selected.");
        }
    }
}

function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

function resetSelection() {
    selectedPoints.length = 0;
    const spans = document.querySelectorAll("span");
    spans.forEach(span => span.remove());
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "toggleSelect") {
        selectable = !selectable;
        if (selectable) {
            console.log("Word selection enabled.");
        } else {
            resetSelection();
            console.log("Word selection disabled.");
        }
    }
});
