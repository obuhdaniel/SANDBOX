import React, { useState } from 'react';
import { Play, Check, X, ChevronRight, Menu, ChevronLeft, Sun, Moon } from 'lucide-react';

const exercises = [
  {
    id: 1,
    title: "Hello World",
    description: "Print the text: Hello, World!",
    expectedOutput: "Hello, World!",
    hint: "Use print() with the text in quotes"
  },
  {
    id: 2,
    title: "Your Name",
    description: "Print your name",
    expectedOutput: null,
    hint: "Type your name inside quotes"
  },
  {
    id: 3,
    title: "Multiple Words",
    description: "Print: Python is fun",
    expectedOutput: "Python is fun",
    hint: "Put the entire sentence in quotes"
  },
  {
    id: 4,
    title: "Numbers",
    description: "Print the number 42",
    expectedOutput: "42",
    hint: "Numbers can be printed with or without quotes"
  },
  {
    id: 5,
    title: "Two Lines",
    description: "Print 'Hello' on one line and 'Python' on the next line",
    expectedOutput: "Hello\nPython",
    hint: "Use two separate print statements"
  },
  {
    id: 6,
    title: "Addition Result",
    description: "Print the result of 15 + 27",
    expectedOutput: "42",
    hint: "You can do math inside print()"
  },
  {
    id: 7,
    title: "Multiplication",
    description: "Print the result of 6 * 7",
    expectedOutput: "42",
    hint: "Use the * operator for multiplication"
  },
  {
    id: 8,
    title: "Text and Number",
    description: "Print: The answer is 100",
    expectedOutput: "The answer is 100",
    hint: "Put the entire phrase in quotes"
  },
  {
    id: 9,
    title: "Three Lines",
    description: "Print the numbers 1, 2, and 3, each on a separate line",
    expectedOutput: "1\n2\n3",
    hint: "Use three print statements"
  },
  {
    id: 10,
    title: "Empty Line",
    description: "Print 'Start', then a blank line, then 'End'",
    expectedOutput: "Start\n\nEnd",
    hint: "Use print() with nothing inside for a blank line"
  },
  {
    id: 11,
    title: "Quotes in Text",
    description: "Print: She said \"Hello\"",
    expectedOutput: "She said \"Hello\"",
    hint: "Use single quotes around the text or escape double quotes with \\"
  },
  {
    id: 12,
    title: "Comma Separator",
    description: "Print 'apple', 'banana', 'cherry' separated by spaces using commas in print",
    expectedOutput: "apple banana cherry",
    hint: "Use print('apple', 'banana', 'cherry')"
  },
  {
    id: 13,
    title: "Concatenation",
    description: "Print 'Hello' + 'World' as one word",
    expectedOutput: "HelloWorld",
    hint: "Use the + operator between strings"
  },
  {
    id: 14,
    title: "Subtraction",
    description: "Print the result of 100 - 58",
    expectedOutput: "42",
    hint: "Use the - operator"
  },
  {
    id: 15,
    title: "Division",
    description: "Print the result of 84 / 2",
    expectedOutput: "42.0",
    hint: "Use the / operator for division"
  },
  {
    id: 16,
    title: "Repeat String",
    description: "Print 'Ha' three times as 'HaHaHa'",
    expectedOutput: "HaHaHa",
    hint: "Use 'Ha' * 3"
  },
  {
    id: 17,
    title: "Mixed Operations",
    description: "Print the result of (5 + 3) * 2",
    expectedOutput: "16",
    hint: "Use parentheses for order of operations"
  },
  {
    id: 18,
    title: "Multiple Items",
    description: "Print three separate items on the same line: Python, 2025, and True",
    expectedOutput: "Python 2025 True",
    hint: "Separate items with commas in print()"
  },
  {
    id: 19,
    title: "Apostrophe",
    description: "Print: It's a beautiful day",
    expectedOutput: "It's a beautiful day",
    hint: "Use double quotes around text containing an apostrophe"
  },
  {
    id: 20,
    title: "Simple Math Expression",
    description: "Print: 2 + 2 = and then the result",
    expectedOutput: "2 + 2 = 4",
    hint: "Combine text and calculation: print('2 + 2 =', 2 + 2)"
  }
];

export default function PythonSandbox() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const runCode = () => {
    setIsCorrect(null);
    setOutput('');
    
    try {
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg => String(arg)).join(' '));
      };

      // Simple eval for print statements
      const printFunction = (...args) => {
        logs.push(args.map(arg => String(arg)).join(' '));
      };

      const wrappedCode = code.replace(/print\(/g, 'printFunction(');
      
      try {
        eval(wrappedCode);
      } catch (e) {
        logs.push(`Error: ${e.message}`);
      }

      console.log = originalLog;
      
      const result = logs.join('\n');
      setOutput(result);

      const exercise = exercises[currentExercise];
      if (exercise.expectedOutput !== null) {
        if (result.trim() === exercise.expectedOutput.trim()) {
          setIsCorrect(true);
          const newCompleted = new Set([...completed, currentExercise]);
          setCompleted(newCompleted);
        } else {
          setIsCorrect(false);
        }
      } else {
        if (result.trim().length > 0) {
          setIsCorrect(true);
          const newCompleted = new Set([...completed, currentExercise]);
          setCompleted(newCompleted);
        }
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsCorrect(false);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setCode('');
      setOutput('');
      setIsCorrect(null);
    }
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setCode('');
      setOutput('');
      setIsCorrect(null);
    }
  };

  const selectExercise = (index) => {
    setCurrentExercise(index);
    setCode('');
    setOutput('');
    setIsCorrect(null);
    setSidebarOpen(false);
  };

 const handleSubmit = async () => {
  try {
    // ---- VALIDATION ----
    if (!userName || !userName.trim()) {
      console.warn("Validation Error: userName is missing");
      alert("Please enter your full name");
      return;
    }

    if (!score || !total) {
      console.warn("Validation Error: score or total missing", { score, total });
      alert("Missing score or total");
      return;
    }

    // Payload for backend
    const payload = {
      userName: userName.trim(),
      score: Number(score),
      total: Number(total),
      completedExercises: completedExercises || []
    };

    console.log("Submitting payload:", payload);

    // ---- SEND TO BACKEND ----
    const response = await fetch("https://raas.on.shiper.app/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    // ---- HANDLE SERVER ERRORS ----
    if (!response.ok) {
      const text = await response.text();
      
      console.error("❌ Backend returned an error:", {
        status: response.status,
        statusText: response.statusText,
        responseBody: text
      });

      alert("Submission failed. Please try again.");
      return;
    }

    // ---- SUCCESS RESPONSE ----
    const data = await response.json();
    console.log("✅ Submission Success:", data);

    alert("Your score was submitted successfully!");

  } catch (error) {
    // ---- NETWORK or UNKNOWN ERRORS ----
    console.group("🔥 CLIENT ERROR DURING SUBMISSION");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Full error:", error);
    console.groupEnd();

    alert("Network error or server unreachable. Try again later.");
  }
};


  const exercise = exercises[currentExercise];
  const score = completed.size;

  // Theme classes
  const themeClasses = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    sidebar: isDarkMode ? 'bg-gray-800' : 'bg-white',
    sidebarBorder: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    header: isDarkMode ? 'bg-gray-800' : 'bg-white',
    headerBorder: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    card: isDarkMode ? 'bg-gray-800' : 'bg-white',
    cardBorder: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    button: {
      primary: isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
      success: isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600',
      secondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      danger: isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
    },
    editor: {
      header: isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
      background: isDarkMode ? 'bg-gray-900' : 'bg-gray-100',
      text: isDarkMode ? 'text-gray-100' : 'text-gray-900'
    },
    modal: isDarkMode ? 'bg-gray-800' : 'bg-white',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  };

  return (
    <div className={`flex flex-col md:flex-row h-screen ${themeClasses.background} ${themeClasses.text} transition-colors duration-200`}>
      {/* Mobile Header */}
      <div className={`md:hidden ${themeClasses.header} border-b ${themeClasses.headerBorder} p-4 flex items-center justify-between`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <span className="text-sm font-semibold">
            {score}/{exercises.length}
          </span>
          <button
            onClick={() => setShowSubmitModal(true)}
            className={`${themeClasses.button.success} px-3 py-1.5 rounded text-sm font-semibold transition-colors text-white`}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 ${themeClasses.sidebar} border-r ${themeClasses.sidebarBorder} overflow-y-auto transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className={`p-4 border-b ${themeClasses.sidebarBorder}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Exercises</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-1 rounded-lg ${themeClasses.button.secondary} transition-colors`}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>
          <p className={`text-sm ${themeClasses.textSecondary}`}>{score}/20 completed</p>
        </div>
        <div className="p-2">
          {exercises.map((ex, idx) => (
            <button
              key={ex.id}
              onClick={() => selectExercise(idx)}
              className={`w-full text-left p-3 mb-1 rounded flex items-center justify-between transition-colors ${
                currentExercise === idx
                  ? `${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                  : completed.has(idx)
                  ? `${isDarkMode ? 'bg-green-900' : 'bg-green-100'} ${isDarkMode ? 'text-green-100' : 'text-green-800'} hover:${isDarkMode ? 'bg-green-800' : 'bg-green-200'}`
                  : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`
              }`}
            >
              <span className="text-sm truncate">
                {ex.id}. {ex.title}
              </span>
              {completed.has(idx) && <Check size={16} />}
            </button>
          ))}
        </div>
        
        {/* Submit Button for Desktop */}
        <div className={`p-4 border-t ${themeClasses.sidebarBorder} hidden md:block`}>
          <button
            onClick={() => setShowSubmitModal(true)}
            className={`w-full ${themeClasses.button.success} py-2 px-4 rounded font-semibold transition-colors text-white`}
          >
            Submit Results ({score}/20)
          </button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className={`${themeClasses.header} border-b ${themeClasses.headerBorder} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-xl font-bold truncate">
                Exercise {exercise.id}: {exercise.title}
              </h1>
              <p className={`mt-1 text-sm md:text-base line-clamp-2 ${themeClasses.textSecondary}`}>
                {exercise.description}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${themeClasses.button.secondary} transition-colors hidden md:flex`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              {completed.has(currentExercise) && (
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'} ml-4`}>
                  <Check size={20} />
                  <span className="font-semibold hidden sm:inline">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col p-2 md:p-4 min-h-0">
          <div className="flex-1 flex flex-col rounded-lg overflow-hidden min-h-0 border border-gray-300">
            <div className={`${themeClasses.editor.header} px-3 md:px-4 py-2 flex items-center justify-between`}>
              <span className="text-sm font-semibold">editor.py</span>
              <button
                onClick={runCode}
                className={`flex items-center gap-2 ${themeClasses.button.success} px-3 md:px-4 py-1.5 rounded text-sm font-semibold transition-colors text-white`}
              >
                <Play size={16} />
                <span className="hidden sm:inline">Run Code</span>
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`flex-1 ${themeClasses.editor.background} ${themeClasses.editor.text} p-3 md:p-4 font-mono text-sm resize-none focus:outline-none min-h-[200px] md:min-h-0`}
              placeholder="# Write your Python code here..."
              spellCheck="false"
            />
          </div>

          {/* Output Section */}
          {output && (
            <div className="mt-3 md:mt-4 rounded-lg overflow-hidden border border-gray-300">
              <div className={`${themeClasses.editor.header} px-3 md:px-4 py-2 flex items-center justify-between`}>
                <span className="text-sm font-semibold">Output</span>
                {isCorrect !== null && (
                  <div className={`flex items-center gap-2 ${isCorrect ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                    {isCorrect ? <Check size={16} /> : <X size={16} />}
                    <span className="text-sm font-semibold">
                      {isCorrect ? 'Correct!' : 'Not quite right'}
                    </span>
                  </div>
                )}
              </div>
              <pre className={`${themeClasses.editor.background} ${themeClasses.editor.text} p-3 md:p-4 font-mono text-sm overflow-x-auto max-h-[200px] md:max-h-none overflow-y-auto`}>
                {output}
              </pre>
            </div>
          )}

          {/* Hint and Navigation */}
          <div className="mt-3 md:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className={`text-sm ${themeClasses.textSecondary} flex-1`}>
              <span className="font-semibold">Hint:</span> {exercise.hint}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={prevExercise}
                disabled={currentExercise === 0}
                className={`flex items-center gap-2 ${themeClasses.button.secondary} disabled:opacity-50 px-3 py-2 rounded font-semibold transition-colors flex-1 sm:flex-none justify-center`}
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
              </button>
              {isCorrect && currentExercise < exercises.length - 1 && (
                <button
                  onClick={nextExercise}
                  className={`flex items-center gap-2 ${themeClasses.button.primary} px-3 py-2 rounded font-semibold transition-colors flex-1 sm:flex-none justify-center text-white`}
                >
                  <span className="hidden sm:inline">Next Exercise</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${themeClasses.modal} rounded-lg max-w-md w-full p-6 border ${themeClasses.cardBorder}`}>
            <h3 className="text-xl font-bold mb-4">Submit Your Results</h3>
            
            <div className={`mb-6 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
              <div className="text-center mb-2">
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {score}/{exercises.length}
                </div>
                <div className={themeClasses.textSecondary}>Your Score</div>
              </div>
              <div className={`text-sm ${themeClasses.textSecondary} text-center`}>
                {score === exercises.length ? 'Perfect score! 🎉' : 
                 score >= exercises.length * 0.8 ? 'Great job! 👍' :
                 score >= exercises.length * 0.6 ? 'Good work! 👏' :
                 'Keep practicing! 💪'}
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                Full Name *
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
                className={`flex-1 ${themeClasses.button.secondary} py-2 px-4 rounded font-semibold transition-colors disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !userName.trim()}
                className={`flex-1 ${themeClasses.button.success} py-2 px-4 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Score'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}