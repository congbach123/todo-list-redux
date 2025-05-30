import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Hanoi');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);

        const apiKey = '78c705cff9889dcce7086c9f5a2ab83d';
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);

        setWeather(response.data);
        setError(null);
      } catch (err) {
        if (err.response) {
          // Server responded with an error status code
          const status = err.response.status;
          if (status === 404) {
            setError(`City "${city}" not found`);
          } else if (status === 401) {
            setError('Invalid API key');
          } else {
            setError(`Weather data not available (${status})`);
          }
        } else if (err.request) {
          setError('No response from weather service. Check your connection.');
        } else {
          setError('Could not fetch weather data');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  if (loading) {
    return (
      <div className="h-96 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl shadow-lg overflow-hidden flex items-center justify-center">
        <div className="animate-pulse text-white">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl shadow-lg overflow-hidden flex items-center justify-center">
        <div className="text-white text-center p-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl shadow-lg overflow-hidden flex flex-col">
      <div className="p-5 text-white flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Weather</h2>
          <select
            value={city}
            onChange={handleCityChange}
            className="bg-white bg-opacity-20 text-white rounded px-2 py-1 text-sm">
            <option
              className="text-black"
              value="Hanoi">
              Hanoi
            </option>
            <option
              className="text-black"
              value="Ho Chi Minh City">
              Ho Chi Minh City
            </option>
            <option
              className="text-black"
              value="Da Nang">
              Da Nang
            </option>
            <option
              className="text-black"
              value="Hue">
              Hue
            </option>
            <option
              className="text-black"
              value="Nha Trang">
              Nha Trang
            </option>
          </select>
        </div>

        {/* Main Content */}
        {weather && (
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-4xl font-bold mb-2">{Math.round(weather.main.temp)}°C</h3>
                <p className="capitalize text-lg mb-1">{weather.weather[0].description}</p>
                <p className="text-sm opacity-90">Feels like: {Math.round(weather.main.feels_like)}°C</p>
              </div>
              <div className="text-center">
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="w-20 h-20 mx-auto"
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                <p className="text-sm opacity-80">Humidity</p>
                <p className="text-lg font-semibold">{weather.main.humidity}%</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                <p className="text-sm opacity-80">Wind Speed</p>
                <p className="text-lg font-semibold">{weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
