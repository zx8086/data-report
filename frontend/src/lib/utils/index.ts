// src/lib/utils/index.ts
import posthog from 'posthog-js';
import { seasonTranslations, divisionTranslations, brandTranslations, translateCode } from './translations';

interface Breadcrumb {
	label: string;
	href: string;
}

type SeasonKey = keyof typeof seasonTranslations;
type DivisionKey = keyof typeof divisionTranslations;
type BrandKey = keyof typeof brandTranslations;

const NON_DIVISION = 'Non-Division';

export function generateBreadcrumbs(path: string): Breadcrumb[] {
	if (posthog.isFeatureEnabled('console-logging')) {
		console.log('Generating breadcrumbs for path:', path);
	}

	const segments = path.split('/').filter(Boolean);

	if (posthog.isFeatureEnabled('console-logging')) {
		console.log('Path segments:', segments);
	}

	const breadcrumbs = [{ label: 'HOME', href: '/' }];

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		const href = breadcrumbs[i].href + segment + '/';
		let label: string;

		if (i === 0) {
			label = translateCode(segment, 'season');
		} else if (i === 1) {
			label = translateCode(segment, 'brand');
		} else if (i === 2) {
			label = translateCode(segment, 'division');
		} else {
			label = segment;
		}

		if (label === segment && i === 2) {
			label = NON_DIVISION;
		}

		breadcrumbs.push({ label: label.toUpperCase(), href });
	}

	if (posthog.isFeatureEnabled('console-logging')) {
		console.log('Final breadcrumbs:', breadcrumbs);
	}

	return breadcrumbs;
}