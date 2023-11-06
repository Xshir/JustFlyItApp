import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Button, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
      navigation.navigate('Home'); // Navigate to the home page after a successful login
    } else {
      setError('Incorrect username or password');
    }
  }

  useEffect(() => {
    // Check if the user is already logged in
    const checkLoggedIn = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        navigation.navigate('Home');
      }
    }

    checkLoggedIn();
  }, [navigation]);

  return (
    <View style={styles.loginForm}>
      <Image source={require('./JFITransparent.png')} style={styles.logoImage} />
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
      <View style={styles.buttonContainer}>
        <Button title="Show Password" onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordButton} color="black" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} style={styles.loginButton} color="black" />
      </View>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const handleSignOut = async () => {
    // Remove the user's login status from AsyncStorage
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.navigate('Login');
  }

  return (
    <View style={styles.homeContainer}>
      <View style={styles.buttonContainer}>
        <Button title="Backend" onPress={() => navigation.navigate('Backend')} color="black" />
      </View>
      <View style={styles.signOutButton}>
        <Button title="Sign Out" onPress={handleSignOut} color="gold" />
      </View>
    </View>
  );
}

function BackendScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.sidebar}>
        <SchoolSidebar navigation={navigation} />
      </ScrollView>
      <View style={styles.content}>
        <Text style={styles.schoolText}>Select a school to view details</Text>
      </View>
    </View>
  );
}

function SchoolSidebar({ navigation }) {
  const schools = Array.from({ length: 50 }, (_, index) => `School ${index + 1}`);

  return (
    <FlatList
      data={schools}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.schoolItem}
          onPress={() => {
            navigation.navigate('SchoolDetails', { school: item });
          }}
        >
          <Text style={styles.schoolText}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

function SchoolDetailsScreen({ route }) {
  return (
    <View style={styles.content}>
      <Text style={styles.schoolText}>{route.params.school}</Text>
      {/* Add additional content for school details, including packing lists, here */}
    </View>
  );
}

const styles = StyleSheet.create({
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
  showPasswordButton: {
    width: '30%',
    borderRadius: 20,
  },
  loginButton: {
    width: '40%',
    borderRadius: 20,
  },
  buttonContainer: {
    marginBottom: 5,
    justifyContent: 'space-evenly',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0cbfb4',
  },
  signOutButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#333',
    height: '100vh', // Set sidebar height to the viewport height
  },
  content: {
    flex: 3,
    padding: 20,
    backgroundColor: '#0cbfb4',
  },
  schoolItem: {
    padding: 10,
    borderBottomColor: '#555',
    borderBottomWidth: 1,
  },
  schoolText: {
    color: 'white',
  },
  logoImage: {
    width: '40%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
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
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="Backend" component={BackendScreen} options={{ title: 'Backend' }} />
        <Stack.Screen name="SchoolDetails" component={SchoolDetailsScreen} options={({ route }) => ({ title: route.params.school })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
