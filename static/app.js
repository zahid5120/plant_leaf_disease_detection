// Define background images
const backgroundImages = [
    "static/images/Plantix-2-980x653.jpg",
    "static/images/wallpaperflare.com_wallpaper.jpg",
    "static/images/depositphotos_321292196-stock-photo-ficus-windowsill-close-stethoscope.jpg"
   
];

let currentIndex = 0;

function changeBackgroundImage() {
    const body = document.body;
    body.style.backgroundImage = `url(${backgroundImages[currentIndex]})`;
    currentIndex = (currentIndex + 1) % backgroundImages.length;
}





changeBackgroundImage();
setInterval(changeBackgroundImage, 5000);

document.addEventListener("DOMContentLoaded", function () {
    const selectButton = document.getElementById("imageInput");
    const captureButton = document.getElementById("captureButton");
    const imageInput = document.getElementById("imageInput");
    const diseaseLabel = document.getElementById("diseaseLabel");
    const confidenceLabel = document.getElementById("confidenceLabel");
    const predictedImage = document.getElementById("predictedImageSrc");
    const showTreatmentButton = document.getElementById("showTreatmentButton");
    const refreshButton = document.getElementById("refreshButton");
    const weatherButton = document.getElementById("weatherButton");
    
    weatherButton.addEventListener("click", function () {
        getWeather();
    });
    
    function getWeather() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const apiKey = ""; // Replace with your actual OpenWeather API key
    
                // Fetch current weather data
                const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
                fetch(currentWeatherUrl)
                    .then(response => response.json())
                    .then(currentWeatherData => {
                        // Fetch weather forecast data for the next 48 hours
                        const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
                        fetch(forecastWeatherUrl)
                            .then(response => response.json())
                            .then(forecastWeatherData => {
                                showWeather(currentWeatherData, forecastWeatherData);
                            })
                            .catch(error => {
                                console.error("Error fetching forecast weather data:", error);
                            });
                    })
                    .catch(error => {
                        console.error("Error fetching current weather data:", error);
                    });
            });
        } else {
            console.error("Geolocation not available.");
        }
    }
    
   

function showWeather(currentWeatherData, forecastWeatherData) {
    
    const currentTemperature = currentWeatherData.main.temp;
    const currentDescription = currentWeatherData.weather[0].description;
    const forecastList = forecastWeatherData.list;

    let sprayMessage = "Weather conditions are suitable for spray.";

    const rainyForecasts = forecastList.filter(item => {
        return item.weather.some(weather => {
            return weather.main.toLowerCase().includes("rain");
        });
    });

    if (currentWeatherData.weather.some(weather => weather.main.toLowerCase().includes("rain")) || rainyForecasts.length > 0) {
        sprayMessage = "Current weather is not feasible for spray.";

        
        const nextDryForecast = forecastList.find(item => {
            return item.dt > currentWeatherData.dt && !item.weather.some(weather => weather.main.toLowerCase().includes("rain"));
        });

        if (nextDryForecast) {
            sprayMessage = `You can spray after ${nextDryForecast.dt_txt}.`;
        }
    } else {
        sprayMessage = "You can spray. Weather is feasible for spray.";
    }

    const weatherPopup = window.open("", "Weather Information", "width=400,height=400");

    weatherPopup.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Weather Information</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f2f2f2; /* Light gray background */
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .popup-content {
                background-color: #fff;
                border-radius: 20px;
                box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
                padding: 30px;
                max-width: 400px;
                text-align: center;
            }
            h2 {
                color: #4CAF50; /* Green header color */
                font-size: 28px;
                margin-bottom: 20px;
                letter-spacing: 1px;
            }
            p {
                color: #555;
                font-size: 18px;
                margin: 10px 0;
            }
            ul {
                list-style: none;
                padding: 0;
                margin: 10px 0;
                text-align: left;
            }
            li {
                margin-bottom: 12px;
                font-size: 16px;
                position: relative;
                padding-left: 25px;
                color: #666; /* Gray list item color */
            }
            li:before {
                content: "•";
                position: absolute;
                left: 0;
                color: #4CAF50; /* Green bullet color */
            }
            #sprayMessage {
                font-size: 20px;
                font-weight: bold;
                margin-top: 30px;
                padding: 10px;
                border-radius: 10px;
            }
            #sprayMessage.green {
                color: #4CAF50; /* Green spray message color */
                background-color: rgba(76, 175, 80, 0.1); /* Light green background */
            }
            #sprayMessage.red {
                color: #F44336; /* Red spray message color */
                background-color: rgba(244, 67, 54, 0.1); /* Light red background */
            }
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

        </style>
    </head>
    <body>
        <div class="popup-content">
            <h2>Current Weather</h2>
            <p>Temperature: <span style="color: #FF9800;">${currentTemperature}°C</span></p>
            <p>Description: <span style="color: #2196F3;">${currentDescription}</span></p>
            <h2>Weather Forecast for the Next 48 Hours</h2>
            <ul id="forecastList">
                <!-- Sample list items -->
                <li><span style="color: #4CAF50;">Timestamp:</span> Temperature°C, Description, Humidity%</li>
                <li><span style="color: #4CAF50;">Timestamp:</span> Temperature°C, Description, Humidity%</li>
                <!-- Add more list items here -->
            </ul>
            <div class="weather-icon">
            <!-- Add the weather icon here (using Font Awesome or other icon library) -->
            <i class="fas fa-cloud-sun"></i>
        </div>
            <p id="sprayMessage" class="${sprayMessage.includes("not feasible") ? "red" : "green"}">${sprayMessage}</p>
        </div>
    </body>
    </html>
    

    
    `);

    const forecastListContainer = weatherPopup.document.getElementById("forecastList");

    forecastList.slice(0, 16).forEach(forecast => {
        const timestamp = forecast.dt_txt;
        const temperature = forecast.main.temp;
        const description = forecast.weather[0].description;
        const humidity = forecast.main.humidity;

        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${timestamp}: ${temperature}°C, ${description}, Humidity: ${humidity}%
        `;
        forecastListContainer.appendChild(listItem);
    });

    weatherPopup.document.close();
}



    
    selectButton.addEventListener("click", function () {
        console.log("Select button clicked");
        imageInput.click();
    });
    

    

    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                predictedImage.src = e.target.result;
                predictDisease(file);
            };
            reader.readAsDataURL(file);
        }
    });

    captureButton.addEventListener("click", function () {
        const constraints = {
            video: true
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                const video = document.createElement("video");
                video.srcObject = stream;
                video.autoplay = true;

                // Create a canvas element to capture the video frame
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext("2d");

                // Wait for the camera stream to be ready
                video.onloadedmetadata = function () {
                    // Capture a frame from the video
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Stop the camera stream
                    stream.getTracks().forEach(track => track.stop());

                    // Convert the canvas image to a Blob
                    canvas.toBlob(function (blob) {
                        const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });

                        // Call the predictDisease() function with the captured image
                        predictDisease(file);
                    }, "image/jpeg");
                };
            })
            .catch(function (error) {
                console.error("Error capturing camera image:", error);
            });
    });

    showTreatmentButton.addEventListener("click", function () {
        const detectedDisease = diseaseLabel.textContent.split(": ")[1];
        fetchTreatmentInformation(detectedDisease);
    });

    refreshButton.addEventListener("click", function () {
        refreshDetection();
    });
    function predictDisease(file) {
        const formData = new FormData();
        formData.append("file", file);
    
        fetch("/upload", {
            method: "POST",
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle the prediction results
            
            diseaseLabel.textContent = `Disease: ${data.detected_disease}`;
            confidenceLabel.textContent = `Confidence: ${data.confidence.toFixed(2)}%`;
            showTreatmentButton.removeAttribute("disabled");
            weatherButton.removeAttribute("disabled");
            // Speak the predicted disease
            speakPredictedDisease(data.detected_disease);
            
        })
        .catch(error => {
            console.error("Error predicting disease:", error);
        });
    }
    

    function speakPredictedDisease(predictedDisease) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = `Predicted disease is ${predictedDisease}`;
        speech.lang = "en-US"; // Specify the language
    
        // Use the speech synthesis API to speak the text
        speechSynthesis.speak(speech);
    }
    
    const voiceButton = document.getElementById("voiceButton");
    voiceButton.addEventListener("click", function () {
        const detectedDisease = diseaseLabel.textContent.split(": ")[1];
        speakPredictedDisease(detectedDisease);
    });
        

    function fetchTreatmentInformation(detectedDisease) {
        fetch(`/get_treatment/${detectedDisease}`)
            .then(response => response.json())
            .then(data => {
                showTreatment(data.treatment);
            })
            .catch(error => {
                console.error("Error fetching treatment information:", error);
            });
    }

    function showTreatment(treatment) {
        const popupWindow = window.open("", "Treatment Information", "width=800,height=600");
        
        popupWindow.document.write(`
        <!DOCTYPE html>
<html>
<head>
    <title>Treatment Information</title>
    <style>
        body {
            font-family: 'Helvetica Neue', sans-serif;
            background-color: rgba(0, 0, 0, 0.5);
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .popup-content {
            background-color: #f2f2f2; /* Light gray background */
            border-radius: 15px;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
            padding: 20px;
            max-width: 80%;
            text-align: center;
            position: relative; /* Added position for close button placement */
        }
        h2 {
            color: #0073e6; /* Deep blue header color */
            font-size: 32px; /* Larger font size */
            margin-bottom: 20px;
        }
        p {
            color: #444; /* Dark gray text color */
            line-height: 1.6;
            margin-bottom: 10px;
        }
        .popup-close {
            position: absolute;
            top: -15px; /* Adjusted top position for better alignment */
            right: -15px; /* Adjusted right position for better alignment */
            font-size: 24px;
            cursor: pointer;
            color: #777; /* Light gray close icon color */
            background-color: #fff; /* Added background color for close icon */
            border-radius: 50%; /* Rounded close icon */
            padding: 5px; /* Added padding for better click area */
            transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
        }
        .popup-close:hover {
            color: #444; /* Darker gray close icon color on hover */
            background-color: #f2f2f2; /* Light gray background color on hover */
        }
        .disclaimer {
            color: #777; /* Light gray text color */
            font-size: 12px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="popup-content">
        <span class="popup-close" onclick="window.close()">&times;</span>
        <h2>Treatment Information</h2>
        <p>${treatment}</p>
        <p class="disclaimer">The effectiveness of treatments may vary based on individual plant characteristics and environmental factors.</p>
        <p class="disclaimer">We do not guarantee the accuracy or completeness of the information provided.</p>
        <p class="disclaimer">By using this information, you acknowledge that you do so at your own risk.</p>
    </div>
</body>
</html>

    `);
    
        
        popupWindow.document.close();
    }
    const virtualDoctorButton = document.getElementById("virtualDoctorButton");
const virtualDoctorResponse = document.getElementById("virtualDoctorResponse");

virtualDoctorButton.addEventListener("click", function () {
    const userQuestion = prompt("Ask a question:");
    if (userQuestion) {
        fetchVirtualDoctorResponse(userQuestion);
    }
});

function fetchVirtualDoctorResponse(question) {
    // Make an API call to your backend to get the response from the virtual doctor
    fetch(`/get_virtual_doctor_response?question=${question}`)
        .then(response => response.json())
        .then(data => {
            displayVirtualDoctorResponse(data.response);
        })
        .catch(error => {
            console.error("Error fetching virtual doctor response:", error);
        });
}

function displayVirtualDoctorResponse(response) {
    virtualDoctorResponse.innerHTML = `<div class="response">${response}</div>`;
}

    
    function refreshDetection() {
        diseaseLabel.textContent = "";
        confidenceLabel.textContent = "";

        // Reset the predicted image
        predictedImage.src = "{{ url_for('static', filename='default_image.jpg') }}";

        // Disable the "Show Treatment" button
        showTreatmentButton.setAttribute("disabled", true);
        weatherButton.setAttribute("disabled", true);
    }
});
