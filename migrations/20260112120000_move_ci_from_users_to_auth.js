/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // users 테이블에서 ci 컬럼 삭제 후 auth 테이블에 ci 컬럼 추가
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('ci');
  });

  await knex.schema.alterTable('auth', (table) => {
    table.string('ci', 255).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // 롤백 시 auth에서 ci 제거, users에 ci 복구
  await knex.schema.alterTable('auth', (table) => {
    table.dropColumn('ci');
  });

  await knex.schema.alterTable('users', (table) => {
    table.string('ci', 255).nullable();
  });
};


