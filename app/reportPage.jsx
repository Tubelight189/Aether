import { useLocalSearchParams } from "expo-router/build/hooks";
import { deleteDoc, doc } from 'firebase/firestore';
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from '../config/firebase.config';
import LeafletMap from "./map";

const ReportPage = () => {
 let { item } = useLocalSearchParams();
item = item ? JSON.parse(item) : null;

// console.log("Report item:", item.longitude);


const deleteReport = async (reportId) => {
  try {
    // 1. Create a reference to the document you want to delete
    const reportRef = doc(db, "reports", reportId);

    // 2. Call deleteDoc with the reference
    await deleteDoc(reportRef);

    console.log("Report deleted successfully!");
    // You can optionally show a success alert, but the item will disappear automatically
    // Alert.alert("Success", "The report has been deleted.");

  } catch (error) {
    console.error("Error deleting report: ", error);
    Alert.alert("Error", "Could not delete the report. Please try again.");
  }
};
  function color(type) {
    switch ((type ?? "").toLowerCase()) {
      case "critical":
        return "#ff443aa3"; // Red
      case "medium":
        return "#ff9f0aa3"; // Orange
      case "low":
        return "#32d74ba3"; // Green
      default:
        return "#8E8E93"; // Grey
    }
  }
   const handleDeletePress = () => {
    Alert.alert(
      "Delete Report", // Title
      "Are you sure you want to delete this report? This action cannot be undone.", // Message
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete",
          onPress: () => deleteReport(item.id), // Call the delete function if confirmed
          style: "destructive"
        }
      ]
    );
  };
// console.log(item.images)
  return (
    <ScrollView style={styles.container}>
         <View style={{
        marginTop: 55,
        color: "black",
      }}/>
      {/* Header Card */}
        <Text style={styles.title}>{item.damage_type ?? "No Type"}</Text>
     <View style={{ marginBottom: 20 }}>
  <FlatList
    data={item.images}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(_, index) => index.toString()}
    renderItem={({ item }) => (
      <Image
        source={{ uri: item }}
        style={{
          width: 270,
          height: 200,
          borderRadius: 10,
          marginRight: 10,
          backgroundColor: "#eee",
        }}
        resizeMode="cover"
        onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
      />
    )}
  />
</View>




      {/* Details Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Summary:</Text>
        <Text style={styles.content}>{item.human_readable_summary ?? "No Summary"}</Text>
      </View>


      <View style={styles.section}>
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.content}>{item.timestamp ?? "Time Unknown"}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Severity:</Text>
        <Text style={[styles.content,{color: color(item.severity_level)}]}>{item.severity_level ?? "Unknown"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.content}>{item.discription ?? "No Description"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Safety Protocol:</Text>
        <Text style={styles.content}>{item.safety_protocol ?? "No Description"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.content}>{item.location ?? "Location Unknown"}</Text>
      </View>

    <LeafletMap
          latitude={item.latitude}
          longitude={item.longitude}
        />

     <TouchableOpacity onPress={handleDeletePress} style={{ backgroundColor: '#32D74B', paddingVertical: 8,marginTop: -10, borderBottomLeftRadius: 12,borderBottomRightRadius: 12,alignItems: 'center',}}>
        <Text style={styles.deleteButtonText}>SOLVED</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReportPage;

const styles = StyleSheet.create({
  container: {
    paddingTop:1,
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  headerCard: {
    marginBottom: 20,
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom:20,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "lightgray",
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: "white",
    lineHeight: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
