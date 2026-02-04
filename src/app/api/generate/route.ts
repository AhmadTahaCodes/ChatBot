import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt, endpoint } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        let url = endpoint || 'https://unfertilizable-homologically-amanda.ngrok-free.dev/generate';

        // Auto-fix: If user provided a base URL (e.g. from just copying the domain), append /generate
        if (!url.endsWith('/generate')) {
            if (url.endsWith('/')) {
                url += 'generate';
            } else {
                url += '/generate';
            }
        }

        const payload = {
            prompt,
            max_tokens: 200,
            temperature: 0.7,
            do_sample: true
        };

        console.log("Proxying request to:", url);
        console.log("Payload:", JSON.stringify(payload, null, 2));

        // Call the external API from the server side
        const response = await axios.post(
            url,
            payload,
            {
                timeout: 30000, // 30 seconds timeout
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'User-Agent': 'Chatbot-Client/1.0'
                }
            }
        );

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Proxy Error:', error.message);

        // Detailed error logging
        if (axios.isAxiosError(error)) {
            console.error('External API Status:', error.response?.status);
            console.error('External API Data:', error.response?.data);
            return NextResponse.json(
                { error: error.response?.data?.error || error.message || 'Failed to fetch from AI provider' },
                { status: error.response?.status || 500 }
            );
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
