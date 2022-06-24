import React from 'react' 
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import db from '../Configs'
import AppHeader from '../components/AppHeader';
import firebase from 'firebase'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {Icon} from 'react-native-elements'
export default class FeedbackTasks extends React.Component{
    constructor(){
        super();
        this.state = {
            userId : firebase.auth().currentUser.email,
            workID:'',
            tasksWithFeedback:[]

        }
    }
    componentDidMount(){
        this.getTasks()
        
    }

    getTasks=()=>{
        db.collection('users')
        .where('email', '==', this.state.userId)
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            this.setState({ workID: doc.data().workID });
            db.collection('tasks'+this.state.workID).where('eEmail','==',this.state.userId).onSnapshot(
                snapshot=>{
                    const {tasksWithFeedback} = this.state;
                    snapshot.forEach(doc=>{
                        
                        if(doc.data().remarks!=undefined && doc.data().submission!='submitted'){
                            tasksWithFeedback.push(doc.data())
                        }
                    })
                    this.setState({tasksWithFeedback:tasksWithFeedback})
                   
                }
            )
          })

    })
    }
    render(){
        console.log(this.state.tasksWithFeedback)

        return(
<SafeAreaProvider>
<AppHeader title = "Feedback Received" navigation = {this.props.navigation} showBackButton = {true} backScreenRoute="ManageScreen" />
            <SafeAreaView>
                
                <View>
                    <FlatList
                    data = {this.state.tasksWithFeedback}
                    renderItem ={({item, index})=>(
                        <View
                        style={{
                          borderWidth: 2,
                          borderRadius: 5,
                          borderColor: 'grey',
                          marginLeft: 10,
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
                            {item.remarks.slice(0, 20)}...
                          </Text>
                          <View style={{ marginLeft: 70 }}>
                            <TouchableOpacity
                              style={{
                                backgroundColor: 'orange',
                                width: 100,
                                alignItems: 'center',
                               
                              }}
                              onPress={() => {
                                this.props.navigation.navigate('ViewFeedback', {
                                  desc: item.description,
                                  title: item.taskTitle,
                                  deadline: item.date,
                                  taskID:item.taskID,
                                  remarks:item.remarks
                                });
                              }}>
                              <Text style={{ color: '#ffffff' }}>View Task</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                    />
                </View>
            </SafeAreaView>
</SafeAreaProvider>
        )
        }
}