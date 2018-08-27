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
},{
  text: 'Delete',
  color: '#c80000',
  icon: require('./images/baseline_delete_white_18dp.png'),
  name: 'delete',
  position: 2
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
      player:null,
      players: [],
      readyPlayers: [],
      gameMode: this.props.navigation.getParam('gameMode'),
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

  _delete() {
    Alert.alert('Confirm Deletion', 'Delete `'+ this.state.player.name +'`?', [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
          this.db.transaction((tx) => {
            tx.executeSql('DELETE FROM players WHERE id = ?', [this.state.player.id])
          });

           this.props.navigation.goBack();
        },
      },
    ], { cancelable: false });
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
                if(this.state.gameMode==1){
                  Alert.alert(item.name+' ready to challege')
                  this.setState({readyPlayers:this.state.readyPlayers.concat([item])});
                  this.showStartButton()
                }
                else if(this.state.gameMode==2){
                  if(this.state.readyPlayers.length!=2)  {
                    this.setState({readyPlayers:this.state.readyPlayers.concat([item])});
                  }
                  if(this.state.readyPlayers.length==0){
                    Alert.alert('First Player is '+item.name);
                  }else if(this.state.readyPlayers.length==1){
                    Alert.alert('Second Player is '+item.name);
                  }
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
                    indexRefresh: this.props.navigation.getParam('refresh'),
                  });
                  break;

                case 'delete':
                  if(this.state.player==null){
                    Alert.alert('Please select the player that you wish to remove it')
                  }
                  else{
                  this._delete();
                  }
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
