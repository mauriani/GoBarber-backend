"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateAppointments1615210134364 = void 0;

var _typeorm = require("typeorm");

class CreateAppointments1615210134364 {
  async up(queryRunner) {
    await queryRunner.createTable(new _typeorm.Table({
      name: 'appointments',
      columns: [{
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()'
      }, {
        name: 'provider',
        type: 'varchar'
      }, {
        name: 'date',
        type: 'timestamp with time zone'
      }, {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()'
      }, {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()'
      }]
    }));
  }

  async down(queryRunner) {
    await queryRunner.dropTable('appointments');
  }

}

exports.CreateAppointments1615210134364 = CreateAppointments1615210134364;