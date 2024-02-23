
# Plant Leaf Diseases Detection and Treatment Recommendation System

This project is a comprehensive system for detecting plant leaf diseases, suggesting treatments, providing real-time weather updates for spraying feasibility, and offering virtual consultation with a doctor. It combines machine learning algorithms for disease detection, weather APIs for real-time weather updates, and a user-friendly interface built with Flask.

![Interface Image 1](https://github.com/zahid5120/plant_leaf_disease_detection/blob/main/img1.png)
*Description*: This image shows the homepage of the interface where users can upload images for disease detection.

![Interface Image 2](https://github.com/zahid5120/plant_leaf_disease_detection/blob/main/img3.png)
*Description*: Here, users can view the treatment recommendations suggested by the system based on the detected disease.

![Interface Image 3](https://github.com/zahid5120/plant_leaf_disease_detection/blob/main/img4.png)
*Description*: This screenshot displays the real-time weather updates section, indicating whether the weather is suitable for spraying.

![Interface Image 4](https://github.com/zahid5120/plant_leaf_disease_detection/blob/main/img5.png)
*Description*: In this image, users are interacting with the virtual doctor feature, seeking consultation for further guidance on plant health management.


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




## Contributing

Contributions to this project are welcome! Feel free to open issues, submit pull requests, or provide feedback to help improve the system.

