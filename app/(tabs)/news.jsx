import { useActionSheet } from "@expo/react-native-action-sheet";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
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
        padding: 10,
        paddingTop:15
      }}
    >
      <View style={{
        marginTop: 35,
        color: "black",
      }}/>
      <Text style={{ fontSize: 24, marginBottom: 20, color: "white" }}>
        Aether
      </Text>
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

  );
}
