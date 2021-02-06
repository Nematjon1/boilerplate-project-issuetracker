const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite("Integration tests with chai-http", function () {
    // #1
    test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
            "issue_title": "Fix error in posting data",
            "issue_text": "When we post data it has an error.",
            "created_on": "2017-01-08T06:35:14.240Z",
            "updated_on": "2017-01-08T06:35:14.240Z",
            "created_by": "Joe",
            "assigned_to": "Joe",
            "open": true,
            "status_text": "In QA"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });
    test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
            "issue_title": "Fix error in posting data",
            "issue_text": "When we post data it has an error.",
            "created_by": "Joe"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });
    test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
            "issue_title": "Fix error in posting data",
            "issue_text": "When we post data it has an error."
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });

    test("View issues on a project: GET request to /api/issues/apistest", function (done) {
      chai
        .request(server)
        .get("/api/issues/apitest")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });

    test("View issues on a project with one filter: GET request to /api/issues/apitest", function (done) {
      chai
        .request(server)
        .get("/api/issues/apitest?created_by=Joe")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });

    test("View issues on a project with multiple filters: GET request to /api/issues/apitest?created_by=Joe&assigned_to=Joe", function (done) {
      chai
        .request(server)
        .get("/api/issues/apitest?created_by=Joe&assigned_to=Joe")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });

    test("Update one field on an issue: PUT request to /api/issues/apitest", function (done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({"_id": "5871dda29faedc3491ff93bb", open: "close"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });

    test("Update multiple fields on an issue: PUT request to /api/issues/apitest", function (done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({"_id": "5871dda29faedc3491ff93bb", open: "close", title: "Test 2"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });

    test("Update an issue with missing _id: PUT request to /api/issues/apitest", function (done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });

    test("Update an issue with no fields to update: PUT request to /api/issues/apitest", function (done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({"_id": "5871dda29faedc3491ff93bb"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });
    
    test("Update an issue with an invalid _id: PUT request to /api/issues/apitest", function (done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({"_id": "5871dda29f1ff93bb"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });
    
    test("Delete an issue: DELETE request to /api/issues/apitest", function (done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({"_id": "5871dda29faedc3491ff93bb"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });

    test("Delete an issue with an invalid _id: DELETE request to /api/issues/apistest", function (done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({"_id": "5871dda29f491ff93bb"})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });

    test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json", "Response type");
          done();
        });
    });
  })
});
