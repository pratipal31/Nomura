from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# LM Studio API configuration
LM_STUDIO_BASE_URL = "http://127.0.0.1:1234"
CHAT_ENDPOINT = f"{LM_STUDIO_BASE_URL}/v1/chat/completions"
MODELS_ENDPOINT = f"{LM_STUDIO_BASE_URL}/v1/models"

def get_available_models():
    """Get available models from LM Studio"""
    try:
        response = requests.get(MODELS_ENDPOINT, timeout=10)
        if response.status_code == 200:
            models = response.json()
            return models.get('data', [])
        else:
            logger.error(f"Failed to get models: {response.status_code}")
            return []
    except requests.exceptions.RequestException as e:
        logger.error(f"Error connecting to LM Studio: {e}")
        return []

def generate_quiz_with_ai(context, num_questions=5):
    """Generate quiz questions using LM Studio API"""
    try:
        # Get available models
        models = get_available_models()
        if not models:
            raise Exception("No models available in LM Studio")
        
        # Use the first available model
        model_id = models[0].get('id', 'local-model')
        
        # Simplified and more focused prompt to avoid incomplete responses
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
]

The "correct" field must be 0, 1, 2, or 3 (index of correct option)."""

        user_prompt = f"Create {num_questions} quiz questions about: {context}. Focus on environmental facts, decomposition time, and recycling."

        # Prepare the request payload with adjusted settings
        payload = {
            "model": model_id,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.3,  # Lower temperature for more consistent formatting
            "max_tokens": 800,   # Reduced to avoid incomplete responses
            "stream": False,
            "stop": ["}]"]  # Stop after completing the JSON array
        }

        # Make request to LM Studio with longer timeout
        response = requests.post(
            CHAT_ENDPOINT,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=600  # Increased timeout
        )

        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content'].strip()
            
            logger.info(f"Raw AI response: {content[:200]}...")  # Log first 200 chars for debugging
            
            # Try to parse the JSON response
            try:
                # Clean the response
                if content.startswith('```json'):
                    content = content.replace('```json', '').replace('```', '').strip()
                elif content.startswith('```'):
                    content = content.replace('```', '').strip()
                
                # Remove extra closing brackets at the end
                content = content.rstrip(']').rstrip()
                
                # Try to parse as-is first
                try:
                    quiz_data = json.loads(content)
                except json.JSONDecodeError:
                    # If direct parsing fails, try to extract the questions array
                    logger.info("Direct JSON parsing failed, attempting to extract questions array")
                    
                    # Look for the questions array in the response
                    if '"questions":' in content:
                        # Extract just the questions array
                        start_idx = content.find('"questions":') + len('"questions":')
                        # Find the start of the array
                        array_start = content.find('[', start_idx)
                        if array_start != -1:
                            # Find the matching closing bracket
                            bracket_count = 0
                            array_end = array_start
                            for i, char in enumerate(content[array_start:], array_start):
                                if char == '[':
                                    bracket_count += 1
                                elif char == ']':
                                    bracket_count -= 1
                                    if bracket_count == 0:
                                        array_end = i
                                        break
                            
                            if array_end > array_start:
                                questions_json = content[array_start:array_end + 1]
                                quiz_data = json.loads(questions_json)
                            else:
                                raise json.JSONDecodeError("Could not find complete questions array", content, 0)
                    else:
                        raise json.JSONDecodeError("No questions array found", content, 0)
                
                # Handle both direct array and nested object formats
                if isinstance(quiz_data, dict) and 'questions' in quiz_data:
                    quiz_data = quiz_data['questions']
                
                # Validate the structure
                if isinstance(quiz_data, list) and len(quiz_data) > 0:
                    validated_quiz = []
                    for q in quiz_data:
                        if (isinstance(q, dict) and 
                            'question' in q and 
                            'options' in q and 
                            'correct' in q and 
                            'explanation' in q and
                            isinstance(q['options'], list) and
                            len(q['options']) == 4 and
                            isinstance(q['correct'], int) and
                            0 <= q['correct'] < 4):
                            validated_quiz.append(q)
                    
                    if validated_quiz:
                        logger.info(f"Successfully parsed {len(validated_quiz)} questions from AI response")
                        return validated_quiz[:num_questions]  # Limit to requested number
                
                # If validation fails, use fallback
                logger.error("AI response validation failed, using fallback")
                return create_fallback_quiz(context)
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response as JSON: {e}")
                logger.error(f"Content: {content}")
                return create_fallback_quiz(context)
        else:
            logger.error(f"LM Studio API error: {response.status_code} - {response.text}")
            return create_fallback_quiz(context)

    except requests.exceptions.Timeout:
        logger.error("Request to LM Studio timed out")
        return create_fallback_quiz(context)
    except Exception as e:
        logger.error(f"Error generating quiz: {e}")
        return create_fallback_quiz(context)

def create_fallback_quiz(context):
    """Create a fallback quiz when AI generation fails"""
    # Create more context-specific fallback questions
    context_lower = context.lower()
    
    questions = []
    
    # Plastic bottle specific questions
    if 'bottle' in context_lower or 'plastic' in context_lower:
        questions.extend([
            {
                "question": "How long does a plastic bottle take to decompose in the environment?",
                "options": [
                    "50 years",
                    "450 years", 
                    "10 years",
                    "100 years"
                ],
                "correct": 1,
                "explanation": "Plastic bottles take approximately 450 years to decompose, making them one of the most persistent forms of pollution."
            },
            {
                "question": "What percentage of plastic bottles are recycled globally?",
                "options": [
                    "Less than 30%",
                    "50%",
                    "70%",
                    "90%"
                ],
                "correct": 0,
                "explanation": "Less than 30% of plastic bottles are recycled globally, with most ending up in landfills or the environment."
            }
        ])
    
    # Cigarette butt questions
    if 'cigarette' in context_lower or 'butt' in context_lower:
        questions.extend([
            {
                "question": "How long do cigarette butts take to decompose?",
                "options": [
                    "1-5 years",
                    "10-12 years",
                    "25 years",
                    "2-3 months"
                ],
                "correct": 1,
                "explanation": "Cigarette butts take 10-12 years to decompose due to the cellulose acetate filters, making them a major environmental pollutant."
            }
        ])
    
    # Styrofoam questions
    if 'styrofoam' in context_lower or 'foam' in context_lower:
        questions.extend([
            {
                "question": "How long does styrofoam take to break down in the environment?",
                "options": [
                    "50 years",
                    "100 years",
                    "500+ years",
                    "Never completely"
                ],
                "correct": 3,
                "explanation": "Styrofoam never completely biodegrades - it breaks into smaller pieces but remains in the environment indefinitely."
            }
        ])
    
    # General environmental questions
    questions.extend([
        {
            "question": "What is the best approach to waste management?",
            "options": [
                "Reduce, Reuse, Recycle",
                "Burn everything",
                "Bury in landfills",
                "Throw in ocean"
            ],
            "correct": 0,
            "explanation": "The 3 R's (Reduce, Reuse, Recycle) prioritize waste prevention first, then reuse, and finally recycling as the most effective approach."
        },
        {
            "question": "Which of these materials is biodegradable?",
            "options": [
                "Plastic bags",
                "Apple cores",
                "Aluminum cans", 
                "Glass bottles"
            ],
            "correct": 1,
            "explanation": "Apple cores and other organic materials are biodegradable and will decompose naturally, unlike synthetic materials."
        }
    ])
    
    # Return up to 5 relevant questions
    return questions[:5]

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Flask backend is running"})

@app.route('/models', methods=['GET'])
def get_models():
    """Get available models from LM Studio"""
    models = get_available_models()
    return jsonify({"models": models})

@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    """Generate quiz based on context"""
    try:
        data = request.get_json()
        
        if not data or 'context' not in data:
            return jsonify({"error": "Context is required"}), 400
        
        context = data['context']
        num_questions = data.get('num_questions', 5)
        
        # Validate num_questions
        if not isinstance(num_questions, int) or num_questions < 1 or num_questions > 10:
            num_questions = 5
        
        logger.info(f"Generating quiz for context: {context}")
        
        # Generate quiz using AI
        quiz_questions = generate_quiz_with_ai(context, num_questions)
        
        return jsonify({
            "success": True,
            "quiz": quiz_questions,
            "context": context
        })
        
    except Exception as e:
        logger.error(f"Error in generate_quiz endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("Starting Flask backend...")
    print("Make sure LM Studio is running on http://127.0.0.1:1234")
    app.run(debug=True, host='0.0.0.0', port=5000)