import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Header, Icon } from 'react-native-elements';

export default class AppHeader extends React.Component {
  render() {
    return (
      <Header
      containerStyle={styles.headerContainer}
      leftComponent={!this.props.showBackButton?<Icon name="bars" type="font-awesome" color="#696969" onPress={()=>{
        if(this.props.navigation!==undefined){
            this.props.navigation.toggleDrawer()
        }
      }}
      
      />:            
      <Icon
      name="arrow-left"
      type="font-awesome"
      color="#696969"
      onPress={() => {
        this.props.navigation.navigate(this.props.backScreenRoute);
      }}
    />}
      centerComponent={{text:this.props.title, style:styles.headerText}} 
      />
    )
  }
}  
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'grey',
    display:'flex',
    
  },
  headerText:{
    color:'#ffffff',
    fontWeight:'bold',
    fontSize:25,
    
  }
});
