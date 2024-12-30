// App.tsx

import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import ChatScreen from './src/screens/ChatScreen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ChatScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
});

export default App;
