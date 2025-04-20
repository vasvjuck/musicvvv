import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";

export const useDebouncedSearch = (value: string, delay = 300) => {
    const [debounced, setDebounced] = useState(value);

    const debouncer = useMemo(
        () => debounce((val) => setDebounced(val), delay),
        [delay]
    );

    useEffect(() => {
        debouncer(value);
        return () => debouncer.cancel();
    }, [value, debouncer]);

    return debounced;
}