import hiResolver from './hiResolver';
import looksByBrandSeasonDivision from './looksByBrandSeasonDivision';
import looksTotalsByBrandSeasonDivision from './looksTotalsByBrandSeasonDivision';

const resolvers = {
	Query: {
		...hiResolver.Query,
		...looksByBrandSeasonDivision.Query,
		...looksTotalsByBrandSeasonDivision.Query,
	},
};

export default resolvers;