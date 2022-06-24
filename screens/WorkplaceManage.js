import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Card, Icon } from 'react-native-elements';
import AppHeader from '../components/AppHeader';
import db from '../Configs';
import firebase from 'firebase';
import  * as Clipboard  from 'expo-clipboard'
export default class Manage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workID: '',
      userID: firebase.auth().currentUser.email, 
      userStatus: '',
      visible:false
    };
  }
  getWorkID = () => {
    db.collection('users')
      .where('email', '==', this.state.userID)
      .onSnapshot((snapshot) =>
        snapshot.forEach((doc) => {
          this.setState({ workID: doc.data().workID });
          db.collection('workplace' + this.state.workID)
            .where('eEmail', '==', this.state.userID)
            .onSnapshot((snapshot) => {
              snapshot.forEach((doc) => {
                this.setState({ userStatus: doc.data().eDesignation });
              });
            });
        })
      );
  };
  componentDidMount() {
this.props.navigation.navigate('Drawer')
    this.getWorkID();
  }
  copyText = () => {
    Clipboard.setStringAsync(this.state.workID);
    ToastAndroid.show('Successfully Copied', ToastAndroid.SHORT);
  };
  render() {
    return (
      <SafeAreaProvider>
        <AppHeader title="Manage Workplace" navigation = {this.props.navigation} />
        <SafeAreaView>
          <View style={styles.containerView}>
            <TextInput
              value={this.state.workID}
              style={[styles.inputs, { textAlign: 'center' }]}
              editable={false}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.copyText();
              }}>
              <Icon name="copy" type="ionicon" color="white" />
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('WorkplaceInfo');
              }}
              style={{
                width: 300,
                height: 50,
                backgroundColor: 'white',
                marginTop: 20,
                borderRadius: 5,
                borderColor: 'grey',
                borderWidth: 2,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                elevation:8
              }}>
              <Icon
                reverse
                name="information-circle-outline"
                type="ionicon" 
                color="grey"
              />
              <Text style={styles.buttonText}>Workplace Info</Text>
            </TouchableOpacity>
            {this.state.userStatus == 'Owner' ? (<View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AssignScreen');
                }}
                style={{
                  width: 300,
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 20,
                  borderRadius: 5,
                  borderColor: 'grey',
                  borderWidth: 2, 
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation:8
                }}>
                <Text style={styles.buttonText}>Assign Tasks</Text>
              </TouchableOpacity>
              <TouchableOpacity
               style={{
                  width: 300,
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 20,
                  borderRadius: 5,
                  borderColor: 'grey',
                  borderWidth: 2, 
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation:8
                }}
                 onPress={() => {
                  this.props.navigation.navigate('SubmittedScreen');
                }}
              >
              <Text style={styles.buttonText}>Submitted Tasks</Text>
              </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                style={{
                  width: 300,
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 20,
                  borderRadius: 5,
                  borderColor: 'grey',
                  borderWidth: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation:8
                }}
                onPress={()=>{
                  this.props.navigation.navigate('FeedbackListScreen');
                }}
                >
                  <Text style={styles.buttonText}>View Feedbacks</Text>
                </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 300,
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 20,
                  borderRadius: 5,
                  borderColor: 'grey',
                  borderWidth: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation:8
                }}
                onPress={()=>{
                  this.props.navigation.navigate('ViewScreen');
                }}
                >
                <Text style={styles.buttonText}>View Tasks</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 300,
                  height: 50,
                  backgroundColor: 'white',
                  marginTop: 20,
                  borderRadius: 5,
                  borderColor: 'grey',
                  borderWidth: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation:8
                }}
                onPress={()=>{
                  this.props.navigation.navigate('CompletedTaskScreen');
                }}
                >
                <Text style={styles.buttonText}>View Completed Tasks</Text>
              </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}
const styles = StyleSheet.create({
  containerView: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  inputs: {
    borderColor: 'black',
    borderWidth: 1,
    width: 200,
    height: 40,
    marginLeft: 50,
  },
  button: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: 'black',
    backgroundColor: 'skyblue',
    borderBottomColor: 'lightblue',
    borderBottomWidth: 3,
    elevation:8
  },
  buttonText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 5 * 4,
  },
});
