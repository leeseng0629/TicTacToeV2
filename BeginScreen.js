import React, { Component } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    View,
    FlatList,
    AppState
} from 'react-native';

export default class BeginScreen extends Component<Props> {
  static navigationOptions = { header: null,};
  render() {

    return (
      <View style={styles.container}>

      <Text style={styles.header}>TIC TAC TOE</Text>
      <Text style={styles.sub}>The simplest game on the world</Text>

      <View style={styles.buttonsty}>
      <TouchableHighlight underlayColor="white"
      onPress={() => {this.props.navigation.navigate('ChooseMode')}}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Start Game</Text>
      </View>
      </TouchableHighlight>
      </View>

      <Text style={styles.feedb}
      onPress={() => {this.props.navigation.navigate('FeedbackHome')}}>
      Send Us Feedback</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    alignItems: 'center'
  },
  header: {
    color: 'black',
    marginTop: 190,
    padding:  0,
    fontWeight: 'bold',
    fontSize: 50
  },
  sub: {
    marginTop: 20
  },
  buttonsty: {
    marginTop: 120,
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3'
  },
  button:{
    alignItems: 'center',
    width: 260
  },
  buttonText: {
    padding: 20,
    color: 'white'
  },
  feedb: {
    fontSize: 10,
    color: 'blue',
    textDecorationLine: 'underline',
    textAlignVertical: 'bottom',
  }
})
