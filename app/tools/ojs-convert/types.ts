export interface LocalizedText {
  "#text": string;
  "@_locale": string;
}

export interface LocalizedTextAdvice {
  "#text": string;
  "@_locale": string;
  "@_advice": string;
}

export interface OldCover {
  "@_locale": string;
  cover_image: string;
  cover_image_alt_text?: string | null;
  embed: {
    "@_encoding": string;
    "#text": string;
  };
}

export interface OldArticleAuthor {
  "@_include_in_browse": boolean | string;
  "@_user_group_ref": string;
  "@_seq": number | string;
  "@_id": number | string;

  givenname: LocalizedText[];
  familyname: LocalizedText[];
  affiliation: LocalizedText[];
  country: string;
  email: string;
}

export interface OldArticleGalley {
  "@_locale": string;
  id: LocalizedTextAdvice[];
  name: {
    "#text": string;
    "@_locale": string;
  };
  submission_file_ref: {
    "@_id": string;
  };
  seq: string;
}

export interface OldPublication {
  "@_locale": string;
  "@_version": string;
  "@_status": string;
  "@_primary_contact_id": string;
  "@_date_published": string;
  "@_section_ref": string;
  "@_access_status": string;
  id: LocalizedTextAdvice[];
  title: LocalizedText[];
  abstract: LocalizedText[];
  copyrightHolder: LocalizedText[];
  licenseUrl: string;
  copyrightYear: string;
  keywords: {
    "@_locale": string;
    keyword: string[];
  }[];
  languages: {
    "@_locale": string;
    laguage: string;
  }[];
  disciplines?: {
    "@_locale": string;
    discipline: string;
  }[];
  authors: {
    author: OldArticleAuthor[];
  };
  article_galley: OldArticleGalley[];
  citations: {
    citation: string[];
  };
  pages: string;
}

export interface OldSubmissionFile {
  "@_id": string;
  "@_created_at": string;
  "@_file_id": string;
  "@_stage": string;
  "@_updated_at": string;
  "@_genre": string;
  "@_uploader": string;
  name: {
    "#text": string;
    "@_locale": string;
  };
  file: {
    "@_id": string;
    embed: {
      "@_encoding": string;
      "#text": string;
    };
  };
}

export interface OldIndexing {
  discipline?: LocalizedText;
  subject: LocalizedText[];
  type: LocalizedText;
}

export interface OldArticle {
  "@_locale": string;
  "@_language": string;
  "@date_submitted": string;
  "@_status": string;
  "@_stage": string;
  "@_current_publication_id": string;
  id: LocalizedTextAdvice[];
  submission_file: OldSubmissionFile[];
  author: OldArticleAuthor[];
  publication: OldPublication;
}

export interface OldSection {
  title: LocalizedText[];
  abbrev: LocalizedText[];
  policy: LocalizedText[];
}

export interface OldIssue {
  "@_published": string;
  "@_current": string;
  id: LocalizedTextAdvice[];
  issue_identification: {
    title: LocalizedText[];
  };
  date_published: string;
  last_modified: string;
  sections: {
    section: OldSection;
  };
  articles: {
    article: OldArticle[];
  };
  covers: {
    cover: OldCover[];
  };
}

export interface ParsedXML {
  "?xml": {
    "@_version": string;
    "@_encoding": string;
  };
  issue: OldIssue;
}
