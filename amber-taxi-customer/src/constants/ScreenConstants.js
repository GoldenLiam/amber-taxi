import { useMediaQuery } from 'react-responsive'

export default function ScreenConstants() {
    const isMobileDevice = useMediaQuery({
        query: "(min-device-width: 320px) and (max-device-width: 480px)",
    });
    
    const isTabletDevice = useMediaQuery({
        query: "(min-device-width: 481px) and (max-device-width: 768px)",
    });

    const isLaptop       = useMediaQuery({
        query: "(min-device-width: 769px) and (max-device-width: 1024px)",
    });

    const isDesktop      = useMediaQuery({
        query: "(min-device-width: 1025px) and (max-device-width: 1201px)",
    });
    
    const isBigScreen    = useMediaQuery({
        query: "(min-device-width: 1201px)",
    });

    const isPortrait     = useMediaQuery({ 
        query: "(orientation: portrait)" 
    })

    return {
        isMobileDevice,
        isTabletDevice,
        isLaptop,
        isDesktop,
        isBigScreen,
        isPortrait
    };
};