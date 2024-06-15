// +page.server.ts
/** @type {import('./$types').PageLoad} */

import { ApolloClient, createHttpLink, gql, InMemoryCache } from '@apollo/client/core';
import fetch from 'cross-fetch';
import type { CollectionsSummaryResponse, LooksSummaryResponse } from '$lib/types';

const brandCodeToBrand: any = {
	THEU: 'TH',
	CKEU: 'CK',
	NIKE: 'NIKE'
};

const brandCodeToSalesOrgCode: any = {
	THEU: 'THE1',
	CKEU: 'CK07'
};

const YOUR_GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

const createApolloClient = () => {
	const link = createHttpLink({
		uri: YOUR_GRAPHQL_ENDPOINT,
		fetch
	});
	return new ApolloClient({
		link,
		cache: new InMemoryCache()
	});
};

export const load = async ({ params }) => {

	const { styleSeasonCode: season, brandCode, divisionCode: division } = params;

	const brand = brandCode ? (brandCodeToBrand[brandCode] || brandCode) : undefined;
	const salesOrgCode = brandCodeToSalesOrgCode[brandCode] || '';


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
      query collectionsSummary($ActiveOption: Boolean!, $DivisionCode: String!, $SalesChannels: [SalesChannel!]!, $SalesOrganizationCode: String!, $StyleSeasonCode: String!) {
          optionsSummary(
              ActiveOption: $ActiveOption,
              DivisionCode: $DivisionCode,
              SalesChannels: $SalesChannels,
              SalesOrganizationCode: $SalesOrganizationCode,
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
		const looksVariables = { brand, season, division };
		const looksResponse = await client.query<LooksSummaryResponse>({ query: looksQuery, variables: looksVariables });

		const collectionsVariables = {
			ActiveOption: true,
			DivisionCode: division,
			SalesChannels: ["SELLIN", "B2B"],
			SalesOrganizationCode: salesOrgCode,
			StyleSeasonCode: season
		};

		const collectionsResponse = await client.query<CollectionsSummaryResponse>({
			query: collectionsQuery,
			variables: collectionsVariables
		});

		if (looksResponse.data.looksSummary && collectionsResponse.data.optionsSummary) {
			console.log(looksResponse.data.looksSummary);
			console.log(collectionsResponse.data.optionsSummary);
			return {
				divisional: {
					looksData: looksResponse.data.looksSummary,
					collectionsData: collectionsResponse.data.optionsSummary
				}
			}
		} else {
			return {
				status: 404,
				error: "No looks found for the given parameters."
			}
		}
	} catch (error) {
		console.error("Error fetching looks:", error);
		return {
			status: 500,
			error: "Error fetching looks data."
		};
	}
}