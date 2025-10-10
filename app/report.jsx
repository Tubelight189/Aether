import { useActionSheet } from "@expo/react-native-action-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { auth, db } from '../config/firebase.config'; // Adjust path to your config
import { usePhotoStore } from "../store/photoStore";

export default function ReportScreen() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { photoUri, newPhotoUri } = useLocalSearchParams();
  const [fetchLocation, setFetchLocation] = useState("Location...");
  const [location, setLocation] = useState(null);
  const [confirmedLocation, setConfirmedLocation] = useState("");
  const [time, setTime] = useState("");
  const [check, setCheck] = useState("");
  const [locationIcon, setLocationIcon] = useState(true);
  const [description, setDescription] = useState("");
  const [error, setError] = useState();
  const [images, setImages] = useState([]);
  const router = useRouter();
  const { photos, setInitialPhoto, addPhoto, clearPhotos } = usePhotoStore();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [parsedAnalysisResult, setParsedAnalysisResult] = useState(null);
  const [manualLocation, setManualLocation] = useState("");


  useEffect(() => {
    // This runs ONCE to set the very first photo
    setInitialPhoto(photoUri);
  }, []); // Empty array means it only runs on the first render

  useEffect(() => {
    // This runs ONLY when a new photo comes from the camera
    if (newPhotoUri && !photos.includes(newPhotoUri)) {
      addPhoto(newPhotoUri);
    }
  }, [newPhotoUri]);

  const handleReport = () => {
    const options = ["Take Photo", "Upload from Gallery", "Cancel"];
    const cancelButtonIndex = 2;


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
          router.push("/camera2");
        } else if (buttonIndex === 1) {
          router.push("/imagePicker");
        }
      }
    );
  };

  async function fetchAddress(location) {
    const options = {
      method: "GET",
      url: "https://trueway-geocoding.p.rapidapi.com/ReverseGeocode",
      params: {
        location: `${location?.coords?.latitude},${location?.coords?.longitude}`,
        language: "in",
      },
      headers: {
        "x-rapidapi-key": process.env.EXPO_PUBLIC_GEO_API_KEY,
        "x-rapidapi-host": "trueway-geocoding.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setLocationIcon(false);
      setCheck(true);
      setFetchLocation(response.data.results[0].address);
    } catch (error) {
    }
  }

  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    fetchAddress(location);
    setFetchLocation(
      `Lat: ${location.coords.latitude.toFixed(
        2
      )}, Lon: ${location.coords.longitude.toFixed(2)}`
    );
    setTime(new Date(location?.timestamp).toString());
  }

 const analyzeWithGemini = async (photosToAnalyze, userDescription) => {
  const genAI = new GoogleGenerativeAI(
    process.env.EXPO_PUBLIC_GEMINI_API_KEY
  );
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const imageParts = await Promise.all(
    photosToAnalyze.map(async (uri) => {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });
      return { inlineData: { data: base64, mimeType: "image/jpeg" } };
    })
  );

  const prompt = `Analyze the attached image(s) and the user's description. The user described the issue as: "${userDescription}".
    You are an AI assistant for disaster response. Analyze this image of potential infrastructure damage and classify the primary hazard. Respond ONLY with a JSON object.

Choose the single most accurate 'damage_type' from this list: ['Fallen Tree on Road', 'Localized Road Flooding', 'Structural Crack on Building', 'Active Fire', 'Downed Power Line', 'Road-blocking Debris/Landslide', 'Major Vehicular Accident', 'Other'].

Your JSON response must contain these four keys:
1. 'damage_type': Your chosen category from the list above.
2. 'severity_level': Your assessment of the severity ('Low', 'Medium', 'Critical').
3. 'human_readable_summary': A one-sentence description of what you see.
4. 'safety_protocol': A brief, point safety protocol for civilians encountering this hazard.
5. 'location': ${confirmedLocation || "Not Provided"}.
6. 'timestamp': ${time || "Not Provided"}.
7. 'discription': A description of what you see.
`;

  const result = await model.generateContent([
    ...imageParts,
    { text: prompt },
  ]);
  const responseText = result.response.text();

  let parsedGeminiResponse;
  try {
    if (typeof responseText === "string") {
      const cleanedJsonString = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsedGeminiResponse = JSON.parse(cleanedJsonString);
    } else if (typeof responseText === "object" && responseText !== null) {
      parsedGeminiResponse = responseText;
    } else {
      throw new Error("Gemini response is not a string or object");
    }
  } catch (e) {
    Alert.alert("AI Response Error", "Gemini returned invalid JSON. Please try again.");
    throw new Error("Invalid JSON from Gemini.");
  }

  return {
    ...parsedGeminiResponse,
    latitude: location?.coords?.latitude,
    longitude: location?.coords?.longitude,
    images: photosToAnalyze.map((p) => p.uri || p),
  };
};

const handleAnalyze = async () => {
  if (photos.length === 0 || !description || !location) {
    Alert.alert(
      "Missing Info",
      "Please add a photo, description, and fetch your location before analyzing."
    );
    return;
  }

  setLoading(true);
  setLoadingMessage("Analyzing with AI...");

  try {
    const reportObject = await analyzeWithGemini(photos, description);

    if (!reportObject || reportObject.error) {
      throw new Error("Failed to get valid report object from AI analysis.");
    }

    setParsedAnalysisResult(reportObject);

    const formattedAnalysis = `
Hazard Type: ${reportObject.damage_type ?? 'N/A'}
Severity: ${reportObject.severity_level ?? 'N/A'}

Summary: ${reportObject.human_readable_summary ?? 'N/A'}
Description: ${reportObject.description ?? 'N/A'}

Safety Protocol:
${reportObject.safety_protocol ?? 'N/A'}
    `;

    setAnalysis(formattedAnalysis);
  } catch (e) {
    Alert.alert("Analysis Error", `Could not get a response from the AI: ${e.message}`);
  } finally {
    setLoading(false);
    setLoadingMessage("");
  }
};


const uploadAllImagesToCloudinary = async (localUris) => {
  if (!localUris || localUris.length === 0) {
    return []; // Return an empty array if there are no images
  }

  setLoadingMessage(`Uploading ${localUris.length} image(s)...`);

  // Create an array of upload promises
  const uploadPromises = localUris.map(uri => {
    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      name: `photo.jpg`, // Simple name
      type: `image/jpeg`,
    });
    formData.append("upload_preset", "aether_unsigned"); // Your preset
    formData.append("cloud_name", "dipqxtw9m"); // Your cloud name

    return fetch(`https://api.cloudinary.com/v1_1/dipqxtw9m/image/upload`, {
      method: "POST",
      body: formData,
    }).then(response => response.json());
  });

  // Wait for all uploads to complete
  const results = await Promise.all(uploadPromises);

  // Extract the secure_url from each result
  const uploadedUrls = results.map(result => {
    if (result.secure_url) {
      return result.secure_url;
    } else {
      console.error("A single image upload failed:", result);
      return null; // Handle potential failed uploads
    }
  });

  // Filter out any nulls from failed uploads
  return uploadedUrls.filter(url => url !== null);
};

// This function uploads a report object to Firestore using setDoc
const uploadReportWithSetDoc = async (reportData) => {
  const user = auth.currentUser;
  if (!user) {
    Alert.alert("Error", "You must be logged in to upload a report.");
    return;
  }

  try {
    // 1. Create a Unique ID for the new document 🆔
    // A simple way is to use the current timestamp + user's ID
    const uniqueId = `${Date.now()}-${user.uid}`;

    // 2. Create a reference to the document path 📄
    // This tells Firestore exactly where to save the data: in the "reports" collection,
    // with the unique ID we just created.
    const reportRef = doc(db, "reports", uniqueId);

    // 3. Call setDoc to upload the data ✅
    console.log(`Uploading report to document ID: ${uniqueId}`);
    await setDoc(reportRef, reportData);

    Alert.alert("Success", "Report uploaded successfully!");
    
  } catch (error) {
    console.error("Error uploading report: ", error);
    Alert.alert("Upload Failed", "Could not upload the report. Please try again.");
  }
};


const handleSubmit = async () => {
  setLoading(true);

  try {
    let finalAnalysisForSubmission = parsedAnalysisResult;

    if (!finalAnalysisForSubmission || finalAnalysisForSubmission.error) {
      setLoadingMessage("Performing analysis before submission...");
      finalAnalysisForSubmission = await analyzeWithGemini(photos, description);
      if (!finalAnalysisForSubmission || finalAnalysisForSubmission.error) {
        throw new Error("Failed to get valid AI analysis for submission.");
      }
    }

    // --- THIS IS THE KEY CHANGE ---

    // 1. Get the array of LOCAL image URIs from the analysis object
    const localImageUris = finalAnalysisForSubmission.images;

    // 2. Upload ALL local images and get an array of Cloudinary URLs back
    const cloudinaryImageUrls = await uploadAllImagesToCloudinary(localImageUris);

    // 3. Create the final report object with the array of Cloudinary URLs
    const reportToSave = {
      ...finalAnalysisForSubmission,
      images: cloudinaryImageUrls, // Replace local URIs with cloud URLs
    };

    // --- END OF KEY CHANGE ---

    setLoadingMessage('Saving report to Firestore...');
    await uploadReportWithSetDoc(reportToSave);


    Alert.alert("Success", "Your report has been submitted successfully!");
    clearPhotos();
    router.replace("/");
  } catch (error) {
    console.error("Submission failed: ", error);
    Alert.alert("Error", `Failed to submit report: ${error.message}`);
  } finally {
    setLoading(false);
    setLoadingMessage("");
  }
};


  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "black" }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          gap: 20,
          // alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginVertical: 10, gap: 12 }}>

          {/* photo display */}
          <View
            style={{
              alignItems: "center",
              marginVertical: 10,
              gap: 12,
              top: 10,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
              Report Photo
            </Text>
            {photos && photos.length > 0 ? (
              <FlatList
                data={photos}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    style={{
                      width: 150,
                      height: 200,
                      resizeMode: "contain",
                      borderWidth: 1,
                      borderColor: "white",
                      borderRadius: 12,
                    }}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <Text style={{ color: "grey" }}>No photo provided.</Text>
            )}
            <View style={{ flexDirection: "row", gap: 20 }}>
              <TouchableOpacity
                onPress={handleReport}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 12,
                }}
              >
                <MaterialIcons name="add-a-photo" size={24} color="white" />
                <Text style={{ color: "white", fontSize: 10 }}>
                  Add Upto 5 Photos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={clearPhotos}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 12,
                }}
              >
                <MaterialCommunityIcons
                  name="delete-sweep"
                  size={24}
                  color="white"
                />
                <Text style={{ color: "white", fontSize: 10 }}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:"row",alignItems:"center",gap:5}}>
              <AntDesign name="info-circle" size={18} color="grey" />
              <Text style={{color:"grey",fontSize:12}}>Only the first image is analyzed by AI to optimize token usage.</Text>
            </View>
          </View>

          {/* location */}
          <View
            style={{
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 12,
              margin: 10,
              padding: 3,
              flexDirection: "row",
              // justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder={fetchLocation}
              numberOfLines={2}
              placeholderTextColor="grey"
              multiline={true}
              value={
                 manualLocation
              }
               onChangeText={(text) => setManualLocation(text)} 
              valuecolor="white"
              // editable={false}
              style={{
                color: "white",
                backgroundColor: "black",
                borderColor: "white",
                width: "100%",
                textAlignVertical: "top",
              }}
            ></TextInput>
            {locationIcon && !confirmedLocation && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => [
                  setFetchLocation("Fetching..."),
                  getCurrentLocation(),
                ]}
              >
                <EvilIcons name="location" size={24} color="white" />
                <Text style={{ color: "white", fontSize: 10 }}>
                  Use Current Location
                </Text>
              </TouchableOpacity>
            )}
            {/* Apply */}
            {check && !confirmedLocation && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  const locationToConfirm = manualLocation || fetchLocation;
                  setManualLocation(locationToConfirm);
                  setConfirmedLocation(locationToConfirm);
                  setCheck(false);
                }}
              >
                <AntDesign name="check" size={24} color="white" />
                <Text style={{ color: "white", fontSize: 10 }}>Apply</Text>
              </TouchableOpacity>
            )}
            {!check && confirmedLocation && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setConfirmedLocation("");
                  setManualLocation("");
                  setCheck(true);
                }}
              >
                <AntDesign name="delete" size={24} color="white" />
                {/* <Text style={{ color: "white", fontSize: 10 }}>Apply</Text> */}
              </TouchableOpacity>
            )}
          </View>

          {/* description */}
          <View style={{ alignItems: "center", marginVertical: 0, gap: 12 }}>
            <TextInput
              placeholder="Describe the issue..."
              numberOfLines={2}
              multiline={true}
              onChangeText={(text) => setDescription(text)}
              value={description}
              color="white"
              placeholderTextColor="grey"
              style={{
                backgroundColor: "black",
                borderColor: "white",
                borderWidth: 1,
                borderRadius: 12,
                padding: 12,
                width: "100%",
                textAlignVertical: "top",
              }}
            >
              {/* <Text style={{ color: "black" }}>{description}</Text> */}
            </TextInput>
          </View>

          {/* Analyze Button */}
          <Button
            title="Analyze Report"
            onPress={handleAnalyze}
            disabled={loading}
          />

          {analysis && (
            <View
              style={{
                marginTop: 20,
                padding: 15,
                backgroundColor: "#1C1C1E",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                AI Analysis:
              </Text>
              <Text style={{ color: "white", fontSize: 16 }}>{analysis}</Text>
            </View>
          )}

          {loading ? (
            <View style={{ alignItems: "center", gap: 10 }}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={{ color: "white" }}>{loadingMessage}</Text>
            </View>
          ) : (
            <Button
              title="Submit Report"
              onPress={handleSubmit}
              disabled={
                photos.length === 0 || !description || !confirmedLocation
              }
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
