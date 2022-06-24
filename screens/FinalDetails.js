import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import db from '../Configs';
import firebase from 'firebase';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import {Card, Icon} from 'react-native-elements'
import { Rating, AirbnbRating } from 'react-native-elements';
export default class FinalDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        deadline: props.navigation.getParam('deadline'),
        desc: props.navigation.getParam('desc'),
        title: props.navigation.getParam('title'),
        taskID : props.navigation.getParam('id'),
        image: '#',
        workID: '',
        remarks: props.navigation.getParam('remarks'),
        userID: firebase.auth().currentUser.email,
        rating:props.navigation.getParam('rating')
      };
    }
  
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
    }

    render() {
  
      return (
        <SafeAreaProvider>
          <AppHeader title="Task Details" navigation={this.props.navigation} showBackButton = {true} backScreenRoute = "CompletedTaskScreen"/>
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
                <Text>Remarks :{this.state.remarks}</Text>
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
                        No Image Found
                  </Text>
                  <Icon
                    type="font-awesome"
                    name="image"
                    raised
                  />
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={{ uri: this.state.image }}
                    style={{ width: 200, height: 200 }}
                  />
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 5,
              }}>
            
            <Rating
              type='star'
              ratingCount={5}
              defaultRating = {this.state.rating}
              imageSize={60}
              readonly
              showRating
              onFinishRating={this.ratingCompleted}
            />
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
  