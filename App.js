import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Platform, TextInput, Button, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePickerExpo from 'expo-image-picker';

const Stack = createStackNavigator();

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'Admin' && password === 'password1234') {
      navigation.navigate('Main'); // Navigate to the main content after successful login
      console.log('Login successful');
    } else {
      setError('Incorrect username or password');
    }
  };

  // Handle login on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.loginForm}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={(text) => setPassword(text)}
        onKeyPress={handleKeyPress} // Add the onKeyPress event
        style={styles.input}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title={showPassword ? 'Hide Password' : 'Show Password'} onPress={() => setShowPassword(!showPassword)} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

function MainScreen() {
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const handleImageSelect = async () => {
    const result = await ImagePickerExpo.launchImageLibraryAsync({
      mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 1 ? styles.activeTab : null,
          ]}
          onPress={() => handleTabClick(1)}
        >
          <Text style={styles.tabText}>Tab 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 2 ? styles.activeTab : null,
          ]}
          onPress={() => handleTabClick(2)}
        >
          <Text style={styles.tabText}>Tab 2</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {activeTab === 1 && (
          <TouchableOpacity onPress={handleImageSelect}>
            <View style={styles.selectImageContainer}>
              <Text style={styles.selectImageText}>Select Image from Gallery</Text>
            </View>
          </TouchableOpacity>
        )}
        {activeTab === 2 && (
          image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <Text>No image selected</Text>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  loginForm: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'teal', // Teal background for the login page
  },
  input: {
    backgroundColor: 'white', // White background for input fields
    marginBottom: 10,
    padding: 10,
  },
  errorText: {
    color: 'orange',
    marginBottom: 10,
  },
  tab: {
    padding: 10,
    
    borderBottomColor: '#555',
    borderBottomWidth: 1,
  },
  activeTab: {
    backgroundColor: '#555',
  },
  tabText: {
    color: '#fff',
  },
  selectImageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  selectImageText: {
    color: 'black',
  },
  sidebar: {
    flex: 1,
    width: 200,
    backgroundColor: '#333',
    padding: 20,
  },
  content: {
    flex: 3,
    padding: 20,
  },
});

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'yellow',
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{
            headerShown: false, // Hide the header for the MainScreen
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 

export default App;
