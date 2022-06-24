import * as React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import db from '../Configs';
import firebase from 'firebase'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'
import AppHeader from '../components/AppHeader'
import {Icon} from 'react-native-elements'
var submitted = []
export default class SubmittedTasks extends React.Component{
  constructor(props){
    super(props)
    this.state={
      submitted : [], 
      userID : firebase.auth().currentUser.email,
      workID:''
    }
  }
  componentDidMount(){ 
    this.getSubmittedtasks()
  }
  getSubmittedtasks=()=>{
    db.collection('users')
    .where('email','==',this.state.userID)
    .onSnapshot(snapshot=>{
      snapshot.forEach(doc=>{
        this.setState({workID:doc.data().workID})
        db.collection('tasks'+this.state.workID)
        .where('submission','==','submitted')
        .where('status','==','incomplete')
        .onSnapshot(snapshot2=>{snapshot2.forEach(
          docu=>{
            
            submitted = this.state.submitted;
            this.setState({submitted:[...submitted,docu.data()]})
          }
        )})
      })
    })
  }
  render(){
    console.log(this.state.submitted)
    return(
      <SafeAreaProvider>
      <AppHeader title = "Submitted Tasks" navigation = {this.props.navigation} showBackButton = {true} backScreenRoute = "ManageScreen"/>
      <SafeAreaView>
      <View>
      <FlatList
      data = {this.state.submitted}
      renderItem = {({item,index})=>(
                <View
                  style={{
                    marginLeft: 10,
                    marginRight:10
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginLeft: 10,
                      marginTop: 10,
                    }}>
                    <Icon name="file" type="font-awesome" color="#696969" />
                    <Text
                      style={{
                        fontWeight: 'bold',
                        marginLeft: 10,
                        color: 'black',
                      }}>
                      {item.taskTitle}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginLeft: 10,
                    }}>
                    <Text
                      style={{
                        marginLeft: 10,
                        color: 'grey',
                      }}>
                      Assigned To : {item.eName}
                    </Text>
                    <View style={{ marginLeft: 70 }}>

                      <TouchableOpacity
                        style={{
                          backgroundColor: 'orange',
                          width: 100,
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          this.props.navigation.navigate('SubmissionDetailsScreen', {
                            desc: item.description,
                            title: item.taskTitle,
                            deadline: item.date,
                            eEmail:item.eEmail,
                            id:item.taskID
                          });
                        }}>
                        <Text style={{ color: '#ffffff' }}>View Task</Text>
                      </TouchableOpacity>
                      
                    </View>
                    
                  </View>
                  <View
                  style={{
                  marginTop:3,
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                  }}/>
                </View>
              )}
      />

      </View>
      </SafeAreaView>
      </SafeAreaProvider>
    )
  }
}