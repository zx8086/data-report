// $lib/lazyLoad.ts

export function lazyLoad(node: HTMLImageElement) {
	let observer: IntersectionObserver;

	const handleIntersection = (entries: IntersectionObserverEntry[]) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const src = node.dataset.src;
				if (src) {
					node.src = src;
					node.removeAttribute('data-src');
				}
				observer.unobserve(node);
			}
		});
	};

	const setupObserver = () => {
		if ('IntersectionObserver' in window) {
			observer = new IntersectionObserver(handleIntersection, {
				rootMargin: '100px', // Start loading when image is 100px from viewport
			});
			observer.observe(node);
		} else {
			// Fallback for browsers that don't support IntersectionObserver
			const src = node.dataset.src;
			if (src) {
				node.src = src;
				node.removeAttribute('data-src');
			}
		}
	};

	setupObserver();

	return {
		destroy() {
			if (observer) {
				observer.unobserve(node);
			}
		}
	};
}