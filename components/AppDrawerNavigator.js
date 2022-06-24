import { createDrawerNavigator } from 'react-navigation-drawer';
import Manage from '../screens/WorkplaceManage';
import CustomSideBarMenu from './CustomSideBarMenu';
import WorkInfo from '../screens/WorkplaceInfo';
import AssignTasks from '../screens/Assign.js';
import ViewTask from '../screens/ViewTask';
export const drawerNavig = createDrawerNavigator(
  {
    Home: {
      screen: Manage,
      navigationOptions: {
        drawerLabel: 'Manage Workplace',
      },
    },
    WorkplaceInfo: {
      screen: WorkInfo,
      navigationOptions: { 
        drawerLabel: 'Workplace Info',
      },
    },
  },
  {
    contentComponent: CustomSideBarMenu,
  }
);
