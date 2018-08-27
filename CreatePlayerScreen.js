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

let SQLite = require('react-native-sqlite-storage');

type Props = {};
export default class StoreScreen extends Component<Props> {
  static navigationOptions = {
    title: 'New Player',
  };

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      winRecord: '0',
    };

    this._insert = this._insert.bind(this);

    this.db=SQLite.openDatabase({
      name: 'playerdb',
      createFromLocation:'~playersdb.sqlite'
    },this.openDb,this.errorDb);
  }

  _insert() {
    this.db.transaction((tx) => {
      tx.executeSql('INSERT INTO players(name,winRecord) VALUES(?,?)', [
        this.state.name,
        this.state.winRecord,
      ]);
    });

     this.props.navigation.getParam('refresh')();
     this.props.navigation.goBack();
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <InputWithLabel style={styles.input}
          label={'Name'}
          value={this.state.name}
          onChangeText={(name) => {this.setState({name})}}
          orientation={'vertical'}
        />
        <AppButton style={styles.button}
          title={'Create'}
          theme={'primary'}
          onPress={this._insert}
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