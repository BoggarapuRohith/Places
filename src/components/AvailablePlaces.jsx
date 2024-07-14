import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        let response = await fetch('http://localhost:3000/places');
        let respData = await response.json();
        if (!response.ok) {
          throw new Error('Failed to fetch Places');
        }
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(respData.places,
            position.coords.latitude,
            position.coords.longitude)
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      }
      catch (error) {
        setError({ message: error.message || "Couldn't fetch places, please try again." });
        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);

  if (error) {
    return <Error title='An Error Occured' message={error.message} />
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText='Fetching available places...'
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
