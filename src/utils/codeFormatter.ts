import { CodeBlock } from '../types';

/**
 * Parses a message text to extract code blocks and format them properly
 */
export const parseCodeBlocks = (text: string): { text: string; codeBlocks: CodeBlock[] } => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  
  const codeBlocks: CodeBlock[] = [];
  let processedText = text;
  
  // Extract code blocks
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const language = match[1] || 'text';
    const code = match[2].trim();
    
    codeBlocks.push({
      language,
      code
    });
    
    // Replace code block with a placeholder in the text
    processedText = processedText.replace(match[0], `[CODE_BLOCK_${codeBlocks.length - 1}]`);
  }
  
  return {
    text: processedText,
    codeBlocks
  };
};

/**
 * Formats inline code snippets
 */
export const formatInlineCode = (text: string): string => {
  const inlineCodeRegex = /`([^`]+)`/g;
  return text.replace(inlineCodeRegex, '<code>$1</code>');
};

/**
 * Detects if a message contains code-related content
 */
export const hasCodeContent = (text: string): boolean => {
  const codePatterns = [
    /```[\s\S]*?```/,  // Code blocks
    /`[^`]+`/,         // Inline code
    /function\s+\w+/,  // Function declarations
    /const\s+\w+\s*=/, // Const declarations
    /let\s+\w+\s*=/,   // Let declarations
    /var\s+\w+\s*=/,   // Var declarations
    /class\s+\w+/,     // Class declarations
    /import\s+.*from/, // Import statements
    /console\.log/,    // Console.log
    /\.map\(|\.filter\(|\.reduce\(/,  // Common array methods
  ];
  
  return codePatterns.some(pattern => pattern.test(text));
};

/**
 * Gets the appropriate syntax highlighting class for a language
 */
export const getLanguageClass = (language: string): string => {
  const languageMap: { [key: string]: string } = {
    javascript: 'language-javascript',
    typescript: 'language-typescript',
    python: 'language-python',
    java: 'language-java',
    cpp: 'language-cpp',
    c: 'language-c',
    csharp: 'language-csharp',
    go: 'language-go',
    rust: 'language-rust',
    php: 'language-php',
    ruby: 'language-ruby',
    html: 'language-html',
    css: 'language-css',
    scss: 'language-scss',
    sass: 'language-sass',
    json: 'language-json',
    xml: 'language-xml',
    yaml: 'language-yaml',
    yml: 'language-yaml',
    markdown: 'language-markdown',
    md: 'language-markdown',
    sql: 'language-sql',
    bash: 'language-bash',
    shell: 'language-bash',
    sh: 'language-bash',
    powershell: 'language-powershell',
    ps1: 'language-powershell',
    dockerfile: 'language-dockerfile',
    text: 'language-text',
  };
  
  return languageMap[language.toLowerCase()] || 'language-text';
};
