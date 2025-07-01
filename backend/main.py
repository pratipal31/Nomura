from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import logging
import sqlite3
import hashlib
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import re

app = Flask(__name__)
CORS(app) 


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# LM Studio API configuration
LM_STUDIO_BASE_URL = "http://127.0.0.1:1234"
CHAT_ENDPOINT = f"{LM_STUDIO_BASE_URL}/v1/chat/completions"
MODELS_ENDPOINT = f"{LM_STUDIO_BASE_URL}/v1/models"

def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    # Password reset tokens table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialise database
init_db()

# Helper functions
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hash):
    return hash_password(password) == hash

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    # Remove any spaces, dashes, or plus signs
    clean_phone = re.sub(r'[^\d]', '', phone)
    # Check if it's a valid Indian phone number (10 digits)
    return len(clean_phone) == 10 or (len(clean_phone) == 12 and clean_phone.startswith('91'))

def send_reset_email(email, token):
    # Configure your email settings here
    SMTP_SERVER = "smtp.gmail.com"  # Change to your SMTP server
    SMTP_PORT = 587
    EMAIL_ADDRESS = "your-email@gmail.com"  # Change to your email
    EMAIL_PASSWORD = "your-app-password"    # Change to your app password
    
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = email
        msg['Subject'] = "Password Reset Request"
        
        reset_link = f"http://localhost:3000/reset-password?token={token}"
        body = f"""
        Hi,
        
        You have requested to reset your password. Click the link below to reset your password:
        
        {reset_link}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        Your App Team
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(EMAIL_ADDRESS, email, text)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'password', 'confirmPassword']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate phone format
        if not validate_phone(data['phone']):
            return jsonify({'error': 'Invalid phone number format'}), 400
        
        # Check if passwords match
        if data['password'] != data['confirmPassword']:
            return jsonify({'error': 'Passwords do not match'}), 400
        
        # Check password strength
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Hash password and insert user
        password_hash = hash_password(data['password'])
        cursor.execute('''
            INSERT INTO users (name, email, phone, password_hash)
            VALUES (?, ?, ?, ?)
        ''', (data['name'], data['email'], data['phone'], password_hash))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'User registered successfully',
            'user_id': user_id,
            'user': {
                'id': user_id,
                'name': data['name'],
                'email': data['email'],
                'phone': data['phone']
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, email, phone, password_hash, is_active
            FROM users WHERE email = ?
        ''', (data['email'],))
        
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user[5]:  # is_active
            return jsonify({'error': 'Account is deactivated'}), 401
        
        if not verify_password(data['password'], user[4]):  # password_hash
            return jsonify({'error': 'Invalid email or password'}), 401
        
        return jsonify({
            'message': 'Login successful',
            'user_id': user[0],
            'user': {
                'id': user[0],
                'name': user[1],
                'email': user[2],
                'phone': user[3]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        
        if not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
        user = cursor.fetchone()
        
        if not user:
            # Don't reveal if email exists or not for security
            return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200
        
        # Generate reset token
        token = secrets.token_urlsafe(32)
        expires_at = datetime.now() + timedelta(hours=1)
        
        # Store token in database
        cursor.execute('''
            INSERT INTO password_reset_tokens (user_id, token, expires_at)
            VALUES (?, ?, ?)
        ''', (user[0], token, expires_at))
        
        conn.commit()
        conn.close()
        
        # Send email (uncomment when email is configured)
        # if send_reset_email(data['email'], token):
        #     return jsonify({'message': 'Password reset link sent to your email'}), 200
        # else:
        #     return jsonify({'error': 'Failed to send email'}), 500
        
        # For development, return the token (remove in production)
        return jsonify({
            'message': 'Password reset link sent to your email',
            'token': token  # Remove this in production
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        
        if not data.get('token') or not data.get('password') or not data.get('confirmPassword'):
            return jsonify({'error': 'Token, password, and confirm password are required'}), 400
        
        if data['password'] != data['confirmPassword']:
            return jsonify({'error': 'Passwords do not match'}), 400
        
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        # Verify token
        cursor.execute('''
            SELECT user_id FROM password_reset_tokens
            WHERE token = ? AND expires_at > ? AND used = 0
        ''', (data['token'], datetime.now()))
        
        token_data = cursor.fetchone()
        
        if not token_data:
            conn.close()
            return jsonify({'error': 'Invalid or expired token'}), 400
        
        user_id = token_data[0]
        
        # Update password
        password_hash = hash_password(data['password'])
        cursor.execute('UPDATE users SET password_hash = ? WHERE id = ?', (password_hash, user_id))
        
        # Mark token as used
        cursor.execute('UPDATE password_reset_tokens SET used = 1 WHERE token = ?', (data['token'],))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Password reset successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, email, phone, created_at
            FROM users WHERE id = ? AND is_active = 1
        ''', (user_id,))
        
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user[0],
                'name': user[1],
                'email': user[2],
                'phone': user[3],
                'created_at': user[4]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_available_models():
    try:
        response = requests.get(MODELS_ENDPOINT, timeout=10)
        if response.status_code == 200:
            return response.json().get('data', [])
        logger.error(f"Failed to get models: {response.status_code}")
        return []
    except requests.exceptions.RequestException as e:
        logger.error(f"Error connecting to LM Studio: {e}")
        return []


def generate_quiz_with_ai(context, num_questions=5):
    try:
        models = get_available_models()
        if not models:
            raise Exception("No models available in LM Studio")

        model_id = models[0].get('id', 'local-model')

        system_prompt = """You are an educational quiz generator. Create environmental quiz questions as a valid JSON array.

CRITICAL: Return ONLY a JSON array, nothing else. No extra text, no markdown, no wrapper objects.

Exact format required:
[
  {
    "question": "Question text?",
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "explanation": "Brief explanation."
  }
]"""

        user_prompt = f"Create {num_questions} quiz questions about: {context}. Focus on environmental facts, decomposition time, and recycling."

        payload = {
            "model": model_id,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 800,
            "stream": False
        }

        response = requests.post(
            CHAT_ENDPOINT,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=600
        )

        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content'].strip()

            logger.info(f"Raw AI response snippet: {content[:200]}...")

            # Save raw for debugging if needed
            with open("raw_ai_response.txt", "w", encoding="utf-8") as f:
                f.write(content)

            # Try to extract JSON array using regex
            match = re.search(r'\[\s*{.*?}\s*]', content, re.DOTALL)
            if not match:
                raise ValueError("Could not extract JSON array from model response")

            content = match.group(0)
            quiz_data = json.loads(content)

            if isinstance(quiz_data, list):
                validated = []
                for q in quiz_data:
                    if (
                        isinstance(q, dict)
                        and 'question' in q
                        and 'options' in q
                        and 'correct' in q
                        and 'explanation' in q
                        and isinstance(q['options'], list)
                        and len(q['options']) == 4
                        and isinstance(q['correct'], int)
                        and 0 <= q['correct'] < 4
                    ):
                        validated.append(q)

                if validated:
                    logger.info(f"Parsed {len(validated)} valid questions.")
                    return validated[:num_questions]

            raise ValueError("Validation failed for AI quiz data")

        logger.error(f"LM Studio API error: {response.status_code} - {response.text}")
        return create_fallback_quiz(context)

    except Exception as e:
        logger.error(f"Error in generate_quiz_with_ai: {e}")
        return create_fallback_quiz(context)


def create_fallback_quiz(context):
    context = context.lower()
    questions = []

    if 'bottle' in context or 'plastic' in context:
        questions.extend([
            {
                "question": "How long does a plastic bottle take to decompose?",
                "options": ["50 years", "450 years", "10 years", "100 years"],
                "correct": 1,
                "explanation": "Plastic bottles take approximately 450 years to decompose."
            },
            {
                "question": "What percentage of plastic bottles are recycled globally?",
                "options": ["Less than 30%", "50%", "70%", "90%"],
                "correct": 0,
                "explanation": "Less than 30% of plastic bottles are recycled globally."
            }
        ])

    if 'cigarette' in context or 'butt' in context:
        questions.append({
            "question": "How long do cigarette butts take to decompose?",
            "options": ["1-5 years", "10-12 years", "25 years", "2-3 months"],
            "correct": 1,
            "explanation": "Cigarette butts take 10-12 years due to their filters."
        })

    if 'styrofoam' in context or 'foam' in context:
        questions.append({
            "question": "How long does styrofoam take to break down?",
            "options": ["50 years", "100 years", "500+ years", "Never completely"],
            "correct": 3,
            "explanation": "Styrofoam never completely biodegrades."
        })

    questions.extend([
        {
            "question": "What is the best approach to waste management?",
            "options": ["Reduce, Reuse, Recycle", "Burn everything", "Bury in landfills", "Throw in ocean"],
            "correct": 0,
            "explanation": "Reduce, Reuse, Recycle is the best strategy."
        },
        {
            "question": "Which of these materials is biodegradable?",
            "options": ["Plastic bags", "Apple cores", "Aluminum cans", "Glass bottles"],
            "correct": 1,
            "explanation": "Apple cores are biodegradable; the others are not."
        }
    ])

    return questions[:5]


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Flask backend is running"})


@app.route('/models', methods=['GET'])
def get_models():
    return jsonify({"models": get_available_models()})


@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    try:
        data = request.get_json()
        if not data or 'context' not in data:
            return jsonify({"error": "Context is required"}), 400

        context = data['context']
        num_questions = data.get('num_questions', 5)
        if not isinstance(num_questions, int) or not (1 <= num_questions <= 10):
            num_questions = 5

        logger.info(f"Generating quiz for: {context}")
        quiz_questions = generate_quiz_with_ai(context, num_questions)

        return jsonify({
            "success": True,
            "quiz": quiz_questions,
            "context": context
        })

    except Exception as e:
        logger.error(f"Server error: {e}")
        return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    print("✅ Flask server running on http://localhost:5000")
    print("🔁 Ensure LM Studio is running at http://127.0.0.1:1234")
    app.run(debug=True, host='0.0.0.0', port=5000)
