import axios from 'axios';

const DEFAULT_NGROK_ENDPOINT = 'https://unfertilizable-homologically-amanda.ngrok-free.dev/generate';

export interface GenerateRequest {
    prompt: string;
    max_tokens?: number;
    temperature?: number;
    do_sample?: boolean;
}

export interface GenerateResponse {
    response: string;
}

export const generateResponse = async (prompt: string, history?: string, endpoint?: string): Promise<string> => {
    try {
        const fullPrompt = history ? `${history}\nUser: ${prompt}` : prompt;

        // Call our own local proxy instead of the external URL directly
        const { data } = await axios.post<GenerateResponse>(
            '/api/generate',
            {
                prompt: fullPrompt,
                endpoint: endpoint // Pass the preferred endpoint to the proxy
            },
            {
                timeout: 30000,
            }
        );

        return data.response;
    } catch (error) {
        console.error('API Error:', error);
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. The AI service might be sleeping.');
            }
            if (error.response?.data?.error) {
                throw new Error(`AI Error: ${error.response.data.error}`);
            }
        }
        throw new Error('Failed to generate response. Please check your connection.');
    }
};
