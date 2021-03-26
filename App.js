import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';
import SignupLoginScreen from './screens/SignupLoginScreen';
import { AppDrawerNavigator } from './components/AppDrawerNavigator';


export default function App() {
  return (
  	<SafeAreaProvider>
    	<AppContainer/>
    </SafeAreaProvider>
  );
}


const switchNavigator = createSwitchNavigator({
  SignupLoginScreen:{screen: SignupLoginScreen},
  Drawer:{screen: AppDrawerNavigator}
})

const AppContainer =  createAppContainer(switchNavigator);
