import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {
  InputWithLabel
} from './UI';
import { Rating } from 'react-native-elements';

let config = require('./Config');

type Props = {};
export default class ShowScreen extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('headerTitle')
    };
  };

  constructor(props) {
    super(props)

    this.state = {
      id: this.props.navigation.getParam('id'),
      feedback: null,
    };

    this._load = this._load.bind(this);
  }

  componentDidMount() {
    this._load();
  }

  _load() {
    let url = config.settings.serverPath + '/api/feedbacks/' + this.state.id;

    fetch(url)
    .then((response) => {
      if(!response.ok) {
        Alert.alert('Error', response.status.toString());
        throw Error('Error ' + response.status);
      }

      return response.json()
    })
    .then((feedback) => {
      this.setState({feedback});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    let feedback = this.state.feedback;
    return (
      <View style={styles.container}>
        <ScrollView>
          <InputWithLabel style={styles.output}
            label={'Email'}
            value={feedback ? feedback.email : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel style={[styles.output, {height: 400, textAlignVertical: 'top'}]}
            label={'Message'}
            value={feedback ? feedback.message : ''}
            orientation={'vertical'}
            editable={false}
            multiline={true}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  output: {
    fontSize: 24,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
});
