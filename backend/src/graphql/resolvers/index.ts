// resolvers/index.ts

import looksSummary from './looksSummary';
import looks from './looks';
import optionsSummary from './optionsSummary';
import optionsProductView from './optionsProductView';

const resolvers = {
	Query: {
		...looks.Query,
		...looksSummary.Query,
		...optionsSummary.Query,
		...optionsProductView.Query,
	}
};

export default resolvers;