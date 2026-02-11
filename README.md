# Nexus - Social Graph Platform ⚛️

> A sophisticated, high-performance social media application engineered to demonstrate mastery of the MERN stack, GraphQL orchestration, and modern complex data modeling.

## 📋 What is this?

**Nexus** is a fully functional Social Media Single Page Application (SPA) that simulates a real-time feed environment. It allows users to authenticate, share thoughts, interact via likes/comments, and manage their digital footprint.

Unlike simple CRUD apps, this project implements a **GraphQL API** capable of handling deeply nested relationships (User → Posts → Comments → Likes) in a single request, solving the common performance bottlenecks found in traditional REST architectures.

## 🔗 **Live Demo:** 

Access the deployed application here: 👉 [https://social-media-graph-ql.vercel.app/]

---

## 🚀 Tech Stack

This project leverages the robust ecosystem of modern JavaScript:

* **Frontend Framework:** React 18 (Vite for fast bundling)
* **Language:** TypeScript (Strict typing for reliability)
* **API Architecture:** GraphQL (Apollo Server & Client)
* **Database:** MongoDB (via Mongoose ODM)
* **Styling:** TailwindCSS (Dark Mode & Responsive Design)
* **Authentication:** Custom JWT (Stateless Security)
* **State Management:** Apollo Client Cache (Normalized Caching)
* **Deployment:** Vercel (Client) & Render (Server)

---

## ✨ Key Features

### ⚡ Immersive User Experience
* **Optimistic UI:** Instant feedback on interactions (Likes/Comments). The UI updates immediately while the server processes the request in the background, masking network latency.
* **Dark Mode System:** A persistent theme toggle that respects user preference and system settings.

### 🛡️ Security & Integrity
* **Granular Permissions:** Logic that strictly enforces data ownership—users can only delete their own content.
* **Danger Zone:** A complete account deletion workflow that performs a cascading delete, removing the user and cleaning up all associated posts from the database.
* **Smart Validation:** Backend enforcement of unique emails and usernames to prevent duplicates before they hit the database.

---

## 🧠 Architectural Decisions & Technical Strategy

### 1. GraphQL over REST
**Decision:** Adopted Apollo Server to handle data fetching.
**Reasoning:**
* **Solves N+1 Problem:** In a social feed, fetching a post, then its author, then its comments, and the comments' authors would require dozens of endpoints in REST. GraphQL fetches the entire tree in **one single request**.
* **Payload Efficiency:** The client requests *only* the fields it needs (e.g., just the avatar and username), reducing bandwidth usage on mobile networks.

### 2. Normalized Caching (Apollo Client)
**Decision:** Used Apollo Client's in-memory cache instead of Redux or Context API for server state.
**Reasoning:**
* **Single Source of Truth:** When a user likes a post, we don't need to refetch the feed. We directly modify the cached entity, and React automatically re-renders any component watching that specific ID. This creates a "snappy" native-app feel.

### 3. Relational Logic in NoSQL
**Decision:** Using Mongoose with strict Schemas to model relationships.
**Reasoning:**
* While MongoDB is document-based, social data is inherently relational. I architected the schema to handle references (`ObjectId`) efficiently, allowing for complex aggregations while maintaining the scalability of a NoSQL environment.

### 4. Custom JWT Implementation
**Decision:** Built a custom Authentication middleware instead of using Auth0 or Clerk.
**Reasoning:**
* To demonstrate a deep understanding of stateless authentication flow, token generation, encryption (bcrypt), and HTTP headers authorization without relying on "magic" third-party wrappers.

---

## 🔧 How to Run Locally

1. **Clone the repository:**
    ```bash
    git clone [https://github.com/paulo-cardoso71/Nexus-App.git](https://github.com/paulo-cardoso71/Nexus-App.git)
    ```

2. **Setup Backend:**
    ```bash
    cd server
    npm install
    # Create a .env file with:
    # MONGODB_URI=your_mongodb_string
    # SECRET_KEY=your_secret_key
    npm run dev
    ```

3. **Setup Frontend:**
    ```bash
    cd client
    npm install
    # The app will connect to localhost:4000 by default.
    # If you need to change the API URL, create a .env file:
    # VITE_API_URL=http://your-custom-url/graphql
    npm run dev
    ```

4. **Access:**
    ```
    Open http://localhost:5173 to view the app.
    ```

## 🧠 Deployment

This project follows a distributed deployment strategy:

Frontend: Deployed on Vercel with automatic CI/CD pipelines connected to the main branch.

Backend: Hosted on Render, serving the GraphQL API endpoint.

Database: Managed cluster on MongoDB Atlas.


## 👨‍💻 Author

Paulo Eder Medeiros Cardoso. Software Engineer focused on building scalable, high-performance web applications.
