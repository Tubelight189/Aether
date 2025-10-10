# Aether: AI-Powered Disaster Response

![Aether App Banner](https://i.imgur.com/your-banner-image-url.png) 
[cite_start]**Aether is a sophisticated disaster response and emergency reporting mobile application built for the Thales Hackathon 2025 under the "AI-Powered Solutions" theme.** [cite: 255]

[cite_start]It leverages cutting-edge AI to provide real-time hazard analysis, bridging the gap between traditional emergency systems and modern disaster management technology. [cite: 9]

### 🎥 [Watch the Video Demo](https://your-video-link-here.com) | [cite_start]📱 [Download the App](https://drive.google.com/file/d/1qLC06mSvDj2qQiqUcUnX29vRp9aG-_1Q/view?usp=sharing) [cite: 280]

---

## 🌟 Key Features

* [cite_start]**AI-Powered Analysis:** Utilizes Google Gemini to instantly classify damage from user-submitted photos into 8 distinct hazard types. [cite: 11, 36]
* [cite_start]**Real-time Dashboard:** A live feed of nearby dangers, with color-coded severity indicators and automatic updates powered by Firebase Firestore. [cite: 78, 79]
* [cite_start]**Multi-modal Reporting:** Users can submit reports using their camera or by uploading from their gallery, complete with precise GPS location and reverse geocoding for a street address. [cite: 13, 64, 68, 69]
* [cite_start]**Automated Safety Protocols:** The AI automatically generates relevant safety guidelines based on the classified hazard, providing users with actionable intelligence. [cite: 14, 47]
* [cite_start]**Interactive Maps:** Each report includes an interactive map view showing the exact location of the hazard. [cite: 88]
* [cite_start]**Live News Feed:** An integrated news section, powered by the NewsAPI, keeps users informed with the latest relevant headlines. [cite: 83]

## 📸 Screenshots

<p float="left">
  <img src="https://i.imgur.com/your-screenshot-1-url.png" width="200" />
  <img src="https://i.imgur.com/your-screenshot-2-url.png" width="200" />
  <img src="https://i.imgur.com/your-screenshot-3-url.png" width="200" />
  <img src="https://i.imgur.com/your-screenshot-4-url.png" width="200" />
</p>

---

## 🛠️ Tech Stack

* [cite_start]**Frontend:** React Native, Expo [cite: 16]
* [cite_start]**Routing:** Expo Router [cite: 19]
* [cite_start]**State Management:** Zustand [cite: 66]
* [cite_start]**Backend & Database:** Firebase Authentication & Cloud Firestore [cite: 26]
* [cite_start]**Image Storage:** Cloudinary [cite: 28]
* [cite_start]**AI & Machine Learning:** Google Gemini API [cite: 32]
* [cite_start]**Geolocation:** Expo Location, TrueWay Geocoding API [cite: 69]
* [cite_start]**News:** NewsAPI [cite: 83]

---

## 🚀 Setup and Installation

**Prerequisites:**
* Node.js and npm installed.
* Expo Go app on your mobile device.

**Instructions:**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/aether-hackathon.git](https://github.com/your-username/aether-hackathon.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd aether-hackathon
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a `.env` file** in the root of the project and add your API keys:
    ```
    EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key
    EXPO_PUBLIC_GEO_API_KEY=your_geocoding_key
    ```
5.  **Start the development server:**
    ```bash
    npx expo start
    ```
6.  **Scan the QR code** with the Expo Go app on your phone to run the application.

---

## 🧑‍💻 Author

* **Arnav Adarsh** - [GitHub Profile](https://github.com/your-username)