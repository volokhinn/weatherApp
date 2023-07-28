import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, Modal, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherForecast } from '../api/weather';
import { days, weatherAssets } from '../constants';
import * as Progress from 'react-native-progress';
import { getData, storeData } from '../utils/asyncStorage';
import { Video } from 'expo-av';

const CloseButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ position: 'absolute', top: 10, right: 10 }}>
    <Text style={{ fontSize: 20 }}>X</Text>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const video = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = React.useState({});
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');

  const handleLocation = (loc) => {
    setLocations([]);
    setShowSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7',
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      storeData('city', loc.name);
    });
  };

  const handleSearch = (value) => {
    // fetch locations
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'Novosibirsk';
    if (myCity) cityName = myCity;
    fetchWeatherForecast({ cityName, days: '7' }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);
  const { current, location } = weather;

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleTouchableOpacity = (item, dayName) => {
    setSelectedWeather(item);
    setSelectedDay(dayName);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Video
        ref={video}
        source={weatherAssets[current?.condition?.text]?.video}
        resizeMode="cover"
        shouldPlay
        isMuted
        isLooping
        className="absolute w-full h-full"
      />
      <Image
        blurRadius={70}
        source={require('../assets/images/bg.png')}
        className="absolute h-full w-full opacity-50"
      />
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail
            thickness={10}
            size={140}
            color="#0bb3b2"
            className="bg-transparent"
          />
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
              <KeyboardAvoidingView behavior="padding">
                <TouchableOpacity
                  onPress={() => setShowSearch(!showSearch)}
                  className="rounded-full top-8 right-4 pt-1 absolute"
                >
                  <MagnifyingGlassIcon size="20" color="white" />
                </TouchableOpacity>
              </KeyboardAvoidingView>

              {locations.length > 0 && showSearch ? (
                <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                  {locations.map((loc, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => handleLocation(loc)}
                        key={index}
                        className="px-5 py-4 flex-row items-center"
                      >
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
              <Text className="text-lg font-semibold text-gray-300">{' ' + location?.country}</Text>
            </Text>
            {/* Иконка погоды */}
            <View className="flex-row justify-center">
              <Image source={weatherAssets[current?.condition?.text]?.image} className="w-40 h-40"></Image>
            </View>
            <View className="space-y-4">
              <Text className="text-white text-center text-4xl mt-6">{current?.temp_c}&#176;</Text>
              <Text className="text-white text-center text-xl tracking-widest">
                {weatherAssets[current?.condition.text]?.description}
              </Text>
            </View>
          </View>
          {/* Другая статистика */}
          <View className="flex-row justify-between mx-4 my-4">
            <View className="flex-row space-x-2 items-center">
              <Image source={require('../assets/icons/wind.png')} className="h-6 w-6"></Image>
              <Text className="text-white font-semibold text-base">
                {Math.round(((current?.wind_kph * 1000) / 3600) * 100) / 100} м/с
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image source={require('../assets/icons/drop.png')} className="h-6 w-6"></Image>
              <Text className="text-white font-semibold text-base">{current?.humidity}%</Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image source={require('../assets/icons/sunny.png')} className="h-6 w-6"></Image>
              <Text className="text-white font-semibold text-base">
                {weather?.forecast?.forecastday[0]?.astro.sunrise}
              </Text>
            </View>
          </View>
          {/* Прогноз на другие дни */}
          <View className="mb-2 space-y-3 mt-10">
            <ScrollView
              horizontal
              currentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
              className="mx-1"
            >
              {weather?.forecast?.forecastday?.map((item, index) => {
                let date = new Date(item.date);
                let options = { weekday: 'long' };
                let dayName = date.toLocaleDateString('en-US', options);
                dayName = dayName.split(',')[0];
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleTouchableOpacity(item, dayName)}
                    style={{
                      backgroundColor: 'rgba(165, 165, 165, 0.5)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 100,
                      borderRadius: 20,
                      paddingVertical: 10,
                      marginRight: 10,
                    }}
                  >
                    <Image
                      source={weatherAssets[item?.day?.condition?.text]?.image}
                      style={{ width: 50, height: 50 }}
                    />
                    <Text style={{ color: 'white' }}>{days[dayName]?.short}</Text>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                      {Math.round(item?.day?.maxtemp_c)}&#176;
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          {/* Modal */}
          <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
            <TouchableWithoutFeedback onPress={closeModal}>
              <View
              className="flex flex-1 justify-center align-center"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
              >
                {selectedWeather && (
                  <View className="px-12 py-12 bg-white">
                    <CloseButton onPress={closeModal} />
                    <Text>
                    {days[selectedDay]?.full}, {new Date(selectedWeather?.date).toLocaleDateString('ru-RU').slice(0,-5)}
                    </Text>
                    <Image
                      source={weatherAssets[selectedWeather?.day?.condition?.text]?.image}
                      className="h-10 w-10"
                    />
                    <Text>{weatherAssets[selectedWeather?.day?.condition.text]?.description}</Text>
                    <Text className="text-black text-4xl">{Math.round(selectedWeather?.day?.maxtemp_c)}&#176;</Text>
                    <View className="flex-row justify-between mx-4 my-4">
                    <View className="flex-row space-x-2 items-center">
                      <Image source={require('../assets/icons/windblack.png')} className="h-6 w-6"></Image>
                      <Text className="text-black font-semibold text-base">
                        {Math.round(((selectedWeather?.day?.maxwind_kph * 1000) / 3600) * 100) / 100} м/с
                      </Text>
                    </View>
                    <View className="flex-row space-x-2 items-center">
                      <Image source={require('../assets/icons/dropblack.png')} className="h-6 w-6"></Image>
                      <Text className="text-black font-semibold text-base">{selectedWeather?.day?.avghumidity}%</Text>
                    </View>
                    <View className="flex-row space-x-2 items-center">
                      <Image source={require('../assets/icons/sunnyblack.png')} className="h-6 w-6"></Image>
                      <Text className="text-black font-semibold text-base">
                        {selectedWeather.astro.sunrise}
                      </Text>
                    </View>
                  </View>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </>
      )}
    </View>
  );
};

export default HomeScreen;
