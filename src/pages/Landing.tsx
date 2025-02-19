import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, Award, Clock, History } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <Brain className="h-16 w-16 mx-auto text-primary-600 dark:text-primary-400 mb-6" />
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Test Your Knowledge</span>
              <span className="block text-primary-600 dark:text-primary-400">Interactive Quiz Platform</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Challenge yourself with our comprehensive quiz platform. Test your knowledge across various topics and track your progress over time.
            </p>
            <div className="mt-10">
              <button
                onClick={() => {
                  // console.log("Button clicked! Navigating...");
                  navigate('/welcome');
                }}
                className="relative z-10 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Clock className="h-12 w-12 text-primary-600 dark:text-primary-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Timed Questions</h3>
            <p className="text-gray-600 dark:text-gray-400">Challenge yourself with our 30-second timer for each question</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Award className="h-12 w-12 text-primary-600 dark:text-primary-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Feedback</h3>
            <p className="text-gray-600 dark:text-gray-400">Get immediate results and see how well you performed</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <History className="h-12 w-12 text-primary-600 dark:text-primary-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Progress Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400">Monitor your improvement with detailed attempt history</p>
          </div>
        </div>
      </div>
    </div>
  );
}
