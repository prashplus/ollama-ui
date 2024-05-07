import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.post('http://localhost:11434/api/generate', {
          model: 'llama2',
          prompt: 'Hi',
        });

        // Assuming the response is a string of JSON objects
        const responseChunks = result.data.split('} {');
        let fullResponse = '';

        responseChunks.forEach((chunk: string) => {
          // Add missing brackets if they were removed by split
          if (!chunk.startsWith('{')) chunk = '{' + chunk;
          if (!chunk.endsWith('}')) chunk = chunk + '}';
          console.log(chunk);
          const json = JSON.parse(chunk);
          fullResponse += json.response;
        });

        setResponse(fullResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Llama API Response</h1>
      {response ? (
        <p>{response}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
