import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  TextInput,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import styled from "styled-components/native";
import { API_URL } from "../Api/config";

// ===== Styled Components =====
const Container = styled.View`
  padding-top: 48px;
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f3f4f6;
`;

const HeaderTitle = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const Section = styled(Animated.View)`
  padding: 20px;
`;

const AvatarContainer = styled(Animated.View)`
  align-items: center;
  margin-bottom: 16px;
`;

const Avatar = styled.View`
  width: 90px;
  height: 90px;
  border-radius: 45px;
  background-color: #f3f4f6;
  justify-content: center;
  align-items: center;
  position: relative;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 3;
`;

const EditButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #3b82f6;
  width: 26px;
  height: 26px;
  border-radius: 13px;
  justify-content: center;
  align-items: center;
`;

const FieldContainer = styled(Animated.View)`
  margin-bottom: 18px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 6px;
  font-weight: 500;
`;

const Input = styled.TextInput`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 16px;
  color: #111827;
`;

const DateButton = styled.TouchableOpacity`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
`;

const ButtonsRow = styled(Animated.View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  margin-right: 10px;
  padding: 14px;
  background-color: #f3f4f6;
  border-radius: 10px;
  align-items: center;
`;

const SaveButton = styled.TouchableOpacity`
  flex: 1;
  margin-left: 10px;
  padding: 14px;
  background-color: #3b82f6;
  border-radius: 10px;
  align-items: center;
`;

const ButtonText = styled.Text<{ primary?: boolean }>`
  color: ${(props) => (props.primary ? "#fff" : "#111827")};
  font-size: 16px;
  font-weight: 600;
`;

// ===== Component =====
const EditProfileScreen = () => {
  const navigation = useNavigation();

  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [ngaySinh, setNgaySinh] = useState(new Date());
  const [diaChi, setDiaChi] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [userId, setUserId] = useState("");

  // ===== Animation setup =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const animateIn = (delay = 0) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    animateIn(150);
  }, []);

  // ===== Fetch profile =====
  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return navigation.goBack();

      try {
        const res = await fetch(`${API_URL}/api/nguoi_dung/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setHoTen(data.ho_ten);
          setEmail(data.email);
          setAvatar(data.avatar || "");
          if (data.ngay_sinh) setNgaySinh(new Date(data.ngay_sinh));
          setDiaChi(data.dia_chi || "");
          setUserId(data.ma_nguoi_dung);
        } else {
          Alert.alert("Lỗi", "Không thể tải hồ sơ.");
          navigation.goBack();
        }
      } catch {
        Alert.alert("Lỗi", "Không thể kết nối máy chủ.");
        navigation.goBack();
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, []);

  // ===== Handle Save =====
  const handleSave = async () => {
    if (!hoTen.trim() || !email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ họ tên và email.");
      return;
    }

    setIsLoading(true);
    const token = await AsyncStorage.getItem("userToken");

    try {
      const formData = new FormData();
      formData.append("ho_ten", hoTen);
      formData.append("email", email);
      formData.append("ngay_sinh", ngaySinh.toISOString().split("T")[0]);
      formData.append("dia_chi", diaChi);
      if (avatar.startsWith("file://")) {
        const parts = avatar.split("/");
        const name = parts[parts.length - 1];
        const type = `image/${name.split(".").pop()}`;
        formData.append("avatar", { uri: avatar, name, type } as any);
      }

      const res = await fetch(`${API_URL}/api/nguoi_dung/${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        Alert.alert("Thành công", "Đã lưu thay đổi!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const err = await res.json();
        Alert.alert("Lỗi", err.message || "Không thể cập nhật.");
      }
    } catch {
      Alert.alert("Lỗi", "Không thể gửi yêu cầu cập nhật.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Container style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 8, color: "#6b7280" }}>Đang tải...</Text>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <HeaderTitle>Chỉnh sửa hồ sơ</HeaderTitle>
        <View style={{ width: 24 }} />
      </Header>

      {/* Body */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Section
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <AvatarContainer
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Avatar>
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  style={{ width: 90, height: 90, borderRadius: 45 }}
                />
              ) : (
                <Ionicons name="person-outline" size={42} color="#9ca3af" />
              )}
              <EditButton
                onPress={async () => {
                  const permission =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (!permission.granted) {
                    Alert.alert("Lỗi", "Bạn cần cấp quyền truy cập ảnh.");
                    return;
                  }
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                  });
                  if (!result.canceled) {
                    setAvatar(result.assets[0].uri);
                  }
                }}
              >
                <Ionicons name="camera-outline" size={14} color="#fff" />
              </EditButton>
            </Avatar>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#111827",
                marginTop: 10,
              }}
            >
              {hoTen || "Người dùng"}
            </Text>
          </AvatarContainer>

          {/* Input fields with fade-in */}
          {[
            { label: "Họ và tên", value: hoTen, setter: setHoTen },
            { label: "Email", value: email, setter: setEmail },
            { label: "Địa chỉ", value: diaChi, setter: setDiaChi },
          ].map((f, i) => (
            <FieldContainer
              key={f.label}
              style={{
                opacity: fadeAnim,
                transform: [
                  { translateY: Animated.multiply(slideAnim, 1 + i * 0.1) },
                ],
              }}
            >
              <Label>{f.label}</Label>
              <Input
                value={f.value}
                onChangeText={f.setter}
                placeholder={`Nhập ${f.label.toLowerCase()}`}
                placeholderTextColor="#9ca3af"
              />
            </FieldContainer>
          ))}

          <FieldContainer>
            <Label>Ngày sinh</Label>
            <DateButton onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: "#111827" }}>
                {ngaySinh.toLocaleDateString("vi-VN")}
              </Text>
            </DateButton>
            {showDatePicker && (
              <DateTimePicker
                value={ngaySinh}
                mode="date"
                display="default"
                onChange={(e, selected) => {
                  setShowDatePicker(false);
                  if (selected) setNgaySinh(selected);
                }}
                maximumDate={new Date()}
              />
            )}
          </FieldContainer>

          {/* Buttons */}
          <ButtonsRow
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <CancelButton
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <ButtonText>Hủy</ButtonText>
            </CancelButton>

            <SaveButton onPress={handleSave} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ButtonText primary>Lưu thay đổi</ButtonText>
              )}
            </SaveButton>
          </ButtonsRow>
        </Section>
      </ScrollView>
    </Container>
  );
};

export default EditProfileScreen;
