import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock axios to prevent actual API calls during testing
jest.mock('axios');

describe('Ollama UI App', () => {
  test('renders main heading', () => {
    render(<App />);
    const heading = screen.getByText(/Ollama Chat UI/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders welcome message when no messages', () => {
    render(<App />);
    const welcomeMessage = screen.getByText(/Welcome to Ollama Chat!/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('renders API URL input', () => {
    render(<App />);
    const apiUrlInput = screen.getByDisplayValue('http://localhost:11434');
    expect(apiUrlInput).toBeInTheDocument();
  });

  test('renders model selector', () => {
    render(<App />);
    const modelSelect = screen.getByDisplayValue('llama3');
    expect(modelSelect).toBeInTheDocument();
  });

  test('renders text area for user input', () => {
    render(<App />);
    const textArea = screen.getByPlaceholderText(/Type your message here/i);
    expect(textArea).toBeInTheDocument();
  });

  test('renders send button', () => {
    render(<App />);
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeInTheDocument();
  });

  test('renders clear chat button (disabled when no messages)', () => {
    render(<App />);
    const clearButton = screen.getByRole('button', { name: /clear chat/i });
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toBeDisabled();
  });

  test('send button is disabled when input is empty', () => {
    render(<App />);
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  test('send button is enabled when input has text', () => {
    render(<App />);
    const textArea = screen.getByPlaceholderText(/Type your message here/i);
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(textArea, { target: { value: 'Hello, Ollama!' } });
    expect(sendButton).not.toBeDisabled();
  });

  test('updates API URL when input changes', () => {
    render(<App />);
    const apiUrlInput = screen.getByDisplayValue('http://localhost:11434');
    
    fireEvent.change(apiUrlInput, { target: { value: 'http://localhost:8080' } });
    expect(apiUrlInput).toHaveValue('http://localhost:8080');
  });

  test('updates selected model when dropdown changes', () => {
    render(<App />);
    const modelSelect = screen.getByDisplayValue('llama3');
    
    fireEvent.change(modelSelect, { target: { value: 'mistral' } });
    expect(modelSelect).toHaveValue('mistral');
  });

  test('shows example prompts in welcome section', () => {
    render(<App />);
    expect(screen.getByText(/Try asking:/i)).toBeInTheDocument();
    expect(screen.getByText(/Explain quantum computing in simple terms/i)).toBeInTheDocument();
    expect(screen.getByText(/Write a Python function to reverse a string/i)).toBeInTheDocument();
    expect(screen.getByText(/What are the benefits of renewable energy/i)).toBeInTheDocument();
  });

  test('footer contains correct links and text', () => {
    render(<App />);
    expect(screen.getByText(/Built with ❤️ using React & TypeScript/i)).toBeInTheDocument();
    
    const ollamaLink = screen.getByRole('link', { name: /Learn more about Ollama/i });
    expect(ollamaLink).toHaveAttribute('href', 'https://ollama.com');
    expect(ollamaLink).toHaveAttribute('target', '_blank');
  });
});
