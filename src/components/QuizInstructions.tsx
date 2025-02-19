import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ClipboardList } from 'lucide-react';

interface QuizInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function QuizInstructions({ isOpen, onClose, onStart }: QuizInstructionsProps) {
  const [agreed, setAgreed] = useState(false);

  const handleStart = () => {
    if (agreed) {
      onStart();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="flex items-center text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                >
                  <ClipboardList className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
                  Quiz Instructions
                </Dialog.Title>
                <div className="mt-2 space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please read the following instructions carefully:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>You will have 30 seconds per question</li>
                    <li>There are two types of questions: multiple choice and integer input</li>
                    <li>You cannot go back to previous questions</li>
                    <li>Your score will be displayed at the end of the quiz</li>
                    <li>The quiz consists of 10 questions in total</li>
                  </ul>
                  <div className="mt-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        I have read and agree to the instructions
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleStart}
                    disabled={!agreed}
                    className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-500 dark:hover:bg-primary-600"
                  >
                    Start Quiz
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}