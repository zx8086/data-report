// resolvers/index.ts

import looksSummary from './looksSummary';
import looks from './looks';
import optionsSummary from './optionsSummary';
import optionsProductView from './optionsProductView';
import imageDetails from './imageDetails';
import lookDetails from './lookDetails';
import imageUrlCheck from './imageUrlCheck';
import looksUrlCheck from './looksUrlCheck';
import documentSearch from './documentSearch';

const resolvers = {
	Query: {
		...looks.Query,
		...looksSummary.Query,
		...optionsSummary.Query,
		...optionsProductView.Query,
		...imageDetails.Query,
		...lookDetails.Query,
		...imageUrlCheck.Query,
		...looksUrlCheck.Query,
		...documentSearch.Query
	}
};

export default resolvers;