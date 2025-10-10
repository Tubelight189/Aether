// components/LeafletMap.js
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const LeafletMap = ({ latitude, longitude }) => {
  const mapHTML = `
   <!DOCTYPE html>
<html>
<head>
    <title>Leaflet Map</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <style>
      html, body, #map { height: 100%; margin:0; padding:0; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const lat = ${latitude};
      const lon = ${longitude};
      const map = L.map('map').setView([lat, lon], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      L.marker([lat, lon]).addTo(map)
        .bindPopup('Reported Location')
        .openPopup();
    </script>
</body>
</html>

  `;

  return (
    <View style={styles.container}>
      <WebView
         originWhitelist={['*']}
  source={{ html: mapHTML }}
  style={styles.webview}
  javaScriptEnabled={true}
  domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300, // You can adjust the height as needed
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    overflow: 'hidden', // This is important to respect the borderRadius
        backgroundColor: 'yellow',
  },
  webview: {
    flex: 1,
  },
});

export default LeafletMap;