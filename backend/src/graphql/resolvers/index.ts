// resolvers/index.ts

import looksSummary from './looksSummary';
import looks from './looks';
import optionsSummary from './optionsSummary';

const resolvers = {
	Query: {
		...looks.Query,
		...looksSummary.Query,
		...optionsSummary.Query,
	}
};

export default resolvers;