import React, { useState, useEffect } from 'react';
import axios from 'axios'; // You need to import axios

const QuoteCard = () => {
  const [quote, setQuote] = useState(null);
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get('https://api.api-ninjas.com/v1/quotes', {
          headers: { 'X-Api-Key': 'yZ6gFVmBD+IrF4cayCGSfw==n06PFnxptPLkqOF9' },
        });

        setQuote(response.data[0]);
        console.log(response.data[0]);
      } catch (err) {
        setError('Could not load daily quote');
        console.error(err);
      }
    };

    const fetchMusic = async () => {
      try {
        const apiKey = '2a351279d5bb97e12b582bd96d0c680d';

        const response = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json&limit=1`);

        if (response.data.tracks && response.data.tracks.track && response.data.tracks.track.length > 0) {
          setMusic(response.data.tracks.track[0]);
        }
      } catch (err) {
        console.error('Could not load music recommendation', err);
        // Fallback data if API fails
        setMusic({
          name: 'Dynamite',
          artist: { name: 'BTS' },
          image: [{ '#text': 'https://cdn-icons-png.flaticon.com/512/3659/3659784.png', size: 'medium' }],
        });
      } finally {
        setLoading(false);
      }
    };

    // Run both API requests
    Promise.all([fetchQuote(), fetchMusic()]);
  }, []);

  if (loading && !quote && !music) {
    return (
      <div className="h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl shadow-lg overflow-hidden flex items-center justify-center">
        <div className="animate-pulse text-white">Loading daily inspiration...</div>
      </div>
    );
  }

  return (
    <div className="h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl shadow-lg overflow-hidden flex flex-col">
      <div className="p-5 text-white flex-1 flex flex-col">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-4">Daily Inspiration</h2>

        {/* Quote Section */}
        <h3 className="text-lg font-semibold mb-2">Today's Quote</h3>
        <div className="flex-1 mb-2">
          {quote ? (
            <div className="bg-white bg-opacity-20 rounded-lg p-4 h-full flex flex-col justify-center">
              <p className="italic text-sm leading-relaxed mb-3 line-clamp-4">"{quote.quote.length > 120 ? quote.quote.substring(0, 120) + '...' : quote.quote}"</p>
              <p className="text-right text-xs opacity-90">— {quote.author}</p>
            </div>
          ) : error ? (
            <div className="bg-white bg-opacity-20 rounded-lg p-4 h-full flex items-center justify-center">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          ) : (
            <div className="animate-pulse h-full bg-white bg-opacity-10 rounded-lg"></div>
          )}
        </div>

        {/* Music Section */}
        <h3 className="text-lg font-semibold mb-2">Today's Track</h3>
        <div className="flex-1">
          {music ? (
            <div className="bg-white bg-opacity-20 rounded-lg p-4 h-full flex items-center">
              <div className="mr-3 flex-shrink-0">
                <img
                  src={music.image && music.image.length > 0 ? music.image[1]['#text'] : 'https://cdn-icons-png.flaticon.com/512/3659/3659784.png'}
                  alt="Album art"
                  className="w-12 h-12 rounded object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{music.name.length > 25 ? music.name.substring(0, 25) + '...' : music.name}</p>
                <p className="text-xs opacity-90 truncate">{music.artist ? music.artist.name : 'Unknown Artist'}</p>
                <div className="mt-2 flex items-center">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-75"></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-150"></div>
                  </div>
                  <span className="ml-2 text-xs opacity-75">Now Playing</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse h-full bg-white bg-opacity-10 rounded-lg"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
