<div id="top"></div>

<div align="center">
  <h1 align="center">StackOverflow - Full Stack Next.js 14 App</h1>



> ~
>
> <h3 align="center">Welcome to Stack Overflow, a full-stack application built with Next.js 14 and Server Actions, featuring an array of powerful functionalities to enhance your developer community experience. Stack Overflow is designed to be a comprehensive platform for developers to ask questions, share knowledge, and engage in a thriving community.</h3>

> <p align="center">
>   <img src="https://img.shields.io/badge/NextJS-black?style=for-the-badge&logo=next.js&logoColor=white" />
>   <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
>   <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
>   <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
>   <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" />
>   <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white" />

> </p>
> ~

</div>





## 🚀 Features

- 🔧 **Next.js Server Actions**: Leverage the power of Next.js server actions for enhanced backend functionality.
- 🔗 **Webhooks for Authentication Service**: Utilize webhooks for streamlined authentication services.
- ❓ **Ask and Answer Questions:** Engage in meaningful discussions by posing questions and providing answers
- 🔖 **Bookmarking:** Save and organize your favorite posts for future reference.
- 🔍 **Recommendation System for Posts**: Unparalleled recommendation system to enhance content discovery.
- 🌐 **Global Database Data-Fetching**: Efficient data fetching from all models of the database for the search bar.
- 🤖 **AI-Generated Answers**: Harness the power of AI to generate insightful answers to questions.
- 🏆 **Community Badges & Reputation System**: Earn badges and build your reputation within the community.
- 👀 **Views and Voting Mechanism**: Track views and enable a robust voting mechanism for content.
- 🎯 **Filter and Pagination**: Enjoy filter and pagination features across various pages for easy navigation.
- 📱 **Responsive UI**:Experience a responsive user interface that adapts to different screen sizes.
- 🔐 **User Authentication**: Create a personalized account to fully engage with the community.
- 🌈 **Themes**: Switch between light and dark themes for a comfortable viewing experience.
- 🧭 **Multiple Layouts & Grouped Routes**: Explore a well-organized interface with multiple layout options and grouped routes.
- ✨ **Form Handling**: Efficiently handle forms for seamless user interactions.
- 🏷️ **Tag Browsing:** Explore content categorically through an intuitive tag-based browsing system.

## 🛠️ Tech Stack

- 🚀 **Next.js 14**: A React framework for building server-rendered applications.
- 🌐 **Tailwind CSS**: A utility-first CSS framework for responsive designs.
- 📘 **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- 🔍 **ESLint**: Pluggable linting utility for JavaScript and TypeScript.
- 📦 **MongoDB**: Store and manage data efficiently.
- 📚 **Mongoose**: MongoDB object modeling for Node.js.
- 🚀 **clerk**: Simplify authentication workflows.
- 🔧 **hookform/resolver**: Webhooks for authentication services.
- 🎨 **Shadcn UI:**: Components from the Shadcn UI library.
- 🔤 **tailwindcss/typography**: Typography plugin for Tailwind CSS.
- 🌈 **prismjs**: Syntax highlighting for code blocks.
- 📝 **react-hook-form**: Forms management for React.
- 🛠️ **zod**: A TypeScript-first schema declaration.

## 🚀 Author

- Linkedin: Bishwash Kumar Sah - [Linkedin: Bishwash Kumar Sah](https://www.linkedin.com/in/bishwash-kumar-sah-3462612b1/)
- GitHub [@BishwashKumarSah](https://github.com/BishwashKumarSah)

## 🛠️ Run the project

- Clone the repository.
- Install dependency using:

```bash
npm install
# or
yarn install
```

- Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- Create a `.env.local` file in the root directory of the project and add the following environment variables:

```
# Clerk secrets for API key and webhook
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_CLERK_WEBHOOK_SECRET=

# Google AI
GOOGLEAI_API_KEY=

# Apify
JOBS_APIFY_API_KEY=

# Database
MONGODB_URI=

# Webhook
NEXT_WEBHOOK_SECRET=

# Host URL
NEXT_PUBLIC_HOST_URL=

# Tiny editor
NEXT_PUBLIC_TINY_API_KEY=

```

Notes

- **Clerk Authentication:** Create a Clerk account [here](https://clerk.com/) and set the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` environment variables in the `.env.local` file. Configure different URLs for Clerk sign-in, sign-up, after sign-in, and after sign-up pages.
- **MongoDB Database:** Create a MongoDB database and connect it to the application. Change the `MONGO_DB_URI` environment variable in the `.env.local` file.
- **TinyMCE**: Create a TinyMCE account [here](https://www.tiny.cloud/) and set the `NEXT_PUBLIC_TINY_EDITOR_API_KEY` environment variable in the `.env.local` file.
- **OpenAI API:** Create an OpenAI account here and set the `OPENAI_API_KEY` environment variable in the `.env.local` file.
- After deploy, create a new webhook on Clerk, add the endpoint of `http://<Your-deployed-link>/api/webhook`, set `user` events, and set the `NEXT_CLERK_WEBHOOK_SECRET` environment variable in the `.env.local` file.


