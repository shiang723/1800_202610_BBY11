// Function to load the header
function loadHeader() {
    fetch("header.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not find header.html");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("Header").innerHTML = data;
        })
        .catch(error => {
            console.error("Error loading header:", error);
        });
}

// Runs the function when the page loads
window.onload = loadHeader;