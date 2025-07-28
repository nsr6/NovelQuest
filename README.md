# NovelQuest - AI-Powered Book Recommendations

Welcome to NovelQuest, an intelligent book recommendation engine that connects you with your next great read. By analyzing your literary tastes—your favorite books, authors, and genres—our AI-powered platform delivers personalized suggestions tailored to you.

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Components](#components)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Personalized Recommendations**: Get book suggestions based on your unique reading profile.
- **Favorite Books & Authors**: Tell us what you love, and we'll find similar titles and authors.
- **Genre Preferences**: Specify your favorite genres to narrow down the recommendations.
- **Least Favorite Books**: Exclude books you didn't enjoy for more accurate results.
- **Sleek, Modern UI**: A clean and intuitive interface for a seamless user experience.

## How It Works

NovelQuest uses a sophisticated AI model to understand your reading preferences. When you submit the form with your favorite books, authors, and genres, the application processes this information to generate a curated list of book recommendations that you're likely to enjoy.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **AI**: Groq API

## Project Structure

```
NovelQuest/
├── frontend-next/
│   ├── src/
│   │   ├── app/
│   │   │   └── api/
│   │   │       └── route.ts
│   │   ├── components/
│   │   └── types/
│   ├── public/
│   ├── .env.local
│   ├── package.json
│   └── next.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/novelquest.git
    ```

2.  **Navigate to the project directory**:
    ```bash
    cd NovelQuest
    ```

3.  **Install dependencies**:
    ```bash
    npm install
    ```

4.  **Set up environment variables**:

    Create a `.env.local` file in the `frontend-next` directory and add your Groq API key:
    ```
    GROQ_API_KEY=your_groq_api_key
    ```

5.  **Start the application**:
    From the root `NovelQuest` directory, run the start script:
    ```bash
    npm start
    ```

    This will launch the frontend development server at `http://localhost:3000`

## API Endpoints

### `POST /api`

-   **Description**: Generates book recommendations based on user preferences.
-   **Request Body**:
    ```json
    {
      "favoriteBooks": "string",
      "leastFavoriteBooks": "string",
      "preferredGenres": "string",
      "favoriteAuthors": "string"
    }
    ```
-   **Response**:
    Returns a JSON array of recommended books.
    ```json
    [
      {
        "title": "Book Title",
        "author": "Author Name",
        "description": "A brief description of the book."
      }
    ]
    ```

## Components

The `frontend-next/src/components` directory contains the main React components for the application.

### BookRecommendationForm

-   **File**: `BookRecommendationForm.tsx`
-   **Description**: A form for users to input their reading preferences, including favorite books, least favorite books, preferred genres, and favorite authors. It handles form state and submission.

### BookRecommendations

-   **File**: `BookRecommendations.tsx`
-   **Description**: Displays the list of recommended books in a clean, card-based layout. It shows the book title, author, and a brief description.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. 