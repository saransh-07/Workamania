import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import db from '../Configs';
import firebase from 'firebase';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import {Card, Icon} from 'react-native-elements'

export default class CompletedTasks extends React.Component
{
    constructor(){
        super();
        this.state = {
            userID : firebase.auth().currentUser.email,
            workID : '',
            completedTasks:[]
        }
    }
    componentDidMount(){
        this.getTasks()
    }
    getTasks=()=>{
        db.collection('users').where('email','==',this.state.userID).onSnapshot(
            snapshot=>{
                snapshot.forEach(doc=>{
                    this.setState({workID:doc.data().workID})
                    db.collection('tasks'+this.state.workID).where('status','==','complete')
                    .onSnapshot(snapshot2=>{
                        const {completedTasks} = this.state;
                        snapshot2.forEach(doc2=>{
                            completedTasks.push(doc2.data());
                        })
                        this.setState({completedTasks:completedTasks})
                    })
                })
            }
        )
    }
    render(){
        return(
            <SafeAreaProvider>
                <AppHeader title = "Completed Tasks" navigation = {this.props.navigation} showBackButton = {true} backScreenRoute = "ManageScreen"/>
                <SafeAreaView>
                    <View>
                    <FlatList
                    data  = {this.state.completedTasks}
                    renderItem = {({item, index})=>(
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
                          this.props.navigation.navigate('FinalDetails', {
                            desc: item.description,
                            title: item.taskTitle,
                            deadline: item.date,
                            id:item.taskID,
                            remarks:item.remarks,
                            rating:item.rating
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