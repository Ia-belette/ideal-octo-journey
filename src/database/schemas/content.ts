import {
  pgTable,
  serial,
  varchar,
  pgEnum,
  text,
  integer,
  primaryKey,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const contentFlag = pgEnum('flag', ['none', 'moderate']);

export const contents = pgTable('contents', {
  id: serial('id').primaryKey(),
  tb_id: text('tb_id'),
  flag: contentFlag('flag'),
  is_family_friendly: boolean('is_family_friendly').default(false),
  backdrop_path: text('backdrop_path'),
  poster_path: text('poster_path'),
});

export const categories = pgTable('category', {
  id: serial('id').primaryKey(),
  category_id: integer('category_id'),
  name: varchar('name', {
    length: 255,
  }),
});

export const contentCategories = pgTable(
  'content_categories',
  {
    content_id: integer('content_id')
      .notNull()
      .references(() => contents.id),
    category_id: integer('category_id')
      .notNull()
      .references(() => categories.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.content_id, t.category_id] }),
  })
);

export const categoryRelations = relations(categories, ({ many }) => ({
  contents: many(contents),
}));

export const contentRelations = relations(contents, ({ many }) => ({
  content: many(contents),
}));

export const contentsRelations = relations(contents, ({ many }) => ({
  categories: many(contentCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  contents: many(contentCategories),
}));

export const contentCategoriesRelations = relations(
  contentCategories,
  ({ one }) => ({
    content: one(contents, {
      fields: [contentCategories.category_id],
      references: [contents.id],
    }),
    category: one(categories, {
      fields: [contentCategories.category_id],
      references: [categories.category_id],
    }),
  })
);
