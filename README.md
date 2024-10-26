# MarathonMate

MarathonMate is an application designed for movie enthusiasts who enjoy organizing film marathons with friends. Whether it's for a themed night, a special event, or simply discovering cinematic classics, MarathonMate helps you plan and share your viewing sessions with ease.

## Features

- **Create and Organize Marathons:** Easily create lists of movies to watch and share them with your friends.
- **Movie Recommendations:** Get personalized movie suggestions based on your preferences.
- **Marathon Tracking:** Keep track of your marathon progress and record the movies you've watched.
- **Participant Management:** Invite friends and monitor participation confirmations.
- **Multi-language Support:** Enjoy the app in different languages, powered by Inlang and Paraglide.

## Tech Stack

- **Frontend:** SvelteKit with TypeScript
- **Backend:** PostgreSQL database configured using Drizzle ORM
- **Styling:** Custom CSS with global reset and typography (Cinzel and Montserrat fonts)
- **Authentication:** Session-based authentication with cookie management
- **Internationalization (i18n):** Support for multilingual functionality

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (version 16 or higher)
- **PostgreSQL** (configured locally or with a cloud provider)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/marathonmate.git
cd marathonmate
```
### 2. Install Dependencies
Install the project dependencies with npm:
```bash
npm install
```
### 3. Configure the Environment
Push the schema to the database using Drizzle ORM:
```bash
npx drizzle-kit push
```
### 5. Start the Development Server
Start the server and launch the app in a new browser tab:
```bash
npm run dev -- --open
```
## Project Structure
```bash
.
├── src
│   ├── lib           # Shared utilities and components
│   ├── routes        # SvelteKit route definitions
│   ├── components    # Reusable Svelte components (Header, Footer, etc.)
│   ├── server        # Server-side logic and API endpoints
│   └── static        # Static assets (images, fonts, etc.)
├── drizzle           # Database migration files
├── public            # Public files served at the root
├── .env.example      # Example environment variables
└── README.md         # Project documentation
```
## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.


