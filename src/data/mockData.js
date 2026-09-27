// Mock Data for ExamPulse Online Examination System

export const INITIAL_SUBJECTS = [
  {
    id: "sub-1",
    code: "CS301",
    name: "Data Structures & Algorithms",
    department: "Computer Science & Engineering",
    description: "Algorithmic analysis, tree traversal, graph algorithms, dynamic programming, and complexity.",
    examCount: 4,
    questionCount: 42,
    status: "Active",
    color: "#2563EB",
  },
  {
    id: "sub-2",
    code: "CS302",
    name: "Database Management Systems",
    department: "Computer Science & Engineering",
    description: "Relational algebra, ACID properties, indexing, B+ Trees, query optimization, and normalization.",
    examCount: 3,
    questionCount: 35,
    status: "Active",
    color: "#0D9488",
  },
  {
    id: "sub-3",
    code: "CS304",
    name: "Operating Systems Internals",
    department: "Computer Science & Engineering",
    description: "Process scheduling, thread concurrency, virtual memory management, file systems, and deadlocks.",
    examCount: 3,
    questionCount: 38,
    status: "Active",
    color: "#4F46E5",
  },
  {
    id: "sub-4",
    code: "CS401",
    name: "Computer Networks & Security",
    department: "Information Technology",
    description: "OSI and TCP/IP stack, routing protocols, flow control, transport layer security, and cryptographic fundamentals.",
    examCount: 2,
    questionCount: 28,
    status: "Active",
    color: "#D97706",
  },
  {
    id: "sub-5",
    code: "CS405",
    name: "Artificial Intelligence & ML",
    department: "Data Science & AI",
    description: "Supervised and unsupervised learning, gradient descent, loss functions, neural network architectures, and evaluation metrics.",
    examCount: 3,
    questionCount: 30,
    status: "Active",
    color: "#9333EA",
  },
  {
    id: "sub-6",
    code: "MA201",
    name: "Discrete Mathematics",
    department: "Applied Mathematics",
    description: "Set theory, propositional logic, graph theory, recurrence relations, and combinatorics.",
    examCount: 2,
    questionCount: 25,
    status: "Active",
    color: "#059669",
  }
];

export const INITIAL_QUESTIONS = [
  // CS301 Questions
  {
    id: "q-101",
    subjectId: "sub-1",
    examId: "exam-1",
    text: "What is the worst-case time complexity of searching an element in a Red-Black Tree with n nodes?",
    options: [
      { id: "A", text: "O(1)" },
      { id: "B", text: "O(log n)" },
      { id: "C", text: "O(n)" },
      { id: "D", text: "O(n log n)" }
    ],
    correctAnswer: "B",
    marks: 2,
    difficulty: "Medium",
    topic: "Balanced Search Trees",
    explanation: "A Red-Black tree is a self-balancing binary search tree with height guaranteed to be at most 2 * log2(n + 1). Hence, worst-case search time is strictly O(log n)."
  },
  {
    id: "q-102",
    subjectId: "sub-1",
    examId: "exam-1",
    text: "Which of the following algorithm paradigms is predominantly used by Dijkstra's Single-Source Shortest Path algorithm on non-negative edge weights?",
    options: [
      { id: "A", text: "Dynamic Programming" },
      { id: "B", text: "Greedy Approach" },
      { id: "C", text: "Divide and Conquer" },
      { id: "D", text: "Backtracking with Branch and Bound" }
    ],
    correctAnswer: "B",
    marks: 2,
    difficulty: "Easy",
    topic: "Graph Algorithms",
    explanation: "Dijkstra's algorithm selects the vertex with the minimal tentative distance at each step, which is a classic greedy choice strategy."
  },
  {
    id: "q-103",
    subjectId: "sub-1",
    examId: "exam-1",
    text: "In a min-heap with n elements, what is the time complexity to build the heap from an unsorted array of n elements using Floyd's heap construction method?",
    options: [
      { id: "A", text: "O(n log n)" },
      { id: "B", text: "O(n)" },
      { id: "C", text: "O(log n)" },
      { id: "D", text: "O(n^2)" }
    ],
    correctAnswer: "B",
    marks: 2,
    difficulty: "Medium",
    topic: "Heaps & Priority Queues",
    explanation: "Floyd's bottom-up buildHeap algorithm evaluates sum of (h * n / 2^(h+1)) across levels, converging linearly to O(n)."
  },
  {
    id: "q-104",
    subjectId: "sub-1",
    examId: "exam-1",
    text: "Consider a hash table of size 11 using open addressing with quadratic probing: h(k, i) = (k + i^2) mod 11. What is the hash index for key k = 37 at collision attempt i = 2?",
    options: [
      { id: "A", text: "Index 8" },
      { id: "B", text: "Index 4" },
      { id: "C", text: "Index 0" },
      { id: "D", text: "Index 6" }
    ],
    correctAnswer: "A",
    marks: 3,
    difficulty: "Hard",
    topic: "Hashing Techniques",
    explanation: "h(37, 2) = (37 + 2^2) mod 11 = (37 + 4) mod 11 = 41 mod 11 = 8."
  },
  {
    id: "q-105",
    subjectId: "sub-1",
    examId: "exam-1",
    text: "Which traversal of a Binary Search Tree (BST) visits nodes in strictly non-decreasing ascending order?",
    options: [
      { id: "A", text: "Pre-order traversal" },
      { id: "B", text: "In-order traversal" },
      { id: "C", text: "Post-order traversal" },
      { id: "D", text: "Level-order (BFS) traversal" }
    ],
    correctAnswer: "B",
    marks: 2,
    difficulty: "Easy",
    topic: "Binary Trees",
    explanation: "In a BST, all left descendants are smaller than the node, and right descendants are larger. In-order traversal visits Left -> Node -> Right, yielding sorted order."
  },

  // CS302 Questions
  {
    id: "q-201",
    subjectId: "sub-2",
    examId: "exam-2",
    text: "Which normal form removes all transitive functional dependencies X -> Y where X is not a superkey?",
    options: [
      { id: "A", text: "First Normal Form (1NF)" },
      { id: "B", text: "Second Normal Form (2NF)" },
      { id: "C", text: "Third Normal Form (3NF)" },
      { id: "D", text: "Boyce-Codd Normal Form (BCNF)" }
    ],
    correctAnswer: "C",
    marks: 2,
    difficulty: "Medium",
    topic: "Relational Normalization",
    explanation: "3NF requires the schema to be in 2NF and that no non-prime attribute is transitively dependent on any candidate key."
  },
  {
    id: "q-202",
    subjectId: "sub-2",
    examId: "exam-2",
    text: "In transaction management, which ACID property guarantees that concurrently executing transactions produce the same state as if executed serially?",
    options: [
      { id: "A", text: "Atomicity" },
      { id: "B", text: "Consistency" },
      { id: "C", text: "Isolation" },
      { id: "D", text: "Durability" }
    ],
    correctAnswer: "C",
    marks: 2,
    difficulty: "Easy",
    topic: "ACID Properties",
    explanation: "Isolation ensures concurrent execution of transactions leaves the database in the same state that would have been obtained if transactions were executed sequentially."
  },
  {
    id: "q-203",
    subjectId: "sub-2",
    examId: "exam-2",
    text: "Why are B+ trees preferred over standard B-trees for database indexing on disk storage?",
    options: [
      { id: "A", text: "B+ trees hold data pointers in all internal nodes" },
      { id: "B", text: "Leaf nodes in B+ trees are linked sequentially, allowing rapid range queries and higher internal node fan-out" },
      { id: "C", text: "B+ trees have a strictly lower height than B trees for small datasets" },
      { id: "D", text: "B+ trees do not require node rebalancing during insertion" }
    ],
    correctAnswer: "B",
    marks: 3,
    difficulty: "Hard",
    topic: "Storage & Indexing",
    explanation: "In B+ trees, all record pointers reside in leaf nodes, which form a linked list. This enables efficient range scans and stores only keys in internal nodes, maximizing fan-out."
  },

  // CS304 Questions
  {
    id: "q-301",
    subjectId: "sub-3",
    examId: "exam-3",
    text: "Which of the following condition combinations is necessary and sufficient for a deadlock condition according to Coffman's conditions?",
    options: [
      { id: "A", text: "Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait" },
      { id: "B", text: "Preemption, Starvation, Race Condition, Mutual Exclusion" },
      { id: "C", text: "Paging, Fragmentation, Thrashing, Inverted Page Table" },
      { id: "D", text: "Context Switching, Aging, Priority Inversion, Mutual Exclusion" }
    ],
    correctAnswer: "A",
    marks: 2,
    difficulty: "Medium",
    topic: "Deadlocks & Concurrency",
    explanation: "Coffman stated that deadlock can arise if and only if all four conditions hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait."
  },
  {
    id: "q-302",
    subjectId: "sub-3",
    examId: "exam-3",
    text: "What phenomenon occurs when excessive page faults lead to continuous paging activity, drastically lowering CPU utilization?",
    options: [
      { id: "A", text: "Belady's Anomaly" },
      { id: "B", text: "Thrashing" },
      { id: "C", text: "External Fragmentation" },
      { id: "D", text: "Deadlock Inversion" }
    ],
    correctAnswer: "B",
    marks: 2,
    difficulty: "Easy",
    topic: "Virtual Memory",
    explanation: "Thrashing occurs when a process does not have enough frames to hold its working set, causing frequent page faults and spending more time swapping than executing."
  },

  // CS401 Questions
  {
    id: "q-401",
    subjectId: "sub-4",
    examId: "exam-4",
    text: "In the TCP 3-Way Handshake protocol, what flags are set by the server in response to the client's initial SYN packet?",
    options: [
      { id: "A", text: "SYN only" },
      { id: "B", text: "SYN + ACK" },
      { id: "C", text: "ACK + FIN" },
      { id: "D", text: "RST + ACK" }
    ],
    correctAnswer: "B",
    marks: 2,
    difficulty: "Easy",
    topic: "Transport Layer Protocols",
    explanation: "The server acknowledges the client's sequence number with ACK and sends its own starting sequence number with SYN in a single SYN-ACK packet."
  },
  {
    id: "q-402",
    subjectId: "sub-4",
    examId: "exam-4",
    text: "Which IP addressing CIDR block prefix corresponds to the standard subnet mask 255.255.240.0?",
    options: [
      { id: "A", text: "/18" },
      { id: "B", text: "/19" },
      { id: "C", text: "/20" },
      { id: "D", text: "/22" }
    ],
    correctAnswer: "C",
    marks: 3,
    difficulty: "Medium",
    topic: "IP Addressing & Subnetting",
    explanation: "255.255.240.0 has 8 + 8 + 4 = 20 network bits (11111111.11111111.11110000.00000000), making it /20."
  }
];

export const INITIAL_EXAMS = [
  {
    id: "exam-1",
    code: "EX-CS301-M1",
    title: "Mid-Term Examination: Advanced Data Structures & Algorithms",
    subjectId: "sub-1",
    subjectName: "Data Structures & Algorithms",
    subjectCode: "CS301",
    description: "Official departmental mid-term assessment covering asymptotic notations, balanced search trees, graph algorithms, and dynamic programming.",
    durationMinutes: 45,
    totalQuestions: 5,
    totalMarks: 11,
    passingMarks: 6,
    difficulty: "Medium",
    status: "Published",
    scheduledStart: "2026-09-28T09:30:00",
    scheduledEnd: "2026-10-05T18:00:00",
    instructions: [
      "The exam consists of multiple-choice questions with single correct answers.",
      "Each question carries marks as indicated on the question header.",
      "Negative marking is not applicable for this session.",
      "Navigating away from the active browser window will trigger security proctor flags.",
      "You can mark questions for review and return to them anytime prior to submission.",
      "The system will automatically finalize and submit your responses when the timer runs out."
    ],
    attemptsAllowed: 2,
    attemptsCount: 148,
    passRate: 74.2,
    avgScore: 8.4,
    tags: ["Core CS", "Trees", "Graphs", "Midterm"]
  },
  {
    id: "exam-2",
    code: "EX-CS302-Q1",
    title: "Relational Modeling, Indexing & ACID Transactions Quiz",
    subjectId: "sub-2",
    subjectName: "Database Management Systems",
    subjectCode: "CS302",
    description: "Assessment on relational schema decomposition, B+ tree properties, isolation levels, and concurrency control.",
    durationMinutes: 30,
    totalQuestions: 3,
    totalMarks: 7,
    passingMarks: 4,
    difficulty: "Hard",
    status: "Published",
    scheduledStart: "2026-09-25T10:00:00",
    scheduledEnd: "2026-10-10T23:59:00",
    instructions: [
      "Read each scenario carefully before picking an answer.",
      "Calculators are not permitted; rough sheets may be maintained offline.",
      "Timer starts immediately after clicking 'Begin Examination'."
    ],
    attemptsAllowed: 1,
    attemptsCount: 112,
    passRate: 68.5,
    avgScore: 5.1,
    tags: ["Databases", "SQL", "Transactions"]
  },
  {
    id: "exam-3",
    code: "EX-CS304-S1",
    title: "Operating Systems: Concurrency, Virtual Memory & Storage",
    subjectId: "sub-3",
    subjectName: "Operating Systems Internals",
    subjectCode: "CS304",
    description: "Standard university assessment addressing scheduling queues, page replacement policies, synchronization primitives, and deadlocks.",
    durationMinutes: 40,
    totalQuestions: 2,
    totalMarks: 4,
    passingMarks: 2,
    difficulty: "Medium",
    status: "Published",
    scheduledStart: "2026-09-29T14:00:00",
    scheduledEnd: "2026-10-12T17:00:00",
    instructions: [
      "Strict proctoring rules are in effect.",
      "All questions are mandatory.",
      "Ensure an uninterrupted power and internet connection."
    ],
    attemptsAllowed: 1,
    attemptsCount: 95,
    passRate: 78.0,
    avgScore: 3.2,
    tags: ["OS", "Memory", "Semaphores"]
  },
  {
    id: "exam-4",
    code: "EX-CS401-N1",
    title: "Computer Networks & Transport Protocols Assessment",
    subjectId: "sub-4",
    subjectName: "Computer Networks & Security",
    subjectCode: "CS401",
    description: "Protocol headers, handshake stages, subnetting algorithms, and routing table convergence.",
    durationMinutes: 35,
    totalQuestions: 2,
    totalMarks: 5,
    passingMarks: 3,
    difficulty: "Easy",
    status: "Published",
    scheduledStart: "2026-09-27T08:00:00",
    scheduledEnd: "2026-10-08T20:00:00",
    instructions: [
      "Review network topology conventions before answering subnet questions.",
      "Answers can be cleared using the 'Clear Selection' action button."
    ],
    attemptsAllowed: 2,
    attemptsCount: 130,
    passRate: 82.5,
    avgScore: 4.2,
    tags: ["Networking", "TCP/IP", "Security"]
  },
  {
    id: "exam-5",
    code: "EX-CS405-A1",
    title: "Machine Learning Foundations & Neural Architectures",
    subjectId: "sub-5",
    subjectName: "Artificial Intelligence & ML",
    subjectCode: "CS405",
    description: "Gradient descent optimization, activation functions, regularization, bias-variance tradeoff, and evaluation metrics.",
    durationMinutes: 50,
    totalQuestions: 8,
    totalMarks: 20,
    passingMarks: 12,
    difficulty: "Hard",
    status: "Draft",
    scheduledStart: "2026-10-15T11:00:00",
    scheduledEnd: "2026-10-25T19:00:00",
    instructions: [
      "Examination scheduled for next term.",
      "Requires camera proctoring validation."
    ],
    attemptsAllowed: 1,
    attemptsCount: 0,
    passRate: 0,
    avgScore: 0,
    tags: ["AI", "Machine Learning", "Deep Learning"]
  }
];

export const CURRENT_STUDENT = {
  id: "std-53",
  name: "Bhavesh Thakur",
  rollNo: "53",
  email: "bhavesh.thakur@nhitm.ac.in",
  avatar: null,
  department: "Department of Information Technology",
  semester: "6th Semester",
  academicYear: "2025-2026",
  institution: "NHITM Engineering College",
  registeredDate: "2024-08-10",
  overallRank: 1,
  totalStudents: 184,
  gpa: 9.65
};

export const CURRENT_ADMIN = {
  id: "adm-001",
  name: "Prof. Rajesh Verma",
  designation: "Dean of Academic Evaluations",
  email: "r.verma@apexuniv.edu.in",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
  institution: "NHITM Engineering College",
  department: "Department of Information Technology",
  role: "CHIEF_ADMINISTRATOR"
};

export const INITIAL_STUDENTS = [
  {
    id: "std-53",
    name: "Bhavesh Thakur",
    rollNo: "53",
    email: "bhavesh.thakur@nhitm.ac.in",
    department: "Department of Information Technology",
    semester: "6th",
    attemptsCount: 9,
    avgScore: 96.4,
    status: "Active",
    lastActive: "Today at 11:30 AM"
  },
  {
    id: "std-06",
    name: "Atharva Chavan",
    rollNo: "6",
    email: "atharva.chavan@nhitm.ac.in",
    department: "Department of Information Technology",
    semester: "6th",
    attemptsCount: 8,
    avgScore: 94.2,
    status: "Active",
    lastActive: "Today at 10:15 AM"
  },
  {
    id: "std-24",
    name: "Aditya Mhaisekar",
    rollNo: "24",
    email: "aditya.mhaisekar@nhitm.ac.in",
    department: "Department of Information Technology",
    semester: "6th",
    attemptsCount: 8,
    avgScore: 92.8,
    status: "Active",
    lastActive: "Yesterday at 04:20 PM"
  },
  {
    id: "std-102",
    name: "Ananya Iyer",
    rollNo: "03",
    email: "ananya.iyer@nhitm.ac.in",
    department: "Computer Science & Engineering",
    semester: "6th",
    attemptsCount: 7,
    avgScore: 89.5,
    status: "Active",
    lastActive: "2 days ago"
  },
  {
    id: "std-103",
    name: "Rohan V. Deshmukh",
    rollNo: "19",
    email: "rohan.deshmukh@nhitm.ac.in",
    department: "Department of Information Technology",
    semester: "6th",
    attemptsCount: 6,
    avgScore: 86.0,
    status: "Active",
    lastActive: "3 days ago"
  },
  {
    id: "std-105",
    name: "Vikramaditya Rao",
    rollNo: "CS2024-088",
    email: "vikram.rao@apexuniv.edu.in",
    department: "Computer Science & Engineering",
    semester: "5th",
    attemptsCount: 5,
    avgScore: 78.4,
    status: "Active",
    lastActive: "3 days ago"
  },
  {
    id: "std-106",
    name: "Sneha Mukherjee",
    rollNo: "CS2024-094",
    email: "sneha.m@apexuniv.edu.in",
    department: "Information Technology",
    semester: "5th",
    attemptsCount: 7,
    avgScore: 82.1,
    status: "Active",
    lastActive: "4 days ago"
  },
  {
    id: "std-107",
    name: "Arjun K. Das",
    rollNo: "CS2024-112",
    email: "arjun.das@apexuniv.edu.in",
    department: "Computer Science & Engineering",
    semester: "5th",
    attemptsCount: 6,
    avgScore: 76.5,
    status: "Probation",
    lastActive: "1 week ago"
  }
];

export const INITIAL_ATTEMPTS = [
  {
    id: "att-801",
    examId: "exam-2",
    examTitle: "Relational Modeling, Indexing & ACID Transactions Quiz",
    subjectCode: "CS302",
    subjectName: "Database Management Systems",
    studentId: "std-53",
    studentName: "Bhavesh Thakur",
    studentRoll: "53",
    attemptDate: "2026-09-24T14:30:00",
    score: 6,
    totalMarks: 7,
    percentage: 85.7,
    status: "PASSED",
    durationSeconds: 1120, // 18m 40s
    totalQuestions: 3,
    correctCount: 2,
    incorrectCount: 1,
    unansweredCount: 0,
    responses: {
      "q-201": { selected: "C", isCorrect: true, timeSpent: 240 },
      "q-202": { selected: "C", isCorrect: true, timeSpent: 180 },
      "q-203": { selected: "A", isCorrect: false, timeSpent: 700 }
    }
  },
  {
    id: "att-802",
    examId: "exam-4",
    examTitle: "Computer Networks & Transport Protocols Assessment",
    subjectCode: "CS401",
    subjectName: "Computer Networks & Security",
    studentId: "std-53",
    studentName: "Bhavesh Thakur",
    studentRoll: "53",
    attemptDate: "2026-09-20T11:15:00",
    score: 5,
    totalMarks: 5,
    percentage: 100.0,
    status: "PASSED",
    durationSeconds: 980,
    totalQuestions: 2,
    correctCount: 2,
    incorrectCount: 0,
    unansweredCount: 0,
    responses: {
      "q-401": { selected: "B", isCorrect: true, timeSpent: 300 },
      "q-402": { selected: "C", isCorrect: true, timeSpent: 680 }
    }
  },
  {
    id: "att-803",
    examId: "exam-3",
    examTitle: "Operating Systems: Concurrency, Virtual Memory & Storage",
    subjectCode: "CS304",
    subjectName: "Operating Systems Internals",
    studentId: "std-53",
    studentName: "Bhavesh Thakur",
    studentRoll: "53",
    attemptDate: "2026-09-12T16:00:00",
    score: 4,
    totalMarks: 4,
    percentage: 100.0,
    status: "PASSED",
    durationSeconds: 840,
    totalQuestions: 2,
    correctCount: 2,
    incorrectCount: 0,
    unansweredCount: 0,
    responses: {
      "q-301": { selected: "A", isCorrect: true, timeSpent: 410 },
      "q-302": { selected: "B", isCorrect: true, timeSpent: 430 }
    }
  },
  {
    id: "att-804",
    examId: "exam-1",
    examTitle: "Mid-Term Examination: Advanced Data Structures & Algorithms",
    subjectCode: "CS301",
    subjectName: "Data Structures & Algorithms",
    studentId: "std-102",
    studentName: "Ananya Iyer",
    studentRoll: "CS2024-003",
    attemptDate: "2026-09-25T10:10:00",
    score: 11,
    totalMarks: 11,
    percentage: 100.0,
    status: "PASSED",
    durationSeconds: 1950,
    totalQuestions: 5,
    correctCount: 5,
    incorrectCount: 0,
    unansweredCount: 0
  },
  {
    id: "att-805",
    examId: "exam-1",
    examTitle: "Mid-Term Examination: Advanced Data Structures & Algorithms",
    subjectCode: "CS301",
    subjectName: "Data Structures & Algorithms",
    studentId: "std-103",
    studentName: "Rohan V. Deshmukh",
    studentRoll: "CS2024-019",
    attemptDate: "2026-09-25T11:40:00",
    score: 9,
    totalMarks: 11,
    percentage: 81.8,
    status: "PASSED",
    durationSeconds: 2200,
    totalQuestions: 5,
    correctCount: 4,
    incorrectCount: 1,
    unansweredCount: 0
  },
  {
    id: "att-806",
    examId: "exam-2",
    examTitle: "Relational Modeling, Indexing & ACID Transactions Quiz",
    subjectCode: "CS302",
    subjectName: "Database Management Systems",
    studentId: "std-107",
    studentName: "Arjun K. Das",
    studentRoll: "CS2024-112",
    attemptDate: "2026-09-22T09:00:00",
    score: 2,
    totalMarks: 7,
    percentage: 28.5,
    status: "FAILED",
    durationSeconds: 1780,
    totalQuestions: 3,
    correctCount: 1,
    incorrectCount: 2,
    unansweredCount: 0
  }
];

export const LEADERBOARD_DATA = [
  {
    rank: 1,
    id: "std-53",
    name: "Bhavesh Thakur",
    rollNo: "53",
    avatar: null,
    department: "Department of Information Technology",
    examsCompleted: 9,
    totalScore: 320,
    averageScore: 96.4,
    streak: 7,
    badge: "Institute Scholar",
    isCurrentUser: true
  },
  {
    rank: 2,
    id: "std-06",
    name: "Atharva Chavan",
    rollNo: "6",
    avatar: null,
    department: "Department of Information Technology",
    examsCompleted: 8,
    totalScore: 295,
    averageScore: 94.2,
    streak: 6,
    badge: "Algorithm Ace",
    isCurrentUser: false
  },
  {
    rank: 3,
    id: "std-24",
    name: "Aditya Mhaisekar",
    rollNo: "24",
    avatar: null,
    department: "Department of Information Technology",
    examsCompleted: 8,
    totalScore: 288,
    averageScore: 92.8,
    streak: 5,
    badge: "Consistent Performer",
    isCurrentUser: false
  },
  {
    rank: 4,
    id: "std-102",
    name: "Ananya Iyer",
    rollNo: "03",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    department: "Computer Science & Engineering",
    examsCompleted: 7,
    totalScore: 242,
    averageScore: 89.5,
    streak: 4,
    badge: "Rising Star",
    isCurrentUser: false
  },
  {
    rank: 5,
    id: "std-103",
    name: "Rohan V. Deshmukh",
    rollNo: "19",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    department: "Department of Information Technology",
    examsCompleted: 6,
    totalScore: 218,
    averageScore: 86.0,
    streak: 3,
    badge: "Network Specialist",
    isCurrentUser: false
  },
  {
    rank: 6,
    id: "std-104",
    name: "Priya Nair",
    rollNo: "67",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256",
    department: "Data Science & AI",
    examsCompleted: 6,
    totalScore: 211,
    averageScore: 84.0,
    streak: 2,
    badge: "Dedicated Learner",
    isCurrentUser: false
  },
  {
    rank: 7,
    id: "std-105",
    name: "Vikramaditya Rao",
    rollNo: "CS2024-088",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    department: "Computer Science",
    examsCompleted: 5,
    totalScore: 156,
    averageScore: 78.4,
    streak: 2,
    badge: "Dedicated Learner",
    isCurrentUser: false
  }
];

export const PERFORMANCE_ANALYTICS = {
  scoreTrend: [
    { exam: "CS401 Netw.", score: 72, avgScore: 68, date: "Aug 15" },
    { exam: "CS304 OS-I", score: 80, avgScore: 71, date: "Aug 28" },
    { exam: "CS302 DB-Q1", score: 85.7, avgScore: 69, date: "Sep 10" },
    { exam: "CS304 OS-II", score: 100, avgScore: 75, date: "Sep 18" },
    { exam: "CS401 Netw.-II", score: 100, avgScore: 79, date: "Sep 22" },
  ],
  subjectBreakdown: [
    { subject: "Data Structures", score: 88, fullMark: 100 },
    { subject: "Databases (DBMS)", score: 86, fullMark: 100 },
    { subject: "Operating Systems", score: 95, fullMark: 100 },
    { subject: "Networks & Security", score: 92, fullMark: 100 },
    { subject: "Machine Learning", score: 78, fullMark: 100 },
    { subject: "Discrete Math", score: 82, fullMark: 100 }
  ],
  passFailDistribution: [
    { name: "Passed First Attempt", value: 6, color: "#10B981" },
    { name: "Passed Re-attempt", value: 1, color: "#3B82F6" },
    { name: "Unsuccessful", value: 0, color: "#EF4444" }
  ],
  monthlyActivity: [
    { month: "May", attempts: 2 },
    { month: "Jun", attempts: 4 },
    { month: "Jul", attempts: 3 },
    { month: "Aug", attempts: 6 },
    { month: "Sep", attempts: 7 }
  ],
  insights: [
    "Your average score improved by 14.8% compared to the beginning of the semester.",
    "Strongest domain: Operating Systems & Process Synchronization (95% accuracy).",
    "Suggested study focus: Complex Hashing with Quadratic Probing & B+ Tree Splits.",
    "You have maintained an active evaluation streak for 4 consecutive weeks."
  ]
};

export const ADMIN_ANALYTICS = {
  overview: {
    totalStudents: 184,
    totalExams: 18,
    totalQuestions: 246,
    totalAttempts: 942,
    avgPassRate: 76.4,
    overallAvgScore: 78.2
  },
  participationTrend: [
    { day: "Mon", attempts: 42, activeStudents: 38 },
    { day: "Tue", attempts: 68, activeStudents: 59 },
    { day: "Wed", attempts: 124, activeStudents: 110 },
    { day: "Thu", attempts: 180, activeStudents: 154 },
    { day: "Fri", attempts: 145, activeStudents: 130 },
    { day: "Sat", attempts: 88, activeStudents: 72 },
    { day: "Sun", attempts: 54, activeStudents: 49 }
  ],
  departmentPerformance: [
    { department: "CSE", avgScore: 82.4, students: 85, passRate: 84 },
    { department: "IT", avgScore: 78.6, students: 46, passRate: 79 },
    { department: "DS & AI", avgScore: 81.1, students: 35, passRate: 82 },
    { department: "ECE", avgScore: 72.3, students: 18, passRate: 70 }
  ],
  hardestQuestions: [
    { id: "q-104", subject: "CS301", text: "Quadratic Probing hash collision resolution index", failRate: 64.2 },
    { id: "q-203", subject: "CS302", text: "B+ Tree disk block fan-out & sequential traversal", failRate: 58.7 },
    { id: "q-402", subject: "CS401", text: "CIDR subnet calculation for 255.255.240.0", failRate: 46.1 }
  ],
  recentActivity: [
    { id: "act-1", type: "EXAM_SUBMISSION", student: "Aarav Sharma", exam: "CS302 DBMS Quiz", time: "10 mins ago", score: "85.7%" },
    { id: "act-2", type: "STUDENT_REGISTRATION", student: "Divya Krishnan", exam: "Enrolled in CSE Batch B", time: "35 mins ago", score: "N/A" },
    { id: "act-3", type: "EXAM_PUBLISHED", student: "Prof. Rajesh Verma", exam: "CS401 Networks Mid-Term", time: "2 hours ago", score: "Live" },
    { id: "act-4", type: "EXAM_SUBMISSION", student: "Ananya Iyer", exam: "CS301 Algorithms Midterm", time: "3 hours ago", score: "100%" }
  ]
};
