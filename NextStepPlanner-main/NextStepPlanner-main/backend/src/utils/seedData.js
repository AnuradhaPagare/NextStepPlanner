const Roadmap = require("../models/Roadmap");
const Quiz = require("../models/Quiz");

const seedRoadmaps = async () => {
  try {
    // Check if roadmaps already exist
    const existingRoadmaps = await Roadmap.countDocuments();
    if (existingRoadmaps > 0) {
      // Update existing roadmaps with quiz links
      const webDevRoadmap = await Roadmap.findOne({ domain: "Web Development" });
      const aiMlRoadmap = await Roadmap.findOne({ domain: "AI/ML" });
      
      if (webDevRoadmap) {
        const webDevQuiz1 = await Quiz.findOne({ domain: "Web Development", stepNumber: 1 });
        const webDevQuiz2 = await Quiz.findOne({ domain: "Web Development", stepNumber: 2 });
        if (webDevQuiz1 && !webDevRoadmap.steps[0].quizId) {
          webDevRoadmap.steps[0].quizId = webDevQuiz1._id;
        }
        if (webDevQuiz2 && !webDevRoadmap.steps[1].quizId) {
          webDevRoadmap.steps[1].quizId = webDevQuiz2._id;
        }
        await webDevRoadmap.save();
      }
      
      if (aiMlRoadmap) {
        const aiMlQuiz1 = await Quiz.findOne({ domain: "AI/ML", stepNumber: 1 });
        const aiMlQuiz2 = await Quiz.findOne({ domain: "AI/ML", stepNumber: 2 });
        if (aiMlQuiz1 && !aiMlRoadmap.steps[0].quizId) {
          aiMlRoadmap.steps[0].quizId = aiMlQuiz1._id;
        }
        if (aiMlQuiz2 && !aiMlRoadmap.steps[1].quizId) {
          aiMlRoadmap.steps[1].quizId = aiMlQuiz2._id;
        }
        await aiMlRoadmap.save();
      }
      
      console.log("Roadmaps already seeded, quiz links updated");
      return;
    }

    // Web Development Roadmap
    const webDevRoadmap = new Roadmap({
      domain: "Web Development",
      title: "Complete Web Development Roadmap",
      description: "Master web development from basics to advanced concepts",
      steps: [
        {
          stepNumber: 1,
          title: "HTML & CSS Fundamentals",
          description: "Learn the building blocks of web development",
          estimatedTime: "2-3 weeks",
          resources: [
            {
              type: "tutorial",
              title: "MDN HTML Guide",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
              description: "Comprehensive HTML documentation",
            },
            {
              type: "tutorial",
              title: "CSS-Tricks",
              url: "https://css-tricks.com/",
              description: "CSS tutorials and guides",
            },
          ],
        },
        {
          stepNumber: 2,
          title: "JavaScript Basics",
          description: "Learn JavaScript fundamentals and DOM manipulation",
          estimatedTime: "3-4 weeks",
          resources: [
            {
              type: "tutorial",
              title: "JavaScript.info",
              url: "https://javascript.info/",
              description: "Modern JavaScript tutorial",
            },
            {
              type: "video",
              title: "JavaScript Crash Course",
              url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
              description: "Quick JavaScript introduction",
            },
          ],
        },
        {
          stepNumber: 3,
          title: "React Framework",
          description: "Build modern user interfaces with React",
          estimatedTime: "4-5 weeks",
          resources: [
            {
              type: "documentation",
              title: "React Official Docs",
              url: "https://react.dev/",
              description: "Official React documentation",
            },
            {
              type: "tutorial",
              title: "React Tutorial",
              url: "https://react.dev/learn",
              description: "Step-by-step React tutorial",
            },
          ],
        },
        {
          stepNumber: 4,
          title: "Backend Development",
          description: "Learn Node.js and Express for server-side development",
          estimatedTime: "3-4 weeks",
          resources: [
            {
              type: "documentation",
              title: "Node.js Docs",
              url: "https://nodejs.org/docs/",
              description: "Node.js official documentation",
            },
            {
              type: "tutorial",
              title: "Express.js Guide",
              url: "https://expressjs.com/",
              description: "Express.js framework guide",
            },
          ],
        },
      ],
    });

    // AI/ML Roadmap
    const aiMlRoadmap = new Roadmap({
      domain: "AI/ML",
      title: "AI/ML Learning Path",
      description: "Comprehensive guide to artificial intelligence and machine learning",
      steps: [
        {
          stepNumber: 1,
          title: "Python Fundamentals",
          description: "Master Python programming for data science",
          estimatedTime: "2-3 weeks",
          resources: [
            {
              type: "tutorial",
              title: "Python.org Tutorial",
              url: "https://docs.python.org/3/tutorial/",
              description: "Official Python tutorial",
            },
            {
              type: "video",
              title: "Python for Data Science",
              url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
              description: "Python basics for ML",
            },
          ],
        },
        {
          stepNumber: 2,
          title: "Data Science Libraries",
          description: "Learn NumPy, Pandas, and Matplotlib",
          estimatedTime: "3-4 weeks",
          resources: [
            {
              type: "documentation",
              title: "NumPy Documentation",
              url: "https://numpy.org/doc/",
              description: "NumPy official docs",
            },
            {
              type: "tutorial",
              title: "Pandas Tutorial",
              url: "https://pandas.pydata.org/docs/",
              description: "Pandas data manipulation",
            },
          ],
        },
        {
          stepNumber: 3,
          title: "Machine Learning Basics",
          description: "Introduction to ML algorithms and concepts",
          estimatedTime: "4-5 weeks",
          resources: [
            {
              type: "tutorial",
              title: "Scikit-learn Guide",
              url: "https://scikit-learn.org/stable/",
              description: "ML library documentation",
            },
            {
              type: "video",
              title: "Machine Learning Course",
              url: "https://www.youtube.com/watch?v=PPLop4L2eGk",
              description: "Comprehensive ML course",
            },
          ],
        },
        {
          stepNumber: 4,
          title: "Deep Learning",
          description: "Neural networks and deep learning frameworks",
          estimatedTime: "5-6 weeks",
          resources: [
            {
              type: "documentation",
              title: "TensorFlow Guide",
              url: "https://www.tensorflow.org/learn",
              description: "TensorFlow tutorials",
            },
            {
              type: "tutorial",
              title: "PyTorch Tutorial",
              url: "https://pytorch.org/tutorials/",
              description: "PyTorch deep learning",
            },
          ],
        },
      ],
    });

    await webDevRoadmap.save();
    await aiMlRoadmap.save();

    // Link quizzes to roadmap steps
    const webDevQuiz1 = await Quiz.findOne({ domain: "Web Development", stepNumber: 1 });
    const webDevQuiz2 = await Quiz.findOne({ domain: "Web Development", stepNumber: 2 });
    const aiMlQuiz1 = await Quiz.findOne({ domain: "AI/ML", stepNumber: 1 });
    const aiMlQuiz2 = await Quiz.findOne({ domain: "AI/ML", stepNumber: 2 });

    if (webDevQuiz1) {
      webDevRoadmap.steps[0].quizId = webDevQuiz1._id;
    }
    if (webDevQuiz2) {
      webDevRoadmap.steps[1].quizId = webDevQuiz2._id;
    }
    if (aiMlQuiz1) {
      aiMlRoadmap.steps[0].quizId = aiMlQuiz1._id;
    }
    if (aiMlQuiz2) {
      aiMlRoadmap.steps[1].quizId = aiMlQuiz2._id;
    }

    await webDevRoadmap.save();
    await aiMlRoadmap.save();

    console.log("✅ Roadmaps seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding roadmaps:", error);
  }
};

const seedQuizzes = async () => {
  try {
    // Check if quizzes already exist
    const existingQuizzes = await Quiz.countDocuments();
    if (existingQuizzes > 0) {
      console.log("Quizzes already seeded");
      return;
    }

    // Web Development Quizzes
    const webDevQuiz1 = new Quiz({
      domain: "Web Development",
      stepNumber: 1,
      title: "HTML & CSS Fundamentals Quiz",
      description: "Test your knowledge of HTML and CSS basics",
      questions: [
        {
          question: "What does HTML stand for?",
          options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
          correctAnswer: 0,
          explanation: "HTML stands for HyperText Markup Language, the standard markup language for web pages.",
        },
        {
          question: "Which CSS property is used to change the text color?",
          options: ["font-color", "text-color", "color", "text-style"],
          correctAnswer: 2,
          explanation: "The 'color' property is used to set the text color in CSS.",
        },
        {
          question: "What is the correct HTML element for the largest heading?",
          options: ["<heading>", "<h6>", "<h1>", "<head>"],
          correctAnswer: 2,
          explanation: "<h1> is the largest heading element in HTML.",
        },
      ],
      passingScore: 70,
    });

    const webDevQuiz2 = new Quiz({
      domain: "Web Development",
      stepNumber: 2,
      title: "JavaScript Basics Quiz",
      description: "Test your JavaScript fundamentals",
      questions: [
        {
          question: "Which method is used to add an element to the end of an array?",
          options: ["push()", "pop()", "shift()", "unshift()"],
          correctAnswer: 0,
          explanation: "push() adds one or more elements to the end of an array.",
        },
        {
          question: "What is the result of typeof null in JavaScript?",
          options: ["null", "undefined", "object", "number"],
          correctAnswer: 2,
          explanation: "typeof null returns 'object' - this is a known JavaScript quirk.",
        },
        {
          question: "Which keyword is used to declare a variable in ES6?",
          options: ["var", "let", "const", "Both let and const"],
          correctAnswer: 3,
          explanation: "ES6 introduced both 'let' and 'const' for variable declaration.",
        },
      ],
      passingScore: 70,
    });

    // AI/ML Quizzes
    const aiMlQuiz1 = new Quiz({
      domain: "AI/ML",
      stepNumber: 1,
      title: "Python Fundamentals Quiz",
      description: "Test your Python programming knowledge",
      questions: [
        {
          question: "What is the output of: print(2 ** 3)?",
          options: ["6", "8", "9", "5"],
          correctAnswer: 1,
          explanation: "** is the exponentiation operator, so 2 ** 3 = 8.",
        },
        {
          question: "Which data type is mutable in Python?",
          options: ["tuple", "string", "list", "int"],
          correctAnswer: 2,
          explanation: "Lists are mutable, meaning they can be modified after creation.",
        },
        {
          question: "What does the range(5) function return?",
          options: ["[0, 1, 2, 3, 4]", "[1, 2, 3, 4, 5]", "0 to 4", "1 to 5"],
          correctAnswer: 2,
          explanation: "range(5) returns numbers from 0 to 4 (5 numbers total).",
        },
      ],
      passingScore: 70,
    });

    const aiMlQuiz2 = new Quiz({
      domain: "AI/ML",
      stepNumber: 2,
      title: "Data Science Libraries Quiz",
      description: "Test your knowledge of NumPy and Pandas",
      questions: [
        {
          question: "What is NumPy primarily used for?",
          options: ["Web development", "Numerical computing", "Database management", "Text processing"],
          correctAnswer: 1,
          explanation: "NumPy is a library for numerical computing with arrays and matrices.",
        },
        {
          question: "Which Pandas method is used to read a CSV file?",
          options: ["read_csv()", "load_csv()", "import_csv()", "open_csv()"],
          correctAnswer: 0,
          explanation: "pd.read_csv() is the standard method to read CSV files in Pandas.",
        },
        {
          question: "What does df.head() do in Pandas?",
          options: ["Shows the last 5 rows", "Shows the first 5 rows", "Shows column names", "Shows data types"],
          correctAnswer: 1,
          explanation: "df.head() displays the first 5 rows of a DataFrame by default.",
        },
      ],
      passingScore: 70,
    });

    await webDevQuiz1.save();
    await webDevQuiz2.save();
    await aiMlQuiz1.save();
    await aiMlQuiz2.save();

    console.log("✅ Quizzes seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding quizzes:", error);
  }
};

module.exports = { seedRoadmaps, seedQuizzes };

