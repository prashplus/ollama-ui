import React from 'react';
import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { SmartToy as BotIcon, Person as PersonIcon } from '@mui/icons-material';
import { Message as MessageType } from '../types';
import MessageContent from './MessageContent';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          maxWidth: '70%',
          minWidth: isMobile ? '60%' : '200px',
          backgroundColor: message.isUser 
            ? 'primary.main' 
            : 'background.paper',
          color: message.isUser ? 'primary.contrastText' : 'text.primary',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          {message.isUser ? <PersonIcon /> : <BotIcon />}
          <Box sx={{ flexGrow: 1 }}>
            <MessageContent 
              text={message.text} 
              isUser={message.isUser}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                mt: 1, 
                opacity: 0.7,
                textAlign: 'right'
              }}
            >
              {message.timestamp.toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Message;
