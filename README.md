<div align="center">

# 🎓 clg_lyf

### *Your Campus. Your Voice. Your Anonymity.*

A college-exclusive, anonymous community platform where verified students can freely discuss campus life — without revealing their real identities.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

</div>

## 📌 The Problem

College students often want to discuss academics, placements, hostel life, and campus issues openly — but the fear of judgment or backlash keeps them silent. Existing social media platforms tie every post to a real identity, discouraging honest conversations.

**clg_lyf** solves this by creating a **verified yet anonymous** space: only students from an approved college can join (via institutional email verification), but once inside, every interaction happens under an anonymous username. No real names. No student IDs exposed. Just real conversations.

---

## ✨ Features

### ✅ Implemented

| Feature | Description |
|---|---|
| **College Email Verification** | Registration restricted to a configurable college email domain (e.g. `@iiitn.ac.in`). Only students with a valid institutional email can create an account. |
| **OTP-Based Email Verification** | A 6-digit OTP is sent to the student's college email via Gmail OAuth2. OTPs expire after 5 minutes and are rate-limited to 5 attempts. |
| **Anonymous Usernames** | Students choose a username at registration. Real email addresses and student IDs are never exposed through the API to other users. |
| **JWT Authentication** | Secure, cookie-based JSON Web Token authentication protects all endpoints. Only verified users can access the platform. |
| **Posts & Discussions** | Authenticated users can create posts with a title, description, optional image upload, and labels. |
| **Image Uploads** | Posts support image attachments uploaded via Multer and stored on ImageKit CDN. |
| **Threaded Comments** | Users can comment on posts, with support for nested replies via `parentComment` references. |
| **Likes & Dislikes** | Toggle-based like/dislike reactions on posts. A user can only like or dislike — not both simultaneously. |
| **Polls** | Create polls with multiple options. Users can vote, change their vote, or remove it. Each user gets one vote per poll. |
| **Label Filtering** | Posts can be tagged with labels and filtered by category. |
| **Password Management** | Change password via old password or via OTP-based reset flow. |
| **Input Validation** | Request bodies validated with Zod schemas for registration, login, and password operations. |

### 🔮 Planned / In Progress

| Feature | Description |
|---|---|
| **Randomly Generated Aliases** | Auto-assign anonymous aliases like `QuietFalcon42` instead of user-chosen usernames. |
| **Real-Time Chat Rooms** | Live group conversations for topics such as General, Academics, Placements, Hostel Life, and Confessions. |
| **Content Moderation** | Automated and manual moderation tools to maintain a healthy community. |
| **Frontend Application** | A client-side web application for the platform (currently backend-only). |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | [Node.js](https://nodejs.org/) |
| **Framework** | [Express 5](https://expressjs.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/) |
| **Authentication** | [JSON Web Tokens](https://jwt.io/) (`jsonwebtoken`) · Cookie-based sessions (`cookie-parser`) |
| **Password Hashing** | [bcrypt](https://www.npmjs.com/package/bcrypt) |
| **Validation** | [Zod 4](https://zod.dev/) |
| **Email** | [Nodemailer](https://nodemailer.com/) with Gmail OAuth2 |
| **File Upload** | [Multer](https://www.npmjs.com/package/multer) (in-memory) → [ImageKit](https://imagekit.io/) CDN |
| **Dev Tooling** | [Nodemon](https://nodemon.io/) |

---

## 📁 Project Structure

```
clg_lyf/
├── server.js                        # Entry point — starts Express server & connects DB
├── package.json                     # Dependencies and scripts
├── .env                             # Environment variables (not committed)
├── .gitignore
└── src/
    ├── app.js                       # Express app configuration & route mounting
    ├── controllers/
    │   ├── auth.controller.js       # Register, login, logout, OTP verify, password reset
    │   ├── post.controller.js       # CRUD posts, likes, dislikes, comments
    │   └── poll.controller.js       # Create polls, vote, list polls
    ├── db/
    │   └── db.js                    # MongoDB connection via Mongoose
    ├── middlewares/
    │   └── auth.middleware.js       # JWT verification & email-verified check
    ├── models/
    │   ├── user.model.js            # User schema (username, email, password, verified)
    │   ├── post.model.js            # Post schema (title, description, uri, labels, likes, comments)
    │   ├── comment.model.js         # Comment schema (content, author, post, parentComment)
    │   ├── poll.model.js            # Poll schema (title, options with votes)
    │   └── otp.model.js             # OTP schema (hash, expiry, attempts)
    ├── routes/
    │   ├── auth.route.js            # /api/auth/* routes with Zod validation
    │   ├── post.route.js            # /api/post/* routes (auth-protected)
    │   └── poll.route.js            # /api/poll/* routes (auth-protected)
    ├── services/
    │   ├── email.service.js         # Nodemailer transporter (Gmail OAuth2)
    │   └── storage.service.js       # ImageKit file upload
    ├── utils/
    │   ├── utils.js                 # OTP generation & styled HTML email template
    │   └── checkOtp.js              # OTP validation (expiry, attempts, hash comparison)
    └── validators/
        └── auth.validator.js        # Zod schemas for auth-related requests
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** — a running instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Gmail Account** — with OAuth2 credentials configured for sending emails
- **ImageKit Account** — for image hosting ([imagekit.io](https://imagekit.io/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Aryan25875/clg_lyf.git
cd clg_lyf

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env   # or create .env manually (see below)

# 4. Start the development server
npm run dev
```

The server will start on the port specified in your `.env` file (default: `3000`).

### Production

```bash
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# ── Server ─────────────────────────────────────────────
PORT=3000

# ── Database ───────────────────────────────────────────
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# ── Authentication ─────────────────────────────────────
JWT_SECRET=<your-random-256-bit-hex-secret>

# ── College Verification ──────────────────────────────
COLLEGE_EMAIL_DOMAIN=iiitn.ac.in

# ── ImageKit (File Storage) ───────────────────────────
IMAGEKIT_PRIVATE_KEY=<your-imagekit-private-key>

# ── Gmail OAuth2 (Email Service) ──────────────────────
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REFRESH_TOKEN=<your-google-refresh-token>
GOOGLE_USER=<your-gmail-address>
```


---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require a valid JWT cookie (set automatically on login/register).

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register with college email, username, and password. Sends OTP. |
| `POST` | `/login` | ❌ | Login with email/username and password. |
| `POST` | `/logout` | ❌ | Clears the auth cookie. |
| `POST` | `/verify_email` | ❌ | Verify college email with the 6-digit OTP. |
| `POST` | `/change_username` | 🔑 | Change your anonymous username. |
| `POST` | `/changePassByOldpass` | 🔑 | Change password using current password. |
| `POST` | `/sendOtp_pass` | ❌ | Request an OTP to reset your password. |
| `POST` | `/change_pass_otp` | ❌ | Reset password using OTP. |

### Posts — `/api/post`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create_post/` | 🔑 | Create a post (supports optional image via `file` field). |
| `GET` | `/` | 🔑 | Get all posts (limit 20). |
| `GET` | `/my_posts/` | 🔑 | Get your own posts. |
| `GET` | `/labels/` | 🔑 | Filter posts by label. |
| `POST` | `/like/:id` | 🔑 | Toggle like on a post. |
| `POST` | `/dislike/:id` | 🔑 | Toggle dislike on a post. |
| `POST` | `/comment/:postid` | 🔑 | Add a comment (supports nested replies). |
| `GET` | `/:postid` | 🔑 | Get a single post with populated comments. |

### Polls — `/api/poll`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create_poll` | 🔑 | Create a poll with multiple options. |
| `POST` | `/vote/:pollid` | 🔑 | Cast, change, or remove your vote. |
| `GET` | `/` | 🔑 | Get all polls (limit 20). |
| `GET` | `/:pollId` | 🔑 | Get your polls. |

> 🔑 = Requires authentication (JWT cookie) and a verified email.

---

## 🔒 Security & Privacy

| Aspect | Implementation |
|---|---|
| **Password Storage** | Hashed with `bcrypt` (12 salt rounds). Plaintext passwords are never stored. |
| **Authentication** | Stateless JWT tokens stored in HTTP cookies. |
| **OTP Security** | OTPs are hashed with bcrypt before storage. Expire after 5 minutes. Max 5 attempts before invalidation. |
| **Email Gating** | Only emails matching the configured `COLLEGE_EMAIL_DOMAIN` can register. |
| **Verification Wall** | Unverified users are blocked by the auth middleware from accessing any protected resource. |
| **Input Validation** | All auth inputs validated with Zod schemas before reaching controllers. |
| **Secrets Management** | All credentials stored in `.env` and excluded from version control via `.gitignore`. |

### Privacy by Design

- User-chosen usernames serve as the public-facing identity — **real emails are never exposed** in API responses to other users.
- The verification layer (`verified` flag) ensures only legitimate college students access the platform, while the anonymous username layer keeps their real identity separate.

---

## 🗺️ Roadmap

- [ ] **Anonymous Alias Generator** — Auto-assign creative aliases (e.g. `QuietFalcon42`) to decouple usernames from any personally identifiable pattern.
- [ ] **Real-Time Chat Rooms** — WebSocket-powered group chats for topics like Academics, Placements, Hostel Life, Confessions.
- [ ] **Frontend Client** — Build a web UI (React / Next.js) for the platform.
- [ ] **Content Moderation** — Profanity filters, reporting system, and admin moderation dashboard.
- [ ] **Rate Limiting** — Protect endpoints from abuse with express-rate-limit or similar.
- [ ] **Pagination & Infinite Scroll** — Cursor-based pagination for posts, comments, and polls.
- [ ] **Notifications** — In-app or email notifications for replies, likes, and poll results.
- [ ] **Multi-College Support** — Allow multiple college domains with institution-specific communities.
- [ ] **Profile Customization** — Anonymous avatars and bios.
- [ ] **Search** — Full-text search across posts and polls.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository.
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit with a clear message:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against `main` with a detailed description of your changes.

### Guidelines

- Follow the existing project structure (MVC pattern under `src/`).
- Add Zod validation schemas for any new request inputs.
- Protect new routes with the `authMiddleware.authUser` middleware where appropriate.
- Do not commit `.env` files or any secrets.

---

## 📄 License

No license has been specified for this project yet. All rights are reserved by the author until a license is explicitly added.

---

<div align="center">

**Built with ❤️ for college students who deserve a space to speak freely.**

*If this project resonates with you, give it a ⭐ on GitHub!*

</div>
