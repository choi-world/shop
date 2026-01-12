/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex
    .raw(
      `
    ALTER TABLE users 
    ADD COLUMN role varchar(20) DEFAULT 'USER' AFTER status
  `,
    )
    .then(() => {
      return knex.raw(`
      UPDATE users SET role = 'USER' WHERE role IS NULL
    `);
    })
    .then(() => {
      return knex.raw(`
      CREATE INDEX idx_users_role ON users(role)
    `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex
    .raw(
      `
    DROP INDEX idx_users_role ON users
  `,
    )
    .then(() => {
      return knex.raw(`
      ALTER TABLE users DROP COLUMN role
    `);
    });
};
