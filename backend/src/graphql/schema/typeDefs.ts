/**
 * GraphQL type definitions for queries
 */

const typeDefs: string = `
    type Look {
    	  documentKey: String
        divisionCode: String
        lookType: Int
        assetUrl: String
        title: String
        trend: String
        relatedStyles: [String] 
        isCompleted: Boolean
    }

    type Query {
        hi: String
        looksByBrandSeasonDivision(brand: String!, season: String!, division: String!): [Look]
    }
`;

export default typeDefs;