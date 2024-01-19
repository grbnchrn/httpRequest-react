import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import {
    updateUserPlaces,
    fetchUserPlaces,
} from "./components/HttpConnection.jsx";
import ErrorPopup from "./components/Error.jsx";

function App1() {
    const selectedPlace = useRef();

    const [userPlaces, setUserPlaces] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [errorInUpdation, setErrorInUpdation] = useState();

    const [isFectching, setIsFectching] = useState(false);
    const [errorInFetching, setErrorInFetching] = useState();

    useEffect(() => {
        setIsFectching(true);
        async function fetchPlaces() {
            try {
                const places = await fetchUserPlaces();
                setUserPlaces(places);
            } catch (error) {
                setErrorInFetching({
                    message: "Failed to fetch user places !!",
                });
                
            }
            setIsFectching(false);
        }
        fetchPlaces();
    }, []);

    function handleStartRemovePlace(place) {
        setModalIsOpen(true);
        selectedPlace.current = place;
    }

    function handleStopRemovePlace() {
        setModalIsOpen(false);
    }

    async function handleSelectPlace(selectedPlace) {
        setUserPlaces((prevPickedPlaces) => {
            if (!prevPickedPlaces) {
                prevPickedPlaces = [];
            }
            if (
                prevPickedPlaces.some((place) => place.id === selectedPlace.id)
            ) {
                return prevPickedPlaces;
            }
            return [selectedPlace, ...prevPickedPlaces];
        });
        try {
            await updateUserPlaces([selectedPlace, ...userPlaces]);
        } catch (error) {
            setUserPlaces(userPlaces);
            setErrorInUpdation({
                message: error.message || "Failed to update place.",
            });
        }
    }

    const handleRemovePlace = useCallback(async function handleRemovePlace() {
        setUserPlaces((prevPickedPlaces) =>
            prevPickedPlaces.filter(
                (place) => place.id !== selectedPlace.current.id
            )
        );
        try {
            await updateUserPlaces(
                userPlaces.filter(
                    (place) => place.id !== selectedPlace.current.id
                )
            );
        } catch (error) {
            setUserPlaces(userPlaces);
            setErrorInUpdation({
                message: error.message || "Failed to delete place.",
            });
        }
        setModalIsOpen(false);
    }, []);

    function handleError() {
        setErrorInUpdation(null);
    }

    function handleFetchingError() {
      setErrorInFetching(null);
  }

    return (
        <>
            <Modal open={errorInFetching} onClose={handleFetchingError}>
                {errorInFetching && (
                    <ErrorPopup
                        title="An error occured!"
                        message={errorInFetching.message}
                        onConfirm={handleFetchingError}
                    />
                )}
            </Modal>

            <Modal open={errorInUpdation} onClose={handleError}>
                {errorInUpdation && (
                    <ErrorPopup
                        title="An error occured!"
                        message={errorInUpdation.message}
                        onConfirm={handleError}
                    />
                )}
            </Modal>

            <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
                <DeleteConfirmation
                    onCancel={handleStopRemovePlace}
                    onConfirm={handleRemovePlace}
                />
            </Modal>

            <header>
                <img src={logoImg} alt="Stylized globe" />
                <h1>PlacePicker</h1>
                <p>
                    Create your personal collection of places you would like to
                    visit or you have visited.
                </p>
            </header>
            <main>
                <Places
                    title="I'd like to visit ..."
                    fallbackText="Select the places you would like to visit below."
                    places={userPlaces}
                    onSelectPlace={handleStartRemovePlace}
                    isloading={isFectching}
                    loadingText="Fetching your places ..."
                />

                <AvailablePlaces onSelectPlace={handleSelectPlace} />
            </main>
        </>
    );
}

export default App;
