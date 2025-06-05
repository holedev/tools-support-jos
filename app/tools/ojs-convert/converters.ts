import type { OJSConverterConfig } from "./config";
import { DEFAULT_CONFIG } from "./config";
import type { OldArticle, OldArticleAuthor, OldCover, OldIssue, OldSection } from "./types";
import { escapeXml } from "./utils";

export function convertAuthors(authors: OldArticleAuthor[], config: OJSConverterConfig) {
  const { isOnlyEnglishVersion, langEn, langVi, authorUserGroup } = { ...DEFAULT_CONFIG, ...config };

  return authors.map((author) => ({
    "@_primary_contact": author["@_primary_contact"] ? "true" : "false",
    "@_include_in_browse": "true",
    "@_user_group_ref": authorUserGroup,
    givenname: isOnlyEnglishVersion
      ? { "@_locale": langEn, "#text": `${author.firstname} ${author.middlename}` }
      : [
          {
            "@_locale": langVi,
            "#text": `${author.firstname} ${author.middlename}`
          },
          {
            "@_locale": langEn,
            "#text": `${author.firstname} ${author.middlename}`
          }
        ],
    familyname: isOnlyEnglishVersion
      ? { "@_locale": langEn, "#text": author.lastname }
      : [
          {
            "@_locale": langVi,
            "#text": author.lastname
          },
          {
            "@_locale": langEn,
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

export function convertArticles(articles: OldArticle[], config: OJSConverterConfig) {
  const { isOnlyEnglishVersion, langEn, xmlnsXsi, xmlnsXsiSchema, sectionAbbr } = { ...DEFAULT_CONFIG, ...config };

  return articles.map((article: OldArticle, idx) => {
    return {
      "@_xmlns:xsi": xmlnsXsi,
      "@_locale": article["@_locale"],
      "@_language": article["@_language"],
      "@_date_submitted": article.date_published,
      "@_stage": "submission",
      "@_date_published": article.date_published,
      "@_section_ref": sectionAbbr,
      "@_seq": `${idx + 1}`,
      "@_access_status": "0",
      id: {
        "#text": article.id["#text"] || `${idx + 1}`,
        "@_type": "internal",
        "@_advice": "ignore"
      },
      title: isOnlyEnglishVersion ? { "@_locale": langEn, "#text": article.title[0]["#text"] } : article.title,
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
        "@_xmlns:xsi": xmlnsXsi,
        "@_xsi:schemaLocation": xmlnsXsiSchema,
        author: convertAuthors(article.author, config)
      },
      submission_file: {
        "@_xmlns:xsi": xmlnsXsi,
        "@_stage": "proof",
        "@_id": `${idx + 1}`,
        "@_xsi:schemaLocation": xmlnsXsiSchema,
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
        "@_xmlns:xsi": xmlnsXsi,
        "@_approved": "false",
        "@_xsi:schemaLocation": xmlnsXsiSchema,
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

export function convertSection(oldSection: OldSection, config: OJSConverterConfig) {
  const { sectionAbbr, sectionTitle, langVi } = { ...DEFAULT_CONFIG, ...config };

  return {
    "@_ref": sectionAbbr,
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
      "@_locale": langVi,
      "#text": sectionAbbr
    },
    title: {
      "@_locale": langVi,
      "#text": sectionTitle
    }
  };
}

export function convertCovers(covers: OldCover[]) {
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

export function convertIssue(issue: OldIssue, config: OJSConverterConfig) {
  const {
    xmlns,
    xmlnsXsi,
    xmlnsXsiSchema,
    issuePublished,
    issueCurrent,
    issueAccessStatus,
    issueDatePublished,
    issueDateModified,
    langEn,
    langVi
  } = { ...DEFAULT_CONFIG, ...config };

  const issueTitle = `${issue.volume}(${issue.number})${issue.year}`;

  return {
    "@_xmlns": xmlns,
    "@_xmlns:xsi": xmlnsXsi,
    "@_published": issuePublished,
    "@_current": issueCurrent,
    "@_access_status": issueAccessStatus,
    "@_xsi:schemaLocation": xmlnsXsiSchema,
    id: {
      "#text": issue.id?.["#text"] || "1",
      "@_type": "internal",
      "@_advice": "ignore"
    },
    issue_identification: {
      title: [
        {
          "@_locale": langEn,
          "#text": issue.title[0]["#text"] || issueTitle
        },
        {
          "@_locale": langVi,
          "#text": issue.title[0]["#text"] || issueTitle
        }
      ]
    },
    date_published: issueDatePublished || issue.date_published,
    last_modified: issueDateModified || issue.date_published,
    sections: {
      section: convertSection(issue.section, config)
    },
    covers: {
      cover: convertCovers(issue.cover)
    },
    issue_galleys: {
      "@_xmlns:xsi": xmlnsXsi,
      "@_xsi:schemaLocation": xmlnsXsiSchema
    },
    articles: {
      "@_xmlns:xsi": xmlnsXsi,
      "@_xsi:schemaLocation": xmlnsXsiSchema,
      article: convertArticles(issue.section.article, config)
    }
  };
}
