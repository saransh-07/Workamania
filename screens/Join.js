import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Card } from 'react-native-elements';
import firebase from 'firebase';
import db from '../Configs';
import AppHeader from '../components/AppHeader';
export default class Join extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      workID: '',
      verifiedExistenceOfWorkplace: false,
      address: '',
      contact: '',
      username: '',
    };
  }
  componentDidMount() {
    this.getUserDetails();
  }
  getUserDetails = () => {
    db.collection('users')
      .where('email', '==', this.state.userID)
      .onSnapshot((snapshot) =>
        snapshot.forEach((doc) => {
          this.setState({
            address: doc.data().address,
            contact: doc.data().phone,
            username: doc.data().username,
          });
        })
      );
  };
  addEmployee = () => {
    var workplace_path = 'workplace' + this.state.workID;
    db.collection(workplace_path).onSnapshot((snapshot) =>
      snapshot.forEach((doc) => {
        this.setState({
          verifiedExistenceOfWorkplace: doc.data() !== undefined ? true : false,
        });
      })
    );

    if (this.state.verifiedExistenceOfWorkplace == true) {
      db.collection(workplace_path).add({
        dType: 'employeeInfo',
        eName: this.state.username,
        eAddress: this.state.address,
        ePhone: this.state.contact,
        eDesignation: 'Ordinary Employee',
        eEmail:this.state.userID
      });

      db.collection('users')
        .where('email', '==', this.state.userID)
        .onSnapshot((snapshot) => {
          snapshot.forEach((docu) => {
            db.collection('users').doc(docu.id).update({
              isInAnyWorkplace: true,
              workID:this.state.workID
            });
          });
        });
      ToastAndroid.show('Joined Successfully', ToastAndroid.SHORT);
      this.props.navigation.navigate('ManageScreen');
    } else {
      Alert.alert('Invalid ID Entered. Please check and try again.');
    }
  };
  render() {
    return (
      <SafeAreaProvider>
        <AppHeader title="Join Workplace"/>
        <SafeAreaView>
          <View style={{ alignItems: 'center' }}>
            <Card style={{ borderRadius: 5, backgroundColor: '#d3d3d3' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Join your workplace by entering the ID provided to you by the
                owner. Make sure to take care of capital and small letters.
              </Text>
            </Card>
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
              }}
            />
            <TextInput
              style={styles.inputs}
              placeholder="Workplace ID"
              onChangeText={(text) => {
                this.setState({ workID: text });
              }}
            />
            <TouchableOpacity
              onPress={() => {
                this.addEmployee();
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Join!</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 50,
    borderColor: 'grey',
    borderWidth: 2,
    shadowOffset: {
      x: 10,
      y: 10,
    },
    marginTop: 20,
    shadowColor: 'grey',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 20,
  },
  inputs: {
    borderColor: 'black',
    border: 'solid',
    borderWidth: 1,
    width: 200,
    height: 40,
    borderRadius: 5,
    marginTop: 20,
  },
});
