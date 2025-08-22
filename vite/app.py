from flask import Flask, jsonify, request
from flask_cors import CORS
from model import SalesPredictor
import matplotlib.pyplot as plt
from io import BytesIO
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend
predictor = SalesPredictor()

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    month = int(data['month'])
    
    # Get prediction
    top_product = predictor.predict_top_product(month)
    
    # Get historical data
    monthly_data = predictor.get_top_products_by_month()
    
    # Generate plot
    img = generate_sales_plot(monthly_data, month, top_product)
    
    return jsonify({
        'month': month,
        'top_product': top_product,
        'plot_image': img,
        'historical_data': monthly_data
    })

def generate_sales_plot(monthly_data, selected_month, predicted_product):
    # ... same implementation as before ...
    return f"data:image/png;base64,{img}"

@app.route('/api/months', methods=['GET'])
def get_available_months():
    months = sorted(predictor.df['month'].unique())
    return jsonify({'months': months})

if __name__ == '__main__':
    app.run(debug=True)