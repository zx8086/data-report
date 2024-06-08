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

    type Status {
        code: String
        description: String
        isAvailable: Boolean
        isCancelled: Boolean
        isClosed: Boolean
        isInvalid: Boolean
        isSoldOut: Boolean
    }

    type Size {
        EAN: String
        index: Int
        name: String
        pimVariantKeyNo: String
        sapVariant: String
        status: Status
    }

    type SizeSet {
        sizes: [Size]
    }

    type Inseam {
        null: SizesMap
    }

    type SizesMap {
        sizes: [Size]
    }

    type Dimensions {
        heelHeight: Int
        height: Int
        length: Int
        shaftHeight: Int
        width: Int
    }

    type Theme {
        name: String
    }

    type PimDeliveryDates {
        additionalDeliveryDate: String
        adjustedDeliveryDate: String
        dropDate: Float
        modifiedOn: String
    }

    type MerchandisingHierarchy {
        business: String
        category: String
        code: String
        gender: String
        lifestyle: String
        productgroup: String
        productsubgroup: String
        world: String
    }

    type Option {
        activeOption: Boolean
        brandCode: String
        certificationStyles: [String]
        channels: [String]
        collection: String
        collectionStructure: String
        color: String
        colorDescription1: String
        colorDescription2: String
        consumerAssortment: String
        consumerAssortmentCode: String
        copiedFromOption: String
        countryOfOrigin: String
        ctpMonth: String
        description: String
        descriptions: String
        dimensions: Dimensions
        distribution: String
        divisionCode: String
        documentType: String
        fabric: String
        fashionability: String
        fashionabilityCode: String
        fit: String
        fitForBottoms: String
        fitForTops: String
        fmsCollectionCode: String
        fmsMainSeasonCode: String
        garmentLength: String
        hasSustainableMaterials: Boolean
        hexCode: String
        images: String
        innovation: Boolean
        innovationAttributes: String
        inseams: Inseam
        internalStyleName: String
        internal_id: String
        isAvailable: Boolean
        isCancelled: Boolean
        isClosed: Boolean
        isInvalid: Boolean
        isLicensed: Boolean
        isNew: Boolean
        isSoldOut: Boolean
        isUpdated: Boolean
        keyLook: String
        label: String
        llo: Int
        mainSeason: String
        merchandisingHierarchy: MerchandisingHierarchy
        neckline: String
        openForEcom: Boolean
        optionCode: String
        optionType: String
        originatingProductLine: String
        originatingProductLineCode: String
        packingType: String
        pimDeliveryDates: PimDeliveryDates
        pimOptionKeyNo: String
        pimProductKeyNo: String
        prepackSizeOffer: String
        priceBySize: Boolean
        productStory: String
        program: String
        referenceOptionNumber: String
        referenceStyleNumber: String
        rise: String
        salesChannels: [String]
        salesComments: String
        salesOrganizationCode: String
        seasonYear: String
        shape: String
        sizeCode: String
        sizeRange: String
        sizeRangeOption: String
        sleeveLength: String
        styleDescription: String
        styleDescriptions: [String]
        styleNumber: String
        styleSeasonCode: String
        sustainableAttribute: String
        sustainableFiber: String
        sustainableFibers: [String]
        swatchBookNumber: String
        theme: Theme
        wash: String
    }
    
    type Query {
        looksSummary(brand: String, season: String, division: String): LookSummary
        looks(brand: String, season: String, division: String): [Look]
    }
`;

export default typeDefs;
