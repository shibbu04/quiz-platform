export interface User {
  name: string;
  userId: string;
}

export interface Question {
  id: number;
  type: 'mcq' | 'integer';
  question: string;
  options?: string[];
  correctAnswer: string | number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  date: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<number, string | number>;
  timeRemaining: number;
  isComplete: boolean;
}