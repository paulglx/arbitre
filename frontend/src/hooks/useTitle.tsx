import { useEffect } from "react";

export const useTitle = (title: string) => {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = title ? `Arbitre | ${title}` : "Arbitre";
        return () => {
            document.title = previousTitle;
        }
    }, [title]);

    return null;
}