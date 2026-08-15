document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("imageInput");
    const imagePreview = document.getElementById("imagePreview");
    const predictBtn = document.getElementById("predictBtn");
    const resultArea = document.getElementById("resultArea");
    const predictionText = document.getElementById("predictionText");
    const confidenceText = document.getElementById("confidenceText");

    // Show a preview of the image when selected
    imageInput.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block";
                resultArea.style.display = "none"; // Hide old results
            }
            reader.readAsDataURL(file);
        }
    });

    // Send image to Flask backend when button is clicked
    predictBtn.addEventListener("click", () => {
        const file = imageInput.files[0];

        if (!file) {
            alert("Please select an image first!");
            return;
        }

        // UI state: Processing
        predictBtn.innerText = "Analyzing...";
        predictBtn.disabled = true;

        const formData = new FormData();
        formData.append("file", file);

        fetch("/predict", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // UI state: Done
            predictBtn.innerText = "Scan Image";
            predictBtn.disabled = false;

            // Show Results
            resultArea.style.display = "block";
            if (data.error) {
                predictionText.innerText = "Error!";
                confidenceText.innerText = data.error;
            } else {
                predictionText.innerText = data.result;
                confidenceText.innerText = "Confidence: " + data.confidence;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            predictBtn.innerText = "Scan Image";
            predictBtn.disabled = false;
            alert("Something went wrong communicating with the server.");
        });
    });
});