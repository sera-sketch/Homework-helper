export const learnData = [
  {
    subject: "Mathematics",
    icon: "calculate",
    color: "linear-gradient(135deg, #ef4444, #f97316)",
    topics: [
      {
        id: "math-1",
        title: "Algebra Basics: Equations & Inequalities",
        level: "Beginner",
        content: `
### Introduction to Algebra
Algebra uses letters (like x or y) to represent unknown numbers. The main goal is to find the value of these unknowns.

#### 1. Solving Linear Equations
An equation is like a scale; whatever you do to one side, you must do to the other to keep it balanced.
**Example**: Solve 2x + 5 = 13
1. Subtract 5 from both sides: 2x = 8
2. Divide by 2: x = 4

#### 2. Inequalities
Inequalities show that two values are not equal. 
- \`>\` means greater than
- \`<\` means less than
- \`>=\` means greater than or equal to
- \`<=\` means less than or equal to

**Example**: Solve 3x - 2 > 10
1. Add 2 to both sides: 3x > 12
2. Divide by 3: x > 4

*Insight*: If you ever multiply or divide an inequality by a negative number, you MUST flip the inequality sign!
        `
      },
      {
        id: "math-2",
        title: "Introduction to Calculus: The Derivative",
        level: "Intermediate",
        content: `
### What is a Derivative?
The derivative measures the *instantaneous rate of change* of a function. Geometrically, it represents the slope of the tangent line to the curve at any given point.

#### The Power Rule
The most common rule for finding derivatives is the Power Rule.
If f(x) = x^n, then f'(x) = n * x^(n-1).

**Example**: Find the derivative of f(x) = 3x^4.
1. Multiply the coefficient by the exponent: 3 * 4 = 12
2. Decrease the exponent by 1: 4 - 1 = 3
3. Result: f'(x) = 12x^3

#### Concept of Limits
Derivatives are built on limits. The formal definition of a derivative is the limit as h approaches 0 of [f(x+h) - f(x)] / h.

*Insight*: Think of a car driving. The function f(x) is your position at time x. The derivative f'(x) is your speedometer—your exact speed at that moment!
        `
      },
      {
        id: "math-3",
        title: "Linear Algebra: Matrices & Vectors",
        level: "Advanced",
        content: `
### Matrices and Vectors
Linear algebra is the mathematics of data. It revolves around vectors (1D arrays of numbers) and matrices (2D arrays of numbers).

#### Matrix Multiplication
Matrix multiplication is not commutative (AB != BA). To multiply matrix A (size m x n) and matrix B (size n x p), the inner dimensions (n) must match. The resulting matrix will have size m x p.

#### Determinants
The determinant is a scalar value that can be computed from the elements of a square matrix. It encodes certain properties of the linear transformation described by the matrix.
- If det(A) = 0, the matrix is non-invertible (singular).
- It geometrically represents the scaling factor of the linear transformation.

*Insight*: In Computer Graphics, every rotation, translation, and scaling of a 3D object is just multiplying vectors representing points by transformation matrices!
        `
      }
    ]
  },
  {
    subject: "Science",
    icon: "science",
    color: "linear-gradient(135deg, #10b981, #3b82f6)",
    topics: [
      {
        id: "sci-1",
        title: "Cell Biology Fundamentals",
        level: "Beginner",
        content: `
### The Cell Theory
1. All living organisms are composed of one or more cells.
2. The cell is the basic unit of structure and organization in organisms.
3. Cells arise from pre-existing cells.

#### Prokaryotes vs. Eukaryotes
- **Prokaryotes**: Simple cells without a nucleus (e.g., Bacteria). Their DNA floats freely in the cytoplasm.
- **Eukaryotes**: Complex cells with a nucleus and membrane-bound organelles (e.g., Animal and Plant cells).

#### Key Organelles
- **Nucleus**: The "brain" of the cell; contains DNA.
- **Mitochondria**: The "powerhouse" of the cell; generates ATP (energy) through cellular respiration.
- **Ribosomes**: Protein synthesizers.

*Insight*: Plant cells have a rigid cell wall and chloroplasts (for photosynthesis), which animal cells lack!
        `
      },
      {
        id: "sci-2",
        title: "Classical Mechanics: Newton's Laws",
        level: "Intermediate",
        content: `
### Newton's Three Laws of Motion
Classical mechanics describes the motion of macroscopic objects.

#### First Law (Inertia)
An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.

#### Second Law (F = ma)
The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force, in the same direction as the net force, and inversely proportional to the mass of the object.

#### Third Law (Action & Reaction)
For every action, there is an equal and opposite reaction.

*Insight*: When you jump off a small boat, you push the boat backward (action) to propel yourself forward (reaction).
        `
      },
      {
        id: "sci-3",
        title: "Organic Chemistry: Functional Groups",
        level: "Advanced",
        content: `
### What are Functional Groups?
Functional groups are specific groupings of atoms within molecules that have their own characteristic properties, regardless of the other atoms present in a molecule.

#### Common Groups
1. **Hydroxyl (-OH)**: Found in alcohols. Makes molecules polar and capable of hydrogen bonding.
2. **Carbonyl (C=O)**: Found in aldehydes and ketones.
3. **Carboxyl (-COOH)**: Found in carboxylic acids (like acetic acid). Acts as an acid by donating a proton.
4. **Amino (-NH2)**: Found in amines. Acts as a base.

#### Why they matter
Biological molecules (like amino acids) are defined by their functional groups. An amino acid literally has an "amino" group and a "carboxyl" (acid) group.

*Insight*: The reactivity of organic molecules is almost entirely dictated by the functional groups they contain. The rest of the carbon skeleton is usually just an unreactive framework.
        `
      }
    ]
  },
  {
    subject: "History",
    icon: "account_balance",
    color: "linear-gradient(135deg, #f59e0b, #eab308)",
    topics: [
      {
        id: "hist-1",
        title: "Ancient Rome: Republic to Empire",
        level: "Beginner",
        content: `
### The Roman Republic
Before Rome was ruled by emperors, it was a Republic (509 BC – 27 BC). It was governed by a complex constitution, centering on the principles of a separation of powers and checks and balances.

#### The Fall of the Republic
The late Republic was marked by political turmoil and civil wars. Julius Caesar emerged as a dictator, but was assassinated in 44 BC by senators who wanted to restore the Republic.

#### The Rise of the Empire
After Caesar's death, his adopted heir Octavian defeated his rivals (including Mark Antony and Cleopatra) and became Augustus, the first Roman Emperor, in 27 BC. This marked the beginning of the Pax Romana (Roman Peace).

*Insight*: The American founding fathers were deeply inspired by the Roman Republic when designing the US Constitution, especially the Senate!
        `
      },
      {
        id: "hist-2",
        title: "World War II: The Major Turning Points",
        level: "Intermediate",
        content: `
### A Global Conflict (1939-1945)
World War II involved the vast majority of the world's countries forming two opposing military alliances: the Allies and the Axis.

#### Key Turning Points
1. **Battle of Britain (1940)**: The Royal Air Force defended the UK against Nazi Germany's air force, preventing a ground invasion.
2. **Battle of Stalingrad (1942-1943)**: A brutal battle where the Soviet Union successfully defended the city, marking the turning point on the Eastern Front.
3. **Battle of Midway (1942)**: A decisive naval battle in the Pacific Theater where the US defeated the attacking Japanese fleet.
4. **D-Day (1944)**: The Allied invasion of Normandy, France, leading to the liberation of Western Europe.

*Insight*: WWII spurred massive technological advancements, including radar, jet engines, and the first electronic computers (used for code-breaking).
        `
      }
    ]
  },
  {
    subject: "Computer Science",
    icon: "code",
    color: "linear-gradient(135deg, #a855f7, #ec4899)",
    topics: [
      {
        id: "cs-1",
        title: "Introduction to Algorithms",
        level: "Beginner",
        content: `
### What is an Algorithm?
An algorithm is simply a step-by-step set of instructions to solve a specific problem. A recipe for baking a cake is an algorithm!

#### Sorting Algorithms
Imagine having a messy deck of cards and wanting to sort them.
- **Bubble Sort**: repeatedly step through the list, compare adjacent elements and swap them if they are in the wrong order. Very slow!
- **Merge Sort**: Divide the deck into halves until you have single cards, then merge them back together in order. Much faster!

#### Big O Notation
Big O notation is used to classify algorithms according to how their run time or space requirements grow as the input size grows.
- O(1): Constant time (instant).
- O(n): Linear time (grows proportionally with input).
- O(n^2): Quadratic time (gets slow very fast).

*Insight*: The efficiency of an algorithm matters more than the speed of the computer running it when dealing with massive amounts of data!
        `
      },
      {
        id: "cs-2",
        title: "Data Structures: Trees and Graphs",
        level: "Advanced",
        content: `
### Beyond Arrays and Lists
While arrays are linear, many real-world relationships are not.

#### Trees
A tree is a hierarchical data structure consisting of nodes.
- **Root**: The top node.
- **Leaves**: Nodes with no children.
- **Binary Search Tree (BST)**: A tree where the left child is smaller than the parent, and the right child is larger. It allows for O(log n) search times.

#### Graphs
A graph is a network of nodes (vertices) connected by edges. 
- Useful for representing social networks, maps, and the internet.
- Algorithms like Dijkstra's find the shortest path between two nodes in a graph.

*Insight*: The DOM (Document Object Model) that structures every webpage is exactly a Tree data structure!
        `
      }
    ]
  }
];
