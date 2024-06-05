// Importing your resolver
import looksByBrandSeasonDivisionResolver from './looksByBrandSeasonDivisionResolver';

// We will simulate the process that actually calls this
(async () => {
	try {
		const result = await looksByBrandSeasonDivisionResolver.Query.looksByBrandSeasonDivision(null, {
			brand: 'yourBrand',
			season: 'yourSeason',
			division: 'yourDivision'
		});
		console.log(result);
	} catch (error) {
		console.error(error);
	}
})();