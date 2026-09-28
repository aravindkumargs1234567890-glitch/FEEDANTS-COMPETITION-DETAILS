# Feedants — Full-Stack Competition Details Module

A production-grade, full-stack implementation of the **Feedants Classical Dance Competition Details Screen** built for the Feedants Full-Stack Development Internship technical assessment.

This repository features a faithful reproduction of the provided Feedants design, driven by an Express REST API backend and an ACID-safe MongoDB architecture supporting dynamic lifecycle states, atomic concurrency controls, and real-time user action handling.

---

## 🚀 Key Features Implemented

1. **Pixel-Perfect Visual & Functional Reproduction**:
   - Status bar, top navigation (`Go back`, `ENG | हिंदी` bilingual toggle).
   - Dynamic badges (`Dance`, `Multi-Win`, `🏆 Winners get certificate`, and dynamic status badges: `✓ Registered`, `Open`, `Sold Out`, `Closed`).
   - Dynamic metrics: Prize pool (₹1,500), entry fee (₹99), and live capacity progress bar (`Only 19 spots left`, `1 / 20 Booked`).
   - Judge profile card: Portrait of Manju Dubey with playback modal for the Intro Video.
   - Real-time countdown timer: Live seconds-accurate countdown (`01d : 06h : 28m : 32s • Hurry up!`).
   - 2x2 Important Dates grid (`Register Before`, `Submission Starts`, `Submission Ends`, `Result Date`).
   - Previous Winners carousel: Horizontal scrolling list with playable winning performances (Riya Shah, Aarav Mehta, Neha Verma, Ishita Choi).
   - Expandable Tabs: `About Competition`, `Judging Parameters`, and `Rules & Eligibility` with `View more / View less` toggle.
   - Complete Rewards breakdown for all 6 podium positions (₹550, ₹300, ₹240, ₹200, ₹130, ₹80).
   - Disclaimer notice, Trust badges (payout video modal, refund policy modal, Razorpay branding).
   - Referral card with clipboard copy and native share integration (`https://feedants.com/r/referral123`).
   - Participant reviews drawer (`Hear From Our Users`) with 5-star ratings and testimonials.
   - Sticky bottom action button dynamically reflecting user registration & submission state (`Upload Submission`, `Register Now`, `Sold Out`, `Registration Closed`, etc.).
   - 5-tab Bottom Navigation bar (`Home`, `Explore`, `(+)`, `Competitions`, `Profile`).

2. **Backend Architecture & MongoDB Modelling**:
   - **`User` Model**: Name, email, hashed credentials (PBKDF2-SHA256), profile image, contact metadata.
   - **`Competition` Model**: Full schema encompassing capacity limits, prize pool, dynamic dates, judge metadata, previous winners, judging parameters, rules, rewards, and disclaimers.
   - **`Registration` Model**: Tracks `userId`, `competitionId`, registration status, payment status, payment reference, and submission progress.
     - **Unique Compound Index**: `{ userId: 1, competitionId: 1 }` prevents any user from registering twice.
   - **`Submission` Model**: Stores performance video URL, title, choreography notes, file type, timestamps, and status.

3. **Concurrency & Capacity Protection (Zero Overbooking Guarantee)**:
   - Atomic conditional updates:
     ```ts
     Competition.findOneAndUpdate(
       { _id: competitionId, participantCount: { $lt: maxParticipants } },
       { $inc: { participantCount: 1 } },
       { new: true }
     );
     ```
   - Race conditions are eliminated; requests that exceed `maxParticipants` receive an immediate `409 Conflict`.
   - Any database compound index collision automatically triggers a rollback decrement (`$inc: { participantCount: -1 }`).

4. **Built-in Evaluator Test Suite**:
   - **User Switcher**: Instantly switch between `Riya Shah (Registered - matches reference screenshot)`, `Arjun Verma (Unregistered)`, and `Priya Sharma (Submitted entry)`.
   - **Lifecycle Simulator**: Test scenarios (`Normal`, `Registration Closed`, `Sold Out (20/20)`, `Submission Closed`, `Completed`).
   - **Parallel Concurrency Tester**: Fire 5, 10, or 20 simultaneous registration requests directly from the UI with real-time thread logs and overbooking verification.
   - **Database Reset**: One-click restore to the initial 1/20 booked state.

---

## 🛠️ Technology Stack

- **Frontend**: React (React Native style & layout principles, Tailwind CSS, Lucide icons, Motion)
- **Backend**: Node.js + Express.js REST API
- **Database**: MongoDB Mongoose-compatible document store with atomic operators (`$inc`, `$set`, `$lt`, `findOneAndUpdate`, unique compound indexes)
- **Runtime**: TypeScript & tsx

---

## 🏃 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Full-Stack Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`, serving both the Express REST API (`/api/*`) and the React application.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 📋 Evaluation Criteria & Design Answers

### 1. Important Assumptions Made
- **Currency & Localization**: Indian Rupee (`₹`) is the standard currency; both English and Hindi are supported for all UI labels.
- **Reference Screenshot State**: The reference screenshot captures an active, registered participant (`Riya Shah`) with 1/20 spots booked (19 spots remaining) and the submission window open (`Upload Submission • Registered`). The app loads this exact state by default.
- **Payments**: Uses Razorpay-style simulated transactions with unique reference IDs and refund policies.

### 2. Major Technical Decisions
- **Unified Express + Vite Middleware**: Mounted Vite within Express dev server (`server.ts`) to provide unified local hosting on port 3000 without CORS configuration issues.
- **Atomic Concurrency Control**: Avoided naive `read -> check -> write` pattern in favor of atomic condition updates (`participantCount < maxParticipants` with `$inc: 1`) to guarantee no overbooking under high traffic.
- **Compound Index for Idempotency**: Enforced `{ userId: 1, competitionId: 1 }` at the database level so duplicate submissions are impossible even with parallel retries.

### 3. Trade-offs Considered
- **Video Hosting**: Stored video stream URLs (e.g., Google Cloud Storage, YouTube, Vimeo) instead of raw video binaries in MongoDB documents to optimize database performance and network bandwidth.
- **Client vs Server State**: Frontend derives zero business decisions; lifecycle status, remaining spots, and permissions are authoritatively computed on the server based on current timestamps.

### 4. Future Production Improvements
- Integration with live payment gateways (Razorpay Webhooks) for instant settlement.
- AWS S3 / Cloud Storage direct presigned upload URLs for user performance video uploads with automated transcoding.
- Redis caching for high-frequency competition details read queries.
- WebSocket / SSE push notifications for live spot availability decrements when competitions near full capacity.
