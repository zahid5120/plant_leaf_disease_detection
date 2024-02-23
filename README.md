
# Plant Leaf Diseases Detection and Treatment Recommendation System

This project is a comprehensive system for detecting plant leaf diseases, suggesting treatments, providing real-time weather updates for spraying feasibility, and offering virtual consultation with a doctor. It combines machine learning algorithms for disease detection, weather APIs for real-time weather updates, and a user-friendly interface built with Flask.

## Features

- **Disease Detection**: Utilizes a machine learning model based on MobileNetV2 for accurately identifying plant leaf diseases from images.
- **Treatment Recommendation**: Recommends appropriate treatments based on the detected disease, including suggested sprays and other remedies.
- **Real-time Weather Updates**: Integrates with weather APIs to provide real-time weather information, helping farmers decide whether the weather is suitable for spraying.
- **Weather Feasibility Check**: Alerts users if the weather conditions are not favorable for spraying, such as in the case of rain or high humidity.
- **Virtual Doctor Consultation**: Offers virtual consultation with a doctor for further guidance and advice on plant health management.

## Usage

1. **Installation**:
   - Clone the repository:
     ```
     git clone https://github.com/yourusername/plant-leaf-diseases-detection.git
     ```
  
2. **Running the Application**:
   - Navigate to the project directory:
     ```
     cd plant-leaf-diseases-detection
     ```
   - Run the Flask application:
     ```
     python app.py
     ```
   - Access the application in your web browser at `http://localhost:5000`.

3. **Using the Interface**:
   - Upload images of plant leaves to detect diseases.
   - View treatment recommendations based on detected diseases.
   - Check real-time weather updates and spraying feasibility.
   - Consult with a virtual doctor for further assistance.

## Folder Structure

- **static**: Contains static files such as CSS stylesheets and JSON data files.
- **templates**: Contains HTML templates for the Flask application.
- **models**: Contains pre-trained machine learning models for disease detection.



## Contributing

Contributions to this project are welcome! Feel free to open issues, submit pull requests, or provide feedback to help improve the system.

