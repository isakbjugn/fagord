// Speiler kontrakten fra Rust-API-et. Felter som kommer fra databasen
// beholder snake_case (created_at/updated_at/updated_by) slik de ligger på tråden.

/** Det /articles returnerer per rad i listen. */
export type ArticleSummary = {
  slug: string;
  title: string;
  author: string;
  actions: ArticleAction[];
};

/** Det /articles/{slug} returnerer for én temaside. */
export type Article = {
  slug: string;
  title: string;
  author: string;
  content: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  actions: ArticleAction[];
};

type ArticleAction = 'edit' | 'delete';
