# StableMind

**StableMind** is a mental health companion designed to support students navigating the pressures of placement season. It provides a safe space for students to manage stress, set goals, and connect with peers while offering AI-driven support and personalized wellness tools.

## Key Features

- **AI Chatbot Support**: 24/7 empathetic listening and support with advanced crisis detection and emotion-based wellness tool suggestions. Powered by Google Gemini.
- **Crisis Detection**: Intelligent system that detects distress signals in chat and provides immediate helpline information and resources.
- **Emotion Recognition**: Analyzes chat interactions to suggest relevant wellness tools (e.g., breathing exercises for anxiety, journaling for loneliness).
- **Daily Goals**: Set achievable goals and track your placement preparation progress to stay motivated.
- **Mindful Moments**: Access guided meditation and stress-relief techniques tailored for students.
- **Peer Support**: Connect with a community of peers who understand the unique challenges of the placement journey.
- **Affirmations**: Receive daily motivational quotes and articles to maintain a positive mindset.
- **Mood Tracker**: Monitor your mental wellbeing over time to identify patterns and triggers.
- **Document Upload**: Securely upload resumes and other materials for personalized placement advice.

## Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth integration)
- **Authentication**: [Clerk](https://clerk.com/)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/)
- **Styling**: Tailwind CSS with custom animations

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn or pnpm
- A Supabase account
- A Clerk account
- A Google Cloud project with Gemini API access

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/stablemind.git
    cd stablemind
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables:**

    Create a `.env.local` file in the root directory and add the following variables:

    ```env
    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    # Google Gemini AI
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Set up the Database:**

    -   Go to your Supabase project dashboard.
    -   Navigate to the **SQL Editor**.
    -   Run the contents of `supabase-schema.sql` to set up the main tables.
    -   Run the contents of `supabase-peer-support.sql` to set up tables for peer support features.

5.  **Run the Development Server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Main application source code (Next.js App Router).
    -   `app/api/`: API routes for chat and other backend logic.
    -   `app/components/`: Reusable UI components.
    -   `app/context/`: React Context providers (Chat, Theme).
    -   `app/services/`: Services for AI, crisis detection, and emotion detection.
    -   `app/dashboard/`: Dashboard page and layout.
-   `public/`: Static assets.
-   `supabase-*.sql`: SQL scripts for database setup.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
