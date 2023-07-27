import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { ScrollView } from 'react-native';
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherForecast } from '../api/weather';
import { weatherImages } from '../constants';
import * as Progress from 'react-native-progress';
import { getData, storeData } from '../utils/asyncStorage';

const HomeScreen = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = (loc) => {
    setLocations([]);
    setShowSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data => {
      setWeather(data);
      setLoading(false);
      storeData('city', loc.name);
    })
  }

  const handleSearch = value => {
    // fetch locations
    if (value.length > 2) {
      fetchLocations({cityName: value}).then(data => {
        setLocations(data);
      })
    }
  }

  useEffect(() => {
    fetchMyWeatherData();
  }, [])

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'Novosibirsk';
    if (myCity) cityName = myCity;
    fetchWeatherForecast({cityName, days: '7'}).then(data => {
      setWeather(data);
      setLoading(false);
    })
  }
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);
  const {current, location} = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        blurRadius={70}
        source={require('../assets/images/bg.png')}
        className="absolute h-full w-full"
      />
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
        </View>
      ) : (
        <>
      {/* Поиск */}
      <View style={{ height: '7%' }} className="mb-10 mx-4 relative z-50">
        <View className="flex-row justify-end items-center rounded-full relative">
          {showSearch ? (
            <TextInput
              onChangeText={handleTextDebounce}
              placeholder="Выберите город"
              placeholderTextColor={'white'}
              style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
              }}
              className="w-full rounded-full pl-6 h-10 text-white top-11"
            />
          ) : null}
          <TouchableOpacity
            onPress={() => setShowSearch(!showSearch)}
            className="rounded-full top-12 right-4 pt-1 absolute">
            <MagnifyingGlassIcon size="20" color="white" />
          </TouchableOpacity>
          {locations.length > 0 && showSearch ? (
            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
              {locations.map((loc, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleLocation(loc)}
                    key={index}
                    className="px-5 py-4 flex-row items-center">
                    <MapPinIcon size="20" color="gray" />
                    <Text className="ml-2">{loc?.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
      </View>
      {/* Прогноз */}
      <View className="mx-4 flex-column justify-around flex-1 mb-6">
        <Text className="text-white text-center text-2xl font-bold mb-6">
          {location?.name},
          <Text className="text-lg font-semibold text-gray-300">{" " + location?.country}</Text>
        </Text>
        {/* Иконка погоды */}
        <View className="flex-row justify-center">
          <Image source={weatherImages[current?.condition?.text]} className="w-40 h-40"></Image>
        </View>
        <View className="space-y-4">
          <Text className="text-white text-center text-4xl mt-6">{current?.temp_c}&#176;</Text>
          <Text className="text-white text-center text-xl tracking-widest">{current?.condition.text}</Text>
        </View>
      </View>
      {/* Другая статистика */}
      <View className="flex-row justify-between mx-4 my-4">
        <View className="flex-row space-x-2 items-center">
          <Image source={require('../assets/icons/wind.png')} className="h-6 w-6"></Image>
          <Text className="text-white font-semibold text-base">{Math.round((current?.wind_kph) * 1000 / 3600 * 100) / 100} m/s</Text>
        </View>
        <View className="flex-row space-x-2 items-center">
          <Image source={require('../assets/icons/drop.png')} className="h-6 w-6"></Image>
          <Text className="text-white font-semibold text-base">{current?.humidity}%</Text>
        </View>
        <View className="flex-row space-x-2 items-center">
          <Image source={require('../assets/icons/sunny.png')} className="h-6 w-6"></Image>
          <Text className="text-white font-semibold text-base">{weather?.forecast?.forecastday[0]?.astro.sunrise}</Text>
        </View>
      </View>
      {/* Прогноз на другие дни */}
      <View className="mb-2 space-y-3 mt-10">
        <ScrollView horizontal currentContainerStyle={{paddingHorizontal: 15}} showsHorizontalScrollIndicator={false} className="mx-1">
        {weather?.forecast?.forecastday?.map((item, index) => {
          let date = new Date(item.date);
          let options = {weekday: 'long'};
          let dayName = date.toLocaleDateString('ru-RU', options);
          dayName = dayName.split(',')[0];
        return (
          <View key={index} style={{backgroundColor: "rgba(165,165,165,0.5)"}} className="flex justify-center items-center w-20 rounded-3xl py-3 space-y-1 mr-4 bg-opacity-20">
          <Image source={weatherImages[item?.day?.condition?.text]} className="w-10 h-10"></Image>
            <Text className="text-white">{dayName}</Text>
            <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c}&#176;</Text>
        </View>
        )
      })}
        </ScrollView>
      </View>
        </>
      )}
    </View>
  );
};

export default HomeScreen;
