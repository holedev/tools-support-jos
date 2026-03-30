import type { OJSConverterConfig } from "./config";
import { DEFAULT_CONFIG } from "./config";
import type { OldArticle, OldArticleAuthor, OldCover, OldIssue, OldSection } from "./types";
import { escapeXml } from "./utils";

export function convertAuthors(authors: OldArticleAuthor[], config: OJSConverterConfig, primaryContactId?: string) {
  const { isOnlyEnglishVersion, langEn, langVi, authorUserGroup } = { ...DEFAULT_CONFIG, ...config };

  return authors.map((author) => ({
    "@_primary_contact": author["@_id"] === primaryContactId ? "true" : "false",
    "@_include_in_browse": "true",
    "@_user_group_ref": authorUserGroup,
    givenname: isOnlyEnglishVersion
      ? { "@_locale": langEn, "#text": author.givenname[0]["#text"] }
      : [
        {
          "@_locale": langVi,
          "#text": `${author.givenname[0]["#text"]}`
        },
        {
          "@_locale": langEn,
          "#text": `${author.givenname[0]["#text"]}`
        }
      ],
    familyname: isOnlyEnglishVersion
      ? { "@_locale": langEn, "#text": author.familyname[0]["#text"] }
      : [
        {
          "@_locale": langVi,
          "#text": author.familyname[0]["#text"]
        },
        {
          "@_locale": langEn,
          "#text": author.familyname[0]["#text"]
        }
      ],
    email: author.email,
    biography: author.affiliation.map((bio) => ({
      "@_locale": bio["@_locale"],
      "#text": bio["#text"]
    }))
  }));
}

export function convertArticles(articles: OldArticle[], config: OJSConverterConfig) {
  const { isOnlyEnglishVersion, langEn, xmlnsXsi, xmlnsXsiSchema, sectionAbbr } = { ...DEFAULT_CONFIG, ...config };

  return articles.map((article: OldArticle, idx) => {
    const articleId = article?.id?.[0]?.["#text"] ?? `index ${idx}`;
    const articleTitle = article?.publication?.title?.[0]?.["#text"] ?? "(no title)";
    try {
      const pdfID = article.publication.article_galley[0].submission_file_ref["@_id"] || `${idx + 1}`;

      const pdfFileRaw = article.submission_file.find((file) => {
        return file["@_id"] === pdfID;
      });
      const pdfFileData = Array.isArray(pdfFileRaw?.file) ? pdfFileRaw.file[0] : pdfFileRaw?.file;

      const seq = article.publication.authors.author[0]["@_seq"] || "1";

      return {
        "@_xmlns:xsi": xmlnsXsi,
        "@_locale": article["@_locale"],
        "@_language": article["@_language"],
        "@_date_submitted": article["@date_submitted"],
        "@_stage": "submission",
        "@_date_published": article.publication["@_date_published"],
        "@_section_ref": sectionAbbr,
        "@_seq": `${seq}`,
        "@_access_status": "0",
        id: {
          "#text": article.id[0]["#text"] || `${idx + 1}`,
          "@_type": "internal",
          "@_advice": "ignore"
        },
        title: isOnlyEnglishVersion
          ? { "@_locale": langEn, "#text": article.publication.title[0]["#text"] }
          : article.publication.title,
        abstract: article.publication.abstract.map((abstract) => {
          const abstractText = escapeXml(abstract["#text"]);
          return {
            "@_locale": abstract["@_locale"],
            "#text": abstractText.replace(/</g, "&lt;").replace(/>/g, "&gt;")
          };
        }),
        keywords: article.publication.keywords.map((keyword) => ({
          "@_locale": keyword["@_locale"],
          keyword: keyword.keyword.map((kw) => escapeXml(kw))
        })),
        authors: {
          "@_xmlns:xsi": xmlnsXsi,
          "@_xsi:schemaLocation": xmlnsXsiSchema,
          author: convertAuthors(article.publication.authors.author, config, article.publication["@_primary_contact_id"])
        },
        // submission_file: {
        //   "@_xmlns:xsi": xmlnsXsi,
        //   "@_stage": "proof",
        //   "@_id": `${pdfID}`,
        //   "@_xsi:schemaLocation": xmlnsXsiSchema,
        //   revision: {
        //     "@_number": "1",
        //     "@_genre": "Điều văn bản",
        //     "@_filename": pdfFileRaw?.name["#text"] || "document.pdf",
        //     "@_viewable": "false",
        //     "@_date_uploaded": article.publication["@_date_published"],
        //     "@_date_modified": article.publication["@_date_published"],
        //     "@_filetype": "application/pdf",
        //     "@_uploader": "tuyethtk",
        //     name: {
        //       "@_locale": article.publication.article_galley[0].name["@_locale"],
        //       "#text": article.publication.article_galley[0].name["#text"]
        //     },
        //     embed: {
        //       "@_encoding": "base64",
        //       "#text": pdfFileData?.embed["#text"]
        //     }
        //   }
        // },
        article_galley: {
          "@_xmlns:xsi": xmlnsXsi,
          "@_approved": "false",
          "@_xsi:schemaLocation": xmlnsXsiSchema,
          id: {
            "#text": article.publication.article_galley[0].id[0]["#text"] || `${idx + 1}`,
            "@_type": "internal",
            "@_advice": "ignore"
          },
          name: {
            "@_locale": article.publication.article_galley[0].name["@_locale"],
            "#text": "PDF"
          },
          seq: "0",
          // submission_file_ref: {
          //   "@_id": pdfID,
          //   "@_revision": "1"
          // }
        },
        pages: article.publication.pages
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Article [id=${articleId}, title="${articleTitle}"]: ${msg}`);
    }
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

export function convertCovers(covers: OldCover[] | OldCover) {

  if (!Array.isArray(covers)) {
    covers = [covers];
  }

  return covers.map((cover) => ({
    "@_locale": cover["@_locale"],
    cover_image: cover.cover_image,
    cover_image_alt_text: cover.cover_image_alt_text || "",
    embed: {
      "@_encoding": "base64",
      "#text": cover.embed["#text"]
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

  const issueTitle = `${issue.issue_identification.title[0]["#text"]}`;

  return {
    "@_xmlns": xmlns,
    "@_xmlns:xsi": xmlnsXsi,
    "@_published": issuePublished,
    "@_current": issueCurrent,
    "@_access_status": issueAccessStatus,
    "@_xsi:schemaLocation": xmlnsXsiSchema,
    id: {
      "#text": issue.id[0]["#text"] || "1",
      "@_type": "internal",
      "@_advice": "ignore"
    },
    issue_identification: {
      title: [
        {
          "@_locale": langEn,
          "#text": issueTitle
        },
        {
          "@_locale": langVi,
          "#text": issueTitle
        }
      ]
    },
    date_published: issueDatePublished || issue.date_published,
    last_modified: issueDateModified || issue.date_published,
    sections: {
      section: convertSection(issue.sections.section, config)
    },
    covers: {
      cover: convertCovers(issue.covers?.cover || [])
    },
    issue_galleys: {
      "@_xmlns:xsi": xmlnsXsi,
      "@_xsi:schemaLocation": xmlnsXsiSchema
    },
    articles: {
      "@_xmlns:xsi": xmlnsXsi,
      "@_xsi:schemaLocation": xmlnsXsiSchema,
      article: convertArticles(issue.articles.article, config)
    }
  };
}
