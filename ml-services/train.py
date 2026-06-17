import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Load dataset
df = pd.read_csv('data/Agriculture_price_dataset.csv')

# Drop rows with missing values
df = df.dropna()

# Features we use for prediction
features = ['STATE', 'Commodity', 'Variety', 'Grade']
target = 'Modal_Price'

# Encode categorical columns
encoders = {}
for col in features:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    encoders[col] = le

X = df[features]
y = df[target]

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model and encoders
os.makedirs('model_files', exist_ok=True)
joblib.dump(model, 'model_files/price_model.pkl')
joblib.dump(encoders, 'model_files/encoders.pkl')

print("✅ Model trained and saved!")
score = model.score(X_test, y_test)
print(f"Model accuracy (R2 score): {score:.2f}")