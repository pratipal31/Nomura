"use client";
import React, { useState } from 'react';
import { Leaf, Sparkles, Image, Quote, Heart, Send, RefreshCw } from 'lucide-react';

const EcoAIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('quote');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const environmentalQuotes = [
    "The Earth does not belong to us; we belong to the Earth. All things are connected like the blood that unites one family.",
    "In every walk with nature, one receives far more than they seek. Let's preserve this gift for future generations.",
    "The greatest threat to our planet is the belief that someone else will save it. Be the change you wish to see.",
    "Nature is not a place to visit. It is home. Let's treat it with the respect it deserves.",
    "We won't have a society if we destroy the environment. Every small action towards sustainability counts.",
    "The environment is where we all meet; where we all have a mutual interest. It is the one thing all of us share.",
    "Climate change is not just an environmental issue – it's a human rights issue, an economic issue, and a moral issue.",
    "Renewable energy is not just good for the planet – it's good for our future, our economy, and our children."
  ];

  const motivationalContent = [
    "🌱 Start Small, Think Big: Every eco-friendly choice you make creates ripples of positive change across the planet.",
    "🌍 Be the Guardian: Your actions today determine the world your children will inherit. Choose wisely, act boldly.",
    "♻️ Transform & Transcend: Turn your daily habits into powerful statements of environmental stewardship.",
    "🌿 Nature's Ally: You have the power to be nature's greatest advocate. Use your voice, use your choices.",
    "🌊 Flow Forward: Like water carving through stone, your consistent environmental actions will reshape the world.",
    "🌳 Root Deep, Reach High: Ground yourself in sustainable practices and watch your positive impact grow exponentially.",
    "☀️ Shine Bright: Be the renewable energy in someone else's day. Inspire others through your green actions.",
    "🦋 Metamorphosis Mindset: Transform your lifestyle today and emerge as the environmental champion the world needs."
  ];

  const imagePrompts = [
    "A serene forest with sunlight filtering through ancient trees, symbolizing hope and renewal",
    "Ocean waves meeting a pristine beach with wildlife thriving in crystal clear waters",
    "A vibrant community garden where people of all ages work together growing organic vegetables",
    "Wind turbines and solar panels integrated harmoniously into a beautiful natural landscape",
    "A polar bear family on pristine Arctic ice under the aurora borealis",
    "Coral reef teeming with colorful marine life in crystal clear tropical waters",
    "A butterfly landing on wildflowers in a meadow with clean air and blue skies",
    "Children planting trees in a reforestation project, smiling with dirt-covered hands"
  ];

  const generateContent = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      let content = '';
      
      if (contentType === 'quote') {
        const randomQuote = environmentalQuotes[Math.floor(Math.random() * environmentalQuotes.length)];
        content = `"${randomQuote}"`;
      } else if (contentType === 'motivation') {
        const randomMotivation = motivationalContent[Math.floor(Math.random() * motivationalContent.length)];
        content = randomMotivation;
      } else if (contentType === 'image') {
        const randomImagePrompt = imagePrompts[Math.floor(Math.random() * imagePrompts.length)];
        content = `🎨 Image Concept: ${randomImagePrompt}\n\n✨ This would make a beautiful environmental artwork! Imagine this scene with vibrant colors, natural lighting, and inspiring composition that captures the beauty of our planet.`;
      }
      
      if (prompt.trim()) {
        content += `\n\n🌱 Personalized for your interest in: "${prompt}"`;
      }
      
      setGeneratedContent(content);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-full shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent ml-4">
              EcoAI Assistant
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate inspiring environmental content, quotes, and image concepts to fuel your eco-conscious journey
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-green-500" />
                Create Environmental Content
              </h2>
              
              {/* Content Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What would you like to generate?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setContentType('quote')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                      contentType === 'quote'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300 text-gray-600'
                    }`}
                  >
                    <Quote className="w-5 h-5 mb-1" />
                    <span className="text-sm font-medium">Quote</span>
                  </button>
                  <button
                    onClick={() => setContentType('motivation')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                      contentType === 'motivation'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300 text-gray-600'
                    }`}
                  >
                    <Heart className="w-5 h-5 mb-1" />
                    <span className="text-sm font-medium">Motivation</span>
                  </button>
                  <button
                    onClick={() => setContentType('image')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                      contentType === 'image'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300 text-gray-600'
                    }`}
                  >
                    <Image className="w-5 h-5 mb-1" />
                    <span className="text-sm font-medium">Image</span>
                  </button>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Environmental Interest (Optional)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., renewable energy, ocean conservation, sustainable living..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
                  rows="3"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateContent}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 px-6 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 font-semibold flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Generate Content
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-teal-500" />
                Generated Content
              </h2>
              
              {generatedContent ? (
                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-200">
                  <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                    {generatedContent}
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-gray-600 italic">
                      ✨ Share this content to inspire others on their environmental journey!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-12 h-12 text-green-500" />
                  </div>
                  <p className="text-gray-500">
                    Select a content type and click generate to create inspiring environmental content!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center border border-green-100">
              <Quote className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Inspiring Quotes</h3>
              <p className="text-gray-600 text-sm">Powerful environmental quotes to motivate and educate</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center border border-green-100">
              <Heart className="w-12 h-12 text-teal-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Motivational Content</h3>
              <p className="text-gray-600 text-sm">Uplifting messages to fuel your eco-friendly actions</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center border border-green-100">
              <Image className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Image Concepts</h3>
              <p className="text-gray-600 text-sm">Creative visual ideas celebrating our beautiful planet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoAIAssistant;