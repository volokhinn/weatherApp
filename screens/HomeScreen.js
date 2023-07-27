import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native';
import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { ScrollView } from 'react-native';

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
              onChangeText={handleSearch}
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
      {/* Прогноз */}
      <View className="mx-4 flex justify-around flex-1 mb-2">
        <Text className="text-white text-center text-2xl font-bold mr-2">
          Новосибирск,
          <Text className="text-lg font-semibold text-gray-300">Россия</Text>
        </Text>
        {/* Иконка погоды */}
        <View className="flex-row justify-center">
          <Image source={require('../assets/images/partlycloudy.png')} className="w-52 h-52"></Image>
        </View>
        <View className="space-y-4">
          <Text className="text-white text-center text-4xl">23&#176;</Text>
          <Text className="text-white text-center text-xl tracking-widest">Малооблачно</Text>
        </View>
      </View>
      {/* Другая статистика */}
      <View className="flex-row justify-between mx-4 my-4">
        <View className="flex-row space-x-2 items-center">
          <Image source={require('../assets/icons/wind.png')} className="h-6 w-6"></Image>
          <Text className="text-white font-semibold text-base">4 m/s</Text>
        </View>
        <View className="flex-row space-x-2 items-center">
          <Image source={require('../assets/icons/drop.png')} className="h-6 w-6"></Image>
          <Text className="text-white font-semibold text-base">23%</Text>
        </View>
        <View className="flex-row space-x-2 items-center">
          <Image source={require('../assets/icons/sunny.png')} className="h-6 w-6"></Image>
          <Text className="text-white font-semibold text-base">6:05 AM</Text>
        </View>
      </View>
      {/* Прогноз на другие дни */}
      <View className="mb-2 space-y-3">
        <View className="flex-row items-center mx-5 space-x-2">
          <CalendarDaysIcon size="20" color="white" />
          <Text className="text-white text-base">Прогноз по дням</Text>
        </View>
        <ScrollView horizontal currentContainerStyle={{paddingHorizontal: 15}} showsHorizontalScrollIndicator={false} className="mx-1">
          <View style={{backgroundColor: "rgba(165,165,165,0.5)"}} className="flex justify-center items-center w-20 rounded-3xl py-3 space-y-1 mr-4 bg-opacity-20">
            <Image source={require('../assets/images/heavyrain.png')} className="w-10 h-10"></Image>
              <Text className="text-white">Пн</Text>
              <Text className="text-white text-xl font-semibold">13&#176;</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;
