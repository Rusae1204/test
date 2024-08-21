import base64
import os
import cv2
import numpy as np
from flask import Flask, jsonify, request, render_template
from deepface import DeepFace

app = Flask(__name__)

def decode_image(image_data):
    image_data = image_data.split(',')[1]
    image_data = base64.b64decode(image_data)
    np_arr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    image_data = data['image']
    img = decode_image(image_data)
    
    try:
        result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']
        return jsonify({'emotion': emotion})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
