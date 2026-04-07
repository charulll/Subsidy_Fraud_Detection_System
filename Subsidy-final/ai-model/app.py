from flask import Flask, request, jsonify
from predict import predict_fraud

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    result = predict_fraud(data)
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5001)