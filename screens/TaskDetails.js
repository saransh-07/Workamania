import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { Card, Icon, Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import db from '../Configs';
import {Audio} from 'expo-av';
export default class TaskDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deadline: props.navigation.getParam('deadline'),
      desc: props.navigation.getParam('desc'),
      title: props.navigation.getParam('title'),
      taskID : props.navigation.getParam('taskID'),
      image: '#',
      workID: '',
      userID: firebase.auth().currentUser.email,
      soundURL:'',
      playing:false,
      paused:false,
      playedDuration:0,
      interval:'',
      duration:''

    };
 this.sound = new Audio.Sound()
 
  }
onPlaybackStatusUpdate=(playbackStatus)=>{
  if (playbackStatus.isPlaying) {
    this.setState({playing:true})
  } else {
    this.setState({playing:false})
  }
  console.log(playbackStatus.durationMillis)
  return {duration : playbackStatus.durationMillis}
}
  openCamera  = async()=>{
   //ImagePicker.requestCameraPermissionsAsync()
const {uri, cancelled} = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
})
 if (!cancelled) {
      this.uploadImage(uri, this.state.taskID);
      console.log("Camera"+uri)
    }
  }
  selectPicture = async () => {
    const { uri, cancelled } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!cancelled) {
      this.uploadImage(uri, this.state.taskID);
      console.log(uri)
    }
  };
  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    var blob = await response.blob();
    console.log(blob);
    var ref = firebase
      .storage()
      .ref()
      .child('tasks' + imageName);
    ref.put(blob).then(() => {
      this.fetchImg(imageName);
    });
  };
  fetchImg = (imageName) => {
    console.log(imageName);
    var storageRef = firebase
      .storage()
      .ref()
      .child('tasks' + imageName);

    storageRef
      .getDownloadURL()
      .then((url) => {
    
        this.setState({ image: url });

      })
      .catch((error) => {
        console.error('My Error' + error);
        this.setState({ image: '#' });
      });
  };
  componentDidMount() {
    this.fetchImg(this.state.taskID);
    this.fetchSound();
   // this.sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
  }
  fetchSound=()=>{
  firebase.storage().ref().child('sound'+this.state.taskID).getDownloadURL().then(url=>{
      this.setState({soundURL:url})
      console.log(":"+this.state.soundURL)
      const {sound} = this
      sound.loadAsync({uri:url})
    })
  }
  playSound=async()=>{
    const {sound} = this;
    if(!this.state.paused)
    {
      sound.replayAsync()
    }
    else{
      sound.playAsync()
      
    }
   sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)

   this.setState({paused:false})


  }
  pauseSound=async()=>{
const {sound} = this;
sound.pauseAsync();
sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
this.setState({paused:true})
     }
  
  updateTaskStatus = () => {
    db.collection('users')
      .where('email', '==', this.state.userID)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({ workID: doc.data().workID });
          console.log(doc.data());
          var taskPath = 'tasks' + this.state.workID;
          db.collection(taskPath)
            .where('taskTitle', '==', this.state.title)
            .onSnapshot((snapshot2) =>
              snapshot2.forEach((doc2) => {
                console.log(doc2.id)
                db
                .collection(taskPath)
                .doc(doc2.id)
                .update({
                  submission:'submitted'
                });
                ToastAndroid.show('Submitted', ToastAndroid.SHORT);
    this.props.navigation.navigate('ManageScreen');
              })
            );
        });
      });

    
  };
  render() {

    return (
      <SafeAreaProvider>
        <AppHeader title="Task Details" navigation={this.props.navigation} showBackButton = {true} backScreenRoute = "ViewScreen"/>
        <SafeAreaView>
          <View style={{ alignItems: 'center' }}> 
            <Card>
              <Text>{this.state.title}</Text>
            </Card>
            <Card>
              <Text>Task Description:{this.state.desc}</Text>
            </Card>
            <Card>
              <Text>Deadline :{this.state.deadline}</Text>
            </Card>
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 40,
              justifyContent: 'center',
              border: 'solid',
              borderColor: 'grey',
              borderWidth: 1,
              width: '80%',
              height: 300,
              marginTop: 10,
            }}>{console.log(this.state.image)}
            {this.state.image == '#' ? (
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{ fontWeight: 'bold', color: 'grey', fontSize: 20 }}>
                  Upload Image of Task
                </Text>
                <Icon
                  type="font-awesome"
                  name="image"
                  onPress={() => {
                    this.selectPicture();
                  }}
                  raised
                />
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={{ uri: this.state.image }}
                  style={{ width: 200, height: 200 }}
                />
                <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                 <Icon
                  type="font-awesome"
                  name="image"
                  onPress={() => {
                    this.selectPicture();
                  }}
                  raised
                />
                <Icon name="camera" type="font-awesome"
                onPress = {()=>{
                  this.openCamera()
                }}
                raised /></View>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: 7,
              border:'solid',
              borderWidth:2,
              borderColor:'grey',
              width:270,
              alignSelf:'center',
              flexDirection:'row',
              justifyContent:'center',
              
              height:61
            }}>
             
                <Text style={{ fontWeight:'bold', fontSize:20}}>Extended description</Text>
              <Icon
              name={this.state.playing?"pause":"play"}
              type="font-awesome"
              color="#696969"
              rounded
              reverse
              onPress={() => {
                if(!this.state.playing)
         {  
          this.playSound();
        }
           else
           {
            this.pauseSound()
           }
                  
              }}
            /></View><View style={{alignItems:'center', marginTop:10}}>
            <TouchableOpacity
              onPress={() => {
                this.updateTaskStatus();
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>I have done the task.</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    width: 300,
    height: 40,
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
    elevation:8
  },
  buttonText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
