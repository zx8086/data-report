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
        isDeleted: Boolean
    }

    type LooksTotals {
        hasGender: Int
        hasTag: Int
        totalLooks: Int
        hasRelatedStyles: Int
        hasDescription: Int
        hasTrend: Int
        hasTitle: Int
        hasDeliveryName: Int
    }

    type Query {
        hi: String
        looksByBrandSeasonDivision(brand: String!, season: String!, division: String!): [Look]
        looksTotalsByBrandSeasonDivision(brand: String!, season: String!, division: String!): LooksTotals
    }
`;

export default typeDefs;