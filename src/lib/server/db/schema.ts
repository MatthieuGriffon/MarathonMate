import { pgTable, text, integer, timestamp, unique } from 'drizzle-orm/pg-core';

// Table User
export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name'),
    email: text('email').notNull(),
    password: text('password'), // hashed password if needed
    oauthProvider: text('oauth_provider'),
    oauthProviderId: text('oauth_provider_id'),
    profilePicture: text('profile_picture'), 
    createdAt: timestamp('created_at').defaultNow()
});

// Table Movie
export const movie = pgTable('movie', {
    id: text('id').primaryKey(),
    tmdbId: integer('tmdb_id').notNull(),
    title: text('title').notNull(),
    genreId: text('genre_id').references(() => genre.id),
    releaseDate: timestamp('release_date'),
    posterUrl: text('poster_url')
});

// Table Genre
export const genre = pgTable('genre', {
    id: text('id').primaryKey(),
    name: text('name').notNull()
});

// Table List
export const list = pgTable('list', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow()
});

// Table List_Movies (junction table)
export const listMovies = pgTable('list_movies', {
    listId: text('list_id').references(() => list.id).notNull(),
    movieId: text('movie_id').references(() => movie.id).notNull(),
}, (table) => ({
    uniqueConstraint: unique().on(table.listId, table.movieId)
}));

// Table Marathon
export const marathon = pgTable('marathon', {
    id: text('id').primaryKey(),
    organizerId: text('organizer_id').references(() => user.id).notNull(),
    date: timestamp('date').notNull(),
    name: text('name').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow()
});

// Table Marathon_Movies (junction table)
export const marathonMovies = pgTable('marathon_movies', {
    marathonId: text('marathon_id').references(() => marathon.id).notNull(),
    movieId: text('movie_id').references(() => movie.id).notNull(),
}, (table) => ({
    uniqueConstraint: unique().on(table.marathonId, table.movieId)
}));

// Table Marathon_Participants (junction table)
export const marathonParticipants = pgTable('marathon_participants', {
    marathonId: text('marathon_id').references(() => marathon.id).notNull(),
    userId: text('user_id').references(() => user.id).notNull(),
    status: text('status').notNull()
}, (table) => ({
    uniqueConstraint: unique().on(table.marathonId, table.userId)
}));

// Table Ratings
export const ratings = pgTable('ratings', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id).notNull(),
    movieId: text('movie_id').references(() => movie.id).notNull(),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at').defaultNow()
});

// Table AuditLog
export const auditLog = pgTable('audit_log', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id).notNull(),
    action: text('action').notNull(),
    target: text('target').notNull(),
    timestamp: timestamp('timestamp').defaultNow()
});

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

// Pour inférer le type `Session` pour le retour dans ton fichier `auth.ts`
export type Session = typeof session.$inferSelect;
