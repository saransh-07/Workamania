import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Modal,
  ToastAndroid,
  Alert,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import firebase from 'firebase';
import db from '../Configs';
import AppHeader from '../components/AppHeader';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      phone: '',
      modalVisible: false,
      isInAnyWorkplace: '',
      userID: '',
    };
  }

  getIsInAnyWorkplace = (email) => {
    this.setState({ userID: email });
    db.collection('users')
      .where('email', '==', this.state.userID)
      .onSnapshot((snapshot) =>
        snapshot.forEach((doc) => {
          console.log(doc.data().isInAnyWorkplace);

          if (doc.data().isInAnyWorkplace == false) {
            this.props.navigation.navigate('WorkInit');
          } else {
            this.props.navigation.navigate('Manage');
          }
        })
      );
  };
  signup = (email, pass, confirmPass) => {
    if (email && pass && confirmPass) {
      if (pass == confirmPass) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, pass)
          .then(() => {
            db.collection('users').add({
              username: this.state.username,
              email: email,
              address: this.state.address,
              phone: this.state.phone,
              isInAnyWorkplace: false,
              workID: '',
            });
            this.setState({ modalVisible: false });
            ToastAndroid.show(
              'Your account has been created!',
              ToastAndroid.SHORT
            );
          })
          .catch((error) => {
            Alert.alert(error.message);
          });
      } else {
        Alert.alert("Passwords don't match.");
      }
    } else {
      Alert.alert('Fill The Details Properly');
    }
  };
  login = (email, pass) => {
    if (email && pass) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, pass)
        .then(() => {
          ToastAndroid.show('Signed In Successfully', ToastAndroid.SHORT);
          this.getIsInAnyWorkplace(email);
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    } else {
      Alert.alert('Fill The Details Properly');
    }
  };
  showModal = () => {
    return (
      <Modal
        style={{ width: '100%' }}
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}>
        <View style={{ alignItems: 'center' }}>
          <TextInput
            placeholder="Username"
            onChangeText={(text) => {
              this.setState({ username: text });
            }}
            style={styles.inputs}
          />
          <TextInput
            placeholder=" abc@example.com"
            onChangeText={(text) => {
              this.setState({ email: text });
            }}
            style={styles.inputs}
          />
          <TextInput
            placeholder=" Address"
            onChangeText={(text) => {
              this.setState({ address: text });
            }}
            style={styles.inputs}
          />
          <TextInput
            placeholder=" Phone"
            onChangeText={(text) => {
              this.setState({ phone: text });
            }}
            style={styles.inputs}
          />
          <TextInput
            placeholder=" Password"
            secureTextEntry={true}
            onChangeText={(text) => {
              this.setState({ password: text });
            }}
            style={styles.inputs}
          />
          <TextInput
            placeholder=" Confirm Password"
            secureTextEntry={true}
            onChangeText={(text) => {
              this.setState({ confirmPassword: text });
            }}
            style={styles.inputs}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.signup(
                this.state.email,
                this.state.password,
                this.state.confirmPassword
              );
            }}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'red' }]}
            onPress={() => {
              this.setState({ modalVisible: false });
            }}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  render() {
    return (
      <SafeAreaProvider>
        <AppHeader title="SimplyWork" />
        <SafeAreaView>
          <View style={styles.containerView}>
            {this.showModal()}
            <LottieView
        autoPlay
        style={{
          width:300,
          height:200,
          backgroundColor: '#eee',
          marginTop : 60
        }}
        source={require('../97045-working-man.json')}
        loop
      /><View>
            <TextInput
              placeholder=" abc@example.com"
              onChangeText={(text) => {
                this.setState({ email: text });
              }}
              style={[styles.inputs,{marginTop:100}]}
            />
            <TextInput
              placeholder=" Password"
              secureTextEntry={true}
              onChangeText={(text) => {
                this.setState({ password: text }); 
              }}
              style={styles.inputs}
            />

            <TouchableOpacity
              onPress={() => { 
                this.login(this.state.email, this.state.password);
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({ modalVisible: true });
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );

  }
}
const styles = StyleSheet.create({
  containerView: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: Constants.statusBarHeight+50,
      alignItems:'center'
  
  },
  inputs: {
    borderColor: 'black',
    borderWidth: 1,
    width: 200,
    height: 40,
    borderRadius: 5,
    marginTop: 20,
    paddingLeft:6
  },
  button: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    border: 'solid',
    borderWidth: 2,
    borderColor: 'black',
    marginTop: 20,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    borderBottomColor: 'lightblue',
    borderBottomWidth: 3,
    alignItems:'center',
    elevation:8
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 5 * 4,
  },
});
