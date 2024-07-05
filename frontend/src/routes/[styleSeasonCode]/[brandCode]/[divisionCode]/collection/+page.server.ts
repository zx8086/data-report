// +page.server.ts (collection)
import { ApolloClient, gql, InMemoryCache, createHttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
import type { PageServerLoad, Actions } from './$types';
import type { Collection } from '$lib/types';

const brandCodeToBrand: any = {
	THEU: 'TH',
	CKEU: 'CK',
	NIKE: 'NIKE',
};

const activeOption = true;
const salesChannels = ['SELLIN', 'B2B'];

// interface ProductResponse {
// 	collections: Collection[];
// }

const YOUR_GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

const link = createHttpLink({
	uri: YOUR_GRAPHQL_ENDPOINT,
	fetch,
});

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});

export const load: PageServerLoad = async ({ params }) => {
	const { brandCode, divisionCode, styleSeasonCode } = params;

	const brand = brandCode ? (brandCodeToBrand[brandCode] || brandCode) : undefined;

	let salesOrganizationCode = '';
	if(brand === 'CK') {
		salesOrganizationCode = 'CK07';
	} else if(brand === 'TH') {
		salesOrganizationCode = 'THE1';
	}

	console.log("Brand", brand)
	console.log("Parameters", params)
	console.log("Sales Organisation Code", salesOrganizationCode)

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
              hasImageDocument
              styleDescription
              internal_id
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

	console.log("Variables", variables)

	try {
		console.log("Sending GraphQL query with variables:", variables);
		const response = await client.query({ query: productViewQuery, variables });

		const productData: Collection[] | null = response.data.optionsProductView;

		if (productData && productData.length > 0) {
			return { optionsProductView: productData };
		} else {
			console.log("No products found");
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

export const actions: Actions = {
	getImageDetails: async ({ request }) => {
		const data = await request.formData();
		const divisionCode = data.get('divisionCode') as string;
		const styleCode = data.get('styleCode') as string;
		const styleSeasonCode = data.get('styleSeasonCode') as string;

		const imageDetailsQuery = gql`
        query ImageDetails($divisionCode: String!, $styleCode: String!, $styleSeasonCode: String!) {
            imageDetails(
                divisionCode: $divisionCode
                styleCode: $styleCode
                styleSeasonCode: $styleSeasonCode
            ) {
                imageKey
                back2ModifiedOn
                back2Url
                backModifiedOn
                backUrl
                detail2ModifiedOn
                detail2Url
                detail3ModifiedOn
                detail3Url
                detailModifiedOn
                detailUrl
                fabricScanModifiedOn
                fabricScanUrl
                front2ModifiedOn
                front2Url
                frontModifiedOn
                frontUrl
                i360ModifiedOn
                i360Url
                imageModifiedOn
                imageUrl
                inside2ModifiedOn
                inside2Url
                insideModifiedOn
                insideUrl
                packageModifiedOn
                packageUrl
                sketchModifiedOn
                sketchUrl
            }
        }
		`;

		const variables = {
			divisionCode,
			styleCode,
			styleSeasonCode
		};

		try {
			console.log("Sending GraphQL query for image details with variables:", variables);
			const response = await client.query({ query: imageDetailsQuery, variables });

			const imageData = response.data.imageDetails;

			if (imageData) {
				const { __typename, ...cleanedImageData } = imageData;

				console.log("Fetched via Action Form Call - deconstructed:", cleanedImageData);

				return { success: true, imageDetails: cleanedImageData };
			} else {
				console.log("No image details found");
				return {
					success: false,
					error: "No image details found for the given parameters.",
				};
			}
		} catch (error) {
			console.error("Error fetching image details:", error);
			return {
				success: false,
				error: "Error fetching image details.",
			};
		}
	}
};