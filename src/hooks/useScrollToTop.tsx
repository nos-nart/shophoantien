import { useEffect, useState } from 'react';

export function useScrollToTop() {
	const [showBackToTop, setShowBackToTop] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 200) {
				setShowBackToTop(true);
			} else {
				setShowBackToTop(false);
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};

	return { showBackToTop, scrollToTop };
}
