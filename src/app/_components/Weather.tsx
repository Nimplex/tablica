/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind } from '@fortawesome/free-solid-svg-icons/faWind';
import { PulseLoader } from 'react-spinners';

import './Weather.css';

const lang = 'pl';
const units = 'metric';

const sun = (
  <path
    d="M-0.492691 72.0625C-31.5936 72.0625 -56.9329 97.4006 -56.9329 128.5C-56.9329 159.599 -31.5936 184.938 -0.492691 184.938C30.6082 184.938 55.9476 159.599 55.9476 128.5C55.9476 97.4006 30.6082 72.0625 -0.492691 72.0625ZM144.371 119.388L88.6947 91.5805L108.39 32.5563C111.036 24.5609 103.451 16.9771 95.5145 19.6814L36.4874 39.3758L8.62006 -16.3562C4.85738 -23.8812 -5.84276 -23.8812 -9.60544 -16.3562L-37.414 39.317L-96.4999 19.6227C-104.496 16.9771 -112.08 24.5609 -109.375 32.4975L-89.68 91.5217L-145.356 119.388C-152.881 123.15 -152.881 133.85 -145.356 137.612L-89.68 165.42L-109.375 224.503C-112.021 232.498 -104.437 240.082 -96.4999 237.377L-37.4728 217.683L-9.66423 273.356C-5.90155 280.881 4.79858 280.881 8.56126 273.356L36.3698 217.683L95.3969 237.377C103.393 240.023 110.977 232.439 108.272 224.503L88.5771 165.478L144.253 137.671C151.896 133.85 151.896 123.15 144.371 119.388ZM52.714 181.704C23.3768 211.04 -24.3622 211.04 -53.6994 181.704C-83.0365 152.368 -83.0365 104.632 -53.6994 75.2959C-24.3622 45.9602 23.3768 45.9602 52.714 75.2959C82.0512 104.632 82.0512 152.368 52.714 181.704Z"
    fill="#fbbf24"
  />
);
const cloud = (
  <path
    d="M63.2141 242.5C109.764 242.5 147.5 204.259 147.5 157.088C147.5 119.702 123.797 87.9261 90.7877 76.3516C86.0972 33.6799 50.3845 0.5 7.02393 0.5C-39.5259 0.5 -77.262 38.7401 -77.262 85.9118C-77.262 96.3456 -75.4159 106.342 -72.0367 115.585C-75.9994 114.795 -80.095 114.382 -84.2858 114.382C-119.198 114.382 -147.5 143.062 -147.5 178.441C-147.5 213.82 -119.198 242.5 -84.2858 242.5H63.2141Z"
    fill="white"
  />
);

export default function Weather({
  apiKey,
  city,
}: {
  apiKey: string;
  city: string;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [gradient, setGradient] = useState({ background: '#0f0f0f' });
  const [temp, setTemp] = useState(0);
  const [wind, setWind] = useState(0);
  const [description, setDescription] = useState('pogodnie');
  const [icon, setIcon] = useState(sun);

  const fetchData = async () => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=${lang}&units=${units}`,
    );

    if (!res.ok) {
      setLoading(false);
      return setError('Wystąpił błąd w trakcie ładowania pogody');
    } else {
      setLoading(true);
      setError(null);
    }

    const json = await res.json();

    setDescription(json.weather[0].description.split(' ')[0]);
    setTemp(Math.round(json.main.temp));
    setWind(Math.round(json.wind.speed));

    switch (json.weather[0].main) {
      case 'Clouds':
        setIcon(cloud);
        setGradient({
          background: `linear-gradient(
            0deg,
            rgb(93, 93, 93) 0%,
            rgba(15, 15, 15, 1) 90%
          )`,
        });
        break;
      case 'Clear':
        setIcon(sun);
        setGradient({
          background: `linear-gradient(
            0deg,
            #ca9204 0%,
            rgba(15, 15, 15, 1) 90%
          )`,
        });
        break;
    }

    setLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 120000);

    fetchData();

    return () => clearInterval(interval);
  }, []);

  return !loading ? (
    error ? (
      <div className="weather-loading" style={gradient}>
        <h1>{error}</h1>
      </div>
    ) : (
      <div className="weather" style={gradient}>
        <svg height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          {icon}
        </svg>

        <div className="right">
          <h1 className="weather-temp">{temp}°C</h1>
          <h2 className="weather-description">{description}</h2>
          <h2 className="weather-wind">
            <FontAwesomeIcon icon={faWind} /> {wind} km/h
          </h2>
        </div>
      </div>
    )
  ) : (
    <div className="weather-loading" style={gradient}>
      <PulseLoader size={'20px'} color={'#fafafa'} />
    </div>
  );
}
