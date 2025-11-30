/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex
    .raw(
      `
    CREATE TABLE orders (
      order_idx char(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
      user_idx char(36) NOT NULL,
      address_idx char(36) NOT NULL,
      order_number varchar(100) NOT NULL UNIQUE,
      total_amount decimal(10, 2) NOT NULL,
      status varchar(20) DEFAULT 'PENDING',
      payment_method varchar(50) NULL,
      payment_status varchar(20) DEFAULT 'PENDING',
      reg_dt timestamp DEFAULT CURRENT_TIMESTAMP,
      udt_dt timestamp NULL,
      del_dt timestamp NULL,
      FOREIGN KEY (user_idx) REFERENCES users(user_idx) ON DELETE CASCADE,
      FOREIGN KEY (address_idx) REFERENCES addresses(address_idx) ON DELETE RESTRICT
    )
  `,
    )
    .then(() => {
      return knex.raw(`
      CREATE TABLE order_items (
        order_item_idx char(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
        order_idx char(36) NOT NULL,
        product_idx char(36) NOT NULL,
        quantity int NOT NULL,
        price decimal(10, 2) NOT NULL,
        reg_dt timestamp DEFAULT CURRENT_TIMESTAMP,
        udt_dt timestamp NULL,
        FOREIGN KEY (order_idx) REFERENCES orders(order_idx) ON DELETE CASCADE,
        FOREIGN KEY (product_idx) REFERENCES products(product_idx) ON DELETE RESTRICT
      )
    `);
    })
    .then(() => {
      return knex.raw(`CREATE INDEX idx_orders_user_idx ON orders(user_idx)`);
    })
    .then(() => {
      return knex.raw(
        `CREATE INDEX idx_orders_order_number ON orders(order_number)`,
      );
    })
    .then(() => {
      return knex.raw(`CREATE INDEX idx_orders_status ON orders(status)`);
    })
    .then(() => {
      return knex.raw(
        `CREATE INDEX idx_order_items_order_idx ON order_items(order_idx)`,
      );
    })
    .then(() => {
      return knex.raw(
        `CREATE INDEX idx_order_items_product_idx ON order_items(product_idx)`,
      );
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(`
    DROP TABLE order_items;
    DROP TABLE orders;
  `);
};
