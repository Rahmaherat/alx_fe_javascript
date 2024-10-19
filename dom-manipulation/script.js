// Array to hold quotes
let quotes = [];

// Mock server endpoint (replace with your actual server logic if needed)
const mockServerUrl = "https://jsonplaceholder.typicode.com/posts";

// Load quotes from local storage when the application initializes
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
        quotes.forEach(quote => {
            addQuoteToDOM(quote);
        });
    }
    populateCategories();
    restoreLastSelectedCategory();
    fetchServerQuotes(); // Fetch initial quotes from the server
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to fetch quotes from the mock server
async function fetchServerQuotes() {
    try {
        const response = await fetch(mockServerUrl);
        const serverQuotes = await response.json();
        handleServerQuotes(serverQuotes);
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

// Handle quotes fetched from the server
function handleServerQuotes(serverQuotes) {
    // Simulate merging server data with local data
    const newQuotes = serverQuotes.map(item => ({
        text: item.title, // Using title for the quote text
        category: "General" // Using a default category
    }));

    const updatedQuotes = [...quotes];

    // Merge logic
    newQuotes.forEach(newQuote => {
        const existingQuote = updatedQuotes.find(q => q.text === newQuote.text);
        if (!existingQuote) {
            updatedQuotes.push(newQuote);
        }
    });

    // If the local quotes differ from server quotes, notify the user
    if (updatedQuotes.length !== quotes.length) {
        quotes = updatedQuotes;
        saveQuotes();
        alert("Quotes updated from server!");
        refreshQuoteDisplay(); // Refresh display
    }
}

// Refresh the quote display
function refreshQuoteDisplay() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear current quotes
    quotes.forEach(quote => addQuoteToDOM(quote));
}

// Periodic fetch every 10 seconds
setInterval(fetchServerQuotes, 10000);

// Populate categories dynamically in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = new Set(quotes.map(quote => quote.category));

    categoryFilter.innerHTML = ""; // Clear existing options
    const defaultOption = document.createElement("option");
    defaultOption.value = "all";
    defaultOption.textContent = "All Categories";
    categoryFilter.appendChild(defaultOption);

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear current quotes

    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    filteredQuotes.forEach(quote => addQuoteToDOM(quote));

    // Save the selected category to local storage
    localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Restore the last selected category from local storage
function restoreLastSelectedCategory() {
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        document.getElementById("categoryFilter").value = lastSelectedCategory;
        filterQuotes(); // Filter quotes based on the last selected category
    }
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

        // Populate categories
        populateCategories();

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
        populateCategories(); // Update categories

        alert('Quotes imported successfully!');
    };
}

// Load quotes on initial page load
loadQuotes();

// Event listeners for buttons
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.querySelector("button[onclick='addQuote()']").addEventListener("click", addQuote);
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

