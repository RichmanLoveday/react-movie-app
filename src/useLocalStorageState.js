import { useEffect, useState } from "react";

export function useLocalStorageState(initialState, key) {
    // set local storage state
    const [value, setValue] = useState(() => {
        const storedValue = JSON.parse(localStorage.getItem(key)) || initialState;
        // console.log(watched);
        return storedValue;
    });

    // save in local storage
    useEffect(function () {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
}