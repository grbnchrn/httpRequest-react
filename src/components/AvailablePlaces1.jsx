import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import ErrorPopup from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "./HttpConnection.jsx";

export default function AvailablePlaces1({ onSelectPlace }) {
    const [availPlaces, setAvailPlaces] = useState([]);
    const [isFectching, setIsFectching] = useState(false);
    const [error, setError] = useState();

    /* useEffect(() => {
        fetch("http://localhost:3000/places")
            .then((response) => response.json())
            .then((resData) => setAvailPlaces(resData.places));
    }, []); */

    useEffect(() => {
        setIsFectching(true);
        async function fetchPlaces() {
            try {
                const places = await fetchAvailablePlaces();
                navigator.geolocation.getCurrentPosition((pos) => {
                    const sortedPlaces = sortPlacesByDistance(
                        places,
                        pos.coords.latitude,
                        pos.coords.longitude
                    );
                    setAvailPlaces(sortedPlaces);
                    setIsFectching(false);
                });
            } catch (error) {
                setError({ message: error.message || "Please try later" });
                setIsFectching(false);
            }
        }
        fetchPlaces();
    }, []);

    if (error) {
        return (
            <ErrorPopup
                title="An error occured!"
                message={error.message}
            ></ErrorPopup>
        );
    }

    return (
        <Places
            title="Available Places"
            places={availPlaces}
            isloading={isFectching}
            loadingText="Fetching place data..."
            fallbackText="No places available."
            onSelectPlace={onSelectPlace}
        />
    );
}
