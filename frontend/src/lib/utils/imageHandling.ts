// $lib/utils/imageHandling.ts

const DEFAULT_IMAGE = '/img/not-found.png';
const LOADING_IMAGE = '/img/loading-placeholder.png';
const TIMEOUT = 30000; // 30 seconds

export function handleImage(node: HTMLImageElement) {
	let timer: Timer;
	const originalSrc = node.dataset.src || node.src;

	const setDefaultSrc = () => {
		if (node.src !== DEFAULT_IMAGE) {
			console.error('Image failed to load:', originalSrc);
			node.src = DEFAULT_IMAGE;
		}
		clearTimeout(timer);
	};

	const loadImage = () => {
		if (node.src === originalSrc) return; // Image is already loaded

		node.src = LOADING_IMAGE; // Show loading placeholder

		const img = new Image();
		img.onload = () => {
			clearTimeout(timer);
			node.src = originalSrc;
			console.log('Image loaded successfully:', originalSrc);
		};
		img.onerror = () => {
			console.error('Image load error:', originalSrc);
			setDefaultSrc();
		};

		timer = setTimeout(() => {
			console.warn('Image load timed out:', originalSrc);
			setDefaultSrc();
		}, TIMEOUT);

		img.src = originalSrc;
	};

	return {
		update() {
			loadImage();
		},
		destroy() {
			clearTimeout(timer);
		}
	};
}