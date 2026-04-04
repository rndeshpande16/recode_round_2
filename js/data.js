/**
 * Nexus-Uni Mock Data Store
 * Rich, realistic academic data for all views
 */

const NexusData = {
  // ========== STUDENT ==========
  student: {
    name: localStorage.getItem("nexus-student-name") || "Alex Chen",
    major: "Computer Science",
    year: "Junior",
    gpa: 3.72,
    semester: "Spring 2026",
  },

  // ========== SUBJECTS ==========
  // baseHealth and baseGrade represent past performance. Live metrics are calculated dynamically.
  subjects: [
    {
      id: "s1",
      name: "Data Structures & Algorithms",
      code: "CS301",
      color: "#7c5cfc",
      professor: "Dr. Sarah Mitchell",
      credits: 4,
      baseGrade: 88,
      baseHealth: 80,
      attendance: 94,
      assignmentsTotal: 10,
      tags: ["algorithms", "programming", "complexity"],
    },
    {
      id: "s2",
      name: "Linear Algebra",
      code: "MATH240",
      color: "#22d3ee",
      professor: "Prof. James Liu",
      credits: 3,
      baseGrade: 75,
      baseHealth: 70,
      attendance: 88,
      assignmentsTotal: 8,
      tags: ["math", "vectors", "matrices"],
    },
    {
      id: "s3",
      name: "Operating Systems",
      code: "CS350",
      color: "#f59e0b",
      professor: "Dr. Michael Torres",
      credits: 4,
      baseGrade: 82,
      baseHealth: 85,
      attendance: 92,
      assignmentsTotal: 9,
      tags: ["systems", "programming", "concurrency"],
    },
    {
      id: "s4",
      name: "Discrete Mathematics",
      code: "MATH260",
      color: "#10b981",
      professor: "Prof. Emily Park",
      credits: 3,
      baseGrade: 60,
      baseHealth: 65,
      attendance: 80,
      assignmentsTotal: 8,
      tags: ["math", "logic", "graphs", "complexity"],
    },
    {
      id: "s5",
      name: "Machine Learning",
      code: "CS440",
      color: "#ef4444",
      professor: "Dr. Priya Sharma",
      credits: 3,
      baseGrade: 86,
      baseHealth: 88,
      attendance: 96,
      assignmentsTotal: 8,
      tags: ["ai", "statistics", "programming", "matrices"],
    },
    {
      id: "s6",
      name: "Technical Writing",
      code: "ENG200",
      color: "#8b5cf6",
      professor: "Prof. Rachel Adams",
      credits: 2,
      baseGrade: 93,
      baseHealth: 95,
      attendance: 100,
      assignmentsTotal: 6,
      tags: ["writing", "communication"],
    },
  ],

  // ========== SCHEDULE ==========
  schedule: [
    {
      id: "cl1",
      subjectId: "s1",
      day: "Mon",
      startHour: 9,
      startMin: 0,
      endHour: 10,
      endMin: 30,
      room: "Room 401, CS Building",
    },
    {
      id: "cl2",
      subjectId: "s2",
      day: "Mon",
      startHour: 11,
      startMin: 0,
      endHour: 12,
      endMin: 0,
      room: "Room 205, Math Hall",
    },
    {
      id: "cl3",
      subjectId: "s3",
      day: "Mon",
      startHour: 14,
      startMin: 0,
      endHour: 15,
      endMin: 30,
      room: "Room 302, CS Building",
    },
    {
      id: "cl4",
      subjectId: "s5",
      day: "Mon",
      startHour: 16,
      startMin: 0,
      endHour: 17,
      endMin: 0,
      room: "Room 501, AI Lab",
    },
    {
      id: "cl5",
      subjectId: "s4",
      day: "Tue",
      startHour: 10,
      startMin: 0,
      endHour: 11,
      endMin: 0,
      room: "Room 210, Math Hall",
    },
    {
      id: "cl6",
      subjectId: "s6",
      day: "Tue",
      startHour: 13,
      startMin: 0,
      endHour: 14,
      endMin: 0,
      room: "Room 104, Liberal Arts",
    },
    {
      id: "cl7",
      subjectId: "s1",
      day: "Wed",
      startHour: 9,
      startMin: 0,
      endHour: 10,
      endMin: 30,
      room: "Room 401, CS Building",
    },
    {
      id: "cl8",
      subjectId: "s3",
      day: "Wed",
      startHour: 14,
      startMin: 0,
      endHour: 15,
      endMin: 30,
      room: "Room 302, CS Building",
    },
    {
      id: "cl9",
      subjectId: "s5",
      day: "Thu",
      startHour: 16,
      startMin: 0,
      endHour: 17,
      endMin: 0,
      room: "Room 501, AI Lab",
    },
    {
      id: "cl10",
      subjectId: "s2",
      day: "Thu",
      startHour: 11,
      startMin: 0,
      endHour: 12,
      endMin: 0,
      room: "Room 205, Math Hall",
    },
    {
      id: "cl11",
      subjectId: "s4",
      day: "Fri",
      startHour: 10,
      startMin: 0,
      endHour: 11,
      endMin: 0,
      room: "Room 210, Math Hall",
    },
    {
      id: "cl12",
      subjectId: "s6",
      day: "Fri",
      startHour: 13,
      startMin: 0,
      endHour: 14,
      endMin: 0,
      room: "Room 104, Liberal Arts",
    },
  ],

  // ========== TASKS ==========
  tasks: [
    {
      id: "t1",
      subjectId: "s1",
      title: "Implement AVL Tree Rotations",
      description:
        "Complete the AVL tree implementation with insert, delete, and all rotation operations. Include balance factor calculations.",
      dueDate: "2026-04-05",
      gradeWeight: 15,
      completed: false,
      type: "assignment",
    },
    {
      id: "t2",
      subjectId: "s2",
      title: "Eigenvalue Decomposition Problem Set",
      description:
        "Problems 4.1-4.18 from the textbook. Show complete work for eigenvalue and eigenvector computation.",
      dueDate: "2026-04-06",
      gradeWeight: 10,
      completed: false,
      type: "homework",
    },
    {
      id: "t3",
      subjectId: "s3",
      title: "Process Scheduler Simulation",
      description:
        "Build a simulation of Round-Robin, FCFS, and SJF scheduling algorithms. Compare performance metrics.",
      dueDate: "2026-04-04",
      gradeWeight: 20,
      completed: false,
      type: "project",
    },
    {
      id: "t4",
      subjectId: "s5",
      title: "Neural Network from Scratch",
      description:
        "Implement a multi-layer perceptron using only NumPy. Train on MNIST dataset and report accuracy.",
      dueDate: "2026-04-10",
      gradeWeight: 25,
      completed: false,
      type: "project",
    },
    {
      id: "t5",
      subjectId: "s4",
      title: "Graph Theory Proofs",
      description:
        "Prove theorems 7.3, 7.5, and 7.8 related to Euler circuits and Hamiltonian paths.",
      dueDate: "2026-04-07",
      gradeWeight: 8,
      completed: false,
      type: "homework",
    },
    {
      id: "t6",
      subjectId: "s6",
      title: "Technical Report Draft",
      description:
        "First draft of the technical report on your CS project. Minimum 8 pages, APA format.",
      dueDate: "2026-04-08",
      gradeWeight: 12,
      completed: false,
      type: "assignment",
    },
    {
      id: "t7",
      subjectId: "s1",
      title: "Midterm Exam Prep",
      description:
        "Review chapters 5-9. Focus on B-trees, hashing, and graph algorithms.",
      dueDate: "2026-04-12",
      gradeWeight: 30,
      completed: false,
      type: "exam",
    },
    {
      id: "t8",
      subjectId: "s3",
      title: "Memory Management Lab",
      description:
        "Implement page replacement algorithms: FIFO, LRU, and Optimal. Compare page fault rates.",
      dueDate: "2026-04-09",
      gradeWeight: 10,
      completed: false,
      type: "lab",
    },
    {
      id: "t9",
      subjectId: "s5",
      title: "ML Paper Review",
      description:
        'Write a 2-page critical review of "Attention Is All You Need" paper.',
      dueDate: "2026-04-11",
      gradeWeight: 5,
      completed: true,
      type: "assignment",
    },
    {
      id: "t10",
      subjectId: "s2",
      title: "SVD Applications Report",
      description:
        "Report on Singular Value Decomposition applications in image compression and recommender systems.",
      dueDate: "2026-04-14",
      gradeWeight: 15,
      completed: false,
      type: "assignment",
    },
    {
      id: "t11",
      subjectId: "s4",
      title: "Combinatorics Quiz",
      description:
        "Online quiz covering permutations, combinations, and the Pigeonhole Principle.",
      dueDate: "2026-04-05",
      gradeWeight: 5,
      completed: false,
      type: "quiz",
    },
    {
      id: "t12",
      subjectId: "s6",
      title: "Peer Review Session",
      description:
        "Review and provide feedback on two classmates' technical reports.",
      dueDate: "2026-04-13",
      gradeWeight: 3,
      completed: false,
      type: "assignment",
    },
  ],

  // ========== FEEDBACK (Professor Comments) ==========
  feedback: [
    {
      id: "f1",
      subjectId: "s1",
      title: "Binary Search Tree implementation has edge cases",
      comment:
        "Your BST deletion logic doesn't handle the case where the node has two children correctly. The in-order successor replacement needs to account for the successor's right subtree. Please review and resubmit.",
      professor: "Dr. Sarah Mitchell",
      status: "open",
      createdAt: "2026-03-28T10:30:00",
      replies: [
        {
          author: localStorage.getItem("nexus-student-name") || "Alex Chen",
          content:
            "Thank you for the feedback. I'll review the deletion cases and fix the successor replacement logic.",
          time: "2026-03-28T14:15:00",
        },
      ],
    },
    {
      id: "f2",
      subjectId: "s3",
      title: "Thread synchronization race condition",
      comment:
        "Your producer-consumer implementation has a potential deadlock scenario when the buffer is full and all producers are waiting. Consider using condition variables instead of busy-waiting.",
      professor: "Dr. Michael Torres",
      status: "in-progress",
      createdAt: "2026-03-30T09:00:00",
      replies: [
        {
          author: localStorage.getItem("nexus-student-name") || "Alex Chen",
          content:
            "I see the issue. I'm refactoring to use pthread_cond_wait/signal instead of the spin lock.",
          time: "2026-03-30T15:30:00",
        },
        {
          author: "Dr. Michael Torres",
          content:
            "Good approach. Also consider what happens if a signal is sent before any thread is waiting.",
          time: "2026-03-31T08:45:00",
        },
      ],
    },
    {
      id: "f3",
      subjectId: "s5",
      title: "Excellent gradient descent optimization",
      comment:
        "Your implementation of mini-batch gradient descent with momentum is well-done. The learning rate scheduling is a nice touch. Consider exploring Adam optimizer for your final project.",
      professor: "Dr. Priya Sharma",
      status: "resolved",
      createdAt: "2026-03-25T14:00:00",
      replies: [
        {
          author: localStorage.getItem("nexus-student-name") || "Alex Chen",
          content:
            "Thank you! I'll definitely look into Adam and compare convergence rates.",
          time: "2026-03-25T16:00:00",
        },
      ],
    },
    {
      id: "f4",
      subjectId: "s2",
      title: "Matrix multiplication proof incomplete",
      comment:
        "Your proof for the associativity of matrix multiplication is missing the general case. You've shown it for 2x2 matrices, but you need to prove it for arbitrary m×n and n×p matrices.",
      professor: "Prof. James Liu",
      status: "open",
      createdAt: "2026-04-01T11:20:00",
      replies: [],
    },
    {
      id: "f5",
      subjectId: "s4",
      title: "Logic gates truth table has errors",
      comment:
        "The truth table for the XOR gate in problem 3.5 is incorrect. Also, your Boolean simplification in 3.7 can be reduced further using De Morgan's theorem.",
      professor: "Prof. Emily Park",
      status: "open",
      createdAt: "2026-04-02T09:45:00",
      replies: [],
    },
    {
      id: "f6",
      subjectId: "s6",
      title: "Strong technical writing style",
      comment:
        "Your abstract is concise and informative. The methodology section is particularly well-structured. Minor suggestion: use active voice more consistently in the results section.",
      professor: "Prof. Rachel Adams",
      status: "resolved",
      createdAt: "2026-03-27T13:30:00",
      replies: [
        {
          author: localStorage.getItem("nexus-student-name") || "Alex Chen",
          content:
            "Thanks! I'll revise the results section to use more active voice.",
          time: "2026-03-27T17:00:00",
        },
        {
          author: "Prof. Rachel Adams",
          content:
            "Great. Also, the references are well-formatted. Keep it up!",
          time: "2026-03-28T09:00:00",
        },
      ],
    },
  ],

  // ========== RESOURCES ==========
  resources: [
    {
      id: "r1",
      title: "Introduction to Algorithms (CLRS)",
      subjectId: "s1",
      type: "pdf",
      url: "#",
      tags: ["algorithms", "trees", "reference"],
      size: "2.4 MB",
      addedAt: "2026-03-15",
    },
    {
      id: "r2",
      title: "AVL Tree Visualization Guide",
      subjectId: "s1",
      type: "article",
      url: "https://visualgo.net/en/bst",
      tags: ["algorithms", "trees", "visualization"],
      size: "Web",
      addedAt: "2026-03-20",
    },
    {
      id: "r3",
      title: "Linear Algebra Done Right",
      subjectId: "s2",
      type: "pdf",
      url: "#",
      tags: ["math", "eigenvalues", "reference"],
      size: "1.8 MB",
      addedAt: "2026-03-10",
    },
    {
      id: "r4",
      title: "3Blue1Brown: Essence of Linear Algebra",
      subjectId: "s2",
      type: "video",
      url: "https://www.youtube.com/embed/fNk_zzaMoSs",
      tags: ["math", "visualization", "vectors"],
      size: "26 min",
      addedAt: "2026-03-05",
    },
    {
      id: "r5",
      title: "OS Concepts - Process Scheduling Slides",
      subjectId: "s3",
      type: "pdf",
      url: "#",
      tags: ["systems", "scheduling", "lecture"],
      size: "3.1 MB",
      addedAt: "2026-03-18",
    },
    {
      id: "r6",
      title: "Concurrency in Practice - Java Examples",
      subjectId: "s3",
      type: "article",
      url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/",
      tags: ["systems", "concurrency", "programming"],
      size: "Web",
      addedAt: "2026-03-22",
    },
    {
      id: "r7",
      title: "Graph Theory Fundamentals",
      subjectId: "s4",
      type: "pdf",
      url: "#",
      tags: ["math", "graphs", "reference"],
      size: "4.2 MB",
      addedAt: "2026-03-08",
    },
    {
      id: "r8",
      title: "Stanford CS229: Machine Learning Lecture Notes",
      subjectId: "s5",
      type: "pdf",
      url: "#",
      tags: ["ai", "statistics", "lecture"],
      size: "5.6 MB",
      addedAt: "2026-03-01",
    },
    {
      id: "r9",
      title: "Neural Networks: 3B1B Deep Learning Series",
      subjectId: "s5",
      type: "video",
      url: "https://www.youtube.com/embed/aircAruvnKk",
      tags: ["ai", "neural-networks", "visualization"],
      size: "19 min",
      addedAt: "2026-03-12",
    },
    {
      id: "r10",
      title: "Attention Is All You Need (Transformer Paper)",
      subjectId: "s5",
      type: "pdf",
      url: "#",
      tags: ["ai", "transformers", "research"],
      size: "1.2 MB",
      addedAt: "2026-03-25",
    },
    {
      id: "r11",
      title: "Technical Writing Handbook",
      subjectId: "s6",
      type: "article",
      url: "https://developers.google.com/tech-writing",
      tags: ["writing", "reference", "style"],
      size: "Web",
      addedAt: "2026-03-02",
    },
    {
      id: "r12",
      title: "APA Format Quick Guide",
      subjectId: "s6",
      type: "pdf",
      url: "#",
      tags: ["writing", "formatting", "reference"],
      size: "800 KB",
      addedAt: "2026-03-14",
    },
    {
      id: "r13",
      title: "Big-O Cheat Sheet",
      subjectId: "s1",
      type: "link",
      url: "https://www.bigocheatsheet.com/",
      tags: ["algorithms", "complexity", "reference"],
      size: "Web",
      addedAt: "2026-03-20",
    },
    {
      id: "r14",
      title: "MIT OCW: Mathematics for Computer Science",
      subjectId: "s4",
      type: "video",
      url: "https://www.youtube.com/embed/L3LMbpZIKhQ",
      tags: ["math", "logic", "lecture"],
      size: "52 min",
      addedAt: "2026-03-11",
    },
    {
      id: "r15",
      title: "LeetCode Dynamic Programming Patterns",
      subjectId: "s1",
      type: "article",
      url: "https://leetcode.com",
      tags: ["algorithms", "dp", "practice"],
      size: "Web",
      addedAt: "2026-03-28",
    },
    {
      id: "r16",
      title: "Calculus: Early Transcendentals",
      subjectId: "s2",
      type: "pdf",
      url: "#",
      tags: ["math", "calculus", "reference"],
      size: "14.5 MB",
      addedAt: "2026-03-29",
    },
    {
      id: "r17",
      title: "Linux Kernel Development",
      subjectId: "s3",
      type: "article",
      url: "https://kernel.org",
      tags: ["systems", "linux", "kernel"],
      size: "Web",
      addedAt: "2026-03-30",
    },
    {
      id: "r18",
      title: "Introduction to Automata Theory",
      subjectId: "s4",
      type: "pdf",
      url: "#",
      tags: ["math", "automata", "computation"],
      size: "9.2 MB",
      addedAt: "2026-04-01",
    },
    {
      id: "r19",
      title: "PyTorch Documentation",
      subjectId: "s5",
      type: "article",
      url: "https://pytorch.org/docs/stable/index.html",
      tags: ["ai", "pytorch", "programming"],
      size: "Web",
      addedAt: "2026-04-02",
    },
    {
      id: "r20",
      title: "How to Write a Good Research Paper",
      subjectId: "s6",
      type: "video",
      url: "https://www.youtube.com/watch?v=Nx3bO9ogkcg",
      tags: ["writing", "research", "tips"],
      size: "15 min",
      addedAt: "2026-04-03",
    },
    {
      id: "r21",
      title: "Rust and WebAssembly Book",
      subjectId: "s3",
      type: "article",
      url: "https://rustwasm.github.io/docs/book/",
      tags: ["systems", "wasm", "programming"],
      size: "Web",
      addedAt: "2026-04-04",
    },
    {
      id: "r22",
      title: "Advanced Graph Algorithms in Competitive Programming",
      subjectId: "s1",
      type: "pdf",
      url: "#",
      tags: ["algorithms", "competitive", "graphs"],
      size: "5.1 MB",
      addedAt: "2026-04-05",
    },
    {
      id: "r23",
      title: "CS231n: CNNs for Visual Recognition",
      subjectId: "s5",
      type: "link",
      url: "https://cs231n.github.io/",
      tags: ["ai", "computer-vision", "lecture"],
      size: "Web",
      addedAt: "2026-04-05",
    },
    {
      id: "r24",
      title: "Gramsci's Prison Notebooks - Selections",
      subjectId: "s6",
      type: "pdf",
      url: "#",
      tags: ["writing", "philosophy", "reference"],
      size: "20.0 MB",
      addedAt: "2026-04-06",
    },
    {
      id: "r25",
      title: "Group Theory and Its Applications",
      subjectId: "s4",
      type: "pdf",
      url: "#",
      tags: ["math", "group-theory", "abstract"],
      size: "8.4 MB",
      addedAt: "2026-04-06",
    },
    {
      id: "r26",
      title: "HuggingFace Transformers Documentation",
      subjectId: "s5",
      type: "article",
      url: "https://huggingface.co/docs",
      tags: ["ai", "transformers", "nlp"],
      size: "Web",
      addedAt: "2026-04-07",
    },
    {
      id: "r27",
      title: "The C Programming Language (K&R)",
      subjectId: "s3",
      type: "pdf",
      url: "#",
      tags: ["systems", "c", "reference"],
      size: "3.3 MB",
      addedAt: "2026-04-07",
    },
    {
      id: "r28",
      title: "Strang's Linear Algebra Lectures",
      subjectId: "s2",
      type: "video",
      url: "https://youtu.be/J7DzL2_Na80",
      tags: ["math", "lecture", "matrices"],
      size: "45 min",
      addedAt: "2026-04-08",
    },
    {
      id: "r29",
      title: "Operating Systems: Three Easy Pieces",
      subjectId: "s3",
      type: "pdf",
      url: "#",
      tags: ["systems", "os", "textbook"],
      size: "12.0 MB",
      addedAt: "2026-04-08",
    },
    {
      id: "r30",
      title: "Turing Machines Explained",
      subjectId: "s4",
      type: "video",
      url: "https://www.youtube.com/embed/dNRDvLACg5Q",
      tags: ["math", "turing", "computation"],
      size: "15 min",
      addedAt: "2026-04-09",
    },
    {
      id: "r31",
      title: "Competitive Programmer's Handbook",
      subjectId: "s1",
      type: "pdf",
      url: "#",
      tags: ["algorithms", "competitive", "handbook"],
      size: "7.8 MB",
      addedAt: "2026-04-09",
    },
    {
      id: "r32",
      title: "DeepLearning.AI: Prompt Engineering",
      subjectId: "s5",
      type: "article",
      url: "https://www.deeplearning.ai/short-courses/",
      tags: ["ai", "prompt-engineering", "llm"],
      size: "Web",
      addedAt: "2026-04-10",
    },
    {
      id: "r33",
      title: "The Elements of Style (Strunk & White)",
      subjectId: "s6",
      type: "pdf",
      url: "#",
      tags: ["writing", "style", "classic"],
      size: "1.1 MB",
      addedAt: "2026-04-10",
    },
    {
      id: "r34",
      title: "Understanding Quaternions",
      subjectId: "s2",
      type: "video",
      url: "https://www.youtube.com/embed/d4EgbgTm0Bg",
      tags: ["math", "quaternions", "graphics"],
      size: "32 min",
      addedAt: "2026-04-11",
    },
    {
      id: "r35",
      title: "GitHub: Awesome Algorithms",
      subjectId: "s1",
      type: "link",
      url: "https://github.com/tayllan/awesome-algorithms",
      tags: ["algorithms", "github", "curated"],
      size: "Web",
      addedAt: "2026-04-12",
    },
  ],

  // ========== KNOWLEDGE GRAPH CONNECTIONS ==========
  // Connections between subjects based on shared tags/concepts
  graphConnections: [
    { source: "s1", target: "s3", label: "Programming", strength: 0.8 },
    { source: "s1", target: "s4", label: "Complexity & Graphs", strength: 0.7 },
    { source: "s1", target: "s5", label: "Algorithms", strength: 0.6 },
    { source: "s2", target: "s5", label: "Matrices & Stats", strength: 0.9 },
    { source: "s2", target: "s4", label: "Math Foundation", strength: 0.85 },
    { source: "s3", target: "s1", label: "Systems Programming", strength: 0.8 },
    { source: "s4", target: "s1", label: "Graph Algorithms", strength: 0.7 },
    { source: "s5", target: "s1", label: "ML Algorithms", strength: 0.6 },
    {
      source: "s5",
      target: "s2",
      label: "Linear Algebra in ML",
      strength: 0.9,
    },
    { source: "s6", target: "s5", label: "Paper Writing", strength: 0.3 },
    { source: "s3", target: "s5", label: "GPU Computing", strength: 0.4 },
    { source: "s4", target: "s5", label: "Probability", strength: 0.5 },
  ],
};

// Helper to get subject by ID
NexusData.getSubject = function (id) {
  return this.subjects.find((s) => s.id === id);
};

// Helper to calculate dynamic health and GPA
NexusData.getLiveSubjectStats = function (subjectId) {
  const subject = this.subjects.find((s) => s.id === subjectId);
  if (!subject) return null;

  const subjectTasks = this.tasks.filter((t) => t.subjectId === subjectId);
  const now = new Date();

  let completedTasks = 0;
  let overduePenalty = 0;
  let totalWeights = 0;
  let earnedWeights = 0;

  subjectTasks.forEach((t) => {
    totalWeights += t.gradeWeight;
    if (t.completed) {
      completedTasks++;
      earnedWeights += t.gradeWeight;
    } else {
      const due = new Date(t.dueDate);
      if (due < now) {
        // Penalty for overdue uncompleted tasks
        overduePenalty += Math.min(10, (now - due) / (1000 * 60 * 60 * 24));
      }
    }
  });

  // Health is Base Health + points purely for completing tasks, minus penalty for dragging tasks.
  let dynamicHealth =
    subject.baseHealth + completedTasks * 1.5 - overduePenalty;
  dynamicHealth = Math.max(0, Math.min(100, dynamicHealth));

  // GPA part / Live Grade
  // Tasks are personal reminders, not assignments affecting actual GPA
  let dynamicGrade = subject.baseGrade;

  let trend = "stable";
  if (dynamicHealth > subject.baseHealth + 2) trend = "up";
  if (dynamicHealth < subject.baseHealth - 2) trend = "down";

  return {
    ...subject,
    health: Math.round(dynamicHealth),
    grade: Math.round(dynamicGrade),
    trend: trend,
    assignmentsDone: completedTasks,
    assignmentsTotal: Math.max(subject.assignmentsTotal, subjectTasks.length),
  };
};

NexusData.getAllLiveSubjects = function () {
  return this.subjects.map((s) => this.getLiveSubjectStats(s.id));
};

NexusData.getLiveGPA = function () {
  const liveSubjects = this.getAllLiveSubjects();
  if (liveSubjects.length === 0) return 0;
  let totalGradePoints = 0;
  let totalCredits = 0;

  // American GPA standard mapping
  const getGPAPoints = (grade) => {
    if (grade >= 95) return 4.0;
    if (grade >= 90) return 3.75;
    if (grade >= 85) return 3.5;
    if (grade >= 80) return 3.25;
    if (grade >= 75) return 3.0;
    if (grade >= 70) return 2.75;
    if (grade >= 65) return 2.5;
    if (grade >= 60) return 2.25;
    if (grade >= 55) return 2.0;
    if (grade >= 50) return 1.75;
    return 0.0;
  };

  liveSubjects.forEach((s) => {
    totalGradePoints += getGPAPoints(s.grade) * s.credits;
    totalCredits += s.credits;
  });

  return ((totalGradePoints / totalCredits) * (10 / 4)).toFixed(2);
};

// Helper to get today's classes
NexusData.getTodayClasses = function () {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = days[new Date().getDay()];
  return this.schedule
    .filter((c) => c.day === today)
    .map((c) => ({
      ...c,
      subject: this.getSubject(c.subjectId),
    }))
    .sort(
      (a, b) => a.startHour * 60 + a.startMin - (b.startHour * 60 + b.startMin),
    );
};

// Helper to calculate task gravity
NexusData.calcGravity = function (task) {
  const now = new Date();
  const due = new Date(task.dueDate);
  const daysLeft = Math.max(0, (due - now) / (1000 * 60 * 60 * 24));
  // Urgency: 10 if overdue, scales from 10 to 1 based on days left (0-14 range)
  const urgency =
    daysLeft <= 0 ? 10 : Math.max(1, 10 - Math.floor(daysLeft * (9 / 14)));
  const gravity = urgency * task.gradeWeight;
  return { urgency, gravity };
};

NexusData.saveTasks = function () {
  localStorage.setItem("nexus-tasks", JSON.stringify(this.tasks));
};

NexusData.loadTasks = function () {
  const saved = localStorage.getItem("nexus-tasks");
  if (saved) {
    try {
      this.tasks = JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse tasks from localStorage", e);
    }
  }
};

NexusData.saveFeedback = function () {
  localStorage.setItem("nexus-feedback", JSON.stringify(this.feedback));
};

NexusData.loadFeedback = function () {
  const saved = localStorage.getItem("nexus-feedback");
  if (saved) {
    try {
      this.feedback = JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse feedback from localStorage", e);
    }
  }
};

// Initialize by loading dynamic data
NexusData.loadTasks();
NexusData.loadFeedback();
