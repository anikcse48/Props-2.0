import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getLoggedInUser, getDatabase } from './database';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = await getLoggedInUser();
    if (userData) {
      setUser(userData);
      setName(userData.name);
      setPhone(userData.phone);
      setAddress(userData.address);
      setProfileImage(userData.profile_image);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    const db = await getDatabase();
    await db.runAsync('UPDATE users SET name = ?, phone = ?, address = ?, profile_image = ? WHERE id = ?', [name, phone, address, profileImage, user.id]);
    Alert.alert('Success', 'Profile updated successfully.');
    setEditing(false);
    loadUserData();
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      {profileImage ? <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 50 }} /> : <Text>No Profile Image</Text>}
      <Button title="Change Profile Image" onPress={pickImage} />

      <TextInput value={name} editable={editing} onChangeText={setName} placeholder="Name" />
      <TextInput value={phone} editable={editing} onChangeText={setPhone} placeholder="Phone" />
      <TextInput value={address} editable={editing} onChangeText={setAddress} placeholder="Address" />

      <Button title={editing ? "Save Profile" : "Edit Profile"} onPress={() => (editing ? saveProfile() : setEditing(true))} />
    </ScrollView>
  );
};

export default ProfileScreen;
