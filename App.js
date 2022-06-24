import * as React from 'react'
import Login from './screens/Login';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import InitWorkplace from './screens/WorkplaceInit';
import Add from './screens/Add';
import Join from './screens/Join';
import Manage from './screens/WorkplaceManage';
import { registerRootComponent } from 'expo';
import WorkInfo from './screens/WorkplaceInfo';
import { createStackNavigator } from 'react-navigation-stack';
import AssignTasks from './screens/Assign';
import ViewTask from './screens/ViewTask';
import { drawerNavig } from './components/AppDrawerNavigator';
import TaskDetails from './screens/TaskDetails';
import SubmittedTasks from './screens/SubmittedTasks'
import ViewSubmitted from './screens/ViewSubmitted'
import FeedbackTasks from './screens/FeedbackTasks';
import FeedbackDetails from './screens/FeedbackDetails';
import FinalDetails  from './screens/FinalDetails';
import CompletedTasks from './screens/CompletedTasks';
export default class App extends React.Component {
  render() {
    return <AppContainer/>;
  }
}
const ManageNavigator = createSwitchNavigator({
  ManageScreen: { screen: Manage },
  WorkplaceInfo: { screen: WorkInfo },
  AssignScreen: { screen: AssignTasks },
  SubmittedScreen:{screen : SubmittedTasks},
  ViewScreen: { screen: ViewTask },
  Drawer: { screen: drawerNavig },
  TaskDetailsScreen: { screen: TaskDetails },
  SubmissionDetailsScreen:{screen:ViewSubmitted},
  FeedbackListScreen:{screen:FeedbackTasks},
  ViewFeedback:{screen:FeedbackDetails},
  CompletedTaskScreen:{screen:CompletedTasks},
  FinalDetails:{screen:FinalDetails}
});
const LoginNavigator = createSwitchNavigator({
  LoginScreen: { screen: Login },
  WorkInit: { screen: InitWorkplace },
  AddScreen: { screen: Add },
  JoinScreen: { screen: Join }, 
  Manage: { screen: ManageNavigator },

});

const AppContainer = createAppContainer(LoginNavigator);
registerRootComponent(App);