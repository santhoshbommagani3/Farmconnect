from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict_price

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        state = data['state']
        commodity = data['commodity']
        variety = data['variety']
        grade = data['grade']

        price = predict_price(state, commodity, variety, grade)

        return jsonify({
            'success': True,
            'predicted_price': price,
            'unit': 'INR per Quintal'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML service is running'})

if __name__ == '__main__':
    app.run(port=5000, debug=True)