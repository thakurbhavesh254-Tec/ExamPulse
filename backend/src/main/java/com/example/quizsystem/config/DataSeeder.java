package com.example.quizsystem.config;

import com.example.quizsystem.entity.*;
import com.example.quizsystem.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AttemptRepository attemptRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            logger.info("Database already contains seed records. Skipping initialization.");
            return;
        }

        logger.info("Starting database initialization with academic seed data...");

        // 1. Seed Users (1 Admin, 4 Students)
        User admin = new User(
                "Prof. Rajesh Verma",
                "r.verma@apexuniv.edu.in",
                passwordEncoder.encode("DeanAdmin@2026"),
                "FAC-CS-001",
                "Computer Science & Engineering",
                Role.ROLE_ADMIN
        );
        userRepository.save(admin);

        User student1 = new User(
                "Aarav Sharma",
                "aarav.sharma@apexuniv.edu.in",
                passwordEncoder.encode("ApexSecure@2026"),
                "CS2024-042",
                "Computer Science & Engineering",
                Role.ROLE_STUDENT
        );
        userRepository.save(student1);

        User student2 = new User(
                "Ananya Iyer",
                "ananya.iyer@apexuniv.edu.in",
                passwordEncoder.encode("ApexSecure@2026"),
                "CS2024-003",
                "Computer Science & Engineering",
                Role.ROLE_STUDENT
        );
        userRepository.save(student2);

        User student3 = new User(
                "Rohan Deshmukh",
                "rohan.deshmukh@apexuniv.edu.in",
                passwordEncoder.encode("ApexSecure@2026"),
                "CS2024-089",
                "Information Technology",
                Role.ROLE_STUDENT
        );
        userRepository.save(student3);

        User student4 = new User(
                "Priya Nair",
                "priya.nair@apexuniv.edu.in",
                passwordEncoder.encode("ApexSecure@2026"),
                "CS2024-115",
                "Computer Science & Engineering",
                Role.ROLE_STUDENT
        );
        userRepository.save(student4);

        logger.info("Seeded 5 users (1 Admin, 4 Students).");

        // 2. Seed Subjects
        Subject sub1 = new Subject(
                "CS301",
                "Advanced Data Structures & Algorithms",
                "Computer Science & Engineering",
                "Rigorous study of balanced trees, graph theory algorithms, dynamic programming formulations, and complexity theory."
        );
        Subject sub2 = new Subject(
                "CS302",
                "Database Management Systems & Relational Theory",
                "Computer Science & Engineering",
                "Relational algebra, normal forms (BCNF/3NF), ACID transactions, multi-version concurrency control, and index structures."
        );
        Subject sub3 = new Subject(
                "CS304",
                "Operating Systems & Concurrency",
                "Computer Science & Engineering",
                "Process scheduling, virtual memory management, deadlock detection algorithms, kernel synchronization, and IPC."
        );
        Subject sub4 = new Subject(
                "CS401",
                "Computer Networks & Cloud Protocols",
                "Information Technology",
                "Transport layer mechanics, congestion control, TCP/IP stack, software-defined networking, and cloud IAM protocols."
        );
        Subject sub5 = new Subject(
                "CS405",
                "Machine Learning & Pattern Recognition",
                "Artificial Intelligence",
                "Supervised learning algorithms, loss surface optimization, gradient descent mechanics, and deep neural representations."
        );

        subjectRepository.save(sub1);
        subjectRepository.save(sub2);
        subjectRepository.save(sub3);
        subjectRepository.save(sub4);
        subjectRepository.save(sub5);

        logger.info("Seeded 5 academic subjects.");

        // 3. Seed Exams
        Exam exam1 = new Exam(
                "DS-ADV-2026",
                "Midterm Evaluation: Advanced Data Structures & Algorithm Design",
                "Proctored midterm examination covering asymptotic bounds, AVL self-balancing trees, B-Trees, shortest-path graph traversals, and dynamic programming.",
                sub1,
                45,
                100,
                50,
                "Hard",
                "1. Proctored examination session.\n2. Fullscreen mode mandatory.\n3. Each question carries 20 marks.\n4. No negative marking for incorrect submissions.",
                true,
                2
        );

        Exam exam2 = new Exam(
                "DBMS-REL-2026",
                "Relational DB Architecture & SQL Concurrency Evaluation",
                "Assessment on relational normalization, transaction serializability, two-phase locking protocols, and disk-based indexing structures.",
                sub2,
                40,
                80,
                40,
                "Medium",
                "1. Standard academic evaluation criteria.\n2. 4 questions carrying 20 marks each.\n3. Review all answers before final submission.",
                true,
                2
        );

        Exam exam3 = new Exam(
                "OS-KERN-2026",
                "Operating Systems, Kernel Internals & Virtual Memory Diagnostics",
                "Evaluation covering Coffman deadlock conditions, page replacement anomalies, synchronization primitives, and modern CPU scheduling.",
                sub3,
                60,
                100,
                50,
                "Hard",
                "1. Complete in designated proctored environment.\n2. Single attempt policy strictly enforced.\n3. Ensure stable network connection.",
                true,
                1
        );

        Exam exam4 = new Exam(
                "CLOUD-SEC-2026",
                "Cloud Security, IAM Protocols & Distributed Systems",
                "Comprehensive diagnostic on OAuth 2.0 authorization flows, asymmetric public-key certificate verification, and API gateway routing architectures.",
                sub4,
                50,
                60,
                30,
                "Medium",
                "1. Draft departmental exam.\n2. Preliminary testing.",
                false, // Draft
                1
        );

        examRepository.save(exam1);
        examRepository.save(exam2);
        examRepository.save(exam3);
        examRepository.save(exam4);

        logger.info("Seeded 4 examinations (3 published, 1 draft).");

        // 4. Seed Questions for Exam 1 (DS-ADV-2026)
        List<Question> qList1 = new ArrayList<>();
        qList1.add(new Question(
                exam1,
                "What is the worst-case time complexity of searching an element in an AVL Tree containing N nodes?",
                "O(1)",
                "O(log N)",
                "O(N)",
                "O(N log N)",
                "B",
                20,
                "Medium",
                "Balanced Trees",
                "An AVL tree strictly maintains a balance factor between -1 and +1 for every node. The height is strictly bounded by 1.44 * log2(N), guaranteeing worst-case search complexity of O(log N)."
        ));
        qList1.add(new Question(
                exam1,
                "In a B-Tree of order M, what is the maximum number of children an internal node (non-root) can possess?",
                "M - 1",
                "M",
                "ceil(M / 2)",
                "2M",
                "B",
                20,
                "Hard",
                "B-Trees",
                "By definition, a B-tree of order M allows any node to have at most M children and at most M - 1 keys."
        ));
        qList1.add(new Question(
                exam1,
                "Which algorithmic paradigm does Dijkstra's Single Source Shortest Path algorithm employ on graphs with non-negative edge weights?",
                "Divide and Conquer",
                "Dynamic Programming",
                "Greedy Algorithm",
                "Backtracking",
                "C",
                20,
                "Medium",
                "Graph Algorithms",
                "Dijkstra's algorithm greedily extracts the vertex with the minimum tentative distance from a priority queue at each step, relying on non-negative weights for correctness."
        ));
        qList1.add(new Question(
                exam1,
                "What is the primary architectural advantage of a Trie (Prefix Tree) over a Hash Table for string dictionary queries?",
                "Lower worst-case space complexity in all scenarios",
                "Prefix matching and alphabetical ordering queries in O(L) time where L is word length",
                "O(1) time complexity for numerical hash computation",
                "Zero pointer memory overhead",
                "B",
                20,
                "Medium",
                "Trie Data Structure",
                "Tries allow prefix search (autocomplete) and lexicographical traversal in O(L) time without collisions, which hash tables cannot accomplish without linear scans."
        ));
        qList1.add(new Question(
                exam1,
                "Which dynamic programming recurrence correctly determines the optimal value for the 0/1 Knapsack problem with capacity W and N items?",
                "dp[i][w] = min(dp[i-1][w], dp[i-1][w-wt[i]])",
                "dp[i][w] = max(dp[i-1][w], dp[i-1][w-val[i]])",
                "dp[i][w] = max(dp[i-1][w], dp[i-1][w - wt[i-1]] + val[i-1])",
                "dp[i][w] = dp[i-1][w-1] + val[i]",
                "C",
                20,
                "Hard",
                "Dynamic Programming",
                "For the i-th item, we either exclude it (dp[i-1][w]) or include it if w >= wt[i-1] (dp[i-1][w - wt[i-1]] + val[i-1]) and take the maximum."
        ));
        questionRepository.saveAll(qList1);

        // Seed Questions for Exam 2 (DBMS-REL-2026)
        List<Question> qList2 = new ArrayList<>();
        qList2.add(new Question(
                exam2,
                "Which ACID transaction property guarantees that concurrent execution leaves the database in the same state as if executed serially?",
                "Atomicity",
                "Consistency",
                "Isolation",
                "Durability",
                "C",
                20,
                "Easy",
                "Transactions",
                "Isolation ensures concurrent transactions operate independently without interference, preserving serializability equivalent to sequential execution."
        ));
        qList2.add(new Question(
                exam2,
                "Under the Two-Phase Locking (2PL) protocol, what occurs during the shrinking phase?",
                "Locks can be acquired but none released",
                "Locks can only be released and no new locks acquired",
                "Shared locks can be upgraded to exclusive locks",
                "Transaction rolls back immediately",
                "B",
                20,
                "Medium",
                "Concurrency Control",
                "During the shrinking phase of 2PL, a transaction may only release held locks; it is strictly prohibited from acquiring any new locks."
        ));
        qList2.add(new Question(
                exam2,
                "A relational table schema is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:",
                "Y is a prime attribute",
                "X is a superkey",
                "X is a candidate key and Y is atomic",
                "No transitive dependency exists",
                "B",
                20,
                "Hard",
                "Normalization",
                "BCNF enforces the strict requirement that every determinant X in a non-trivial functional dependency X -> Y must be a superkey."
        ));
        qList2.add(new Question(
                exam2,
                "Why are B+ Trees preferred over standard B-Trees for disk-based relational database indexes?",
                "B+ Trees store data tuples inside internal nodes to save disk space",
                "Leaf nodes are linked in a sequential doubly-linked list enabling rapid range scans",
                "B+ Trees require zero disk block I/O during point queries",
                "B+ Trees have non-deterministic branching factors",
                "B",
                20,
                "Medium",
                "Storage & Indexing",
                "B+ Trees store all actual record references in leaf nodes, linked sequentially. This makes range scans extremely efficient without tree re-traversals."
        ));
        questionRepository.saveAll(qList2);

        // Seed Questions for Exam 3 (OS-KERN-2026)
        List<Question> qList3 = new ArrayList<>();
        qList3.add(new Question(
                exam3,
                "Which condition is NOT one of Coffman's four necessary conditions for a deadlock to occur in an operating system?",
                "Mutual Exclusion",
                "Hold and Wait",
                "Preemptive Resource Scheduling",
                "Circular Wait",
                "C",
                25,
                "Medium",
                "Deadlocks",
                "The necessary condition is No Preemption. If preemptive resource scheduling is supported, deadlock cannot persist."
        ));
        qList3.add(new Question(
                exam3,
                "In virtual memory paging, what is the phenomenon known as 'Belady's Anomaly'?",
                "Page fault rate decreases as the number of allocated page frames increases",
                "Page fault rate increases as the number of allocated page frames increases under FIFO replacement",
                "TLB hit rate drops to zero during thread context switching",
                "Thrashing caused by working set expansion",
                "B",
                25,
                "Hard",
                "Memory Management",
                "Belady's Anomaly describes situations where increasing the number of physical frames leads to more page faults for FIFO page replacement."
        ));
        qList3.add(new Question(
                exam3,
                "What is the key functional difference between a counting semaphore and a mutex lock?",
                "A mutex can be unlocked by any arbitrary thread whereas a semaphore requires the original owner",
                "A mutex possesses an ownership concept and binary state, while a counting semaphore tracks integer permits without ownership",
                "Counting semaphores are implemented strictly in user-space without kernel system calls",
                "Mutexes disable hardware interrupts across all processor cores",
                "B",
                25,
                "Medium",
                "Synchronization",
                "A mutex is owned by the thread that locked it. A semaphore maintains an integer count of available resources and any thread can signal it."
        ));
        qList3.add(new Question(
                exam3,
                "In the Linux Completely Fair Scheduler (CFS), what metric determines which runnable task is scheduled next on the CPU?",
                "Static UNIX nice priority slice",
                "Lowest virtual runtime (vruntime) tracked in a red-black tree",
                "Highest remaining estimated burst time",
                "Round robin time slice counter",
                "B",
                25,
                "Hard",
                "CPU Scheduling",
                "CFS picks the task with the smallest vruntime from the leftmost node of a balanced Red-Black tree to ensure fair CPU time distribution."
        ));
        questionRepository.saveAll(qList3);

        logger.info("Seeded 13 questions with explanations and topics across exams.");

        // 5. Seed Realistic Completed Attempts & Answers
        // Student 1 (Aarav Sharma) - Exam 1 (Scored 100/100)
        Attempt att1 = new Attempt(student1, exam1);
        att1.setStartTime(LocalDateTime.now().minusDays(3).minusHours(2));
        att1.setSubmitTime(LocalDateTime.now().minusDays(3).minusHours(1).minusMinutes(22));
        att1.setScore(100);
        att1.setTotalMarks(100);
        att1.setPercentage(100.0);
        att1.setStatus(AttemptStatus.PASS);
        att1.setDurationSeconds(2280);
        att1.setCorrectAnswers(5);
        att1.setIncorrectAnswers(0);
        att1.setUnanswered(0);
        attemptRepository.save(att1);

        for (Question q : qList1) {
            Answer ans = new Answer(att1, q, q.getCorrectAnswer(), true, q.getMarks());
            answerRepository.save(ans);
        }

        // Student 2 (Ananya Iyer) - Exam 1 (Scored 80/100)
        Attempt att2 = new Attempt(student2, exam1);
        att2.setStartTime(LocalDateTime.now().minusDays(2).minusHours(4));
        att2.setSubmitTime(LocalDateTime.now().minusDays(2).minusHours(3).minusMinutes(18));
        att2.setScore(80);
        att2.setTotalMarks(100);
        att2.setPercentage(80.0);
        att2.setStatus(AttemptStatus.PASS);
        att2.setDurationSeconds(2520);
        att2.setCorrectAnswers(4);
        att2.setIncorrectAnswers(1);
        att2.setUnanswered(0);
        attemptRepository.save(att2);

        for (int i = 0; i < qList1.size(); i++) {
            Question q = qList1.get(i);
            String selected = (i == 4) ? "A" : q.getCorrectAnswer(); // question 5 answered wrong
            boolean correct = (i != 4);
            int marks = correct ? q.getMarks() : 0;
            Answer ans = new Answer(att2, q, selected, correct, marks);
            answerRepository.save(ans);
        }

        // Student 1 (Aarav Sharma) - Exam 2 (Scored 80/80)
        Attempt att3 = new Attempt(student1, exam2);
        att3.setStartTime(LocalDateTime.now().minusDays(1).minusHours(5));
        att3.setSubmitTime(LocalDateTime.now().minusDays(1).minusHours(4).minusMinutes(25));
        att3.setScore(80);
        att3.setTotalMarks(80);
        att3.setPercentage(100.0);
        att3.setStatus(AttemptStatus.PASS);
        att3.setDurationSeconds(2100);
        att3.setCorrectAnswers(4);
        att3.setIncorrectAnswers(0);
        att3.setUnanswered(0);
        attemptRepository.save(att3);

        for (Question q : qList2) {
            Answer ans = new Answer(att3, q, q.getCorrectAnswer(), true, q.getMarks());
            answerRepository.save(ans);
        }

        // Student 3 (Rohan Deshmukh) - Exam 2 (Scored 60/80)
        Attempt att4 = new Attempt(student3, exam2);
        att4.setStartTime(LocalDateTime.now().minusHours(8));
        att4.setSubmitTime(LocalDateTime.now().minusHours(7).minusMinutes(20));
        att4.setScore(60);
        att4.setTotalMarks(80);
        att4.setPercentage(75.0);
        att4.setStatus(AttemptStatus.PASS);
        att4.setDurationSeconds(2400);
        att4.setCorrectAnswers(3);
        att4.setIncorrectAnswers(1);
        att4.setUnanswered(0);
        attemptRepository.save(att4);

        for (int i = 0; i < qList2.size(); i++) {
            Question q = qList2.get(i);
            String selected = (i == 2) ? "A" : q.getCorrectAnswer(); // question 3 wrong
            boolean correct = (i != 2);
            int marks = correct ? q.getMarks() : 0;
            Answer ans = new Answer(att4, q, selected, correct, marks);
            answerRepository.save(ans);
        }

        logger.info("Seeded 4 realistic completed evaluation attempts with full question responses.");
        logger.info("==========================================================================");
        logger.info("   ACADEMIC SYSTEM INITIALIZED SUCCESSFULLY WITH TEST CREDENTIALS:");
        logger.info("   Admin:    r.verma@apexuniv.edu.in         / DeanAdmin@2026");
        logger.info("   Student1: aarav.sharma@apexuniv.edu.in    / ApexSecure@2026");
        logger.info("   Student2: ananya.iyer@apexuniv.edu.in     / ApexSecure@2026");
        logger.info("   Student3: rohan.deshmukh@apexuniv.edu.in  / ApexSecure@2026");
        logger.info("   Student4: priya.nair@apexuniv.edu.in      / ApexSecure@2026");
        logger.info("==========================================================================");
    }
}
