import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {
    Alert,
    FlatList,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// 1. The Data List (Edit numbers here)
const helplineData = [
  { id: '1', title: 'National Emergency', number: '112', icon: 'alert-octagon', library: 'MaterialCommunityIcons', color: '#FF3B30' },
  { id: '2', title: 'Police', number: '100', icon: 'local-police', library: 'MaterialIcons', color: '#007AFF' },
  { id: '3', title: 'Fire Brigade', number: '101', icon: 'fire-truck', library: 'MaterialCommunityIcons', color: '#FF9500' },
  { id: '4', title: 'Ambulance', number: '102', icon: 'ambulance', library: 'FontAwesome5', color: '#34C759' },
  { id: '5', title: 'Women Helpline (UP)', number: '1090', icon: 'human-female-girl', library: 'MaterialCommunityIcons', color: '#FF2D55' },
  { id: '6', title: 'Cyber Crime', number: '1930', icon: 'security', library: 'MaterialIcons', color: '#5856D6' },
  { id: '7', title: 'Disaster Management', number: '108', icon: 'warning', library: 'MaterialIcons', color: '#AF52DE' },
];

export default function HelplineScreen() {

  // 2. Function to handle dialing
  const handleCall = (number) => {
    const phoneNumber = `tel:${number}`;
    
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', 'Phone dialing is not supported on this device');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  // 3. Helper to render the correct icon library
  const renderIcon = (item) => {
    if (item.library === 'MaterialIcons') return <MaterialIcons name={item.icon} size={28} color={item.color} />;
    if (item.library === 'FontAwesome5') return <FontAwesome5 name={item.icon} size={24} color={item.color} />;
    if (item.library === 'MaterialCommunityIcons') return <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />;
    return <MaterialIcons name="phone" size={24} color="white" />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Emergency Helplines</Text>
      <Text style={styles.subHeader}>Tap a number to dial immediately</Text>

      <FlatList
        data={helplineData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={() => handleCall(item.number)}
          >
            {/* Icon Section */}
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
              {renderIcon(item)}
            </View>

            {/* Text Section */}
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardNumber}>{item.number}</Text>
            </View>

            {/* Call Button Visual */}
            <View style={styles.callAction}>
              <MaterialIcons name="phone-forwarded" size={24} color="#4CD964" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Keeping your dark theme
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 20,
  },
  listContent: {
    gap: 15,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E', // Slightly lighter than black for contrast
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cardNumber: {
    color: '#A1A1A1',
    fontSize: 14,
    marginTop: 2,
  },
  callAction: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 30,
  }
});