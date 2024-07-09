// tracker.ts

import type OpenReplayTracker from '@openreplay/tracker';

const trackerKey = Symbol('openreplay tracker symbol');

let Tracker: typeof OpenReplayTracker;

if (typeof window !== 'undefined') {
	Tracker = (await import('@openreplay/tracker')).default;
}

export { Tracker, trackerKey as key };