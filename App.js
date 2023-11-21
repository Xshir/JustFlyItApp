import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { Text, ThemeProvider, Icon, Button, ListItem, Avatar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const authContextValue = {
    loggedIn,
    setLoggedIn,
    username,
    setUsername,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const TrainerProfileScreen = ({ route }) => {
  const { trainer } = route.params;
  const moeExpiryDate = new Date(trainer.moeExpiry);
  const currentDate = new Date();
  const timeSinceExpiry = moeExpiryDate < currentDate ? currentDate - moeExpiryDate : 0;

  const formatTime = (milliseconds) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.trainerProfileLabel}>
        Trainer Profile
      </Text>
      <View style={styles.trainerProfileCard}>
        <Image source={{ uri: trainer.avatar }} style={styles.trainerProfileAvatar} />
        <Text style={styles.trainerProfileName}>{trainer.name}</Text>
        <Text style={styles.trainerProfileInfo}>Experience: {trainer.experience}</Text>
        <Text style={styles.trainerProfileInfo}>
          MOE Registration Expiry: {moeExpiryDate.toDateString()}
        </Text>
        {moeExpiryDate < currentDate ? (
          <Text style={styles.trainerProfileInfo}>
            Time since expiry: {formatTime(timeSinceExpiry)}
          </Text>
        ) : (
          <Text style={styles.trainerProfileInfo}>
            Time till expiry: {formatTime(moeExpiryDate - currentDate)}
          </Text>
        )}
      </View>
    </View>
  );
};

const AllTrainersScreen = () => {
  const navigation = useNavigation();

  const trainersData = Array.from({ length: 20 }, (_, index) => ({
    id: String(index + 1),
    name: `Trainer ${index + 1}`,
    experience: `${index + 1} years`,
    moeExpiry: '2023-12-31', // Replace with actual date
    avatar: `https://placekitten.com/100/${100 + index}`, // Cat picture
  }));

  // Find the maximum width of trainer names
  const maxNameWidth = Math.max(...trainersData.map((trainer) => trainer.name.length));

  const renderTrainerItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('TrainerProfile', { trainer: item })}>
      <ListItem
        bottomDivider
        containerStyle={[styles.listItemContainer, { width: maxNameWidth * 17 , margin: 8, borderRadius: 15}]} // Adjust the multiplier as needed
        contentContainerStyle={styles.listItemContentContainer}
      >
        <Avatar rounded source={{ uri: item.avatar }} />
        <ListItem.Content style={styles.listItemContent}>
          <ListItem.Title style={styles.listItemTitle}>{item.name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trainersData}
        renderItem={renderTrainerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
        numColumns={2}  // Set the number of columns to 2
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};


const HomeScreen = () => {
  const { loggedIn, setLoggedIn, username, setUsername } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const loadLoginState = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
          setLoggedIn(true);
        }
      } catch (error) {
        console.error('Error loading login state:', error);
      }
    };

    loadLoginState();
  }, []);

  const handleLogin = async () => {
    if (username === 'admin') {
      setLoggedIn(true);
      try {
        await AsyncStorage.setItem('username', username);
      } catch (error) {
        console.error('Error saving login state:', error);
      }
    } else {
      Alert.alert('Login Failed', 'Invalid username. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
    } catch (error) {
      console.error('Error clearing login state:', error);
    }
    setLoggedIn(false);
    setUsername('');
  };

  const handleCardPress = (pageName) => {
    switch (pageName) {
      case 'School Assignments':
        Alert.alert('Navigate to School Assignments');
        break;
      case "All Trainers'":
        navigation.navigate('AllTrainers');
        break;
      // Add cases for other pages as needed
    }
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item.pageName)}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={[styles.circle, { backgroundColor: '#0CBFB4' }]}>
            <Icon
              name={item.pageName === 'School Assignments' ? 'home' : 'user'}
              type="font-awesome"
              color={'gold'}
              size={60}
            />
          </View>
          <Text style={styles.cardLabel}>{item.pageName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const data = [
    { id: '1', pageName: 'School Assignments' },
    { id: '2', pageName: "All Trainers'" },
    // Add more objects for additional pages
  ];

  return (
    <ThemeProvider theme={{ colors: { primary: '#0CBFB4', text: 'black', gold: 'gold', card: 'lightgray' } }}>
      <View style={styles.container}>
        <View style={styles.centeredContainer}>
          <Image
            source={require('./JFITransparent.png')} // Replace with the correct path to your local image
            style={{ width: 200, height: 200, alignSelf: 'center', resizeMode: 'contain', marginBottom: 20 }}
          />

          {loggedIn ? (
            <View style={styles.homeContainer}>
              <FlatList
                data={data}
                renderItem={renderCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.flatListContainer}
              />
            </View>
          ) : (
            <View style={styles.loginContainer}>
              <TextInput
                placeholder="Enter your username"
                value={username}
                onChangeText={(text) => setUsername(text)}
                style={styles.textInput}
              />
              <Button
                title="Login"
                onPress={handleLogin}
                buttonStyle={{ backgroundColor: 'black', borderRadius: 40 }}
                titleStyle={{ color: 'gold' }}
              />
            </View>
          )}
        </View>
      </View>
    </ThemeProvider>
  );
};

const HomeScreenHeaderRight = () => {
  const { setLoggedIn, setUsername } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
    } catch (error) {
      console.error('Error clearing login state:', error);
    }
    setLoggedIn(false);
    setUsername('');
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Icon name="sign-out-alt" type="font-awesome-5" color={'gold'} size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0CBFB4',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  flatListContainer: {
    alignItems: 'center',
  },
  cardContainer: {
    margin: 10,
    width: 150,
    height: 200,
    borderRadius: 10,
    backgroundColor: 'transparent',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: '#0CBFB4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 20,
    marginTop: 10,
    color: 'black',
    textAlign: 'center',
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '105%',
  },
  textInput: {
    backgroundColor: 'lightgray',
    color: 'black',
    width: '80%',
    height: 50,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  logoutButton: {
    marginRight: 16,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
  },
  trainerCard: {
    margin: 10,
    width: '10%',
    height: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFDD0', // Magenta background
  },
  trainerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    marginRight: 10,
  },
  trainerCardLabel: {
    fontSize: 18,
    color: '#0CBFB4',
    fontWeight: 'bold',
  },
  trainerProfileLabel: {
    marginBottom: 20,
    color: 'white',
  },
  trainerProfileCard: {
    backgroundColor: '#FFFDD0', // Magenta background
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  trainerProfileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  trainerProfileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  trainerProfileInfo: {
    fontSize: 18,
    color: 'brown',
    marginTop: 10,
  },
  listItemContainer: {
    width: '100%', // Set to '100%' to take up the full width
    backgroundColor: '#FFFDD0',
    flexDirection: 'row', // Set to 'row' to display items horizontally
    alignItems: 'center', // Center items vertically
    borderBottomWidth: 1, // Add a border for separation
    borderBottomColor: 'lightgray', // Border color
    paddingHorizontal: 15, // Add horizontal padding
    marginBottom: 10, // Add bottom margin for separation
  },

  listItemTitle: {
    flex: 1, // Allow the title to take up remaining space
    marginLeft: 10, // Add left margin for separation from the avatar
  },

  columnWrapper: {
    justifyContent: 'space-between', // Adjust the alignment of columns
  },
});

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerRight: () => <HomeScreenHeaderRight />,
              headerShown: useAuth().loggedIn,
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: 'gold',
            })}
          />
          <Stack.Screen
            name="AllTrainers"
            component={AllTrainersScreen}
            options={{
              title: "All Trainers' Profile",
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: 'gold',
            }}
          />
          <Stack.Screen
            name="TrainerProfile"
            component={TrainerProfileScreen}
            options={{
              title: 'Trainer Profile',
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: 'gold',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
