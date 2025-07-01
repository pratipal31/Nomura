'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Recycle, Lightbulb, CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizResponse {
  success: boolean;
  quiz: QuizQuestion[];
  context: string;
}

interface QuizState {
  currentQuestion: number;
  selectedAnswers: number[];
  showExplanation: boolean;
  quizCompleted: boolean;
  score: number;
}

const BACKEND_URL = 'http://localhost:5000';

export default function AIQuizComponent() {
  const [context, setContext] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswers: [],
    showExplanation: false,
    quizCompleted: false,
    score: 0
  });

  const generateQuiz = async () => {
    if (!context.trim()) {
      setError('Please enter the context (trash items picked up)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Sending request to backend:', { context: context.trim(), num_questions: numQuestions });
      
      const response = await fetch(`${BACKEND_URL}/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: context.trim(),
          num_questions: numQuestions
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data: QuizResponse = await response.json();
      console.log('Received data:', data);
      
      if (data.success && data.quiz && Array.isArray(data.quiz) && data.quiz.length > 0) {
        // Validate quiz structure
        const validQuiz = data.quiz.filter(q => 
          q.question && 
          Array.isArray(q.options) && 
          q.options.length === 4 && 
          typeof q.correct === 'number' && 
          q.explanation
        );
        
        if (validQuiz.length === 0) {
          throw new Error('No valid questions received from server');
        }
        
        setQuiz(validQuiz);
        setQuizState({
          currentQuestion: 0,
          selectedAnswers: new Array(validQuiz.length).fill(-1),
          showExplanation: false,
          quizCompleted: false,
          score: 0
        });
      } else {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error generating quiz:', err);
      if (err instanceof Error) {
        if (err.message.includes('fetch')) {
          setError('Cannot connect to backend server. Make sure Flask is running on port 5000.');
        } else {
          setError(`Failed to generate quiz: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred while generating the quiz.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizState.showExplanation) return;

    const newSelectedAnswers = [...quizState.selectedAnswers];
    newSelectedAnswers[quizState.currentQuestion] = answerIndex;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswers: newSelectedAnswers,
      showExplanation: true
    }));
  };

  const nextQuestion = () => {
    const isCorrect = quizState.selectedAnswers[quizState.currentQuestion] === 
                     quiz[quizState.currentQuestion].correct;
    
    const newScore = quizState.score + (isCorrect ? 1 : 0);
    
    if (quizState.currentQuestion < quiz.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        showExplanation: false,
        score: newScore
      }));
    } else {
      setQuizState(prev => ({
        ...prev,
        quizCompleted: true,
        score: newScore
      }));
    }
  };

  const resetQuiz = () => {
    setQuiz([]);
    setContext('');
    setQuizState({
      currentQuestion: 0,
      selectedAnswers: [],
      showExplanation: false,
      quizCompleted: false,
      score: 0
    });
    setError('');
  };

  const getScoreMessage = () => {
    const percentage = (quizState.score / quiz.length) * 100;
    if (percentage >= 80) return "Excellent! You're an eco-warrior! 🌟";
    if (percentage >= 60) return "Great job! You know your environmental facts! 🌱";
    if (percentage >= 40) return "Good start! Keep learning about the environment! 🌍";
    return "Keep practicing! Every bit of environmental knowledge helps! 🌿";
  };

  // Quiz setup form
  if (quiz.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Recycle className="h-12 w-12 text-green-600" />
                <Trash2 className="h-6 w-6 text-gray-500 absolute -top-1 -right-1" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              AI Micro-Quizzes
            </CardTitle>
            <p className="text-gray-600">
              Personalized environmental quizzes based on the trash you've picked up
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="context" className="text-sm font-medium">
                What trash did you pick up? (e.g., "plastic bottles, cigarette butts, styrofoam containers")
              </Label>
              <Input
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Enter the types of trash you collected..."
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numQuestions" className="text-sm font-medium">
                Number of Questions
              </Label>
              <Input
                id="numQuestions"
                type="number"
                min="1"
                max="10"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
                className="w-full"
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <Button 
              onClick={generateQuiz} 
              disabled={loading || !context.trim()}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Generate Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz completed screen
  if (quizState.quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              Quiz Completed!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="text-6xl font-bold text-green-600">
              {quizState.score}/{quiz.length}
            </div>
            
            <div className="space-y-2">
              <p className="text-xl font-semibold">
                {getScoreMessage()}
              </p>
              <p className="text-gray-600">
                You scored {Math.round((quizState.score / quiz.length) * 100)}%
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={resetQuiz}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Try Another Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz question display
  const currentQ = quiz[quizState.currentQuestion];
  const selectedAnswer = quizState.selectedAnswers[quizState.currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correct;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <Badge variant="secondary">
              Question {quizState.currentQuestion + 1} of {quiz.length}
            </Badge>
            <Badge variant="outline">
              Score: {quizState.score}/{quizState.currentQuestion + (quizState.showExplanation ? 1 : 0)}
            </Badge>
          </div>
          <CardTitle className="text-xl">{currentQ.question}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {currentQ.options.map((option, index) => {
              let buttonClass = "w-full text-left p-3 border rounded-lg transition-colors ";
              
              if (quizState.showExplanation) {
                if (index === currentQ.correct) {
                  buttonClass += "bg-green-50 border-green-500 text-green-700";
                } else if (index === selectedAnswer && selectedAnswer !== currentQ.correct) {
                  buttonClass += "bg-red-50 border-red-500 text-red-700";
                } else {
                  buttonClass += "bg-gray-50 border-gray-300 text-gray-600";
                }
              } else {
                buttonClass += "hover:bg-gray-50 border-gray-300";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={buttonClass}
                  disabled={quizState.showExplanation}
                >
                  <div className="flex items-center">
                    {quizState.showExplanation && index === currentQ.correct && (
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    )}
                    {quizState.showExplanation && index === selectedAnswer && selectedAnswer !== currentQ.correct && (
                      <XCircle className="h-5 w-5 mr-2 text-red-600" />
                    )}
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
          
          {quizState.showExplanation && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
              <h4 className="font-semibold mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                {isCorrect ? 'Correct!' : 'Learn More:'}
              </h4>
              <p className="text-sm text-gray-700">{currentQ.explanation}</p>
            </div>
          )}
          
          {quizState.showExplanation && (
            <Button 
              onClick={nextQuestion}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {quizState.currentQuestion < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}