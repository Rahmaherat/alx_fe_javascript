// Array to hold quotes
let quotes = [];

// Load quotes from local storage when the application initializes
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
        quotes.forEach(quote => {
            addQuoteToDOM(quote);
        });
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to show a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<strong>${quote.category}</strong>: "${quote.text}"`;
    
    // Store last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        
        // Add the new quote to the quotes array and the DOM
        quotes.push(newQuote);
        addQuoteToDOM(newQuote);
        
        // Save quotes to local storage
        saveQuotes();
        
        // Clear input fields
        document.getElementById("newQuoteText").value = '';
        document.getElementById("newQuoteCategory").value = '';
        alert("Quote added successfully!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Function to add quote to the DOM
function addQuoteToDOM(quote) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteElement = document.createElement("div");
    newQuoteElement.innerHTML = `<strong>${quote.category}</strong>: "${quote.text}"`;
    quoteDisplay.appendChild(newQuoteElement);
}

// Function to export quotes as JSON
function exportQuotes() {
    const jsonStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        
        // Update the DOM with the imported quotes
        importedQuotes.forEach(quote => addQuoteToDOM(quote));
        
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Load quotes on initial page load
loadQuotes();

// Event listeners for buttons
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.querySelector("button[onclick='addQuote()']").addEventListener("click", addQuote);
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

