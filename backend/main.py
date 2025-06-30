from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy(app)

# Create a User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

@app.post("/login")
def login():
    user_email = request.json["email"]
    user_password = request.json["password"]
    print(user_email,user_password)
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found."}), 401
    if not user.check_password(user_password):
        return jsonify({"message": "Wrong password."}), 401
    # If the credentials are valid, you can set a session for authentication or redirect to the homepage.
    return jsonify({"message": "Logged in successfully."}), 200

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)