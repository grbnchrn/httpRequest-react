import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import ErrorPopup from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "./HttpConnection.jsx";
import { useFetch } from "../hooks/useFetch.jsx";

async function fetchSortedPlace() {
    const availPlaces = await fetchAvailablePlaces();

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const sortedPlaces = sortPlacesByDistance(
                availPlaces,
                pos.coords.latitude,
                pos.coords.longitude
            );
            resolve(sortedPlaces);
        });
    });
}
export default function AvailablePlaces({ onSelectPlace }) {
    const {
        isFectching,
        error,
        fetchedData: availSortedPlaces,
    } = useFetch(fetchSortedPlace, []);

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
            places={availSortedPlaces}
            isloading={isFectching}
            loadingText="Fetching place data..."
            fallbackText="No places available."
            onSelectPlace={onSelectPlace}
        />
    );
}
