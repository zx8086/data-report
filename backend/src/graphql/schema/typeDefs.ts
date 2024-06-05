/**
 * GraphQL type definitions for queries
 */

const typeDefs: string = `
    type Look {
        divisionCode: String
        lookType: String
        documentKey: String
        assetUrl: String
        title: String
        trend: String
        relatedStyles: [String] 
    }

    type Query {
        hi: String
        looksByBrandSeasonDivision(brand: String!, season: String!, division: String!): [Look]
    }
`;

export default typeDefs;