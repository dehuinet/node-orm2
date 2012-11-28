var common     = require('../common');
var assert     = require('assert');

common.createConnection(function (err, db) {
	common.createModelTable('test_association_hasmany_set', db.driver.db, function () {
		common.createModelAssocTable('test_association_hasmany_set', 'assocs', db.driver.db, function () {
			db.driver.db.query("INSERT INTO test_association_hasmany_set VALUES (1, 'test1'), (2, 'test2'), (3, 'test3')", function (err) {
				if (err) throw err;

				var TestModel = db.define('test_association_hasmany_set', common.getModelProperties());
				TestModel.hasMany("assocs");

				TestModel.get(1, function (err, Test1) {
					assert.equal(err, null);
					TestModel.get(2, function (err, Test2) {
						assert.equal(err, null);
						Test1.setAssocs(Test2, function (err) {
							assert.equal(err, null);
							Test1.getAssocs(function (err, Tests) {
								assert.equal(err, null);
								assert.equal(Array.isArray(Tests), true);
								assert.equal(Tests.length, 1);
								assert.equal(Tests[0].name, Test2.name);
								db.close();
							});
						});
					});
				});
			});
		});
	});
});