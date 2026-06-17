import joblib
import numpy as np

def load_model():
    model = joblib.load('model_files/price_model.pkl')
    encoders = joblib.load('model_files/encoders.pkl')
    return model, encoders

def predict_price(state, commodity, variety, grade):
    model, encoders = load_model()

    input_data = {
        'STATE': state,
        'Commodity': commodity,
        'Variety': variety,
        'Grade': grade
    }

    encoded = []
    for col, val in input_data.items():
        le = encoders[col]
        if val in le.classes_:
            encoded.append(le.transform([val])[0])
        else:
            encoded.append(0)  # unknown value fallback

    prediction = model.predict([encoded])
    return round(float(prediction[0]), 2)