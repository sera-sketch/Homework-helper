export const quizData = [
  {
    id: "q-math-1",
    title: "Basic Algebra Test",
    subject: "Mathematics",
    level: "Beginner",
    icon: "calculate",
    color: "linear-gradient(135deg, #ef4444, #f97316)",
    questions: [
      {
        question: "Solve for x: 2x + 5 = 15",
        options: ["x = 5", "x = 10", "x = 2", "x = 20"],
        correctAnswer: 0
      },
      {
        question: "What is the value of 3^3?",
        options: ["9", "18", "27", "81"],
        correctAnswer: 2
      },
      {
        question: "If y - 4 > 10, which of the following is a possible value for y?",
        options: ["14", "10", "12", "16"],
        correctAnswer: 3
      }
    ]
  },
  {
    id: "q-sci-1",
    title: "Cellular Biology",
    subject: "Science",
    level: "Intermediate",
    icon: "science",
    color: "linear-gradient(135deg, #10b981, #3b82f6)",
    questions: [
      {
        question: "Which organelle is known as the powerhouse of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"],
        correctAnswer: 2
      },
      {
        question: "What type of cell lacks a membrane-bound nucleus?",
        options: ["Eukaryotic", "Prokaryotic", "Plant Cell", "Animal Cell"],
        correctAnswer: 1
      },
      {
        question: "Where does photosynthesis occur in a plant cell?",
        options: ["Chloroplast", "Mitochondria", "Vacuole", "Nucleus"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "q-hist-1",
    title: "World War II Trivia",
    subject: "History",
    level: "Advanced",
    icon: "account_balance",
    color: "linear-gradient(135deg, #f59e0b, #eab308)",
    questions: [
      {
        question: "In what year did World War II officially begin?",
        options: ["1937", "1939", "1941", "1945"],
        correctAnswer: 1
      },
      {
        question: "Which battle is considered the major turning point on the Eastern Front?",
        options: ["Battle of Britain", "Battle of Midway", "Battle of Stalingrad", "D-Day"],
        correctAnswer: 2
      },
      {
        question: "Which country was NOT part of the Axis powers?",
        options: ["Germany", "Italy", "Japan", "Soviet Union"],
        correctAnswer: 3
      }
    ]
  },
  {
    id: "q-cs-1",
    title: "Data Structures Basics",
    subject: "Computer Science",
    level: "Intermediate",
    icon: "code",
    color: "linear-gradient(135deg, #a855f7, #ec4899)",
    questions: [
      {
        question: "Which data structure uses LIFO (Last-In-First-Out)?",
        options: ["Queue", "Stack", "Tree", "Graph"],
        correctAnswer: 1
      },
      {
        question: "What is the time complexity of searching an element in a Hash Table (average case)?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctAnswer: 0
      },
      {
        question: "Which of the following is a non-linear data structure?",
        options: ["Array", "Linked List", "Stack", "Tree"],
        correctAnswer: 3
      }
    ]
  }
];
