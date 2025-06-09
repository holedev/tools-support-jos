export interface Journal {
  journal: string;
  publicationDate: string[];
  fullName: string;
  path: string;
}

export const _JOURNAL_PUBLICATION_DATA: Journal[] = [
  {
    journal: "ECONOMICS AND BUSINESS ADMINISTRATION",
    publicationDate: ["01", "02", "04", "06", "07", "08"],
    fullName: "HO CHI MINH CITY OPEN UNIVERSITY JOURNAL OF SCIENCE - ECONOMICS AND BUSINESS ADMINISTRATION",
    path: "econ-en"
  },
  {
    journal: "ENGINEERING AND TECHNOLOGY",
    publicationDate: ["03", "10"],
    fullName: "HO CHI MINH CITY OPEN UNIVERSITY JOURNAL OF SCIENCE - ENGINEERING AND TECHNOLOGY",
    path: "tech-en"
  },
  {
    journal: "SOCIAL SCIENCES",
    publicationDate: ["02", "04", "06", "08", "10", "12"],
    fullName: "HO CHI MINH CITY OPEN UNIVERSITY JOURNAL OF SCIENCE - SOCIAL SCIENCES",
    path: "soci-en"
  },
  {
    journal: "ADVANCES IN COMPUTATIONAL STRUCTURES",
    publicationDate: ["03", "08"],
    fullName: "HCMCOU Journal of Science - Advances in Computational Structures",
    path: "acs-en"
  },
  {
    journal: "KINH TẾ VÀ QUẢN TRỊ KINH DOANH",
    publicationDate: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    fullName: "TẠP CHÍ KHOA HỌC ĐẠI HỌC MỞ THÀNH PHỐ HỒ CHÍ MINH - KINH TẾ VÀ QUẢN TRỊ KINH DOANH",
    path: "econ-vi"
  },
  {
    journal: "KỸ THUẬT VÀ CÔNG NGHỆ",
    publicationDate: ["04", "09"],
    fullName: "TẠP CHÍ KHOA HỌC ĐẠI HỌC MỞ THÀNH PHỐ HỒ CHÍ MINH - KỸ THUẬT VÀ CÔNG NGHỆ",
    path: "tech-vi"
  },
  {
    journal: "KHOA HỌC XÃ HỘI",
    publicationDate: ["05", "11"],
    fullName: "TẠP CHÍ KHOA HỌC ĐẠI HỌC MỞ THÀNH PHỐ HỒ CHÍ MINH - KHOA HỌC XÃ HỘI",
    path: "soci-vi"
  }
];
