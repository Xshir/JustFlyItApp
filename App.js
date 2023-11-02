import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePickerExpo from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (username === 'Admin' && password === 'password1234') {
      // Store the user's login status in AsyncStorage
      await AsyncStorage.setItem('isLoggedIn', 'true');
      navigation.navigate('Main'); // Navigate to the main content after a successful login
    } else {
      setError('Incorrect username or password');
    }
  }

  useEffect(() => {
    // Check if the user is already logged in
    const checkLoggedIn = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        navigation.navigate('Main');
      }
    }

    checkLoggedIn();
  }, [navigation]);

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
        onKeyPress={(e) => {
          if (e.nativeEvent.key === 'Enter') {
            handleLogin();
          }
        }}
        style={styles.input}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title={showPassword ? 'Hide Password' : 'Show Password'} onPress={() => setShowPassword(!showPassword)} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

function MainScreen({ navigation }) {
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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSignOut = async () => {
    // Remove the user's login status from AsyncStorage
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.tabGroup}>
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
        <View style={styles.signOutButton}>
          <CustomButton title="Sign Out" onPress={handleSignOut} textColor="black" />
        </View>
      </View>
      <View style={styles.content}>
        {activeTab === 1 && (
          <TouchableOpacity onPress={handleImageSelect}>
            <View style={styles.selectImageContainer}>
              <Button title="Select Image" onPress={handleImageSelect} color="black" />
            </View>
          </TouchableOpacity>
        )}
        {activeTab === 2 && (
          // ...
        )}
      </View>
    </View>
  );
}

function CustomButton({ title, onPress, textColor }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.customButton}>
        <Text style={{ color: textColor }}>{title}</Text>
      </View>
    </TouchableOpacity>
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
    backgroundColor: '#0cbfb4',
  },
  input: {
    backgroundColor: 'white',
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
    color: 'white',
  },
  selectImageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
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
    backgroundColor: '#0cbfb4',
  },
  signOutButton: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  tabGroup: {
    marginBottom: 20,
  },
  customButton: {
    backgroundColor: 'gold',
    padding: 10,
    borderRadius: 5,
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
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
