import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import db from '../Configs';
import AppHeader from '../components/AppHeader'
export default class InitWorkplace extends React.Component {

 addWorkplace=()=>{
   this.props.navigation.navigate('AddScreen')
 }
 joinWorkplace=()=>{
   this.props.navigation.navigate('JoinScreen')
 }
 
  render() {
    return (
      <SafeAreaProvider>
      <AppHeader title="Initialise Workplace"/>
        <SafeAreaView>
          <View style={styles.containerView}>
            
            <TouchableOpacity style={styles.button} 
            
            onPress={()=>{this.addWorkplace()}}
            >
              <Text style={styles.buttonText}>+Add Workplace</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
            onPress={()=>{this.joinWorkplace()}}
            >
              <Text style={styles.buttonText}>Join Workplace</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}
const styles = StyleSheet.create({
  containerView: {
    alignItems: 'center',
  },

  button: {
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    border: 'dashed',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: 'grey',
    borderLeftColor: 'grey',
    borderRightColor: 'grey',
    borderTopColor: 'grey',
    borderRadius: 9,
    marginTop: 20,
  },
  buttonText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 5 * 4,
  },
});
