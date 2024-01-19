import { useEffect, useState } from "react";

export function useFetch(fetchDataFunct, initialData){

    const [fetchedData, setFetchedData] = useState(initialData);
    const [isFectching, setIsFectching] = useState(false);
    const [error, setError] = useState();
    
    useEffect(() => {
        setIsFectching(true);
        async function fetchData() {
            try {
                const data = await fetchDataFunct();
                setFetchedData(data);
            } catch (error) {
                setError({
                    message: "Failed to fetch data !!",
                });
                
            }
            setIsFectching(false);
        }
        fetchData();
    }, [fetchDataFunct]);

    return ({
        isFectching,
        fetchedData,
        setFetchedData,
        error
    });
}