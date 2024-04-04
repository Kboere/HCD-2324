console.log("Hello from index.js");

let copyTimeout;
let popupTimeout;
const popup = document.getElementById("popup");

document.addEventListener("selectionchange", () => {
    clearTimeout(copyTimeout);
    clearTimeout(popupTimeout);
    copyTimeout = setTimeout(() => {
        copySelectedText();
    }, 2000);
});

function copySelectedText() {
    let selectedText = window.getSelection().toString();
    if (selectedText !== "") {
        const tempInput = document.createElement("textarea");
        tempInput.value = selectedText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        // Show the popup
        popup.classList.remove("hide");
        popup.style.display = "block";
        console.log("Popup shown");
    } else {
        popup.classList.add("hide");
        setTimeout(() => {
            popup.style.display = "none";
            console.log("Popup hidden");
        }, 500); // Adjust the timeout to match the animation duration
    }
}