import { useLocalSearchParams } from "expo-router";
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import {  } from "react-native-web";

export default function NewsDetailsPage() {
  const { news } = useLocalSearchParams(); 
  let item = null;
try {
  item = news ? JSON.parse(news) : null;
} catch (error) {
  console.error("Error parsing news param:", error);
}

console.log(process.env.EXPO_PUBLIC_FIREBASE_API_KEY)

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "black", padding: 16,paddingTop:1 }}>
      <View style={{marginTop:35,backgroundColor:"black"}}/>
      {/* Title */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10,color:"white" }}>
        {item?.title}
      </Text>

      {/* Author + Date */}
      <Text style={{ fontSize: 14, color: "gray", marginBottom: 4 }}>
        By {item?.author ?? "Unknown Author"}
      </Text>
      <Text style={{ fontSize: 12, color: "gray", marginBottom: 12 }}>
        {new Date(item?.publishedAt).toLocaleString()}
      </Text>

      {/* Image */}
      {item?.urlToImage ? (
        <Image
          source={{ uri: item?.urlToImage }}
          style={{
            width: "100%",
            height: 220,
            borderRadius: 12,
            marginBottom: 16,
          }}
          resizeMode="cover"
        />
      ) : null}

      {/* Description */}
      <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 16,color:"white" }}>
        {item?.description ?? "No description available."}
      </Text>

      {/* Content Preview */}
      <Text style={{ fontSize: 14, lineHeight: 22, color: "#444" }}>
        {item?.content?.replace(/\[\+\d+ chars\]/g, "")}
      </Text>

      {/* Source Link */}
      <TouchableOpacity
        onPress={() => Linking.openURL(item.url)}
        style={{
          marginTop: 20,
          backgroundColor: "#0077cc",
          padding: 12,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
          Read Full Article on {item?.source?.name ?? "Source"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
