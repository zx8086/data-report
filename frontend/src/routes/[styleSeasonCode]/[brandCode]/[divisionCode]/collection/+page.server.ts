// +page.server.ts (for optionsProductView)

import { ApolloClient, gql, InMemoryCache, createHttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
import type { Load } from '@sveltejs/kit';

export interface Collection {
	description: string;
	imageUrl: string;
	optionCode: string;
	isAvailable: boolean;
	isCancelled: boolean;
	isClosed: boolean;
	isInvalid: boolean;
	isLicensed: boolean;
	isNew: boolean;
	isOpenForEcom: boolean;
	isSoldOut: boolean;
	isUpdated: boolean;
	hasDeliveryDropDate: boolean;
	activeOption: boolean;
	brandCode: string;
	divisionCode: string;
	images: string[];
}

const brandCodeToBrand: any = {
	THEU: 'TH',
	CKEU: 'CK',
	NIKE: 'NIKE',
};

const activeOption = true;
const salesChannels = ['SELLIN', 'B2B'];

interface ProductResponse {
	collections: Collection[];
}

const YOUR_GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

const link = createHttpLink({
	uri: YOUR_GRAPHQL_ENDPOINT,
	fetch,
});

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});

export const load: Load = async ({ params }) => {
	const { brandCode, divisionCode, styleSeasonCode } = params;

	const brand = brandCode ? (brandCodeToBrand[brandCode] || brandCode) : undefined;

	let salesOrganizationCode = '';
	if(brand === 'CK') {
		salesOrganizationCode = 'CK07';
	} else if(brand === 'TH') {
		salesOrganizationCode = 'THE1';
	}

	console.log("Brand",brand)
	console.log("Parameters",params)
	console.log("Sales Organisation Code",salesOrganizationCode)

	// GraphQL Query for optionsProductView
	const productViewQuery = gql`
      query productView($brandCode: String!, $salesOrganizationCode: String!, $styleSeasonCode: String!, $divisionCode: String!, $activeOption: Boolean!, $salesChannels: [SalesChannel!]!) {
          optionsProductView(
              BrandCode: $brandCode
              SalesOrganizationCode: $salesOrganizationCode
              StyleSeasonCode: $styleSeasonCode
              DivisionCode: $divisionCode
              ActiveOption: $activeOption
              SalesChannels: $salesChannels
          ) {
              description
              imageUrl
              optionCode
              isAvailable
              isCancelled
              isClosed
              isInvalid
              isLicensed
              isNew
              isOpenForEcom
              isSoldOut
              isUpdated
              hasDeliveryDropDate
              activeOption
              brandCode
              divisionCode
              images
          }
      }
	`;
	
	const variables = {
		brandCode,
		salesOrganizationCode,
		styleSeasonCode,
		divisionCode,
		activeOption,
		salesChannels
	};

	console.log("Variables",variables)

	try {
		const response = await client.query({ query: productViewQuery, variables });

		const productData: Collection[] | null = response.data.optionsProductView;

		if (productData && productData.length > 0) {
			return { optionsProductView: productData };

		} else {
			return {
				status: 404,
				error: "No products found for the given parameters.",
			};
		}
	} catch (error) {
		console.error("Error fetching product view data:", error);
		return {
			status: 500,
			error: "Error fetching product data.",
		};
	}
};