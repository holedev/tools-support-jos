export interface OJSConverterConfig {
  isOnlyEnglishVersion?: boolean;
  langVi?: string;
  langEn?: string;
  xmlnsXsi?: string;
  xmlns?: string;
  xmlnsXsiSchema?: string;
  issuePublished?: string;
  issueCurrent?: string;
  issueAccessStatus?: string;
  issueDatePublished?: string;
  issueDateModified?: string;
  sectionAbbr?: string;
  sectionTitle?: string;
  authorUserGroup?: string;
}

export const DEFAULT_CONFIG: OJSConverterConfig = {
  isOnlyEnglishVersion: false,
  langVi: "vi_VN",
  langEn: "en_US",
  xmlnsXsi: "http://www.w3.org/2001/XMLSchema-instance",
  xmlns: "http://pkp.sfu.ca",
  xmlnsXsiSchema: "http://pkp.sfu.ca native.xsd",
  issuePublished: "1",
  issueCurrent: "1",
  issueAccessStatus: "1",
  issueDatePublished: new Date().toISOString().split("T")[0],
  issueDateModified: new Date().toISOString().split("T")[0],
  sectionAbbr: "BV",
  sectionTitle: "Bài viết",
  authorUserGroup: "Tác giả"
};
