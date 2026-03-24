import {useEffect, useRef} from 'react';

function useTitle(title, options = {}) {
    const {restoreOnUnmount = false} = options;
    const prevTitleRef = useRef(document.title);

    useEffect(() => {
        if (title) {
            document.title = title;
        }

        return () => {
            if (restoreOnUnmount) {
                document.title = prevTitleRef.current;
            }
        };
    }, [title, restoreOnUnmount]);
}

export default useTitle;