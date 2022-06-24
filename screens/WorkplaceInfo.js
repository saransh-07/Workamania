import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-elements';
import firebase from 'firebase';
import db from '../Configs';
import AppHeader from '../components/AppHeader.js';
export default class WorkInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerName: '',
      userEmail: firebase.auth().currentUser.email,
      workId: '',
      address: '',
      contact: '',
      name: '',
      department: '',
    };
  }
  componentDidMount() {
    this.getInfo();
  }
  getInfo = () => {
    db.collection('users')
      .where('email', '==', this.state.userEmail)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({ workId: doc.data().workID });
          db.collection('workplace' + this.state.workId)
            .where('dType', '==', 'ownerInfo')
            .onSnapshot((snapshot) => {
              snapshot.forEach((doc) => {
                this.setState({
                  ownerName: doc.data().eName,
                });
              });
            });
          db.collection('workplace' + this.state.workId)
            .where('dType', '==', 'Info')
            .onSnapshot((snapshot) => {
              snapshot.forEach((doc) => {
                this.setState({
                  address: doc.data().address,
                  contact: doc.data().contact,
                  department: doc.data().department,
                  name: doc.data().name,
                });
              });
            });
        });
      });
  };
  render() {
    return (
      <SafeAreaProvider>
      <AppHeader title='Workplace Info' navigation={this.props.navigation} />
        <SafeAreaView>
          <View>
            
            <Card>
              <Text>All Info</Text>
              <Card>
                <Text>Workplace ID : {this.state.workId}</Text>
              </Card>
              <Card>
                <Text>Owner Name : {this.state.ownerName}</Text>
              </Card>
              <Card>
                <Text>Address : {this.state.address}</Text>
              </Card>
              <Card>
                <Text>Name : {this.state.name}</Text>
              </Card>
              <Card>
                <Text>Contact : {this.state.contact}</Text>
              </Card>
              <Card>
                <Text>Type : {this.state.department}</Text>
              </Card>
            </Card>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}
