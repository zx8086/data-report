/**
 * GraphQL Type Definitions:
 * Contains Look, LookTotals and Queries.
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

    type LookTotals {
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
        looksSummary(brand: String!, season: String!, division: String!): LookTotals
    }
`;

export default typeDefs;