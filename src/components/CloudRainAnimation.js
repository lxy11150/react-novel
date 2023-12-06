import React, { useState, useEffect } from 'react';

const CloudRainAnimation = () => {
  const [raindrops, setRaindrops] = useState([]);

  const randomText = () => {
    const text = '山羊我爱你';
    const letter = text[Math.floor(Math.random() * text.length)];
    return letter;
  };

  const createRaindrop = () => {
    const left = Math.floor(Math.random() * 310);
    const size = Math.random() * 1.5;
    const duration = Math.random() * 1;
    const text = randomText();

    return {
      id: Date.now(),
      left,
      size,
      duration,
      text,
    };
  };

  const rain = () => {
    const newRaindrop = createRaindrop();
    setRaindrops((prevRaindrops) => [...prevRaindrops, newRaindrop]);

    setTimeout(() => {
      setRaindrops((prevRaindrops) =>
        prevRaindrops.filter((drop) => drop.id !== newRaindrop.id)
      );
    }, 2000);
  };

  useEffect(() => {
    const intervalId = setInterval(rain, 20);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="shell">
      <div className="cloud">
        {raindrops.map((raindrop) => (
          <div
            key={raindrop.id}
            className="text"
            style={{
              left: `${raindrop.left}px`,
              fontSize: `${0.5 + raindrop.size}em`,
              animationDuration: `${1 + raindrop.duration}s`,
            }}
          >
            {raindrop.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudRainAnimation;
