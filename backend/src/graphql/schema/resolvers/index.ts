import looksSummary from './looksSummary';

const resolvers = {
	Query: {
		...looksSummary.Query,
	},
};

export default resolvers;