import { useState, useEffect } from 'react';

const useMobileStyle = (size, startValue) => {
	const [isMobileDisplay, setMatches] = useState(Boolean(startValue));
	const [mediaMatch, setMediaMatch] = useState(null);
	
	useEffect(() => {
		if (mediaMatch === null) {
			const newMediaMatch = window.matchMedia(`(max-width: ${size}px)`);
			setMediaMatch(newMediaMatch);
			setMatches(newMediaMatch.matches);
		} else {
			const handler = (e) => setMatches(e.matches);
			mediaMatch.addListener(handler);
			return () => mediaMatch.removeListener(handler);
		}
		return () => {};
	});
	
	return isMobileDisplay;
};

export default useMobileStyle;
