import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import firebase from 'firebase';
import db from '../Configs';
import AppHeader from '../components/AppHeader';
import { Icon } from 'react-native-elements';
var tasks = [];
export default class ViewTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      workID: '',
      tasks: [],
    };
  }
  componentDidMount() {
    console.log('Hello');
    this.getUserData();
  }
  getUserData = () => {
    db.collection('users')
      .where('email', '==', this.state.userID)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({ workID: doc.data().workID });
          console.log(this.state.workID);

          db.collection('tasks' + this.state.workID)
            .where('eEmail', '==', this.state.userID)
            .where('submission','==','not submitted')
            .onSnapshot((snapshot) => {
              snapshot.forEach((doc) => {
                tasks = this.state.tasks;
                this.setState({ tasks: [...tasks, doc.data()] });
              });
            });
        });
      });
  };
  render() {
    return (
      <SafeAreaProvider>
        <AppHeader title="View Tasks" navigation ={this.props.navigation} showBackButton={true} backScreenRoute = "ManageScreen"/>
        <SafeAreaView>
          <View>
            <FlatList
              data={this.state.tasks}
              renderItem={({ item, index }) => (
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
                      {item.description.slice(0, 20)}...
                    </Text>
                    <View style={{ marginLeft: 70 }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: 'orange',
                          width: 100,
                          alignItems: 'center',
                         
                        }}
                        onPress={() => {
                          this.props.navigation.navigate('TaskDetailsScreen', {
                            desc: item.description,
                            title: item.taskTitle,
                            deadline: item.date,
                            taskID:item.taskID
                          });
                        }}>
                        <Text style={{ color: '#ffffff' }}>View Task</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
            <View style={{ alignItems: 'flex-start', marginTop: 500 }}>

            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({});
