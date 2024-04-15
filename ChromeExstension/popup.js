document.addEventListener("DOMContentLoaded", function () {
    const selectButton = document.getElementById("selectButton");

    selectButton.addEventListener("click", function (event) {
        event.stopPropagation();
        selectable = !selectable;
        if (selectable) {
            console.log("Word selection enabled.");
        } else {
            resetSelection();
            console.log("Word selection disabled.");
        }
    });

    const selectedPoints = [];
    let selectable = false;

    document.addEventListener("click", function(event) {
        if (!selectable) return;
        selectedPoints.push({ x: event.clientX, y: event.clientY });
        console.log(`Point selected at coordinates: (${event.clientX}, ${event.clientY})`); // Log the coordinates
        if (selectedPoints.length === 2) {
            const range = document.createRange();
            const selection = window.getSelection();
            range.setStartFromPoint(selectedPoints[0].x, selectedPoints[0].y);
            range.setEndFromPoint(selectedPoints[1].x, selectedPoints[1].y);
            selection.removeAllRanges();
            selection.addRange(range);
            const selectedText = selection.toString();
            console.log(`Selected text: ${selectedText}`); // Log the selected text
            copyToClipboard(selectedText);
            resetSelection();
        }
    });

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            console.log(`Copying to clipboard was successful! Copied text: ${text}`); // Log the copied text
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    }

    function resetSelection() {
        selectedPoints.length = 0;
        console.log("Selection reset."); // Log the reset action
    }
});