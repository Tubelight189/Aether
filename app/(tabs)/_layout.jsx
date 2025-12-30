import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Tabs } from "expo-router";
export default function RootLayout() {
    return (
    <Tabs screenOptions={{headerShown:false,color:"black",tabBarStyle:{backgroundColor:"black"},tabBarActiveTintColor:"white",tabBarInactiveTintColor:"gray",  tabBarActiveBackgroundColor: "gray",}}>
        <Tabs.Screen name="index"options={{href: null, }}/> // 👈 THIS hides it from tab bar
        <Tabs.Screen  name="danger"  options={{title:"Danger",tabBarIcon:()=><MaterialCommunityIcons name="sign-caution" size={24} color="red" /> , headerShown: false }}/>
        <Tabs.Screen  name="news"  options={{title:"News",tabBarIcon:()=><MaterialCommunityIcons name="newspaper-variant" size={24} color="green" />, headerShown: false }}/>
        <Tabs.Screen  name="help"  options={{title:"Help",tabBarIcon:()=><SimpleLineIcons name="call-out" size={24} color="orange" /> , headerShown: false }}/>
        
    </Tabs>
    );
}