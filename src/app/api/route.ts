import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize the Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// This function will handle POST requests to /api
export async function POST(req: NextRequest) {
    try {
        // 1. Read the request body
        const { favoriteBooks, leastFavoriteBooks, preferredGenres, favoriteAuthors, excludedTitles } = await req.json();

        // 2. Create the prompt for the AI
        let prompt = `
You are a helpful book recommendation assistant. Based on the following user preferences:

- Favorite Books: ${favoriteBooks}
- Least Favorite Books: ${leastFavoriteBooks}
- Preferred Genres: ${preferredGenres}
- Favorite Authors: ${favoriteAuthors}
`;

        if (excludedTitles && excludedTitles.length > 0) {
            prompt += `
- Do NOT recommend any of the following books as they have already been suggested: ${excludedTitles.join(', ')}
`;
        }

        prompt += `
Please recommend exactly 6 books. Do not recommend any books written by the author of their least favorite books. Make sure the recommendations include almost all the preferred genres. Respond only in the following strict JSON format (no extra text or explanation):

[
  {
    "title": "Book Title 1",
    "author": "Author Name",
    "genre": "Genre",
    "description": "A brief, one-sentence description of the book."
  },
  {
    "title": "Book Title 2",
    "author": "Author Name",
    "genre": "Genre",
    "description": "A brief, one-sentence description of the book."
  }
  ...
]
`;

        // 3. Call the Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a book recommendation assistant.' },
                { role: 'user', content: prompt }
            ],
            model: 'llama3-8b-8192',
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stop: null,
            stream: false
        });
        
        const aiResponse = chatCompletion.choices[0]?.message?.content?.trim();

        if (!aiResponse) {
             return NextResponse.json({ error: 'Failed to get a valid response from AI' }, { status: 500 });
        }

        // 4. Parse the response and send it back to the client
        try {
            const recommendations = JSON.parse(aiResponse);
            return NextResponse.json(recommendations);
        } catch (parseErr) {
            console.error('Failed to parse LLM response as JSON:', aiResponse);
            return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error getting recommendations:', error);
        return NextResponse.json({ error: 'Error getting recommendations from AI' }, { status: 500 });
    }
}