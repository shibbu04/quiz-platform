import { useEffect, useState } from 'react';
import { Circle } from 'lucide-react';

interface QuestionTimerProps {
  duration: number;
  onTimeUp: () => void;
}

export function QuestionTimer({ duration, onTimeUp }: QuestionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const percentage = (timeLeft / duration) * 100;

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200 dark:text-gray-700 stroke-current"
          strokeWidth="8"
          fill="transparent"
          r="42"
          cx="50"
          cy="50"
        />
        <circle
          className="text-primary-600 dark:text-primary-400 stroke-current"
          strokeWidth="8"
          strokeLinecap="round"
          fill="transparent"
          r="42"
          cx="50"
          cy="50"
          style={{
            strokeDasharray: 264,
            strokeDashoffset: 264 - (percentage / 100) * 264,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-semibold text-gray-900 dark:text-white">
          {timeLeft}
        </span>
      </div>
    </div>
  );
}