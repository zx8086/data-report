import { gql } from 'graphql-tag';

const typeDefs = gql`
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

    type LookSummary {
        hasDeliveryName: Int
        hasDescription: Int
        hasGender: Int
        hasRelatedStyles: Int
        hasTag: Int
        hasTitle: Int
        hasTrend: Int
        totalLooks: Int
    }

    type Query {
        looksSummary(brand: String, season: String, division: String): LookSummary
    }
`;

export default typeDefs;
