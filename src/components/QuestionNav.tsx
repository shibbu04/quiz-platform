import { cn } from '../utils/cn';

interface QuestionNavProps {
  currentQuestion: number;
  answers: Record<number, string | number>;
  onSubmit: () => void;
}

export function QuestionNav({ 
  currentQuestion, 
  answers, 
  onSubmit 
}: QuestionNavProps) {
  const sections = [
    { title: 'Section A', questions: [1, 2, 3, 4, 5] },
    { title: 'Section B', questions: [6, 7, 8, 9, 10] },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      {sections.map((section, sectionIndex) => (
        <div key={section.title} className={cn(sectionIndex > 0 && 'mt-6')}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            {section.title}
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {section.questions.map((num) => (
              <div
                key={num}
                className={cn(
                  'h-8 w-8 rounded-full text-sm font-medium flex items-center justify-center',
                  num - 1 === currentQuestion
                    ? 'bg-primary-600 text-white'
                    : answers[num]
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                )}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <button
        onClick={onSubmit}
        className="w-full mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        Submit Quiz
      </button>
    </div>
  );
}