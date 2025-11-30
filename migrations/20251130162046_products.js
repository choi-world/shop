/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE products (
      product_idx char(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
      product_name varchar(255) NOT NULL,
      description text NULL,
      price decimal(10, 2) NOT NULL,
      stock int DEFAULT 0,
      category varchar(100) NULL,
      status varchar(20) DEFAULT 'ACTIVE',
      image_url varchar(500) NULL,
      reg_dt timestamp DEFAULT CURRENT_TIMESTAMP,
      udt_dt timestamp NULL,
      del_dt timestamp NULL
    )
  `).then(() => {
    return knex.raw(`CREATE INDEX idx_products_category ON products(category)`);
  }).then(() => {
    return knex.raw(`CREATE INDEX idx_products_status ON products(status)`);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(`
    DROP TABLE products;
  `);
};
