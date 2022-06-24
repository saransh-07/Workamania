import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import firebase from 'firebase';
import db from '../Configs';
import AppHeader from '../components/AppHeader'
import {Icon, Card} from 'react-native-elements'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Rating, AirbnbRating } from 'react-native-elements';
import {Audio} from 'expo-av';
export default class ViewSubmitted extends React.Component{
  constructor(props){
    super(props);
    this.state={
      title:this.props.navigation.getParam('title'),
      desc:this.props.navigation.getParam('desc'),
      deadline:this.props.navigation.getParam('deadline'),
      eEmail:this.props.navigation.getParam('eEmail'),
      ID:this.props.navigation.getParam('id'),
      image:'',
      workID:'',
      taskDocID:'',
      remark:'',
      openPicker:false,
      date:new Date(),
      rating:''
    }
  }
  componentDidMount(){
this.getImage()
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
  getImage=()=>{
    firebase.storage().ref().child('tasks'+this.state.ID).getDownloadURL().then(url=>{this.setState({image:url})})
  }
  updateTaskRemarks=()=>{
     db.collection('users').where('email','==',this.state.eEmail)
 .onSnapshot(snapshot=>
 snapshot.forEach(doc=>{
   this.setState({workID:doc.data().workID})
   db.collection('tasks'+this.state.workID)
   .where('taskID','==',this.state.ID)
   .onSnapshot(
     snapshot2=>snapshot2.forEach(
       docu=>{
         this.setState({taskDocID:docu.id})
         db.collection('tasks'+this.state.workID).doc(this.state.taskDocID).update({
           remarks:this.state.remark,
           submission:'not submitted',
           date:this.state.deadline,
           rating:this.state.rating
         })
         this.props.navigation.navigate('SubmittedScreen')
       }
     )
   )
 }))
  }
  updateTaskStatus=()=>{
 db.collection('users').where('email','==',this.state.eEmail)
 .onSnapshot(snapshot=>
 snapshot.forEach(doc=>{
   this.setState({workID:doc.data().workID})
   db.collection('tasks'+this.state.workID)
   .where('taskID','==',this.state.ID)
   .onSnapshot(
     snapshot2=>snapshot2.forEach(
       docu=>{
         this.setState({taskDocID:docu.id})
         db.collection('tasks'+this.state.workID).doc(this.state.taskDocID).update({
           status:'complete',
           rating:this.state.rating
         })
         this.props.navigation.navigate('SubmittedScreen')
       }
     )
   )
 }))
  }

  render(){
    return(
      <SafeAreaProvider>
      <AppHeader title="Submission Details" navigation = {this.props.navigation} showBackButton = {true} backScreenRoute="SubmittedScreen"/>
      <SafeAreaView>
        <ScrollView>
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
            <TouchableOpacity style={styles.button} onPress = {()=>{
              this.setState({openPicker:true})}}>
                  <Text style={styles.buttonText}>Update Deadline</Text>
            </TouchableOpacity>
            <DateTimePickerModal
        isVisible={this.state.openPicker}
        mode="date"
        date = {this.state.date}
        onConfirm={(date)=>{
         
          this.setState({openPicker:false})
          var formatted = this.formatDate(date)
          this.setState({date:date})
          this.setState({deadline:formatted})

        }}
        onCancel={()=>{this.setState({openPicker:false})}}
      />
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
           
            <Image
                  source={{ uri: this.state.image }}
                  style={{ width: 200, height: 200 }}
                />
          </View>
           <TextInput
            onChangeText = {text=>{
              this.setState({remark:text})
            }}
            placeholder = "Remarks"
            style={{
              height:40,
              paddingLeft:6,
              underlineColorAndroid: "skyblue",
              marginTop:20,
              borderBottomWidth:2,
              marginLeft:30,
              width:300
            }}
            />
          <View
            style={{
              marginTop: 5,
              alignItems:'center'
            }}>

            <TouchableOpacity
              onPress={() => {
                this.updateTaskStatus();
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Mark As Complete</Text>
            </TouchableOpacity>
             <TouchableOpacity
              onPress={() => {
                this.updateTaskRemarks();
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Submit Remarks</Text>
            </TouchableOpacity>
       
            <Rating
              type='star'
              ratingCount={5}
              imageSize={30}
              fractions={1}
              showRating
              onFinishRating={(rating)=>{
                this.setState({rating:rating})
              }}
            />
            <View style={{height:100}}/>
          </View>
          </ScrollView>
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
   marginTop:10,
  },
  buttonText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 16,
  },
});