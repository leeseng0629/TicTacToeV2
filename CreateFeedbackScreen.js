import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {
  InputWithLabel,
  PickerWithLabel,
  AppButton,
} from './UI';
import { Rating } from 'react-native-elements';

let config = require('./Config');

type Props = {};
export default class StoreScreen extends Component<Props> {
  static navigationOptions = {
    title: 'Add Feedback',
  };

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      message: '',
      rate: '3',
    };
    this._store = this._store.bind(this);
  }

  _store() {
    let url = config.settings.serverPath + '/api/feedbacks';

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        message: this.state.message,
        rate: this.state.rate,
      }),
    })
    .then((response) => {
      if(!response.ok) {
        Alert.alert('Error', response.status.toString());
        throw Error('Error ' + response.status);
      }

      return response.json()
    })
    .then((responseJson) => {
      if(responseJson.affected > 0) {
        Alert.alert('Thanks for your feeback');
      }
      else {
        Alert.alert('Error saving record');
      }

      this.props.navigation.getParam('refresh')();
      this.props.navigation.goBack();
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <InputWithLabel style={styles.input}
          label={'Email'}
          value={this.state.email}
          onChangeText={(email) => {this.setState({email})}}
          keyboardType={'email-address'}
          orientation={'vertical'}
        />
        <InputWithLabel style={[styles.input, {height: 140, textAlignVertical: 'top'}]}
          label={'Message'}
          value={this.state.message}
          onChangeText={(message) => {this.setState({message})}}
          orientation={'vertical'}
          multiline={true}
        />
        <View style={{alignItems:'center'}}>
        <Rating
            showRating
            onFinishRating={(itemValue, itemIndex) => {
                this.setState({rate: itemValue})
                }}
            style={{ paddingVertical: 20}}
            startingValue={this.state.rate}
        />
        </View>
        <AppButton style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={
              this._store
            }
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 16,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  picker: {
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 50,
  },
});
