export interface LocalizedText {
  "#text": string;
  "@_locale": string;
}

export interface OldCover {
  "@_locale": string;
  image: {
    embed: {
      "@_filename": string;
      "@_encoding": string;
      "@_mime_type": string;
      "#text": string;
    };
  };
}

export interface OldArticleAuthor {
  "@_primary_contact": boolean;
  affiliation: LocalizedText[];
  country: string;
  email: string;
  firstname: string;
  lastname: string;
  middlename?: string;
}

export interface OldGalley {
  "@_locale": string;
  file: {
    embed: {
      "@_filename": string;
      "@_encoding"?: string;
      "@_mime_type"?: string;
      "#text": string;
    };
  };
  id: {
    "#text": string;
    "@_type": string;
  };
  label: string;
}

export interface OldIndexing {
  discipline?: LocalizedText;
  subject: LocalizedText[];
  type: LocalizedText;
}

export interface OldArticle {
  "@_locale": string;
  "@_language": string;
  abstract: LocalizedText[];
  author: OldArticleAuthor[];
  date_published: string;
  galley: OldGalley[];
  id: {
    "#text": string;
    "@_type": string;
  };
  indexing: OldIndexing;
  pages: string;
  permissions: {
    copyright_holder: LocalizedText[];
    copyright_year: string;
    license_url: string;
  };
  title: LocalizedText[];
}

export interface OldSection {
  title: LocalizedText;
  abbrev: LocalizedText;
  article: OldArticle[];
}

export interface OldIssue {
  "@_published": string;
  "@_current": string;
  "@_identification": string;
  id?: {
    "#text": string;
    "@_type": string;
  };
  cover: OldCover[];
  volume: string;
  number: string;
  year: string;
  date_published: string;
  open_access: string;
  title: LocalizedText[];
  section: OldSection;
}

export interface ParsedXML {
  "?xml": {
    "@_version": string;
    "@_encoding": string;
  };
  issue: OldIssue;
}
