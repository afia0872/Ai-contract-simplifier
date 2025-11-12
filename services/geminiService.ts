// NOTE: This service is refactored to communicate with a hypothetical backend API
// as per the new architecture. It no longer calls the AI API directly from the client.
import { ContractSummary } from '../types';

const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    // This is a mock implementation of a fetch wrapper.
    // In a real app, it would make a network request.
    console.log(`[MOCK API] Fecthing ${url} with options:`, options);
    await new Promise(res => setTimeout(res, 800)); // Simulate network latency

    const token = getAuthToken();
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    // You could add token validation simulation here if needed

    // Mock successful responses based on the URL
    if (url.includes('/api/contracts/summarize')) {
        return {
            keyTerms: ["Mock: Termination Clause", "Mock: Confidentiality Agreement"],
            potentialRisks: ["Mock: Unlimited Liability", "Mock: Automatic Renewal"],
            obligations: ["Mock: Monthly Reporting", "Mock: Non-compete for 2 years"],
        };
    }

    if (url.includes('/api/contracts/ask')) {
         return { answer: `Mock Answer: Based on the document, the governing law is specified in Section 8.2 as the State of California.`};
    }
    
    throw new Error(`No mock endpoint configured for ${url}`);
};

export async function summarizeContract(contract: string | File): Promise<ContractSummary> {
    const endpoint = '/api/contracts/summarize';
    
    // In a real app, you would build the request differently for text vs. file
    if (typeof contract === 'string') {
        // FIX: The mock `fetchWithAuth` returns a union type that is not assignable to `ContractSummary`.
        // We cast the result to the expected type for this specific API call.
        return await fetchWithAuth(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: contract }),
        }) as ContractSummary;
    } else {
        const formData = new FormData();
        formData.append('file', contract);
        // FIX: The mock `fetchWithAuth` returns a union type that is not assignable to `ContractSummary`.
        // We cast the result to the expected type for this specific API call.
        return await fetchWithAuth(endpoint, {
            method: 'POST',
            body: formData, // Note: Don't set Content-Type header with FormData
        }) as ContractSummary;
    }
}

export async function answerQuestion(contractText: string, question: string): Promise<string> {
    const endpoint = '/api/contracts/ask';
    
    // FIX: Proactively cast the result to its expected shape to prevent potential type errors
    // when accessing `response.answer`, as `fetchWithAuth` returns a broad union type.
    const response = await fetchWithAuth(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractContext: contractText, question }),
    }) as { answer: string };

    return response.answer;
}