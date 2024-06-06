import looksSummary from './looksSummary';
import looks from './looks';



const resolvers = {
	Query: {
		...looksSummary.Query,
		...looks.Query
	},
};

export default resolvers;
