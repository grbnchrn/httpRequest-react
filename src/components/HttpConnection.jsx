const urlLocal = "http://localhost:3000/";

export async function fetchAvailablePlaces() {
    const response = await fetch(urlLocal+'places');
    const resData = await response.json();
    if (!response.ok) {
        throw new Error("Failed to fetch places !!");
    }

    return resData.places;
}

export async function fetchUserPlaces() {
    const response = await fetch(urlLocal+'user-places');
    const resData = await response.json();
    if (!response.ok) {
        throw new Error("Failed to fetch user places !!");
    }

    return resData.places;
}

export async function updateUserPlaces(places){
    const response = await fetch(urlLocal+'user-places', {
        method: 'PUT',
        body: JSON.stringify({places}), //{places: places}
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const resData = await response.json();

    if (!response.ok) {
        throw new Error('Failed to update user data.');
    }
    return resData.message;

}
