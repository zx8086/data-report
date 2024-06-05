import hiResolver from './hiResolver';
import looksByBrandSeasonDivisionResolver from './looksByBrandSeasonDivisionResolver';
import looksTotalsByBrandSeasonDivisionResolver from './looksTotalsByBrandSeasonDivisionResolver';

const resolvers = {
	Query: {
		...hiResolver.Query,
		...looksByBrandSeasonDivisionResolver.Query,
		...looksTotalsByBrandSeasonDivisionResolver.Query,
	},
};

export default resolvers;