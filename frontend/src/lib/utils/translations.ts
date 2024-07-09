// src/lib/utils/translations.ts

const seasonTranslations = {
	"C51": "Spring 2025",
	// Add more seasons as needed
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

const brandTranslations = {
	"CKEU": "Calvin Klein",
	"THEU": "Tommy Hilfiger",
	"NIKE": "Nike"
} as const;

export function translateCode(code: string, type: 'season' | 'division' | 'brand'): string {
	switch (type) {
		case 'season':
			return seasonTranslations[code as keyof typeof seasonTranslations] || code;
		case 'division':
			return divisionTranslations[code as keyof typeof divisionTranslations] || 'Unknown Division';
		case 'brand':
			return brandTranslations[code as keyof typeof brandTranslations] || code;
		default:
			return code;
	}
}

export function translatePath(path: string): { season: string, brand: string, division: string } {
	const [, seasonCode, brandCode, divisionCode] = path.split('/');
	return {
		season: translateCode(seasonCode, 'season'),
		brand: translateCode(brandCode, 'brand'),
		division: translateCode(divisionCode, 'division')
	};
}