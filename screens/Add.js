import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ToastAndroid
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-elements';
import * as firebase from 'firebase';
import db from '../Configs';
import AppHeader from '../components/AppHeader'
export default class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      department: '',
      contact: '',
      address: '',
      ownerId: firebase.auth().currentUser.email,
      ownerName: '',
      ownerPhone: '',
      ownerAddress: '',
      
    };
  }
  getOwnerDetails = () => {
    db.collection('users')
      .where('email', '==', this.state.ownerId)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.data())
          this.setState({
            ownerName: doc.data().username,
            ownerPhone: doc.data().phone,
            ownerAddress: doc.data().address,
          });
        });
      });
  };
  componentDidMount() {
    this.getOwnerDetails();
  }
  createUniqueID = () => {
    var alphas = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var numbers = '0123456789';
    var id = '';
    for (var a = 0; a < 5; a++) {
      if (Math.random() > 0.5) {
        id += alphas[Math.floor(Math.random() * alphas.length)];
      } else {
        id += numbers[Math.floor(Math.random() * numbers.length)];
      }
    }
    return id;
  };
  createWorkplace = () => {
    var workId = this.createUniqueID();
    db.collection('workplace' + workId).add({
      dType: 'Info',
      department: this.state.department,
      workplaceId: workId,
      name: this.state.name,
      contact: this.state.contact,
      address: this.state.address,
    });

    db.collection('workplace' + workId).add({
      dType: 'ownerInfo',
      eName: this.state.ownerName,
      eAddress: this.state.ownerAddress,
      ePhone: this.state.ownerPhone,
      eDesignation: 'Owner',
      eEmail:this.state.ownerId
    });
   
    db.collection('users').where('email', '==', this.state.ownerId)
    .onSnapshot(snapshot=>{
      snapshot.forEach(docu=>{
        db.collection('users').doc(docu.id).update({
      isInAnyWorkplace:true,
      workID:workId
    })
      })
    })
   ToastAndroid.show('Workplace created Successfully!',ToastAndroid.SHORT)
   this.props.navigation.navigate('ManageScreen')
  };
  render() {
    return (
      <SafeAreaProvider>
      <AppHeader title="Add Workplace"/>
        <SafeAreaView>
          <View style={{ alignItems: 'center' }}>
            
            <Card>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Enter the details of your workplace. When creating a workplace
                your designation will be automatically set to owner.
              </Text>
            </Card>
            <TextInput
              placeholder=" Name"
              style={styles.inputs}
              onChangeText={(text) => {
                this.setState({ name: text });
              }}
            />
            <TextInput
              placeholder=" Department"
              style={styles.inputs}
              onChangeText={(text) => {
                this.setState({ department: text });
              }}
            />
            <TextInput
              placeholder=" Address"
              style={styles.inputs}
              onChangeText={(text) => {
                this.setState({ address: text });
              }}
            />
            <TextInput
              placeholder=" Contact"
              style={styles.inputs}
              onChangeText={(text) => {
                this.setState({ contact: text });
              }}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.createWorkplace();
              }}>
              <Text style={styles.buttonText}>Create Workplace</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  inputs: {
    borderColor: 'black',
    border: 'solid',
    borderWidth: 1,
    width: 200,
    height: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  button: {
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    border: 'dashed',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: 'grey',
    borderLeftColor: 'grey',
    borderRightColor: 'grey',
    borderTopColor: 'grey',
    borderRadius: 9,
   
  },
  buttonText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 5 * 4,
  },
});
