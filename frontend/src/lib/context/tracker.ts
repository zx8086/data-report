// tracker.ts

import OpenReplayTracker from '@openreplay/tracker';

const trackerKey = Symbol('openreplay tracker symbol');
export { OpenReplayTracker as Tracker, trackerKey as key };