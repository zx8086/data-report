// +page.server.ts
import { ApolloClient, gql, InMemoryCache, createHttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
import posthog from 'posthog-js'
import type { Load } from '@sveltejs/kit';

export interface LooksSummary {
	__typename: string;
	hasDeliveryName: number;
	hasDescription: number;
	hasGender: number;
	hasRelatedStyles: number;
	hasTag: number;
	relatedStyles: number;
	hasTitle: number;
	hasTrend: number;
	totalLooks: number;
}

interface LooksSummaryResponse {
	looksSummary: LooksSummary;
}

export interface CollectionsSummary {
	__typename: string;
	totalOptions: number;
	hasImages: number;
	isActive: number;
	isAvailable: number;
	isCancelled: number;
	isClosed: number;
	isInvalid: number;
	isLicensed: number;
	isNew: number;
	isSoldOut: number;
	isUpdated: number;
	isOpenForEcom: number;
	hasDeliveryDates: number;
}

interface CollectionsSummaryResponse {
	optionsSummary: CollectionsSummary;
}

const brandCodeToBrand: any = {
	THEU: 'TH',
	CKEU: 'CK',
	NIKE: 'NIKE'
};

const YOUR_GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

const createApolloClient = () => {
	const link = createHttpLink({
		uri: YOUR_GRAPHQL_ENDPOINT,
		fetch
	});
	const client = new ApolloClient({
		link,
		cache: new InMemoryCache()
	});
	return client;
};

export const load: Load = async ({ params }) => {

	const { styleSeasonCode: season, brandCode, divisionCode: division } = params;

	const brand = brandCode ? (brandCodeToBrand[brandCode] || brandCode) : undefined;

	const looksQuery = gql`
      query looksSummary($brand: String!, $division: String!, $season: String!) {
          looksSummary(brand: $brand, division: $division, season: $season) {
              hasDeliveryName
              hasDescription
              hasGender
              hasRelatedStyles
              hasTag
              hasTitle
              hasTrend
              totalLooks
          }
      }
	`;

	const collectionsQuery = gql`
      query collectionsSummary($ActiveOption: Boolean!, $DivisionCode: String!, $SalesChannels: [SalesChannel!]!, $SalesOrganizationCode: String!,$StyleSeasonCode: String!) {
          optionsSummary(
              ActiveOption: $ActiveOption
              DivisionCode: $DivisionCode
              SalesChannels: $SalesChannels
              SalesOrganizationCode: $SalesOrganizationCode
              StyleSeasonCode: $StyleSeasonCode
          ) {
              totalOptions
              isUpdated
              isSoldOut
              isOpenForEcom
              isNew
              isLicensed
              isInvalid
              isClosed
              isCancelled
              isAvailable
              isActive
              hasImages
              hasDeliveryDates
          }
      }
	`;

	const client = createApolloClient();

	try {

		const looksVariables = {
			brand,
			season,
			division
		};

		const looksResponse = await client.query<LooksSummaryResponse>({ query: looksQuery, variables: looksVariables });

		console.log("Looks Response", looksResponse)

		const collectionsVariables = {
			ActiveOption: true,
			DivisionCode: division,
			SalesChannels: ["SELLIN", "B2B"],
			SalesOrganizationCode: "INLC",
			StyleSeasonCode: season
		};

		const collectionsResponse = await client.query<CollectionsSummaryResponse>({ query: collectionsQuery, variables: collectionsVariables });

		console.log("Collection Response", collectionsResponse)


		if(looksResponse.data.looksSummary && collectionsResponse.data.optionsSummary) {


			// Before returning the result, include this:
			console.log({
				body: {
					looksData: looksResponse.data.looksSummary,
					collectionsData: collectionsResponse.data.optionsSummary
				}
			});
			return {
				body: {
					collectionsData: {
						totalOptions: 4853,
						isActive: 4853,
						isAvailable: 4853,
						hasImages: 4853,
						hasDeliveryDates: 4853,
					},
					looksData: {
						hasGender: 14,
						hasTitle: 118,
						hasTrend: 43,
						totalLooks: 118,
					},
				}
			}

		}
	} catch (error) {
		console.error("Error fetching data: ", error);
		return {
			status: 500,
			error: "Error fetching looks and collections data."
		};
	}
};