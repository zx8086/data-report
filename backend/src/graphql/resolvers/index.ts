// resolvers/index.ts

import looksSummary from './looksSummary';
import looks from './looks';
import optionsSummary from './optionsSummary';
import optionsProductView from './optionsProductView';
import imageDetails from './imageDetails';
import lookDetails from './lookDetails';

const resolvers = {
	Query: {
		...looks.Query,
		...looksSummary.Query,
		...optionsSummary.Query,
		...optionsProductView.Query,
		...imageDetails.Query,
		...lookDetails.Query,
	}
};

export default resolvers;