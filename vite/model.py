import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

class SalesPredictor:
    def __init__(self, data_path='data.csv'):
        self.data_path = data_path
        self.model_path = 'sales_predictor_model.joblib'
        self.model = None
        self.load_data()
        
    def load_data(self):
        self.df = pd.read_csv(self.data_path)
        self.df['date'] = pd.to_datetime(self.df['date'])
        self.df['month'] = self.df['date'].dt.month
        
    def preprocess_data(self):
        # Group by month and family to find top selling category each month
        monthly_sales = self.df.groupby(['month', 'family'])['sales'].sum().reset_index()
        top_products = monthly_sales.loc[monthly_sales.groupby('month')['sales'].idxmax()]
        
        # Create training data (month -> top product)
        X = top_products[['month']]
        y = top_products['family']
        
        return X, y
    
    def train_model(self):
        X, y = self.preprocess_data()
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model accuracy: {accuracy:.2f}")
        
        # Save model
        joblib.dump(self.model, self.model_path)
    
    def predict_top_product(self, month):
        if not os.path.exists(self.model_path):
            self.train_model()
        
        if self.model is None:
            self.model = joblib.load(self.model_path)
        
        prediction = self.model.predict([[month]])[0]
        return prediction
    
    def get_top_products_by_month(self):
        monthly_sales = self.df.groupby(['month', 'family'])['sales'].sum().reset_index()
        top_products = monthly_sales.loc[monthly_sales.groupby('month')['sales'].idxmax()]
        return top_products.to_dict('records')

# Initialize the predictor when module is loaded
predictor = SalesPredictor()