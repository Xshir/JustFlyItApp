import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const users = [
  { username: 'Admin', password: 'password1234', role: 'admin', allowedSchools: ['School 1', 'School 2', 'School 3', 'School 4', 'School 5', 'School 6', 'School 7', 'School 8', 'School 9', 'School 10', 'School 11', 'School 12', 'School 13', 'School 14', 'School 15', 'School 16', 'School 17', 'School 18', 'School 19', 'School 20'] },
  { username: 'User1', password: 'user1pass', role: 'user', allowedSchools: ['School 1', 'School 2'] },
  { username: 'User2', password: 'user2pass', role: 'user', allowedSchools: ['School 3', 'School 4'] },
  { username: 'User3', password: 'user3pass', role: 'user', allowedSchools: ['School 5', 'School 6'] },
];

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      navigation.navigate('Home');
    } else {
      setError('Incorrect username or password');
    }
  }

  useEffect(() => {
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
      <View style={styles.inputContainer}>
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
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.showPasswordButton}
        onPress={() => setShowPassword(!showPassword)}
      >
        <Text style={styles.buttonText}>Show Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const allSchools = ['School 1', 'School 2', 'School 3', 'School 4', 'School 5', 'School 6', 'School 7', 'School 8', 'School 9', 'School 10', 'School 11', 'School 12', 'School 13', 'School 14', 'School 15', 'School 16', 'School 17', 'School 18', 'School 19', 'School 20'];

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('currentUser');
      navigation.replace('Login');
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  const fetchCurrentUser = async () => {
    const userString = await AsyncStorage.getItem('currentUser');
    if (userString) {
      const parsedUser = JSON.parse(userString);
      setUser(parsedUser);
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (!isLoggedIn || isLoggedIn !== 'true') {
        navigation.replace('Login');
      } else {
        await fetchCurrentUser();
      }
    };

    checkLoggedIn();
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: user ? `Signed in as ${user.username}` : 'Home',
    });
  }, [user, navigation]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0cbfb4' }}>
      <TouchableOpacity
        style={{ backgroundColor: 'black', borderRadius: 50, paddingVertical: 15, paddingHorizontal: 30, marginBottom: 20 }}
        onPress={() => navigation.navigate('Backend', { allSchools })}
      >
        <Text style={{ color: 'gold', textAlign: 'center', fontSize: 18 }}>Backend</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ position: 'absolute', bottom: 20, left: 20, backgroundColor: 'black', borderRadius: 10, padding: 15 }}
        onPress={handleSignOut}
      >
        <Text style={{ color: 'gold' }}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function BackendScreen({ route, navigation }) {
  const { allSchools } = route.params;
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Backend',
    });
  }, [navigation]);

  const generatePackingList = () => {
    const items = ['Coloured Pens', 'Pen Knife', 'Cutting Mat', "Saimen's Bike", 'DJI Mavic', 'DJI Phantom'];
    const quantity = Math.floor(Math.random() * 10) + 1;
    return items.map(item => `${item} x ${quantity}`);
  };

  const generateSchools = async () => {
    try {
      const currentUserString = await AsyncStorage.getItem('currentUser');
      const currentUser = JSON.parse(currentUserString);
      const allowedSchools = currentUser?.allowedSchools || [];

      const userSchools = currentUser.role === 'admin' ? allSchools : currentUser.allowedSchools;

      const generatedSchools = userSchools.map(schoolName => ({
        name: schoolName,
        packingList: generatePackingList(),
      }));

      return generatedSchools;
    } catch (error) {
      console.error('Error generating schools:', error);
      return [];
    }
  };

  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const generatedSchools = await generateSchools();
        setSchools(generatedSchools);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [allSchools]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.sidebar}>
        {schools.map((school, index) => (
          <TouchableOpacity
            key={index}
            style={styles.schoolItem}
            onPress={() => navigation.navigate('SchoolDetails', { school })}
          >
            <Text style={styles.schoolText}>{school.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.content}>
        <Text style={{ color: 'black' }}>Select a school to view details</Text>
      </View>
    </View>
  );
}

function SchoolDetailsScreen({ route }) {
  const { name, packingList } = route.params.school;

  const isAndroid = Platform.OS === 'android';

  return (
    <View style={styles.content}>
      <View style={styles.schoolNameContainer}>
        <Text style={styles.schoolNameText}>Packing List:</Text>
      </View>
      {isAndroid ? (
        <View>
          {packingList.map((item, index) => (
            <Text key={index} style={styles.androidListItemText}>
              {index + 1}. {item}
            </Text>
          ))}
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Item</Text>
            <Text style={styles.tableHeaderText}>Quantity</Text>
          </View>
          <FlatList
            data={packingList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableItem}>{item}</Text>
                <Text style={styles.tableItem}>1</Text> {/* You can replace '1' with the actual quantity if available */}
              </View>
            )}
          />
        </View>
      )}
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
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  errorText: {
    color: 'orange',
    marginBottom: 15,
    width: '100%',
    textAlign: 'center',
  },
  showPasswordButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 15,
    width: '80%',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 15,
    width: '80%',
  },
  buttonText: {
    color: 'gold',
    textAlign: 'center',
  },
  logoImage: {
    width: '60%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0cbfb4',
  },
  roundButtonContainer: {
    backgroundColor: 'black',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  roundButtonText: {
    color: 'gold',
    textAlign: 'center',
    fontSize: 18,
  },
  signOutButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  newSignOutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 15,
  },
  signOutText: {
    color: 'gold',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#333',
    height: '100vh',
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
  schoolButton: {
    padding: 10,
    borderBottomColor: '#555',
    borderBottomWidth: 1,
  },
  schoolButtonText: {
    color: 'white',
  },
  userInfoContainer: {
    marginBottom: 20,
  },
  userInfoText: {
    color: 'white',
    fontSize: 16,
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'black',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  tableHeaderText: {
    flex: 1,
    color: 'gold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    padding: 10,
  },
  tableItem: {
    flex: 1,
    textAlign: 'center'
  },
  schoolNameContainer: {
    marginBottom: 20,
  },
  schoolNameText: {
    color: 'brown',
    fontSize: 20,
    textAlign: 'center',
  },
  androidListItemText: {
    color: 'black',
    fontSize: 16,
    marginVertical: 5,
  },
});

export default function App() {
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
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home', headerLeft: null }} />
        <Stack.Screen name="Backend" component={BackendScreen} options={{ title: 'Backend' }} />
        <Stack.Screen name="SchoolDetails" component={SchoolDetailsScreen} options={({ route }) => ({ title: route.params.school.name })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
