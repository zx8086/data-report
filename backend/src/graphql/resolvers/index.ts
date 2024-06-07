// resolvers/index.ts

import looksSummary from './looksSummary';
import looks from './looks';

const resolvers = {
	Query: {
		...looks.Query,
		...looksSummary.Query,
	}
};

export default resolvers;