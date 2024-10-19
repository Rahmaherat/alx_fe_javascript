// Array to hold quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Self" }
];

// Function to show a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<strong>${quote.category}</strong>: "${quote.text}"`;
}

// Function to add a new quote
function addQuote("createAddQuoteForm") {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText && newQuoteCategory) {
        // Add the new quote to the quotes array
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        
        // Create a new DOM element for the quote
        const quoteDisplay = document.getElementById("quoteDisplay");
        const newQuoteElement = document.createElement("div");
        newQuoteElement.innerHTML = `<strong>${newQuoteCategory}</strong>: "${newQuoteText}"`;
        
        // Append the new quote element to the quote display area
        quoteDisplay.appendChild(newQuoteElement);
        
        // Clear input fields
        document.getElementById("newQuoteText").value = '';
        document.getElementById("newQuoteCategory").value = '';
        alert("Quote added successfully!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Event listener for the button to show a new quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

