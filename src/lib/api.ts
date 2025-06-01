const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * API utility function to send a question to the FastAPI backend
 * @param question - The question string to send to the backend
 * @returns Promise<string> - The answer from the backend
 * @throws Error if the request fails
 */
export async function askQuestion(question: string): Promise<string> {
  try {
    // Create FormData to match FastAPI's Form(...) parameter
    const formData = new FormData();
    formData.append('question', question);

    const response = await fetch(`${API_BASE_URL}/ask-question/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If we can't parse JSON, use the default error message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data || typeof data.answer !== 'string') {
      throw new Error('Invalid response format from server');
    }

    return data.answer;
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Failed to connect to the server. Make sure the backend is running on http://localhost:8000');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

/**
 * Upload PDF file to the backend (for future use)
 * @param file - The PDF file to upload
 * @returns Promise<string> - Success message from backend
 */
export async function uploadPDF(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload-pdf/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If we can't parse JSON, use the default error message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.message || 'PDF uploaded successfully';
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Failed to connect to the server. Make sure the backend is running on http://localhost:8000');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}
