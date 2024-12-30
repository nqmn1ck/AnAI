// src/screens/ChatScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import MessageBubble from '../components/MessageBubble';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const STORAGE_KEY = '@SimpleChatApp_messages';

const ChatScreen: React.FC = () => {
  // Define the starting message
  const startingMessage: Message = {
    id: '0', // Unique ID for the starting message
    text: 'Welcome to the chat! How can I assist you today?',
    createdAt: new Date(),
    user: {
      id: '2', // ID of the other user or bot
      name: 'ChatBot',
    },
  };

  // Initialize messages state with the starting message
  const [messages, setMessages] = useState<Message[]>([startingMessage]);
  const [input, setInput] = useState<string>('');
  const flatListRef = useRef<FlatList<Message>>(null);

  // Load messages from AsyncStorage on component mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedMessages !== null) {
          const parsedMessages: (Omit<Message, 'createdAt'> & { createdAt: string })[] = JSON.parse(storedMessages);
          const messagesWithDates: Message[] = parsedMessages.map(msg => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          }));
          setMessages(messagesWithDates);
        }
      } catch (error) {
        console.error('Failed to load messages from storage:', error);
      }
    };

    loadMessages();
  }, []);

  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        const messagesToStore = messages.map(msg => ({
          ...msg,
          createdAt: msg.createdAt.toISOString(), // Serialize Date to string
        }));
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToStore));
      } catch (error) {
        console.error('Failed to save messages to storage:', error);
      }
    };

    saveMessages();
  }, [messages]);

  // Function to send a new message
  const sendMessage = () => {
    if (input.trim().length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      createdAt: new Date(),
      user: {
        id: '1', // Current user ID
        name: 'You',
      },
    };

    setMessages(previousMessages => [...previousMessages, newMessage]);
    setInput('');

    // Optionally, simulate a response from the bot
    simulateBotResponse();
  };

  // Function to simulate a bot response after sending a message
  const simulateBotResponse = () => {
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm here to help! Feel free to ask me anything.",
        createdAt: new Date(),
        user: {
          id: '2',
          name: 'ChatBot',
        },
      };

      setMessages(previousMessages => [...previousMessages, botMessage]);
    }, 1500); // 1.5 seconds delay
  };

  // Scroll to bottom when a new message is added
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderItem = ({ item, index }: ListRenderItemInfo<Message>) => {
    const previousMessage = index > 0 ? messages[index - 1] : null;
    return <MessageBubble message={item} previousMessage={previousMessage} />;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="#CCCCCC"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#6F6F6F" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  input: {
    flex: 1,
    backgroundColor: '#333333', // Dark background for better visibility
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    color: '#FFFFFF', // White text color
  },
  sendButton: {
    marginLeft: 10,
  },
});

export default ChatScreen;
