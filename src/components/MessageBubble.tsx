// src/components/MessageBubble.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Define the shape of a message
interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  text: string;
  createdAt: Date;
  user: User;
}

interface MessageBubbleProps {
  message: Message;
  previousMessage?: Message | null;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, previousMessage }) => {
  const isUser = message.user.id === '1'; // Assuming '1' is the current user

  // Function to format the timestamp
  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${hours}:${minutesStr} ${ampm}`;
  };

  // Determine if timestamp should be shown
  const shouldShowTimestamp = () => {
    if (!previousMessage) return true;

    // Check if the sender is different
    if (message.user.id !== previousMessage.user.id) return true;

    // Check if the time difference is greater than 2 minutes
    const timeDiff = (message.createdAt.getTime() - previousMessage.createdAt.getTime()) / 1000; // in seconds
    return timeDiff > 120; // 2 minutes
  };

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.otherContainer,
      ]}
    >
      {/* Conditionally render Timestamp */}
      {shouldShowTimestamp() && (
        <Text style={styles.timestamp}>
          {formatTime(message.createdAt)}
        </Text>
      )}

      {/* Message Bubble */}
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.otherBubble,
        ]}
      >
        <Text style={isUser ? styles.userText : styles.otherText}>
          {message.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    alignItems: 'flex-start', // Align to start by default
  },
  userContainer: {
    alignSelf: 'flex-end', // Align user messages to the right
    alignItems: 'flex-end',
    marginRight: '5%',
    marginLeft: '30%',
  },
  otherContainer: {
    alignSelf: 'flex-start', // Align other messages to the left
    alignItems: 'flex-start',
    marginLeft: '5%',
    marginRight: '30%',
  },
  timestamp: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '100%',
    padding: 10,
    borderRadius: 15,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#3F3F3F',
    borderTopLeftRadius: 0,
  },
  userText: {
    color: '#fff',
    fontSize: 16,
  },
  otherText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MessageBubble;
