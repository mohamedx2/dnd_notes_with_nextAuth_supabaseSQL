# D&D Notes with NextAuth & Supabase

A web application for Dungeons & Dragons players to create, manage, and organize their campaign notes. Built with Next.js, NextAuth for authentication, and Supabase for data storage.

🔗 [Live Demo](https://dnd-notes-with-next-auth-supabase-sql.vercel.app/)

## Features

- 🔐 Secure authentication with NextAuth
- 📝 Create and manage campaign notes
- 🎲 Character information tracking
- 📚 Campaign organization
- 🎨 Modern and responsive UI
- 🔄 Real-time updates with Supabase

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Supabase](https://supabase.com/) - Database and Backend
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vercel](https://vercel.com/) - Deployment

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- GitHub account (for authentication)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mohamedx2/dnd_notes_with_nextAuth_supabaseSQL.git
cd dnd_notes_with_nextAuth_supabaseSQL
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to the Next.js team for the amazing framework
- Supabase team for the excellent database service
- NextAuth.js team for the authentication solution
