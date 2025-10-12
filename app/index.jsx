import { useActionSheet } from "@expo/react-native-action-sheet";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { db } from '../config/firebase.config';
// import news from "../globalContext/news.json";
export default function Index() {
  const { showActionSheetWithOptions } = useActionSheet();
  const [articles, setArticles] = useState([]);
  const [DangerSection, setDangerSection] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

//   useEffect(() => {
//   if (dangerData.length > 0) {
//     setDangerSection(true);
//   } else {
//     setDangerSection(false); // Also handle the case where the data might be cleared
//   }
// }, [dangerData]); // The dependency array

  // useEffect(() => {setArticles(news);}, []);

  const handleReport = () => {
    const options = ["Take Photo", "Upload from Gallery", "Cancel"];
    const cancelButtonIndex = 2;

    console.log("handleReport called");

    showActionSheetWithOptions(
      {
        containerStyle: {
          backgroundColor: "black",
          borderRadius: 30,
          borderWidth: 2,
          borderColor: "white",
          gap: 10,
          padding: 20,
          margin: 10,
        },
        textStyle: { color: "white" },
        options,
        cancelButtonIndex,
        title: "Create a Report",
        titleTextStyle: { color: "white", fontSize: 20, fontWeight: "bold" },
        message: "Choose how you want to add a photo",
        messageTextStyle: { color: "white" },
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          router.push("/camera");
        } else if (buttonIndex === 1) {
          console.log("Upload from Gallery tapped");
          router.push("/imagePicker");
        }
      }
    );
  };

  function color(type) {
    switch ((type ?? '').toLowerCase()) {
      case "critical":
        return "#ff443aa3"; // Red
      case "medium":
        return "#ffb700ff"; // Orange
      case "low":
        return "#32d74ba3"; // Green
      default:
        return "#8E8E93"; // Grey
    }
  }
  // Fetch news articles from NewsAPI

  useEffect(() => {
      const fetchNews = async () => {
        try {
          setLoading(true)
          
          const response = await fetch(
            `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.EXPO_PUBLIC_NEWS_API_KEY}`
          );
          const json = await response.json();
          setArticles(json.articles);
          setLoading(false)
        } catch (error) {
          console.error(error);
        }
      };

      fetchNews();
    }, []);


  useEffect(() => {
    // Reference to the 'reports' collection in Firestore
    const reportsRef = collection(db, 'reports');
    
    // Create a query to get all reports, ordered by timestamp (newest first)
    const q = query(reportsRef, orderBy("timestamp", "desc"));

    // Set up the real-time listener
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const fetchedReports = [];
        querySnapshot.forEach((doc) => {
          // Push the document data and its unique ID to our array
          fetchedReports.push({ id: doc.id, ...doc.data() });
        });
        console.log("Fetched reports: ", fetchedReports);
        setReports(fetchedReports);
        setLoading(false);
      }, 
      (error) => {
        console.error("Error fetching reports: ", error);
        setLoading(false);
      }
    );

    // This cleanup function runs when the screen is unmounted
    // It stops listening for updates to prevent memory leaks
    return () => unsubscribe();
  }, []); // The empty array ensures this effect runs only once

  // Show a loading indicator while fetching initial data
  if (loading) {
    return (
      <View style={{ flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'black',}}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={{ color: 'white', marginTop: 10 }}>Loading Reports...</Text>
      </View>
    );
  }




  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        color: "black",
      }}
    >
      <View style={{
        marginTop: 35,
        color: "black",
      }}/>
      <Text style={{ fontSize: 24, marginBottom: 20, color: "white" }}>
        Aether
      </Text>

      <TouchableOpacity
        onPress={handleReport}
        style={{
          width: 300,
          height: 50,
          backgroundColor: "lightblue",
          marginBottom: 10,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 40,
        }}
      >
        <Text style={{ fontSize: 18 }}>Report...</Text>
      </TouchableOpacity>
      {/* Danger Section */}
      {(reports.length>0)&&
      (
      <View style={{ flex: 1, padding: 2, width: "100%", backgroundColor: "black",  marginBottom:0 }}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 10,
            color: "white",
            fontWeight: "bold",
          }}
        >
          Dangers
        </Text>
        <FlatList
          data={reports}
          keyExtractor={(item, index) => index.toString()}
 ListFooterComponent={<View style={{ height: 0 }} />} 
  contentContainerStyle={{ paddingBottom: 0, marginBottom: 0 }} 
          renderItem={
            
            ({ item }) => 
              {
                 const imageUrl = item.images?.[0];
                 console.log(imageUrl);
                 console.log(item);
                return(
                  <TouchableOpacity onPress={() => {router.push({pathname:'/reportPage',params: { item: JSON.stringify(item) }}),console.log("item passed:",item)}}>

            <View
              style={{
                marginBottom: 5,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                gap: 10,
                backgroundColor: color(item.severity_level),
                padding: 10,
                borderRadius: 10,
                flexDirection: "row",
              
              }}
              >
              <View
                style={{
                  flex: 1,
                  gap: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "70%",
                }}
                >
                <Text
                  style={{ fontSize: 12, color: "white", fontWeight: "bold" }}
                  >
                  {item.damage_type??'No Type'}
                </Text>
                <Text
                  style={{ fontSize: 12, color: "white", fontWeight: "bold" }}
                  numberOfLines={2}
                  >
                  {item.human_readable_summary??'No Summary'}
                </Text>
                <Text
                  style={{ fontSize: 12, color: "white", fontWeight: "bold" }}
                  numberOfLines={2}
                  >
                  📍{item.location??'Location Unknown'}
                </Text>
                <Text
                  style={{ fontSize: 12, color: "white", fontWeight: "bold" }}
                  numberOfLines={2}
                  >
                  🕒{item.timestamp??'Time Unknown'}
                </Text>
              </View>
              <Image
                source={{uri:imageUrl}}
                style={{ width: "30%", height: 80, borderRadius: 10 }}
                contentFit="cover"
                cachePolicy="none"
                />
              <Text style={{ color: "lightgray" }}>{item.description}</Text>
            </View>
                </TouchableOpacity>
          )}}
        />
      </View>
      )}

      <View style={{ backgroundColor: "red", height:0 }} />

      {/* News Section */}
      <View style={{ flex: 1, padding: 20, backgroundColor: "black",marginTop:0 }}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 10,
            color: "white",
            fontWeight: "bold",
            marginTop: 0,
          }}
        >
          Latest News
        </Text>
        <FlatList
          data={articles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>router.push({pathname:"/newsPage", params: { news: JSON.stringify(item) }})}>

            <View
              style={{
                marginBottom: 15,
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text
                style={{ fontSize: 18, color: "white", fontWeight: "bold" }}
              >
                {item.title}
              </Text>
              <Image
                source={{ uri: item.urlToImage }}
                style={{ width: "100%", height: 200, borderRadius: 10 }}
                contentFit="cover"
              />
              <Text style={{ color: "lightgray" }}>{item.description}</Text>
            </View>
        </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
