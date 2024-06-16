// src/lib/utils/index.ts

import posthog from 'posthog-js';

interface Breadcrumb {
	label: string;
	href: string;
}

type SeasonKey = keyof typeof seasonTranslations;
type DivisionKey = keyof typeof divisionTranslations;
type BrandKey = keyof typeof brandTranslations;

const seasonTranslations = {
	"C51": "Spring 2025",
} as const;

const divisionTranslations = {
	"01": "TH Menswear",
	"02": "Tommy Jeans",
	"03": "TH Licensees",
	"04": "TH Kids",
	"05": "TH Womenswear",
	"07": "TH Close to Body",
	"09": "TH Footwear",
	"10": "TH Acessories",
	"61": "CK Menswear",
	"62": "CK Jeans",
	"64": "CKJ Kids",
	"65": "CK Womenswear",
	"67": "CK Underwear",
	"68": "CK Sport",
	"69": "CK Footwear",
	"70": "CK Accessories",
	"77": "CK Swimwear",
	"97": "Nike Underwear"
} as const;

const NON_DIVISION = 'Non-Division';

const brandTranslations = {
	"CKEU": "Calvin Klein",
	"THEU": "Tommy Hilfiger",
	"NIKE": "Nike"
} as const;

export function generateBreadcrumbs(path: string): Breadcrumb[] {

	if (posthog.isFeatureEnabled('console-logging') ) {

		console.log('Generating breadcrumbs for path:', path);
		const segments = path.split('/').filter(Boolean);
		console.log('Path segments:', segments);

	}

	const segments = path.split('/').filter(Boolean);

	if (posthog.isFeatureEnabled('console-logging') ) {

		console.log('Path segments:', segments);

	}

	const breadcrumbs = [{ label: 'HOME', href: '/' }];
	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		const href = breadcrumbs[i].href + segment + '/';
		let label = segment;
		if (seasonTranslations[segment as SeasonKey]) {
			label = seasonTranslations[segment as SeasonKey];
		} else if (brandTranslations[segment as BrandKey]) {
			label = brandTranslations[segment as BrandKey];
		} else {
			label = divisionTranslations[segment as DivisionKey] || NON_DIVISION;
		}
		breadcrumbs.push({ label: label.toUpperCase(), href });
	}

	if (posthog.isFeatureEnabled('console-logging') ) {

		console.log('Final breadcrumbs:', breadcrumbs);
	}
	return breadcrumbs;
}
