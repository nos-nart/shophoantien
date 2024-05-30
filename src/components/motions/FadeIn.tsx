'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';

interface MotionProps extends PropsWithChildren {
	className?: string;
	delay?: number;
	duration?: number;
	initialY?: number;
	initialX?: number;
}

export const FadeIn = (props: MotionProps) => {
	const pathname = usePathname();
	const { initialY = -30, initialX = 0, duration = 0.5, delay = 0, className } = props;

	return (
		<motion.div
			initial={{ opacity: 0, x: initialX, y: initialY }}
			animate={{ opacity: 1, x: 0, y: 0 }}
			transition={{ duration, type: 'spring', delay }}
			className={className}
			key={pathname}>
			{props.children}
		</motion.div>
	);
};

FadeIn.displayName = 'FadeIn';
