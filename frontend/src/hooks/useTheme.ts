import { useEffect } from 'react'
import useThemeStore from '../store/useThemeStore'

const useTheme = () => {
    const { theme } = useThemeStore();
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
    }, [theme]);
}

export default useTheme
