import {
  createStackNavigator,
} from 'react-navigation';

import BeginScreen from './BeginScreen';
import ChooseModeScreen from './ChooseModeScreen'
import ChoosePlayerScreen from './ChoosePlayerScreen';
import GameScreen from './GameScreen';
import CreatePlayerScreen from './CreatePlayerScreen';

export default createStackNavigator({
  Begin: {
    screen: BeginScreen,
  },
  ChooseMode: {
    screen: ChooseModeScreen,
  },
  ChoosePlayer: {
    screen: ChoosePlayerScreen,
  },
  Game: {
    screen: GameScreen,
  },
  CreatePlayer: {
    screen: CreatePlayerScreen,
  },
}, {
  initialRouteName: 'Begin',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#a80000',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }
});
