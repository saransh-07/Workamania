import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ToastAndroid,
  Modal,
  KeyboardAvoidingView
} from 'react-native';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {Icon, Card } from 'react-native-elements';
import firebase from 'firebase'; 
import {Audio} from 'expo-av'
import db from '../Configs'; 
import AppHeader from '../components/AppHeader';
export default class AssignTasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      desc: '',
      eName: '',
      title:'',
      errorMsg:'',
      goingOn:false,
      userID: firebase.auth().currentUser.email,
      workID: '',
      modalVisible: false,
      required: false,
      openPicker:false,
      formattedDate:'',
      recordingUri:'',
      didRecordingOccur:false
    };
  }
  createCustomID=()=>{
    var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var decider = [true,false,false,true,true,false];
    var numbers = '0123456789';
    var id  = '';
    for(var i=0;i<=6;i++){
       if(decider[Math.floor(Math.random()*decider.length)]==true){
         id+=numbers[Math.floor(Math.random()*numbers.length)];
       } else{
         id+=letters[Math.floor(Math.random()*letters.length)];
       }
    }
    return id;

  }
  playBack=async(sound)=>{
   sound.replayAsync()
  }
  showError = () => (
    <Modal
      style={{ width: '70%', height: '30%' }}
      animationType="slide"
      transparent={false}
      visible={this.state.modalVisible}>
      <View style={{ alignItems: 'center' }}>
        <Card>
          <Text style={{ fontSize: 15 }}>
            {this.state.errorMsg}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({ modalVisible: false });
            }}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </Modal>
  );
uploadSound=async(id)=>{
  if(this.state.didRecordingOccur){
    var storageRef = firebase.storage().ref().child('sound'+id);
    var response  = await fetch(this.state.recordingUri);
    var blob = await response.blob();
    storageRef.put(blob);
  }
}
  formatDate = (date) => {
    var date1= date.getDate(); 
    var month = date.getMonth();
    var year = date.getFullYear();

console.log("date1"+date1)


    if (date1 < 10) {
      date1 = '0' + date1.toString();
    }
    if (month < 10) {
      month = '0' + month.toString();
    }
    var finalDate = date1+ '-' + month + '-' + year.toString();
    return finalDate;
  };
  startRec=async()=>{
    await Audio.requestPermissionsAsync()
    this.setState({didRecordingOccur:true})
    try { await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
      })
      const { recording } = await Audio.Recording.createAsync(
           Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        this.setState({recording:recording});
      }
        catch(err){
          console.error(err)
        }
       
    }
     stopRec=async()=>{
          this.setState({recording:undefined});
          const {recording} = this.state;
          await recording.stopAndUnloadAsync();
          const {sound} = await recording.createNewLoadedSoundAsync();
          const uri = recording.getURI(); 
          console.log('Recording stopped and stored at', uri);
          this.setState({recordingUri:uri});
          this.playBack(sound);
    }
  checkUserExistence = () => {
  this.setState({required:false})
    db.collection('users')
      .where('email', '==', this.state.userID)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({ workID: doc.data().workID });
          db.collection('workplace' + this.state.workID)
            .where('dType', '==', 'employeeInfo')
            .where('eName', '==', this.state.eName)
            .onSnapshot((snapshot) => {
              snapshot.forEach((docu) => {
                this.setState({ required: true });
              });
            });
        });
      });
  };
  assignTask = () => {
    db.collection('users')
      .where('email', '==', this.state.userID)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({ workID: doc.data().workID });

          console.log('ID : ' + this.state.workID);
          db.collection('workplace' + this.state.workID)
            .where('dType', '==', 'employeeInfo')
            .where('eName', '==', this.state.eName)
            .onSnapshot((snapshot) => {
              snapshot.forEach((docu) => {
                var id = this.createCustomID()
                db.collection('tasks' + this.state.workID).add({
                  eName: this.state.eName,
                  description: this.state.desc,
                  date: this.state.formattedDate,
                  status: 'incomplete',
                  submission: 'not submitted',
                  eEmail: docu.data().eEmail,
                  taskTitle:this.state.title,
                  taskID:id
                });
                this.uploadSound(id)
                this.setState({ required: true });
                ToastAndroid.show('Task Assigned to ' + this.state.eName,ToastAndroid.SHORT);
                this.props.navigation.navigate('ManageScreen');
              });
            });
        });
      });
  };
  render() {
    return (
      <SafeAreaProvider>
      <AppHeader title="Assign Tasks" navigation ={this.props.navigation} showBackButton={true} backScreenRoute = "ManageScreen"/>
        <SafeAreaView>
         <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled 
    >
          <View style={{ alignItems: 'center' }}>
            
            {this.showError()}
            <TextInput
              placeholder="    Please Enter the Full Name of the Employee"
              style={styles.inputs}
              onChangeText={(text) => {
                this.setState({ eName: text.trim() });
                this.checkUserExistence();
                console.log(this.state.eName);
              }}
            />
            <TextInput
              placeholder="   Task Title"
              multiline={true}
              onChangeText={(text) => {
                this.setState({ title: text });
              }}
              style={[styles.inputs, { height: 100 }]}
            />
                  <TextInput
              placeholder="   Task Description"
              multiline={true}
              onChangeText={(text) => {
                this.setState({ desc: text });
              }}
              style={[styles.inputs, { height: 100 }]}
            /><Text>For extended verbal description</Text>
                 <Icon name="microphone" type="font-awesome"  
                 color = {this.state.goingOn?"green":"grey"}
                 onPress = {()=>{
       if(this.state.goingOn==false){
       this.startRec();
       this.setState({goingOn:true});
       }else{
         this.stopRec();
         this.setState({goingOn:false});
       }
       }} />
            <TouchableOpacity style = {styles.button} onPress={()=>{
              this.setState({openPicker:true})
            }}>
              <Text style={styles.buttonText}>
                Open Date Picker
              </Text>
            </TouchableOpacity>
      <DateTimePickerModal
        isVisible={this.state.openPicker}
        mode="date"
        date = {this.state.date}
        onConfirm={(date)=>{
         
          this.setState({openPicker:false})
          var formatted = this.formatDate(date)
          this.setState({date:date})
          this.setState({formattedDate:formatted})

        }}
        onCancel={()=>{this.setState({openPicker:false})}}
      />
  
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (this.state.desc!=='' && this.state.date!=='' &&this.state.title!=='') {
                  this.assignTask();
                } else {
                  this.setState({errorMsg : 'Fill All Details.'})
                  this.setState({modalVisible:true})
                }
                if (!this.state.required) {  
                  this.setState({errorMsg: 'Employee Not Found. Enter Employee Name Correctly'})
                  this.setState({ modalVisible: true });
                }
              }}>
              <Text style={styles.buttonText}>Assign Task</Text>
            </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
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
    width: 250,
    height: 40,
    borderRadius: 5,
    marginTop: 20,
    paddingleft:6
  },
  button: {
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: 'grey',
    borderLeftColor: 'grey',
    borderRightColor: 'grey',
    borderTopColor: 'grey',
    borderRadius: 9,
    marginTop: 20,
  },
  buttonText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 5 * 4,
  },
});
