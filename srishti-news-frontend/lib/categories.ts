export const categories = [
  { slug: "state", odia: "ରାଜ୍ୟ", label: "State" },
  { slug: "national", odia: "ଜାତୀୟ", label: "National" },
  { slug: "international", odia: "ଆନ୍ତର୍ଜାତୀୟ", label: "International" },
  { slug: "business", odia: "ବାଣିଜ୍ୟ", label: "Business" },
  { slug: "editorial", odia: "ସମ୍ପାଦକୀୟ", label: "Editorial" },
  { slug: "crime", odia: "ଅପରାଧ", label: "Crime" },
  { slug: "sports", odia: "ଖେଳ", label: "Sports" },
  { slug: "entertainment", odia: "ମନୋରଞ୍ଜନ", label: "Entertainment" },
  { slug: "lifestyle", odia: "ଜୀବନଶୈଳୀ", label: "Lifestyle" },
  { slug: "religion", odia: "ଧର୍ମ", label: "Religion" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryByOdia(odia: string) {
  return categories.find((c) => c.odia === odia);
}

export function getOdiaFromSlug(slug: string): string {
  return getCategoryBySlug(slug)?.odia || slug;
}

export function getSlugFromOdia(odia: string): string {
  return getCategoryByOdia(odia)?.slug || odia;
}
