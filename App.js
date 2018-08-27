import {
  createStackNavigator,
} from 'react-navigation';

import BeginScreen from './BeginScreen';
import ChooseModeScreen from './ChooseModeScreen'
import ChoosePlayerScreen from './ChoosePlayerScreen';
import GameScreen from './GameScreen';
import CreatePlayerScreen from './CreatePlayerScreen';
import CreateFeedbackScreen from './CreateFeedbackScreen';
import FeedbackHomeScreen from './FeedbackHomeScreen';
import ViewFeedbackScreen from './ViewFeedbackScreen';

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
  FeedbackHome:{
    screen:FeedbackHomeScreen,
  },
  CreateFeedback:{
    screen: CreateFeedbackScreen,
  },
  ViewFeedback:{
    screen: ViewFeedbackScreen,
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
