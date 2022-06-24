import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import db from '../Configs';
import firebase from 'firebase';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import {Card, Icon} from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
export default class FeedbackDetails extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            taskID:props.navigation.getParam('taskID'),
            deadline:props.navigation.getParam('deadline'),
            title:props.navigation.getParam('title'),
            desc:props.navigation.getParam('desc'),
            remarks : props.navigation.getParam('remarks'),
            workID:'',
            userID: firebase.auth().currentUser.email,
            image:'#'
        }
    } openCamera  = async()=>{
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
       
         }
       };
       uploadImage = async (uri, imageName) => {
         const response = await fetch(uri);
         var blob = await response.blob();
 
         var ref = firebase
           .storage()
           .ref()
           .child('tasks' + imageName);
         ref.put(blob).then(() => {
           this.fetchImg(imageName);
         });
       };
       fetchImg = (imageName) => {
         
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
       }
       updateTaskStatus = () => {
         db.collection('users')
           .where('email', '==', this.state.userID)
           .onSnapshot((snapshot) => {
             snapshot.forEach((doc) => {
               this.setState({ workID: doc.data().workID });
               var taskPath = 'tasks' + this.state.workID;
               db.collection(taskPath)
                 .where('taskTitle', '==', this.state.title)
                 .onSnapshot((snapshot2) =>
                   snapshot2.forEach((doc2) => {
                    ToastAndroid.show('Submitted', ToastAndroid.SHORT);
                     db
                     .collection(taskPath)
                     .doc(doc2.id)
                     .update({
                       submission:'submitted'
                     });
                     
         this.props.navigation.navigate('ManageScreen');
                   })
                 );
             });
           });
     
         
       };
    render(){
        return(
            <SafeAreaProvider>
                <AppHeader title = "Feedback Details" navigation = {this.props.navigation} showBackButton = {true} backScreenRoute="FeedbackListScreen" />
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
            <Card>
                <Text style={{fontWeight:'bold'}}>Remarks:{this.state.remarks}</Text>
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
          <View style={{alignItems:'center'}}>
          <TouchableOpacity
              onPress={() => {
                this.updateTaskStatus();
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Re-submit</Text>
            </TouchableOpacity>
          </View>
         
                </SafeAreaView>
            </SafeAreaProvider>
        )
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
})