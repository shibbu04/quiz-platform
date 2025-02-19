import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Award, Clock } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { useStore } from '../store';
import { getAttempts } from '../utils/db';
import type { QuizAttempt } from '../types';

export function History() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/welcome');
      return;
    }

    const loadAttempts = async () => {
      const userAttempts = await getAttempts(user.userId);
      setAttempts(userAttempts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    loadAttempts();
  }, [user, navigate]);

  const formatTimeSpent = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    
    if (minutes === 0) {
      return `${seconds} seconds`;
    } else if (minutes === 1) {
      return seconds > 0 ? `1 minute ${seconds} seconds` : '1 minute';
    } else {
      return seconds > 0 ? `${minutes} minutes ${seconds} seconds` : `${minutes} minutes`;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6 sm:mb-8">
            <HistoryIcon className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Quiz History</h1>
          </div>

          {attempts.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No quiz attempts yet</p>
              <button
                onClick={() => navigate('/quiz')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
              >
                Take a Quiz
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <Award className="h-6 w-6 flex-shrink-0 text-primary-600 dark:text-primary-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(attempt.date).toLocaleDateString()} at{' '}
                          {new Date(attempt.date).toLocaleTimeString()}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          Score: {attempt.score} / {attempt.totalQuestions}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{formatTimeSpent(attempt.timeSpent)}</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate('/quiz')}
                      className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}