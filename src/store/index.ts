import { create } from 'zustand';
import { User, QuizState } from '../types';

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  quizState: QuizState;
  setUser: (user: User) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  updateQuizState: (state: Partial<QuizState>) => void;
  resetQuiz: () => void;
}

const initialQuizState: QuizState = {
  currentQuestion: 0,
  answers: {},
  timeRemaining: 30,
  isComplete: false,
};

export const useStore = create<AppState>((set) => ({
  user: null,
  theme: 'light',
  quizState: initialQuizState,
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  updateQuizState: (state) =>
    set((prev) => ({
      quizState: { ...prev.quizState, ...state },
    })),
  resetQuiz: () => set({ quizState: initialQuizState }),
}));