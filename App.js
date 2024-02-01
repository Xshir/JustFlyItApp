import React, {  useRef, useState, useEffect, createContext, useContext } from 'react';
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  Linking
} from 'react-native';
import { Text, ThemeProvider, Icon, Button, ListItem, Avatar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Stack = createStackNavigator();
// AuthProvider component
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [theme, setTheme] = useState('light');
  const [isStaff, setIsStaff] = useState(false);  // Add isStaff state
  const toggleTheme = () =>  {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  const authContextValue = {
    loggedIn,
    setLoggedIn,
    username,
    setUsername,
    theme,
    setTheme,
    isStaff,  // Include isStaff in the context
    setIsStaff,  // Include setIsStaff in the context
    fullName, 
    setFullName,
    toggleTheme,
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

const SchoolAssignmentsScreen = () => {
  const [assignment1, setAssignment1] = useState('');
  const [assignment2, setAssignment2] = useState('');
  const [assignment3, setAssignment3] = useState('');
  const [assignment4, setAssignment4] = useState('');
  const [assignment5, setAssignment5] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [imageLoadingError, setImageLoadingError] = useState(false);
  const navigation = useNavigation();
  const handleSubmit = () => {
    // Implement your submission logic here
    // For demonstration purposes, let's assume a successful submission after 2 seconds
    setTimeout(() => {
      setSubmissionSuccess(true);
    }, 2000);
  };
  const handleNavigateHome = () => {
    setSubmissionSuccess(false);
    navigation.navigate('Home');
  };

  const handleImageError = () => {
    setImageLoadingError(true);
    setBackgroundColor('#1C1C73'); // Set background color to red on image loading error
  };
  return (
    <ImageBackground
      source={imageLoadingError ? null : require('./assets/MicrosoftTeams-image(6).png')}
      style={{ flex: 3, resizeMode: 'cover', justifyContent: 'center', backgroundColor }}
      onError={handleImageError} >
      <View style={[styles.container, { paddingTop: 20, paddingBottom: 20, /* Add padding to the top */ }]}>
        <View>
          {/* Rectangular Box 1 */}
          <View style={styles.assignmentBox}>
            <TextInput
              style={styles.assignmentBoxText}
              placeholder="Assignment 1"
              value={assignment1}
              onChangeText={(text) => setAssignment1(text)}
            />
          </View>
          {/* Rectangular Box 2 */}
          <View style={styles.assignmentBox}>
            <TextInput
              style={styles.assignmentBoxText}
              placeholder="Assignment 2"
              value={assignment2}
              onChangeText={(text) => setAssignment2(text)}
            />
          </View>
          {/* Rectangular Box 3 */}
          <View style={styles.assignmentBox}>
            <TextInput
              style={styles.assignmentBoxText}
              placeholder="Assignment 3"
              value={assignment3}
              onChangeText={(text) => setAssignment3(text)}
            />
          </View>
          {/* Rectangular Box 4 */}
          <View style={styles.assignmentBox}>
            <TextInput
              style={styles.assignmentBoxText}
              placeholder="Assignment 4"
              value={assignment4}
              onChangeText={(text) => setAssignment4(text)}
            />
          </View>
          {/* Rectangular Box 5 */}
          <View style={styles.assignmentBox}>
            <TextInput
              style={styles.assignmentBoxText}
              placeholder="Assignment 5"
              value={assignment5}
              onChangeText={(text) => setAssignment5(text)}
            />
          </View>
          {/* Submit Button */}
          <Button title="Submit"
            onPress={handleSubmit}
            titleStyle={{ fontWeight: 'bold', fontSize: 18, }} />

          {/* Display Success Message */}
          {submissionSuccess && (
            <View style={styles.successMessage}>
              <Text style={styles.successMessageText}>Submission Successful!</Text>
              <Button title="Go to Home"
                onPress={handleNavigateHome}
                titleStyle={{ fontWeight: 'bold', fontSize: 18 }} />
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};


const TrainerProfileScreen = ({ route }) => {
  const [trainersData, setTrainersData] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://101.100.176.175/trainers_profile_data');
        const data = await response.json();
        setTrainersData(data.trainers_profile_data);
        console.log(data.trainers_profile_data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchUpdatedData = async () => {
    try {
      const response = await fetch('http://101.100.176.175/trainers_profile_data');
      const data = await response.json();
      setTrainersData(data.trainers_profile_data);
      console.log(data.trainers_profile_data);
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };

  const { trainer } = route.params;

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const dynamicInfo = Object.entries(trainer).map(([key, value]) => {
    const displayValue = value || "NO DATA";

    if (key === 'profile_picture') {
      return null;
    }

    const displayKey = toTitleCase(key.replace(/_/g, ' '));

    return (
      <Text key={key} style={styles.trainerProfileInfo}>
        {displayKey}: {displayValue}
      </Text>
    );
  });

  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [imageLoadingError, setImageLoadingError] = useState(false);

  const handleImageError = () => {
    setImageLoadingError(true);
    setBackgroundColor('#1C1C73');
  };

  const isExpiryWithin3Months = () => {
    const expiryDate = new Date(trainer.expiry_date);
    const currentDate = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow;
  };

  const renderRenewButton = () => {
    if (isExpiryWithin3Months()) {
      return (
        <TouchableOpacity
          style={styles.squareButton}
          onPress={() => {
            Linking.openURL('https://rems.moe.edu.sg/');
          }}
        >
          <Text style={styles.renewButtonText}>Renew MOE Registration</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const profilePictureSource = trainer.profile_picture
    ? { uri: trainer.profile_picture }
    : require('./assets/default-pfp.jpg');

  return (
    <ImageBackground
      source={imageLoadingError ? null : require('./assets/MicrosoftTeams-image(6).png')}
      style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center', backgroundColor }}
      onError={handleImageError}
    >
      <View style={styles.container}>
        <View style={styles.trainerProfileCard}>
          <Avatar
            rounded
            source={profilePictureSource}
            size="xlarge"
            containerStyle={styles.avatarContainer}
          />
          <Text style={styles.trainerProfileName}>{trainer.full_name}</Text>
          {dynamicInfo}
        </View>
        {renderRenewButton()}
      </View>
    </ImageBackground>
  );
};

const AllTrainersScreen = () => {
  const navigation = useNavigation();
  const [trainersData, setTrainersData] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [moeRegistrationDate, setMoeRegistrationDate] = useState(new Date('2024-03-01')); // Replace with the actual MOE registration date

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://101.100.176.175/trainers_profile_data');
        const data = await response.json();
        setTrainersData(data.trainers_profile_data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [showButtons]);

  const maxNameWidth = Math.max(...trainersData.map((trainer) => trainer.full_name.length));
  const windowWidth = Dimensions.get('window').width;
  const numColumns = 2

  const renderTrainerItem = ({ item }) => {
    const profilePictureSource = item.profile_picture
      ? { uri: item.profile_picture }
      : require('./assets/default-pfp.jpg');
  
    const isRegistrationWithin3Months = () => {
      const registrationDate = new Date(item.expiry_date);
      const currentDate = new Date();
      const diffMonths =
        (registrationDate.getFullYear() - currentDate.getFullYear()) * 12 +
        registrationDate.getMonth() -
        currentDate.getMonth();
      return Math.abs(diffMonths) <= 3;
    };
  
    const itemWidth = windowWidth / 2 - 30;
    const maxCardHeight = 150; // Set the maximum height for the card
  
    const listItemContainerStyle = {
      width: itemWidth,
      margin: 10,
      borderRadius: 15,
      backgroundColor: isRegistrationWithin3Months() ? 'red' : 'transparent',
      height: maxCardHeight, // Set a fixed height for the card
    };
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${day}-${month}-${year}`;
    };
  
    return (
      <TouchableOpacity onPress={() => navigation.navigate('TrainerProfile', { trainer: item })}>
        <View style={[styles.listItemContainer, listItemContainerStyle]}>
          <Avatar
            rounded
            source={profilePictureSource}
            size="large"
            containerStyle={{
              borderWidth: 3,
              borderColor: '#383899',
              shadowColor: '#000',
              shadowOffset: { width: 1, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          />
          <View style={styles.listItemContent}>
            <Text
              style={[
                styles.listItemTitle,
                { fontWeight: 'bold', color: 'white', textAlign: 'center'},
              ]}
            >
              {item.full_name}
              {'\n'}
              {isRegistrationWithin3Months() ? (
            <Text style={{ color: 'yellow', fontWeight: 'bold', textAlign: 'center' }}>
              MOE Registration Expiring Soon ({formatDate(item.expiry_date)})
            </Text>
          ) : item.moe_registered ? (
            <Text style={{ color: 'green', fontWeight: 'bold', textAlign: 'center' }}>
              MOE Registered Trainer
            </Text>
          ) : (
            <Text style={{ color: 'gray', fontWeight: 'bold', textAlign: 'center' }}>
              Not Registered
            </Text>
            )}
              </Text>

          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  
  const handleAddTrainer = () => {
    // Implement logic to add a trainer
    // ...
    // Assuming newTrainer is the newly added trainer
    setTrainersData([...trainersData, newTrainer]);
  };

  
  const handleEditPress = () => {
    setShowButtons((prev) => !prev);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#1C1C73' }]}>
      <View style={[styles.container, { flexDirection: 'column' }]}>
       {/* 
        <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
          <Text style={styles.editButtonText}>{showButtons ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
         */}
        <FlatList
          data={trainersData}
          renderItem={renderTrainerItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContainer}
          numColumns={numColumns}
        />
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const { loggedIn, setLoggedIn, username, setUsername, theme, toggleTheme, isStaff, setIsStaff, fullName, setFullName} = useAuth();
  const navigation = useNavigation();
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [imageLoadingError, setImageLoadingError] = useState(false);
  const [trainersData, setTrainersData] = useState([]);
  const trainersDataRef = useRef(trainersData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://101.100.176.175/trainers_profile_data');
        const data = await response.json();

        if (data && data.trainers_profile_data) {
          setTrainersData(data.trainers_profile_data);
          
        } else {
          console.warn('No trainers data received from the server.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures that this effect runs only once on mount

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
  }, []); // The empty dependency array ensures that this effect runs only once on mount

  

  const handleLogin = async () => {
    const apiUrl = 'http://101.100.176.175/login';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (result.success) {
        setLoggedIn(true);
        setIsStaff(result.is_staff);  // Assuming setIsStaff is part of the useAuth context
        setFullName(result.full_name);
        try {
          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('fullname', result.full_name);
          
        } catch (error) {
          console.error('Error saving login state:', error);
        }
      } else {
        Alert.alert('Login Failed', 'Invalid username. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle other errors as needed
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

  const fetchUpdatedData = async () => {
    console.log('called')
    try {
      const response = await fetch('http://101.100.176.175/trainers_profile_data');
      const data = await response.json();
      setTrainersData(data.trainers_profile_data);
      trainersDataRef.current = data.trainers_profile_data
      console.log(data.trainers_profile_data[4].preferred_name);
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };

  const handleCardPress = async (pageName) => {
    
    
    switch (pageName) {
      case 'School Assignments':
        navigation.navigate('SchoolAssignments');
        break;
        case "All Trainers'":
        case 'My Profile':
            if (isStaff) {
              navigation.navigate('AllTrainers');
            } else {
              // Check if the user's full name matches any trainer's full name
              let fullName_
              fullName_ = await AsyncStorage.getItem('fullname');
              console.log('ref', trainersDataRef);
              await fetchUpdatedData();
              //trainersData

              const matchingTrainer = trainersDataRef.current.find(
                (trainerObject) => trainerObject.full_name === fullName_
              );
        
              if (matchingTrainer) {
                // If a matching trainer is found, navigate to the TrainerProfileScreen with the trainer object
                navigation.navigate('TrainerProfile', { trainer: matchingTrainer });
              } else {
                console.log("Else triggered for case/switch: ", trainerObject.full_name, fullName_);
                // Handle the case when the user is not a staff and their profile is not found
                Alert.alert('Profile Not Found', 'Your profile is not found in the trainers data.');
              }
            }
            break;

        
      case 'Schedule Activities':
        navigation.navigate('ScheduleActivities');
        break;
      case 'Confirm Activity Completion':
        navigation.navigate('ConfirmActivityCompletion');
        break;
      // Add cases for other pages as needed
    }
  };
  
  
  const renderCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item.pageName)}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={[styles.circle, { backgroundColor: 'transparent' }]}>
            {item.pageName === 'School Assignments' ? (
              <Icon name="home" type="font-awesome" color={'white'} size={50} />
            ) : item.pageName === 'Schedule Activities' ? (
              <Icon name="calendar" type="font-awesome" color={'white'} size={40} />
            ) : item.pageName === "All Trainers'" ? (
              <Icon name="users" type="font-awesome" color={'white'} size={40} />
            ) : item.pageName === 'My Profile' ? (
              <Icon name="user" type="font-awesome" color={'white'} size={40} />
            ) : (
              <Icon name="fact-check" type="material" color={'white'} size={50} />
            )}
          </View>
          <Text style={styles.cardLabel}>{item.pageName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const data = [
    { id: '1', pageName: 'School Assignments' },
    { id: '2', pageName: "All Trainers'" },
    { id: '3', pageName: 'Schedule Activities' },
    { id: '4', pageName: 'Confirm Activity Completion' },
    // Add more objects for additional pages
  ];

  if (!isStaff) {
    data[1] = {id: '2', pageName: "My Profile"}
  }
  
  const handleImageError = () => {
    setImageLoadingError(true);
    setBackgroundColor('#1C1C73'); // Set background color to red on image loading error
  };
  return (
    <ThemeProvider theme={{ colors: { primary: '#428C8B', text: 'white', gold: '#FFDBB0', card: 'white' } }}>
      <ImageBackground
        source={imageLoadingError ? null : getBackgroundImage(theme)}
        style={{ flex: 3, resizeMode: 'contain', justifyContent: 'center', backgroundColor }}
        onError={handleImageError}
      >
        <View style={styles.container}>
          <View style={styles.centeredContainer}>
            <Image
              source={require('./assets/JFITransparent.png')}
              style={{ width: 170, height: 170, alignSelf: 'center', resizeMode: 'contain', marginBottom: 10 }}
            />
            {loggedIn ? (
              <View style={styles.homeContainer}>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeSwitchButton}>
                  <Icon name="cog" type="font-awesome-5" color="white" size={20} />

                </TouchableOpacity>
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
                  buttonStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', borderColor: 'white', borderRadius: 15, borderWidth: 2, }} // Updated styles
                />
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </ThemeProvider>
  );
};
const getBackgroundImage = (theme) => {
  return theme === 'light' ? require('./assets/MicrosoftTeams-image(4).png') : require('./assets/MicrosoftTeams-image(3).png');
};
const HomeScreenHeaderRight = () => {
  const { setLoggedIn, setUsername } = useAuth();
  const navigation = useNavigation();


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      setLoggedIn(false);
      setUsername('');
    } catch (error) {
      console.error('Error clearing login state:', error);
      Alert.alert('Error', 'An error occurred while logging out. Please try again.');
    }
  };
  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Icon name="sign-out-alt" type="font-awesome-5" color="white" size={20} />
      <Text style={styles.logoutButtonText}>Logout</Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',  
    justifyContent: 'center',
  },
  rectangleImage: {
    width: '100%', 
    height: 100, 
    resizeMode: 'contain',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  trainerProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth, 
    height: windowHeight, 
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
    paddingHorizontal: 20, 
    marginTop: 20, 
    marginLeft: -10
  },
  cardContainer: {
    margin: 10,
    width: 120,  
    height: 160, 
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 50,  
    height: 50, 
    borderRadius: 25,
    backgroundColor: '#1C1C73',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14, 
    marginTop: 10,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '120%',
  },
  textInput: {
    backgroundColor: 'white',
    color: 'grey',
    width: '80%',
    height: 50,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginRight: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    borderRadius: 8,
    borderColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  trainerCard: {
    margin: 10,
    width: '10%',
    height: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C73',
  },
  trainerAvatar: {
    width: 200,
    height: 200,
    borderRadius: 30,
    marginBottom: 10,
    marginRight: 10,
  },
  trainerCardLabel: {
    fontSize: 18,
    color: 'white', 
    fontWeight: 'bold',
  },
  trainerProfileLabel: {
    marginBottom: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  trainerProfileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
  },
  trainerProfileAvatar: {
    width: 100,
    height: 100,
    marginTop: -50,
    borderRadius: 50,
    marginBottom: 10,
    marginLeft: 115,
  },
  trainerProfileName: {
    fontSize: 24,
    color: 'white', 
    fontWeight: 'bold',
  },
  trainerProfileInfo: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  listItemContainer: {
    width: 250, 
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    flexDirection: 'column', 
    alignItems: 'center', 
    borderBottomWidth: 2, 
    borderBottomColor: 'white', 
    paddingHorizontal: 15, 
    marginBottom: 10, 
    borderColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
    flex: 1,
    alignSelf: 'center'
  },
  listItemTitle: {
    flex: 1, 
    marginLeft: 10, 
  },
  columnWrapper: {
    justifyContent: 'space-between', 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignmentBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  assignmentBoxText: {
    fontSize: 18,
    color: 'grey',
  },
  successMessage: {
    marginTop: 20,
    alignItems: 'center',
  },
  successMessageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  assignmentLabel: {
    color: 'white', 
    fontSize: 18,
    fontWeight: 'bold'
  },
  addButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonLabel: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginLeft: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  editButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  trainerItemContainer: {
    position: 'relative',
    width: '100%',
  },
  removeTrainerButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
  },
  themeSwitchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 730,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: 15,
    marginRight: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  themeSwitchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  moeRegistrationMessage: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 20, // Adjust the bottom value to push the button further down
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  
  squareButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  renewButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  profileCardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  trainerDetailContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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
                backgroundColor: 'transparent', // Set background color to transparent
              },
              headerTransparent: true, // Make the header transparent
              headerTintColor: 'white', // Home text color
              shadowColor: 'transparent', // Set shadow color to transparent
            })}
          />
          <Stack.Screen
            name="AllTrainers"
            component={AllTrainersScreen}
            options={{
              title: "All Trainers' Profile",
              headerStyle: {
                backgroundColor: '#1C1C73', // Set background color to transparent
              },
              headerTransparent: false, // Make the header transparent
              headerTintColor: 'white', // Home text color
            }}
          />
          <Stack.Screen
            name="TrainerProfile"
            component={TrainerProfileScreen}
            options={{
              title: 'Trainer Profile',
              headerStyle: {
                backgroundColor: 'transparent', // Set background color to transparent
              },
              headerTransparent: true, // Make the header transparent
              headerTintColor: 'white', // Home text color
              shadowColor: 'transparent', // Set shadow color to transparent
            }}
          />
          <Stack.Screen
            name="SchoolAssignments"
            component={SchoolAssignmentsScreen}  // Include the SchoolAssignmentsScreen component
            options={{
              title: 'School Assignments',
              headerStyle: {
                backgroundColor: '#1C1C73',
              },
              headerTransparent: false,
              headerTintColor: 'white',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;

