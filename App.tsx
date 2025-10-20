import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import LibraryScreen from "./src/screens/LibraryScreen";
import BookScreen from "./src/screens/BookScreens";
import BookDetailScreen from "./src/screens/BookDetailScreen";
import BookDetailScreen_MT from "./src/components/BookDetailScreen_MT";
import ProfileScreen from "./src/screens/ProfileScreen";
import HelpScreen from "./src/screens/HelpScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import HelpMain from "./src/screens/HelpMain";
import HelpDetailScreen from "./src/screens/HelpDetailScreen";
import ChatBoxScreen from "./src/screens/ChatBoxScreen";
import BookShelf from "./src/screens/BookshelfScreen";
import NotificationSettingsScreen from "./src/screens/NotificationSettingsScreen";
import FineScreen from "./src/screens/FineScreen";
import { ThemeProvider } from "./src/styles/ThemeContext";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
          borderTopWidth: 0.5,
          borderTopColor: "#e6e6e6",
          backgroundColor: "#fff",
        },
        tabBarActiveTintColor: "#33A6A6",
        tabBarInactiveTintColor: "#9b9b9b",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          switch (route.name) {
            case "Tủ sách":
              iconName = "book-outline";
              break;
            case "Thư viện":
              iconName = "library-outline";
              break;
            case "Thương phố":
              iconName = "storefront-outline";
              break;
            case "Tường":
              iconName = "newspaper-outline";
              break;
            case "Tài khoản":
              iconName = "person-outline";
              break;
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Tủ sách" component={LibraryScreen} />
      <Tab.Screen name="Thư viện" component={BookScreen} />
      <Tab.Screen name="Thương phố" component={LibraryScreen} />
      <Tab.Screen name="Tường" component={BookShelf} />
      <Tab.Screen name="Tài khoản" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
            <Stack.Screen
              name="BookDetailScreen_MT"
              component={BookDetailScreen_MT}
            />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="HelpMain" component={HelpMain} />
            <Stack.Screen name="HelpDetail" component={HelpDetailScreen} />
            <Stack.Screen name="ChatBox" component={ChatBoxScreen} />
            <Stack.Screen
              name="NotificationSettings"
              component={NotificationSettingsScreen}
            />
            <Stack.Screen name="FineScreen" component={FineScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
