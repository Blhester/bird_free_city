let intersectionObserver : IntersectionObserver;

const ensureIntersectionObserver = () => {
	if (intersectionObserver) return;

    intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(async entry => {
                    const eventName = entry.isIntersecting ? 'enterViewport' : 'exitViewport';
                    await timeout(50);
                    entry.target.dispatchEvent(new CustomEvent(eventName));
                });
            }
        );
}

const viewport = (element: Element) => {
	ensureIntersectionObserver();

	intersectionObserver.observe(element);

	return {
		destroy() {
			intersectionObserver.unobserve(element);
		}
	}
}

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default viewport;