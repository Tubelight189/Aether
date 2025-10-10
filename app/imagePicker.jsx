import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { usePhotoStore } from "../store/photoStore";
export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
const router=useRouter();
const { photos, setInitialPhoto, addPhoto } = usePhotoStore();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      addPhoto(result.assets[0].uri);
      router.push({ pathname: '/report' });
    }
  };

useEffect(() => {
  const run = async () => {
    await pickImage();
  };
  run();
}, []);


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
