import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { AlertTriangle, Clock } from 'lucide-react';
import { questions } from '../data/questions';
import { QuizInstructions } from '../components/QuizInstructions';
import { QuestionTimer } from '../components/QuestionTimer';
import { QuizTimer } from '../components/QuizTimer';
import { QuestionNav } from '../components/QuestionNav';
import { Sidebar } from '../components/Sidebar';
import { useStore } from '../store';
import { saveAttempt } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

export function Quiz() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number>('');
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [questionTimer, setQuestionTimer] = useState(30);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!user) {
      navigate('/welcome');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isQuizActive) {
      setQuestionTimer(30);
    }
  }, [currentQuestionIndex, isQuizActive]);

  useEffect(() => {
    if (!isQuizActive || questionTimer <= 0) return;

    const timer = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuestionTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questionTimer, isQuizActive]);

  const handleStartQuiz = () => {
    setShowInstructions(false);
    setIsQuizActive(true);
    setStartTime(new Date());
  };

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer);
  };

  const calculateTimeSpent = () => {
    if (!startTime) return 0;
    const endTime = new Date();
    return Math.round((endTime.getTime() - startTime.getTime()) / 1000);
  };

  const handleQuestionTimeUp = useCallback(() => {
    if (!selectedAnswer) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: '',
      }));
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer('');
      setQuestionTimer(30);
    } else {
      setShowFeedback(true);
    }
  }, [currentQuestionIndex, selectedAnswer, currentQuestion.id]);

  const handleQuizTimeUp = useCallback(() => {
    handleQuizComplete();
  }, []);

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer,
      }));
      
      if (currentQuestionIndex === questions.length - 1) {
        setShowFeedback(true);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer('');
        setQuestionTimer(30);
      }
    }
  };

  const handleSubmitQuiz = () => {
    setShowConfirmSubmit(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmSubmit(false);
    setShowFeedback(true);
  };

  const handleQuizComplete = async () => {
    const score = calculateScore();
    const totalTimeSpent = calculateTimeSpent();
    
    const attempt = {
      id: uuidv4(),
      userId: user!.userId,
      date: new Date().toISOString(),
      score,
      totalQuestions: questions.length,
      timeSpent: totalTimeSpent,
      feedback,
    };

    await saveAttempt(attempt);
    setQuizComplete(true);
    setShowFeedback(false);
    setIsQuizActive(false);
  };

  const calculateScore = () => {
    let score = 0;
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find((q) => q.id === parseInt(questionId));
      if (question && answer === question.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <QuizInstructions
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          onStart={handleStartQuiz}
        />

        {!showInstructions && !quizComplete && (
          <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {questionTimer}s
                      </span>
                    </div>
                    <QuizTimer duration={300} onTimeUp={handleQuizTimeUp} />
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    {currentQuestion.question}
                  </p>

                  {currentQuestion.type === 'mcq' ? (
                    <div className="space-y-3">
                      {currentQuestion.options!.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswerSelect(option)}
                          className={`w-full text-left p-4 rounded-lg border transition-colors ${
                            selectedAnswer === option
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="number"
                      value={selectedAnswer}
                      onChange={(e) => handleAnswerSelect(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your answer"
                    />
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:w-64 order-first lg:order-last">
              <div className="sticky top-20">
                <QuestionNav
                  currentQuestion={currentQuestionIndex}
                  answers={answers}
                  onSubmit={handleSubmitQuiz}
                />
              </div>
            </div>
          </div>
        )}

        <Dialog
          open={showConfirmSubmit}
          onClose={() => setShowConfirmSubmit(false)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>
                <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                  Confirm Submission
                </Dialog.Title>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to submit the quiz early? You still have time remaining.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Questions Answered</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Object.keys(answers).length} of {questions.length}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Remaining Questions</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {questions.length - Object.keys(answers).length}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleConfirmSubmit}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                  >
                    Yes, Submit Quiz
                  </button>
                  <button
                    onClick={() => setShowConfirmSubmit(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Continue Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>

        <Dialog
          open={showFeedback}
          onClose={() => {}}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quiz Feedback
              </Dialog.Title>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Please provide any feedback about the quiz (optional):
                </p>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  rows={4}
                  placeholder="Your feedback..."
                />
                <button
                  onClick={handleQuizComplete}
                  className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        </Dialog>

        {quizComplete && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Quiz Complete!
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Your score: {calculateScore()} out of {questions.length}
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/history')}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
                >
                  View History
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}