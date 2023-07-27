import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';

const HomeScreen = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([1, 2, 3]);
  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        blurRadius={70}
        source={require('../assets/images/bg.png')}
        className="absolute h-full w-full"
      />

      {/* Поиск */}

      <View style={{ height: '7%' }} className=" mt-10 mb-10 mx-4 relative z-50">
        <View className="flex-row justify-end items-center rounded-full relative">
          {showSearch ? (
            <TextInput
              placeholder="Выберите город"
              placeholderTextColor={'white'}
              style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
              }}
              className="w-full rounded-full pl-6 h-10 text-white"
            />
          ) : null}
          <TouchableOpacity
            onPress={() => setShowSearch(!showSearch)}
            className="rounded-full top-2 right-4 pt-1 absolute">
            <MagnifyingGlassIcon size="20" color="white" />
          </TouchableOpacity>
          {locations.length > 0 && showSearch ? (
            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
              {locations.map((loc, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => handeLocation(loc)}
                    key={index}
                    className="px-5 py-4 flex-row items-center">
                    <MapPinIcon size="20" color="gray" />
                    <Text className="ml-2">Новосибирск</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
