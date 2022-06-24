import React from 'react'
import { DrawerItems } from 'react-navigation-drawer';
import { View, Text, TouchableOpacity, Image } from 'react-native'
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker'
import db from '../Configs'
export default class CustomSideBarMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      image: '#',
      name:''

    }
  }
  
  getUserName=()=>{
    db.collection('users').where('email','==',this.state.userID)
    .onSnapshot(
      snapshot=>{
        snapshot.forEach(doc=>{
          this.setState({name:doc.data().username})
        })
      }
    )
  }
  openCamera = async () => {
    //ImagePicker.requestCameraPermissionsAsync()
    const { uri, cancelled } = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    })
    if (!cancelled) {
      this.uploadImage(uri, this.state.userID);

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
      this.uploadImage(uri, this.state.userID);
    }
  };
  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child('profile' + imageName);
    ref.put(blob).then(() => {
      this.fetchImg(imageName);
    });
  };
  fetchImg = (imageName) => {
    
    var storageRef = firebase
      .storage()
      .ref()
      .child('profile' + imageName);

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
    this.fetchImg(this.state.userID)
    this.getUserName();
  }

  render() {
    return (
      <View style={{ flex: 0.7, marginTop: '10%', backgroundColor: 'white', flexDirection: 'column' }}>
        <DrawerItems {...this.props} />
        {this.state.image=='#'?(<View style={{alignItems:'center'}}>
          <Text style={{fontSize:30, fontWeight:'bold'}}>Upload Profile Picture</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Icon
            type="font-awesome"
            name="image"
            onPress={() => {
              this.selectPicture();
            }}
            raised
          />
          <Icon name="camera" type="font-awesome"
            onPress={() => {
              this.openCamera()
            }}
            raised /></View></View>):(<View style={{alignItems:'center'}}><Image
              source={{ uri: this.state.image }}
              style={{height:200, width:200}}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Icon
              type="font-awesome"
              name="image"
              onPress={() => {
                this.selectPicture();
              }}
              raised
            />
            <Icon name="camera" type="font-awesome"
              onPress={() => {
                this.openCamera()
              }}
              raised /></View>
              <Text style={{fontSize:30, fontWeight:'bold'}}>{this.state.name}</Text></View>
            )}
        
       
        <TouchableOpacity
          style={{
            backgroundColor: '#ff5c5c',
            alignItems: 'center',
            height: 30,
            justifyContent: 'center',


          }}
          onPress={() => {
            this.props.navigation.navigate('LoginScreen')
          }}
        >
          <Text style={{
            color: 'red',
            fontWeight: 'bold'

          }}>
            Log Out
          </Text>
        </TouchableOpacity>

      </View>
    )
  }
}