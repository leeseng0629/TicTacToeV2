import React, { Component } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import {
  InputWithLabel,
  AppButton,
} from './UI';
import { FloatingAction } from 'react-native-floating-action';

const actions = [{
  text: 'Add',
  color: '#c80000',
  icon: require('./images/baseline_add_white_18dp.png'),
  name: 'add',
  position: 1
}];

let SQLite = require('react-native-sqlite-storage');

type Props = {};
export default class IndexScreen extends Component<Props> {
  static navigationOptions = {
    title: 'Players',
  };
  constructor(props) {
    super(props)

    this.state = {
      players: [],
      readyPlayers: [],
      gameMode: this.props.navigation.getParam('gameMode'),
      deleteMode: false,
      isFetching: false,
      isModalVisible : false,
    };
    this._query = this._query.bind(this);

    this.db=SQLite.openDatabase({
      name: 'playersdb',
      createFromLocation:'~playersdb.sqlite'
    },this.openDb,this.errorDb);
  }

  componentDidMount() {
    this._query();
  }

  _query() {
    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM players ORDER BY id', [], (tx, results) => {
        this.setState({
          players: results.rows.raw(),
        })
      })
    });
  }

  openDb() {
    console.log('Database opened');
  }

  errorDb(err) {
    console.log('SQL Error: ' + err);
  }

  showStartButton()
  {
       if(this.state.isModalVisible==false){
          this.setState({isModalVisible:true});
       }
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.players}
          showsVerticalScrollIndicator={true}
          refreshing={this.state.isFetching}
          onRefresh={this._query}
          renderItem={({item}) =>
            <TouchableHighlight
              underlayColor={'#cccccc'}
              onPress={(readyPlayers) => {
                this.setState({player:item})
                if(this.state.gameMode==1 && this.state.deleteMode==false){
                  Alert.alert(item.name+' ready to challege')
                  this.setState({readyPlayers:this.state.readyPlayers.concat([item])});
                  this.showStartButton()
                }
                else if(this.state.gameMode==2 && this.state.deleteMode==false){
                  if(this.state.readyPlayers.length!=2)  {
                    this.setState({readyPlayers:this.state.readyPlayers.concat([item])});
                  }
                  if(this.state.readyPlayers.length==0){
                    Alert.alert('First Player is '+item.name);
                  }else if(this.state.readyPlayers.length==1){
                    Alert.alert('Second Player is '+item.name);
                  }
                }
                else if(this.state.deleteMode==true) {
                  this._delete(item.id);
                  this.setState({
                    deleteMode: false,
                  });
                }
                if(this.state.gameMode==2 && this.state.readyPlayers.length >= 1){
                  this.showStartButton()
                }
              }}
            >
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>Win Record:{item.winRecord}</Text>
              </View>
            </TouchableHighlight>
          }
          keyExtractor={(item) => {item.id.toString()}}
        />
        {(this.state.isModalVisible) && <AppButton style={styles.button}
          title={'Start Game'}
          theme={'primary'}
          onPress={(readyPlayers) => {
              if(this.state.gameMode==1){
                this.props.navigation.navigate('Game', {
                  players:this.state.readyPlayers,
                  gameMode: this.state.gameMode,
                  refresh: this._query,
                })
              }
             else if(this.state.gameMode==2 && this.state.readyPlayers.length==2){
                this.props.navigation.navigate('Game', {
                players:this.state.readyPlayers,
                gameMode: this.state.gameMode,
                refresh: this._query,
              })
            }
          }}
        />}
        <FloatingAction
          actions={actions}
          color={'#a80000'}
          floatingIcon={(
            <Image
              source={require('./images/baseline_edit_white_18dp.png')}
            />
          )}
          onPressItem={(name) => {
              switch(name) {
                case 'add':
                  this.props.navigation.navigate('CreatePlayer', {
                    refresh: this._query,
                  });
                  break;
              }
            }
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },

  item: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },

  itemTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
  },

  itemSubtitle: {
    fontSize: 18,
  },

  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});
