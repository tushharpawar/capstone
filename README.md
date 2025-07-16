# Capstone Project - Fraud Awareness Platform

## Project Description

This Capstone project is a comprehensive **Fraud Awareness Platform** designed to educate users about various types of frauds, collect and verify fraud reports, and provide interactive features for community engagement. The platform aims to combat fraud by making information accessible and fostering a collaborative environment for sharing insights.


## Demo

Experience the live platform here: [https://capstone-web.netlify.app/](https://capstone-web.netlify.app/)


## Features

* **Fraud Statistics Dashboard:** A dynamic **pie chart** visually representing the distribution of frauds across different areas/fields.
* **Top Frauds Listing:** Highlights and details the most prevalent and significant fraud types.
* **Fraud Report Collection & Verification:**
    * Allows users to submit detailed fraud reports.
    * Includes a robust verification process to ensure the authenticity of submitted reports.
    * Verified reports are then integrated into the platform for public awareness.
* **Explore Page (Community Interaction):**
    * Displays verified fraud reports.
    * Enables user engagement through **liking, commenting, replying to comments, and sharing** fraud reports.
* **Password Checker:** A utility to help users check the strength and security of their passwords.
* **Email Pwned Checker:** Allows users to verify if their email addresses have been compromised in known data breaches.
* **News Section:** Provides up-to-date information, articles, and alerts related to fraud and cybersecurity.
* **Quiz Section:** Interactive quizzes to test and enhance users' knowledge about fraud prevention.

## Tech Stack

This project is built using the following key technologies:

* **Framework:** [Next.js](https://nextjs.org/) (React Framework for production)
* **Library:** [React.js](https://react.dev/)
* **Authentication:** [Clerk Auth](https://clerk.com/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (for rapid UI development)
* **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
* **API Integration:** Various external APIs are used to power features like the password checker, email pwned checker, and news section.
* **Database ORM:** [Prisma](https://www.prisma.io/) (for database access and management)
* **Database:** [Neon DB](https://neon.com/)
* **Deployment:** [Netlify](https://www.netlify.com/) 

## Getting Started

Follow these steps to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (LTS version recommended)
* [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/) or [Bun](https://bun.sh/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/tushharpawar/capstone.git](https://github.com/tushharpawar/capstone.git)
    cd capstone
    ```

2.  **Install dependencies:**

    Choose your preferred package manager:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up Environment Variables:**

    Create a `.env` file in the root of your project and add your database connection string and any other necessary environment variables (e.g., Clerk keys, API keys).

    ```dotenv
    # Example .env content
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY =
    CLERK_SECRET_KEY=
    DATABASE_URL=
    NEWSDATA_API_KEY=
    ```

    **Important:**
    * Replace `DATABASE_URL` with your actual database connection string. For production, these should be set in your deployment environment variables.
    * Ensure your Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`) are correctly set.
    * Add any other API keys your project uses (e.g., for news, password checker, email pwned checker APIs).

4.  **Generate Prisma Client and Run Migrations:**

    After installing dependencies and setting up your `.env.local` file, generate the Prisma client and push your schema to the database.

    ```bash
    npx prisma generate
    npx prisma db push # This command will sync your schema with the database
    ```

### Run the project locally

Once the setup is complete, you can run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
