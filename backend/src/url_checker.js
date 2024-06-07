const axios = require('axios');

// Expected media types of images
const expectedMediaTypes = [
	'image/jpeg',
	'image/png',
	'image/svg+xml',
	'image/webp',
	'image/gif',
	'image/apng'
];

// Function to check if URLs are valid
async function checkUrls(looks) {
	let validCount = 0;
	let invalidCount = 0;

	for (const look of looks) {
		try {
			const response = await axios.get(look.assetUrl, {
				responseType: 'stream',
				headers: {'User-Agent': 'Mozilla/5.0'}
			});

			if (response.status === 200 && expectedMediaTypes.includes(response.headers['content-type'])) {
				console.log(`The URL "${look.assetUrl}" is valid.`);
				validCount++;
			} else {
				console.log(`The URL "${look.assetUrl}" is not valid.`);
				invalidCount++;
			}
		} catch (error) {
			console.log(`The URL "${look.assetUrl}" is not valid. Error: ${error.message}`);
			invalidCount++;
		}
	}

	console.log(`Total Valid URLs: ${validCount}`);
	console.log(`Total Invalid URLs: ${invalidCount}`);
}

const looks = [
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 6a_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 1b_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/LOOK_13_097_V3_EXT_R150_CKSportswearM_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 3b_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/LOOK_07_115_V1_EXT_R150_ShapewearCKSportswearM copy_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 6b_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/LOOK_60_126_V2_R150_CKSportswearM_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 3a_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 9_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 5a_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 1a_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/LOOK_27_223_V2_EXT_R150_CKSportswearM_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/LOOK_05_119_V3_EXT_R150_CKSportswearM_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 10a_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 10b_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 5b_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/LOOK_37_162 1_V2_R150_CKSportswearM_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 7_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/LOOK_72_049 1_V1_R150_CKSportswearM_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 8_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/LOOK_07_115_V1_EXT_R150_DenimCKSportswearM_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/LOOK_42_385_V3_EXT_R150_CKSportswearM_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 2_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 4b_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK Mens Key Look 4a_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/LOOK_10_002_V2_R150_CKSportswearM_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/LOOK_21_190 1_V2_R150_CKSportswearM_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK15 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK10_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK16 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK36 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK17 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK30 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK05 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK35 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK30 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK04 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK19 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK18 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK39 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK01 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK07 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK06 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK36 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK09 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK38_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK22 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK32_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK29 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK31 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK15 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK10 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK28 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK23 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK27 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK03 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK31_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK31 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK40 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK34 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK38 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK33 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK04 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK36 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK01 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK28 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK20 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK09_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK38 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK17 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK27 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK20 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK05_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK05 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK33 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK29 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK07 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK11_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK22 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK23 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK13_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK33_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK28_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK35 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK03 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK18 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK03 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK06 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK37 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK15_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK13 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK30 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK24 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK31 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK06 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK26 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK02 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK16 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK26 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK20 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK40 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK14 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK06_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK41 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK22 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK32 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK11 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK33 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK08 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK07_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK16_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK13 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK24 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK34 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK15 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK22 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK28 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK35 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK37 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK01 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK41 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK27 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK23_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK41_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK21 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK13 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK02 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK21 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK14_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK03 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK37 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK23 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK35 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK13 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK21_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK32 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK17 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK39 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK09 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK27 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK17_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK36 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK36_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK25 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK25_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK04 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK26 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK25 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK24 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK14 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK37 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK24_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK08 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK29_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK26_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK38 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK16 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK39_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK19_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK20 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK40 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK07 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK31 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK18_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK28 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK29 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK18 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK22_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK14 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK20_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK19 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK11 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK10 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK05 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK39 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK12 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK29 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK41 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK16 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK26 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK23 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK09 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK40 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK17 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK24 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK19 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK34_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK04 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK34 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK02 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK02 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK12 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK38 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK41 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK40_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK08_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK11 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK07 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK18 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK30 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK05 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK15 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK21 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK21 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK27_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK10 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK32 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK35_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK33 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK06 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK32 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK01 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK12 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK25 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK39 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK08 03_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK30_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK10 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK34 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK37_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK12_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK19 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL SINGLE LOOK25 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK08 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK09 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CKM CL COL LOOK04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK12 02_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK11 01_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/EU SP25 CK CL M COL SINGLE LOOK14 04_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/SP25 CK Mens Moodboard D1_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/SP25 CK Mens Moodboard D2_C5161"
	},
	{
		"assetUrl": "https://s7g10.scene7.com/is/image/TommyHilfigerEU/SP25 CK Mens Moodboard D3_C5161"
	}
];

// Checking all URLs
checkUrls(looks);