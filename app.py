from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import os
from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.mobilenet import preprocess_input
import uuid
app = Flask(__name__)

# Load the trained model
model = load_model('new_plant_disease_detection.h5')

# Define treatment information for each disease
treatments = {
    'Apple___Apple_scab': 'Spray fungicides like Captan, Chlorothalonil, Myclobutanil, Tebuconazole, Propiconazole, Mancozeb, Sulfur/lime sulfur, Neem oil. Plant scab-resistant varieties of apple trees. Prune your trees to improve air circulation. Water your trees at the base, avoid overhead watering. Rake up and dispose of fallen leaves in the fall.',
            'Apple___Black_rot': 'Spray fungicides like Chlorothalonil, Thiophanate-methyl, Fludioxonil, Pyraclostrobin. Plant your trees in a well-drained location. Water your trees regularly, but avoid getting the leaves wet. Thin out the branches of your trees to improve air circulation. Harvest apples promptly when they are ripe.',
            'Apple___Cedar_apple_rust': 'Spray fungicides like Captan, Chlorothalonil, Myclobutanil, Tebuconazole, Propiconazole, Mancozeb, Sulfur/lime sulfur. Plant apple trees and cedars at least 100 feet apart. Rake up and dispose of fallen leaves and fruit in the fall. Prune out infected branches in the spring. Plant your trees in a well-drained location. Water your trees regularly, but avoid getting the leaves wet. Thin out the branches of your trees to improve air circulation. Harvest apples promptly when they are ripe.',
            'Apple___healthy': 'Your apple tree leaf is healthy, no need for any treatment.',
            'Blueberry___healthy': 'Your blueberry leaf is healthy, no need for any treatment.',
            'Cherry_(including_sour)___healthy': 'Your cherry plant leaf is healthy, no need for any treatment.',
            'Cherry_(including_sour)___Powdery_mildew': 'Spray fungicides like Captan, Chlorothalonil, Myclobutanil, Tebuconazole, Propiconazole, Mancozeb, Sulfur/lime sulfur. Inspect your trees regularly for signs of powdery mildew. Prune out infected branches. Water your trees at the base, avoid overhead watering. Dispose of fallen leaves and fruit.',
            'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': 'Spray fungicides like Azoxystrobin, Propiconazole, Tebuconazole, Chlorothalonil, Mancozeb, Sulfur. Plant resistant varieties. Rotate crops with non-host plants. Tillage to bury infected residue. Water at the base of plants to avoid wetting leaves. Harvest corn promptly to remove infected plants from the field.',
            'Corn_(maize)___Common_rust_': 'Treatment for Common Rust: Plant resistant varieties or apply fungicides like triazole or strobilurin.',
            'Corn_(maize)___healthy': 'Your corn plant leaf is healthy, no need for any treatment.',
            'Corn_(maize)___Northern_Leaf_Blight': 'Spray fungicides like Azoxystrobin, Propiconazole, Tebuconazole, Chlorothalonil, Mancozeb, Sulfur. Remove and destroy infected leaves. Plant corn hybrids with genetic resistance to Northern Leaf Blight.',
            'Grape___Black_rot': 'Spray fungicides with active ingredients like Captan, Myclobutanil, Mancozeb. Prune and destroy infected plant parts. Promote good air circulation.',
            'Grape___Esca_(Black_Measles)': 'Prune and remove infected wood during the dormant season. Apply fungicides containing active ingredients like Boscalid, Azoxystrobin, Thiophanate-methyl. Implement trunk injection with phosphite-based products. Improve vineyard management practices.',
            'Grape___healthy': 'Your grapevine leaf is healthy, no need for any treatment.',
            'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': 'Apply fungicides with active ingredients like Captan, Chlorothalonil, Myclobutanil. Remove and destroy infected leaves.',
            'Orange___Haunglongbing_(Citrus_greening)': 'There is no cure for the disease. Implement vector control measures. Plant disease-free nursery stock.',
            'Peach___Bacterial_spot': 'Apply copper-based bactericides during the dormant season. Use fixed copper sprays during the growing season. Prune and remove infected branches, leaves, and fruit. Improve orchard hygiene and avoid overhead irrigation.',
            'Peach___healthy': 'Your peach tree leaf is healthy, no need for any treatment.',
            'Pepper,_bell___Bacterial_spot': 'Apply copper-based bactericides as a preventive measure. Use resistant varieties when available. Practice crop rotation. Remove and destroy infected plants.',
            'Pepper,_bell___healthy': 'Your pepper plant leaf is healthy, no need for any treatment.',
            'Potato___Early_blight': 'Apply fungicides with active ingredients like Chlorothalonil or Mancozeb during early stages of disease development. Practice crop rotation. Remove and destroy infected plant material. Provide adequate spacing and promote good air circulation.',
            'Potato___healthy': 'Your potato plant leaf is healthy, no need for any treatment.',
            'Potato___Late_blight': 'Remove infected leaves and apply fungicides like Chlorothalonil or Mancozeb. Improve air circulation and avoid overhead irrigation.',
            'Raspberry___healthy': 'Your raspberry plant leaf is healthy, no need for any treatment.',
            'Soybean___healthy': 'Your soybean plant leaf is healthy, no need for any treatment.',
            'Squash___Powdery_mildew': 'Apply fungicides like sulfur, neem oil, or potassium bicarbonate. Increase plant spacing and promote good air circulation. Remove and destroy severely infected leaves and plant debris. Implement preventive sprays on a regular schedule.',
            'Strawberry___healthy': 'Your strawberry plant leaf is healthy, no need for any treatment.',
            'Strawberry___Leaf_scorch': 'Apply fungicides with active ingredients like Captan, Chlorothalonil, Myclobutanil. Remove and destroy infected leaves. Properly water your plants. Improve air circulation within the strawberry canopy.',
            'Tomato___Bacterial_spot': 'Apply copper-based bactericides as a preventive measure. Practice crop rotation. Remove and destroy infected plant material. Improve air circulation and avoid overhead irrigation.',
            'Tomato___Early_blight': 'Remove infected leaves and apply fungicides with active ingredients like Chlorothalonil or Mancozeb. Improve air circulation and avoid overhead irrigation.',
            'Tomato___healthy': 'Your tomato plant leaf is healthy, no need for any treatment.',
            'Tomato___Late_blight': 'Remove infected leaves and apply fungicides like Chlorothalonil or Mancozeb. Improve air circulation and avoid overhead irrigation.',
            'Tomato___Leaf_Mold': 'Apply fungicides with active ingredients like Chlorothalonil. Increase air circulation and reduce humidity. Remove and destroy infected leaves.',
            'Tomato___Septoria_leaf_spot': 'Apply fungicides with active ingredients like Chlorothalonil. Remove and destroy infected leaves. Practice crop rotation.',
            'Tomato___Spider_mites Two-spotted_spider_mite': 'Apply insecticides containing pyrethroids or insecticidal soap. Use a forceful stream of water to dislodge mites. Introduce predatory mites or other natural enemies. Avoid using broad-spectrum insecticides.',
            'Tomato___Target_Spot': 'Remove and destroy infected leaves. Apply fungicides like Chlorothalonil or Azoxystrobin. Improve air circulation within the tomato canopy.',
            'Tomato___Tomato_mosaic_virus': 'There is no cure for the disease. Use disease-resistant tomato varieties. Control aphids and other insect vectors. Sanitize gardening tools and equipment.',
            'Tomato___Tomato_Yellow_Leaf_Curl_Virus': 'There is no cure for the disease. Plant disease-resistant tomato varieties. Control whiteflies and other insect vectors. Remove and destroy infected plants.'
        
}
def detect_disease_from_image(image_path):
    img = Image.open(image_path)
    img = img.resize((224, 224))  # Resize the image to match MobileNet input size
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img)
    prediction = model.predict(img)[0]

    # Perform further processing to determine the detected disease, confidence, and treatment
    detected_index = np.argmax(prediction)
    detected_disease = class_labels[detected_index]
    confidence = prediction[detected_index] * 100
    treatment = treatments.get(detected_disease, 'No treatment information available')

    return detected_disease, confidence, treatment
class_labels =  [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___healthy',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___healthy',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___healthy',
    'Potato___Late_blight',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___healthy',
    'Strawberry___Leaf_scorch',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___healthy',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus'
]
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/contact')
def contact():
    return render_template('contact.html')
@app.route('/about')
def about():
    return render_template('about.html')
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        filename = secure_filename(file.filename)
        unique_filename = str(uuid.uuid4()) + '_' + filename
        file_path = os.path.join('uploads', unique_filename)
        file.save(file_path)

        detected_disease, confidence, treatment = detect_disease_from_image(file_path)

        return jsonify({
            'detected_disease': detected_disease,
            'confidence': confidence,
            'treatment': treatment
        })

@app.route('/get_treatment/<detected_disease>')
def get_treatment(detected_disease):
    treatment = treatments.get(detected_disease, 'No treatment information available')
    return jsonify({'treatment': treatment})
    
@app.route("/fetch_agro_shops", methods=["GET"])
def fetch_agro_shops():
    try:
        latitude = request.args.get("lat")
        longitude = request.args.get("lng")

        if latitude is None or longitude is None:
            return jsonify({"error": "Latitude and longitude are required."}), 400

        # Construct the request URL for Nominatim API
        url = f"https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={latitude}&lon={longitude}&zoom=18"

        response = requests.get(url)
        data = response.json()

        if "error" in data:
            return jsonify({"error": "Failed to fetch agro shops."}), 500
        
        agro_shops = data.get("nearby", [])
        return jsonify({"agroShops": agro_shops})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)