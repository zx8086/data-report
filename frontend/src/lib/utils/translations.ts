// src/lib/utils/translations.ts

export const seasonTranslations = {
	"C52": "Summer 2025",
	"C51": "Spring 2025",
	"C44": "Winter 2024",
} as const;

export const divisionTranslations = {
	"01": "TH Menswear",
	"02": "Tommy Jeans",
	"03": "TH Licensees",
	"04": "TH Kids",
	"05": "TH Womenswear",
	"07": "TH Close to Body",
	"08": "Tommy Sports",
	"09": "TH Footwear",
	"10": "TH Acessories",
	"11": "TH Tailored",
	"18": "TH Collection",
	"61": "CK Menswear",
	"62": "CK Jeans",
	"63": "CK Licensees",
	"64": "CKJ Kids",
	"65": "CK Womenswear",
	"67": "CK Underwear",
	"68": "CK Sport",
	"69": "CK Footwear",
	"70": "CK Accessories",
	"71": "CK Dress Furnishing",
	"72": "CKJ Established 1978",
	"77": "CK Swimwear",
	"91" : "Michael Kors",
	"92" : "IZOD",
	"96" : "CK Legwear",
	"97": "Nike Underwear"
} as const;

export const brandTranslations = {
	"CKEU": "Calvin Klein",
	"THEU": "Tommy Hilfiger",
	"MKEU" : "Michael Kors",
	"IZEU" : "IZOD",
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