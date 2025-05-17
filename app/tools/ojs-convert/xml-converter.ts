import { XMLBuilder, XMLParser } from "fast-xml-parser";
import type { X2jOptions, XmlBuilderOptions } from "fast-xml-parser";

const _IS_ONLY_ENGLISH_VERSION = false;
const _LANG_VI = "vi_VN";
const _LANG_EN = "en_US";
const _DEFAULT_XMLNS_XSI = "http://www.w3.org/2001/XMLSchema-instance";
const _DEFAULT_XMLNS = "http://pkp.sfu.ca";
const _DEFAULT_XMLNS_XSI_SCHEMA = "http://pkp.sfu.ca native.xsd";
const _ISSUE_PUBLISHED = "1";
const _ISSUE_CURRENT = "1";
const _ISSUE_ACCESS_STATUS = "1";
const _ISSUE_DATE_MODIFIED = new Date().toISOString().split("T")[0];
const _SECTION_ABBR = "BV";
const _SECTION_TITLE = "Bài viết";
const _AUTHOR_USER_GROUP = "Tác giả";

export function restoreXml(str: string): string {
  return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  // .replace(/&quot;/g, '"')
  // .replace(/&apos;/g, "'")
  // .replace(/&amp;/g, "&")
  // .replace(/&#13;/g, "\r");
}

function escapeXml(str: string): string {
  return (
    str
      // .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
  );
  // .replace(/"/g, "&quot;")
  // .replace(/'/g, "&apos;")
  // .replace(/&amp;#13;/g, "");
}

interface LocalizedText {
  "#text": string;
  "@_locale": string;
}

interface OldCover {
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

interface OldArticleAuthor {
  "@_primary_contact": boolean;
  affiliation: LocalizedText[];
  country: string;
  email: string;
  firstname: string;
  lastname: string;
  middlename?: string;
}

interface OldGalley {
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

interface OldIndexing {
  discipline?: LocalizedText;
  subject: LocalizedText[];
  type: LocalizedText;
}

interface OldArticle {
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

interface OldSection {
  title: LocalizedText;
  abbrev: LocalizedText;
  article: OldArticle[];
}

interface OldIssue {
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

interface ParsedXML {
  "?xml": {
    "@_version": string;
    "@_encoding": string;
  };
  issue: OldIssue;
}

function createParser() {
  const options: X2jOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    isArray: (name: string) =>
      [
        "title",
        "abbrev",
        "subject",
        "article",
        "author",
        "galley",
        "abstract",
        "keywords",
        "givenname",
        "familyname",
        "affiliation"
      ].includes(name),
    parseAttributeValue: true,
    parseTagValue: true,
    trimValues: true
  };
  return new XMLParser(options);
}

function createBuilder() {
  const options: XmlBuilderOptions = {
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    suppressBooleanAttributes: false
  };
  return new XMLBuilder(options);
}

function validateParsedData(data: ParsedXML): void {
  if (!data?.issue) {
    throw new Error("Invalid XML: Missing issue element");
  }

  if (!data.issue.section) {
    throw new Error("Invalid XML: No sections found");
  }

  const articles = data.issue.section.article;

  for (const article of articles) {
    if (!article.title || !article["@_locale"]) {
      throw new Error("Invalid XML: Article missing title or locale");
    }
  }
}

function convertAuthors(authors: OldArticleAuthor[]) {
  return authors.map((author) => ({
    "@_primary_contact": author["@_primary_contact"] ? "true" : "false",
    "@_include_in_browse": "true",
    "@_user_group_ref": _AUTHOR_USER_GROUP,
    givenname: _IS_ONLY_ENGLISH_VERSION
      ? { "@_locale": _LANG_EN, "#text": `${author.firstname} ${author.middlename}` }
      : [
          {
            "@_locale": _LANG_VI,
            "#text": `${author.firstname} ${author.middlename}`
          },
          {
            "@_locale": _LANG_EN,
            "#text": `${author.firstname} ${author.middlename}`
          }
        ],
    familyname: _IS_ONLY_ENGLISH_VERSION
      ? { "@_locale": _LANG_EN, "#text": author.lastname }
      : [
          {
            "@_locale": _LANG_VI,
            "#text": author.lastname
          },
          {
            "@_locale": _LANG_EN,
            "#text": author.lastname
          }
        ],
    email: author.email,
    biography: author.affiliation?.map((bio) => ({
      "@_locale": bio["@_locale"],
      "#text": bio["#text"]
    }))
  }));
}

function convertArticles(articles: OldArticle[]) {
  return articles.map((article: OldArticle, idx) => {
    return {
      "@_xmlns:xsi": _DEFAULT_XMLNS_XSI,
      "@_locale": article["@_locale"],
      "@_language": article["@_language"],
      "@_date_submitted": article.date_published,
      "@_stage": "submission",
      "@_date_published": article.date_published,
      "@_section_ref": _SECTION_ABBR,
      "@_seq": `${idx + 1}`,
      "@_access_status": "0",
      id: {
        "#text": article.id["#text"] || `${idx + 1}`,
        "@_type": "internal",
        "@_advice": "ignore"
      },
      title: _IS_ONLY_ENGLISH_VERSION ? { "@_locale": _LANG_EN, "#text": article.title[0]["#text"] } : article.title,
      abstract: article.abstract.map((abstract) => {
        const abstractText = escapeXml(abstract["#text"]);
        return {
          "@_locale": abstract["@_locale"],
          "#text": abstractText.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        };
      }),
      keywords: article.indexing.subject.map((subject) => ({
        "@_locale": subject["@_locale"],
        keyword: escapeXml(subject["#text"])
      })),
      authors: {
        "@_xmlns:xsi": _DEFAULT_XMLNS_XSI,
        "@_xsi:schemaLocation": _DEFAULT_XMLNS_XSI_SCHEMA,
        author: convertAuthors(article.author)
      },
      submission_file: {
        "@_xmlns:xsi": _DEFAULT_XMLNS_XSI,
        "@_stage": "proof",
        "@_id": `${idx + 1}`,
        "@_xsi:schemaLocation": _DEFAULT_XMLNS_XSI_SCHEMA,
        revision: {
          "@_number": "1",
          "@_genre": "Điều văn bản",
          "@_filename": article.galley[0].file.embed["@_filename"],
          "@_viewable": "false",
          "@_date_uploaded": article.date_published,
          "@_date_modified": article.date_published,
          "@_filetype": "application/pdf",
          "@_uploader": "tuyethtk",
          name: {
            "@_locale": article.galley[0]["@_locale"],
            "#text": article.galley[0].file.embed["@_filename"]
          },
          embed: {
            "@_encoding": "base64",
            "#text": article.galley[0].file.embed["#text"]
          }
        }
      },
      article_galley: {
        "@_xmlns:xsi": _DEFAULT_XMLNS_XSI,
        "@_approved": "false",
        "@_xsi:schemaLocation": _DEFAULT_XMLNS_XSI_SCHEMA,
        id: {
          "#text": article.galley[0]?.id?.["#text"] || `${idx + 1}`,
          "@_type": "internal",
          "@_advice": "ignore"
        },
        name: {
          "@_locale": article.galley[0]["@_locale"],
          "#text": "PDF"
        },
        seq: "0",
        submission_file_ref: {
          "@_id": `${idx + 1}`,
          "@_revision": "1"
        }
      },
      pages: article.pages
    };
  });
}

function convertSection(oldSection: OldSection) {
  return {
    "@_ref": _SECTION_ABBR,
    "@_seq": "0",
    "@_editor_restricted": "0",
    "@_meta_indexed": "1",
    "@_abstracts_not_required": "0",
    "@_hide_title": "0",
    "@_hide_author": "0",
    "@_abstract_word_count": "0",
    id: {
      "@_type": "internal",
      "@_advice": "ignore",
      "#text": "813"
    },
    abbrev: {
      "@_locale": _LANG_VI,
      "#text": _SECTION_ABBR
    },
    title: {
      "@_locale": _LANG_VI,
      "#text": _SECTION_TITLE
    }
  };
}

function convertCovers(covers: OldCover[]) {
  return covers.map((cover) => ({
    "@_locale": cover["@_locale"],
    cover_image: cover.image.embed["@_filename"],
    cover_image_alt_text: "",
    embed: {
      "@_encoding": "base64",
      "#text": cover.image.embed["#text"]
    }
  }));
}

function converIssue(issue: OldIssue) {
  const issueTitle = `${issue.volume}(${issue.number})${issue.year}`;

  return {
    "@_xmlns": _DEFAULT_XMLNS,
    "@_xmlns:xsi": _DEFAULT_XMLNS_XSI,
    "@_published": _ISSUE_PUBLISHED,
    "@_current": _ISSUE_CURRENT,
    "@_access_status": _ISSUE_ACCESS_STATUS,
    "@_xsi:schemaLocation": _DEFAULT_XMLNS_XSI_SCHEMA,
    id: {
      "#text": issue.id?.["#text"] || "1",
      "@_type": "internal",
      "@_advice": "ignore"
    },
    issue_identification: {
      title: [
        {
          "@_locale": _LANG_EN,
          "#text": issue.title[0]["#text"] || issueTitle
        },
        {
          "@_locale": _LANG_VI,
          "#text": issue.title[0]["#text"] || issueTitle
        }
      ]
    },
    date_published: issue.date_published,
    last_modified: _ISSUE_DATE_MODIFIED || issue.date_published,
    sections: {
      section: convertSection(issue.section)
    },
    covers: {
      cover: convertCovers(issue.cover)
    },
    issue_galleys: {
      "@_xmlns:xsi": _DEFAULT_XMLNS_XSI,
      "@_xsi:schemaLocation": _DEFAULT_XMLNS_XSI_SCHEMA
    },
    articles: {
      "@_xmlns:xsi": _DEFAULT_XMLNS_XSI,
      "@_xsi:schemaLocation": _DEFAULT_XMLNS_XSI_SCHEMA,
      article: convertArticles(issue.section.article)
    }
  };
}

export function convertOJSXml(oldXml: string): string {
  try {
    const parser = createParser();
    const builder = createBuilder();

    const oldDoc = parser.parse(oldXml) as ParsedXML;
    console.info("[xml-converter.ts:206] ", oldDoc);
    validateParsedData(oldDoc);

    const issue = oldDoc.issue;
    const xmlBody = builder.build({ issue: converIssue(issue) });
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    return xmlHeader + xmlBody;
  } catch (err) {
    console.info("[xml-converter.ts:401] ", err);
    if (err instanceof Error) {
      throw new Error(`XML Processing Error: ${err.message}`);
    }
    throw new Error("An unexpected error occurred while processing the XML");
  }
}
