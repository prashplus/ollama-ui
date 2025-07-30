import React from 'react';
import { Box, Typography } from '@mui/material';
import CodeBlock from './CodeBlock';
import { parseCodeBlocks, formatInlineCode } from '../utils/codeFormatter';

interface MessageContentProps {
  text: string;
  isUser: boolean;
}

const MessageContent: React.FC<MessageContentProps> = ({ text, isUser }) => {
  const { text: processedText, codeBlocks } = parseCodeBlocks(text);
  
  // Split text by code block placeholders
  const textParts = processedText.split(/\[CODE_BLOCK_(\d+)\]/);
  
  const renderContent = () => {
    const elements: React.ReactNode[] = [];
    
    for (let i = 0; i < textParts.length; i++) {
      const part = textParts[i];
      
      // Check if this part is a code block index
      if (i % 2 === 1) {
        const codeBlockIndex = parseInt(part, 10);
        if (codeBlocks[codeBlockIndex]) {
          elements.push(
            <CodeBlock
              key={`code-${i}`}
              language={codeBlocks[codeBlockIndex].language}
              code={codeBlocks[codeBlockIndex].code}
            />
          );
        }
      } else if (part.trim()) {
        // Regular text part - format inline code
        const formattedText = formatInlineCode(part);
        
        // Check if there are inline code snippets
        if (formattedText.includes('<code>')) {
          // Split by inline code tags and render appropriately
          const inlineParts = formattedText.split(/(<code>.*?<\/code>)/);
          const inlineElements = inlineParts.map((inlinePart, index) => {
            if (inlinePart.startsWith('<code>') && inlinePart.endsWith('</code>')) {
              const codeContent = inlinePart.slice(6, -7); // Remove <code> tags
              return (
                <CodeBlock
                  key={`inline-${i}-${index}`}
                  language="text"
                  code={codeContent}
                  inline
                />
              );
            }
            return inlinePart;
          });
          
          elements.push(
            <Typography
              key={`text-${i}`}
              variant="body1"
              component="span"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                gap: 0.5,
              }}
            >
              {inlineElements}
            </Typography>
          );
        } else {
          elements.push(
            <Typography
              key={`text-${i}`}
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {part}
            </Typography>
          );
        }
      }
    }
    
    return elements;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {renderContent()}
    </Box>
  );
};

export default MessageContent;
