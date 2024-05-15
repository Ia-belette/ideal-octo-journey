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
export const contentType = pgEnum('type_of_content', ['movie', 'tv_show']);

export const contents = pgTable('contents', {
  id: serial('id').primaryKey(),
  tb_id: integer('tb_id'),
  flag: contentFlag('flag'),
  is_family_friendly: boolean('is_family_friendly').default(false),
  backdrop_path: text('backdrop_path'),
  poster_path: text('poster_path'),
  featured: boolean('featured').default(false),
  type_of_content: contentType('type_of_content').default('movie'),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
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
      fields: [contentCategories.content_id],
      references: [contents.id],
    }),
    category: one(categories, {
      fields: [contentCategories.category_id],
      references: [categories.id],
    }),
  })
);
