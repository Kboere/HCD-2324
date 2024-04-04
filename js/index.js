// console.log("Hello from index.js");

let copyTimeout;
let popupTimeout;
const popup = document.getElementById("popup");

// // document.addEventListener("selectionchange", () => {
// //     clearTimeout(copyTimeout);
// //     clearTimeout(popupTimeout);
// //     copyTimeout = setTimeout(() => {
// //         copySelectedText();
// //     }, 2000);
// // });

// function copySelectedText() {
//     let selectedText = window.getSelection().toString();
//     if (selectedText !== "") {
//         const tempInput = document.createElement("textarea");
//         tempInput.value = selectedText;
//         document.body.appendChild(tempInput);
//         tempInput.select();
//         document.execCommand("copy");
//         document.body.removeChild(tempInput);

//         // Show the popup
//         popup.classList.remove("hide");
//         popup.style.display = "block";
//         console.log("Popup shown");
//     } else {
//         popup.classList.add("hide");
//         setTimeout(() => {
//             popup.style.display = "none";
//             console.log("Popup hidden");
//         }, 500); // Adjust the timeout to match the animation duration
//     }
// }


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const commands = ['copy', 'kopieer', 'kopiëren'];

const recognition = new SpeechRecognition();
if (SpeechGrammarList) {
  const speechRecognitionList = new SpeechGrammarList();
  const grammar = `#JSGF V1.0; grammar commands; public <command> = ${commands.join(' | ')} ;`;
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
}
recognition.continuous = false;
recognition.lang = 'nl-NL';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const diagnostic = document.querySelector('.output');
const hints = document.querySelector('.hints');

let commandHTML = '';
commands.forEach(v => {
  commandHTML += `<span> ${v} </span>`;
});
hints.innerHTML = `Tap/click then say a command to copy the text. Try ${commandHTML}.`;

// Start recognition when text is clicked or selected
document.addEventListener('click', event => {
  if (event.target.nodeName === 'TEXTAREA' || event.target.nodeName === 'INPUT' || window.getSelection().toString() !== "") {
    recognition.start();
    console.log('Ready to receive a command command.');
  }
});

recognition.onresult = event => {
  const command = event.results[0][0].transcript.trim().toLowerCase(); // Normalize input
  diagnostic.textContent = `Result received: ${command}.`;
  console.log(`Confidence: ${event.results[0][0].confidence}`);

  if (commands.includes(command)) { // Check if the recognized command is in the predefined array
    const selectedText = window.getSelection().toString();
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
    }
  } else {
    diagnostic.textContent = "I didn't recognise that command.";
    popup.classList.add("hide");
  }
};

recognition.onspeechend = () => {
  recognition.stop();
};

recognition.onnomatch = event => {
  diagnostic.textContent = "I didn't recognise that command.";
};

recognition.onerror = event => {
  diagnostic.textContent = `Error occurred in recognition: ${event.error}`;
};


