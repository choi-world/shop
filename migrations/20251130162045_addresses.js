/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE addresses (
      address_idx char(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
      user_idx char(36) NOT NULL,
      address_name varchar(100) NOT NULL,
      recipient_name varchar(100) NOT NULL,
      phone_number varchar(100) NOT NULL,
      zip_code varchar(20) NOT NULL,
      address varchar(500) NOT NULL,
      detail_address varchar(500) NULL,
      is_default tinyint DEFAULT 0,
      reg_dt timestamp DEFAULT CURRENT_TIMESTAMP,
      udt_dt timestamp NULL,
      del_dt timestamp NULL,
      FOREIGN KEY (user_idx) REFERENCES users(user_idx) ON DELETE CASCADE
    )
  `).then(() => {
    return knex.raw(`
      CREATE INDEX idx_addresses_user_idx ON addresses(user_idx)
    `);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(`
    DROP TABLE addresses;
  `);
};
