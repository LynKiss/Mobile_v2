import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Easing,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";
import GradientView from "../components/GradientView";
import styles from "../styles/LoginScreen.styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/route";
import { API_URL } from "../Api/config";

const { width, height } = Dimensions.get("window");

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(1)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const floatingBooksAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // --- Configure Google Signin once ---
  useEffect(() => {
    // Google Signin configuration removed
  }, []);

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous logo animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(logoScaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    // Floating books animation
    Animated.loop(
      Animated.timing(floatingBooksAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    // Pulsing glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
      ])
    ).start();
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = "Email không được để trống.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email không hợp lệ.";

    if (!password.trim()) newErrors.password = "Mật khẩu không được để trống.";
    else if (password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem("userToken", data.token);
        login(email.trim(), password);
      } else {
        Alert.alert(
          "Đăng nhập thất bại",
          "Thông tin đăng nhập không chính xác."
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // --- Google sign-in handler (only social option) ---
  const handleGoogleLogin = async () => {
    Alert.alert("Thông báo", "Đăng nhập bằng Google tạm thời không khả dụng.");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <GradientView
        colors={["#1f1144", "#3b1f5a"]}
        style={styles.gradientBackground}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Logo + Floating books */}
            <View style={styles.logoContainer}>
              <Animated.View
                style={[
                  styles.logoWrapper,
                  {
                    transform: [
                      {
                        scale: logoScaleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.05],
                        }),
                      },
                      {
                        rotateY: logoRotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.logoText}>📚</Text>
                <Animated.View
                  style={[
                    styles.logoGlow,
                    {
                      opacity: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.8],
                      }),
                    },
                  ]}
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.floatingBooksContainer,
                  {
                    transform: [
                      {
                        translateY: floatingBooksAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -30],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {[...Array(5)].map((_, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.floatingBook,
                      {
                        transform: [
                          {
                            translateY: floatingBooksAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -20 - index * 15],
                            }),
                          },
                          {
                            translateX: floatingBooksAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [index * 10 - 20, index * 15 - 30],
                            }),
                          },
                          {
                            rotate: floatingBooksAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0deg", `${index * 45}deg`],
                            }),
                          },
                        ],
                        opacity: floatingBooksAnim.interpolate({
                          inputRange: [0, 0.3, 1],
                          outputRange: [0.7, 1, 0.7],
                        }),
                      },
                    ]}
                  >
                    <Text style={styles.bookEmoji}>
                      {index % 3 === 0 ? "📖" : index % 3 === 1 ? "📚" : "📗"}
                    </Text>
                  </Animated.View>
                ))}
              </Animated.View>
            </View>

            <Text style={styles.welcomeTitle}>
              Chào mừng đến với Thư Viện Thông Minh! 👋
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Khám phá thế giới tri thức với hàng nghìn cuốn sách và tài liệu
              học tập
            </Text>

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Đăng Nhập</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Nhập email của bạn"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.passwordContainer,
                    errors.password && styles.inputError,
                  ]}
                >
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Nhập mật khẩu"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password)
                        setErrors({ ...errors, password: undefined });
                    }}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeIcon}>
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>📚 Đăng Nhập 📚</Text>
                )}
              </TouchableOpacity>

              {/* Google sign-in temporarily disabled */}
              <TouchableOpacity
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 25,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginTop: 15,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.3)",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={handleGoogleLogin}
                disabled={isLoading}
              >
                <Text style={{ fontSize: 18, marginRight: 10 }}>🌐</Text>
                <Text style={{ color: "#fff", fontSize: 16 }}>
                  Đăng nhập bằng Google
                </Text>
              </TouchableOpacity>

              <View style={styles.linksContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={styles.linkText}>Tạo tài khoản mới</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={styles.linkText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </GradientView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
