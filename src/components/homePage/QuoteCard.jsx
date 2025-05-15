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
    return <div className="animate-pulse p-4">Loading daily inspiration...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl shadow-lg overflow-hidden">
      <div className="p-5 text-white">
        <h2 className="text-2xl font-bold mb-4">Daily Inspiration</h2>

        {/* Quote Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Today's Quote</h3>
          {quote ? (
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="italic">"{quote.quote}"</p>
              <p className="text-right mt-1 text-sm">— {quote.author}</p>
            </div>
          ) : error ? (
            <p className="text-red-200">{error}</p>
          ) : (
            <div className="animate-pulse h-20 bg-white bg-opacity-10 rounded"></div>
          )}
        </div>

        {/* Music Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Today's Track</h3>
          {music ? (
            <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center">
              <div className="mr-3">
                <img
                  src={music.image && music.image.length > 0 ? music.image[1]['#text'] : 'https://cdn-icons-png.flaticon.com/512/3659/3659784.png'}
                  alt="Album art"
                  className="w-12 h-12 rounded"
                />
              </div>
              <div>
                <p className="font-medium">{music.name}</p>
                <p className="text-sm">{music.artist ? music.artist.name : 'Unknown Artist'}</p>
              </div>
            </div>
          ) : (
            <div className="animate-pulse h-20 bg-white bg-opacity-10 rounded"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
