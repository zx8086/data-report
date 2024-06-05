import hiResolver from './hiResolver';
import looksByBrandSeasonDivisionResolver from './looksByBrandSeasonDivisionResolver';

const resolvers = {
	Query: {
		...hiResolver.Query,
		...looksByBrandSeasonDivisionResolver.Query,
	},
};

export default resolvers;