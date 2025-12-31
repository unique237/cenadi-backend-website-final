/**
 * Migration: add-subscribers-email-index
 * Description: Add index on subscribers email for faster lookups
 */

'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.addIndex('subscribers', 'idx_subscribers_email', ['email'], true, function(err) {
    if (err) return callback(err);
    db.addIndex('subscribers', 'idx_subscribers_status', ['status'], false, callback);
  });
};

exports.down = function(db, callback) {
  db.removeIndex('subscribers', 'idx_subscribers_email', function(err) {
    if (err) return callback(err);
    db.removeIndex('subscribers', 'idx_subscribers_status', callback);
  });
};

exports._meta = {
  "version": 1
};
