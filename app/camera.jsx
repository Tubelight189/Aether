import { Camera, CameraView } from "expo-camera";
import * as MediaLib from "expo-media-library";
import { router } from "expo-router"; // <-- Import router to go back
import { useEffect, useRef, useState } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"; // <-- Import ImageBackground

export default function Index() {
    const [facing, setFacing] = useState('back');
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasMediaPermission, setHasMediaPermission] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    
    // 1. Add state for the captured image
    const [capturedImage, setCapturedImage] = useState(null);

    const cameraRef = useRef(null);

    useEffect(() => {
        requestPermission();
    }, []);

    const requestPermission = async () => {
        const { status: CameraStatus } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(CameraStatus === "granted");
        const { status: MediaStatus } = await MediaLib.requestPermissionsAsync();
        setHasMediaPermission(MediaStatus === "granted");
    };

    const takePicture = async () => {
        if (cameraRef.current && cameraReady) {
            const photo = await cameraRef.current.takePictureAsync();
            // console.log("Photo taken: ", photo.uri);
            // 2. Update state with the captured photo's URI
            setCapturedImage(photo);
          
        }
    };

    const usePhoto = () => {
        // console.log("Using photo:", capturedImage.uri);
       router.push({ pathname: "/report", params: { photoUri: capturedImage.uri } });
    };
    
    // 3. Add a function to retake the picture
    const retakePicture = () => {
        setCapturedImage(null); // Clear the image to show the camera again
    };

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    if (!hasCameraPermission) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>No camera permission granted.</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={[styles.text, { color: "black" }]}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // 4. Conditionally render the Preview screen if a photo has been taken
    if (capturedImage) {
        return (
            <ImageBackground source={{ uri: capturedImage.uri }} style={styles.container}>
                <View style={styles.previewButtonContainer}>
                    <TouchableOpacity style={styles.button} onPress={retakePicture}>
                        <Text style={styles.text}>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={usePhoto}>
                        <Text style={styles.text}>Use Photo</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    // Render the Camera view if no photo is captured yet
    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing} onCameraReady={() => setCameraReady(true)}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.text}>Click</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

// 5. Add/update styles for the preview screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: 'center', // Center content for preview
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    fontSize: 20,
    marginBottom: 20,
    color: "white",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  previewButtonContainer: { // New style for preview buttons
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff3",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff8',
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});