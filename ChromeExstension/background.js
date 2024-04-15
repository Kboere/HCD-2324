console.log('This is a popup!');
console.log('This is a popup2!');

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['/popup.js']
    });
  });