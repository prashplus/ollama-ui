import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface IOllamaResponsePart {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [finalResponse, setFinalResponse] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPrompt(event.target.value);
  };

  const callOllamaAPI = async (): Promise<void> => {
    try {
      const result = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3', // Adjust the model as needed
        prompt: prompt,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Assuming the API returns a single string with multiple JSON objects
      const responseString: string = result.data;
      // Split the string by '}' and filter out any empty strings
      const responseParts: string[] = responseString.split('}').filter(part => part.trim() !== '');
      // Parse each part into an object and concatenate the 'response' fields
      const completeResponse: string = responseParts.map(part => JSON.parse(part + '}')).map((obj: IOllamaResponsePart) => obj.response).join('');

      setFinalResponse(completeResponse);
    } catch (error) {
      console.error('Error calling Ollama API:', error);
    }
  };

  return (
    <div className="ollama-container">
      <h1>Ollama API Interaction</h1>
      <input
        type="text"
        value={prompt}
        onChange={handleInputChange}
        className="ollama-input"
        placeholder="Enter your prompt here..."
      />
      <button onClick={callOllamaAPI} className="ollama-button">Send Prompt</button>
      <div className="ollama-response">
        <p>{finalResponse}</p>
      </div>
    </div>
  );
}

export default App;
