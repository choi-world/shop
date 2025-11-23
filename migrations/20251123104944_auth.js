/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE auth (
      auth_idx char(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
      user_idx char(36) NOT NULL,
      account_name varchar(255) NOT NULL,
      password varchar(255) NULL,
      status varchar(20) DEFAULT 'ACTIVE',
      type varchar(100) DEFAULT 'NORMAL',
      social_idx varchar(255) NULL,
      password_udt_dt timestamp NULL,
      reg_dt timestamp DEFAULT CURRENT_TIMESTAMP,
      udt_dt timestamp NULL
    )  
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(`
    DROP TABLE auth;  
  `);
};
