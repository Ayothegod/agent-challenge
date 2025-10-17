// pdf, docs, urls and texts
// Ingestion Service: ETL for text extraction, metadata extraction (title, author, date, source), basic normalization.

// extract raw data from docs
// clean the data, detect Lang, split into paragraph, extract metadata
// save and index metadata

type Input = {
  id: string;
  connector: {
    type: "pdf" | "docs" | "text" | "email" | "slack" | "url";
  };
};
