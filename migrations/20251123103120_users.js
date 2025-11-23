/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE users (
      user_idx char(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
      username varchar(255) NOT NULL,
      phone_number varchar(100) NULL,
      birthday varchar(100) NULL,
      email varchar(255) NULL,
      gender tinyint DEFAULT 0,
      status varchar(20) DEFAULT 'ACTIVE',
      is_agree tinyint DEFAULT 0,
      reg_dt timestamp DEFAULT CURRENT_TIMESTAMP,
      udt_dt timestamp,
      del_dt timestamp,
      ci varchar(255) null
    );
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(`
    DROP TABLE users;  
  `);
};
