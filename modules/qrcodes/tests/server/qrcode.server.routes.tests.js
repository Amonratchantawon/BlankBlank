'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Qrcode = mongoose.model('Qrcode'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  qrcode;

/**
 * Qrcode routes tests
 */
describe('Qrcode CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Qrcode
    user.save(function () {
      qrcode = {
        table: 'Qrcode name'
      };

      done();
    });
  });

  it('should be able to save a Qrcode if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Qrcode
        agent.post('/api/qrcodes')
          .send(qrcode)
          .expect(200)
          .end(function (qrcodeSaveErr, qrcodeSaveRes) {
            // Handle Qrcode save error
            if (qrcodeSaveErr) {
              return done(qrcodeSaveErr);
            }

            // Get a list of Qrcodes
            agent.get('/api/qrcodes')
              .end(function (qrcodesGetErr, qrcodesGetRes) {
                // Handle Qrcodes save error
                if (qrcodesGetErr) {
                  return done(qrcodesGetErr);
                }

                // Get Qrcodes list
                var qrcodes = qrcodesGetRes.body;

                // Set assertions
                (qrcodes[0].user._id).should.equal(userId);
                (qrcodes[0].table).should.match('Qrcode name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Qrcode if not logged in', function (done) {
    agent.post('/api/qrcodes')
      .send(qrcode)
      .expect(403)
      .end(function (qrcodeSaveErr, qrcodeSaveRes) {
        // Call the assertion callback
        done(qrcodeSaveErr);
      });
  });


  it('should be able to update an Qrcode if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Qrcode
        agent.post('/api/qrcodes')
          .send(qrcode)
          .expect(200)
          .end(function (qrcodeSaveErr, qrcodeSaveRes) {
            // Handle Qrcode save error
            if (qrcodeSaveErr) {
              return done(qrcodeSaveErr);
            }

            // Update Qrcode name
            qrcode.table = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Qrcode
            agent.put('/api/qrcodes/' + qrcodeSaveRes.body._id)
              .send(qrcode)
              .expect(200)
              .end(function (qrcodeUpdateErr, qrcodeUpdateRes) {
                // Handle Qrcode update error
                if (qrcodeUpdateErr) {
                  return done(qrcodeUpdateErr);
                }

                // Set assertions
                (qrcodeUpdateRes.body._id).should.equal(qrcodeSaveRes.body._id);
                (qrcodeUpdateRes.body.table).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Qrcodes if not signed in', function (done) {
    // Create new Qrcode model instance
    var qrcodeObj = new Qrcode(qrcode);

    // Save the qrcode
    qrcodeObj.save(function () {
      // Request Qrcodes
      request(app).get('/api/qrcodes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Qrcode if not signed in', function (done) {
    // Create new Qrcode model instance
    var qrcodeObj = new Qrcode(qrcode);

    // Save the Qrcode
    qrcodeObj.save(function () {
      request(app).get('/api/qrcodes/' + qrcodeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('table', qrcode.table);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Qrcode with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/qrcodes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Qrcode is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Qrcode which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Qrcode
    request(app).get('/api/qrcodes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Qrcode with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Qrcode if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Qrcode
        agent.post('/api/qrcodes')
          .send(qrcode)
          .expect(200)
          .end(function (qrcodeSaveErr, qrcodeSaveRes) {
            // Handle Qrcode save error
            if (qrcodeSaveErr) {
              return done(qrcodeSaveErr);
            }

            // Delete an existing Qrcode
            agent.delete('/api/qrcodes/' + qrcodeSaveRes.body._id)
              .send(qrcode)
              .expect(200)
              .end(function (qrcodeDeleteErr, qrcodeDeleteRes) {
                // Handle qrcode error error
                if (qrcodeDeleteErr) {
                  return done(qrcodeDeleteErr);
                }

                // Set assertions
                (qrcodeDeleteRes.body._id).should.equal(qrcodeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Qrcode if not signed in', function (done) {
    // Set Qrcode user
    qrcode.user = user;

    // Create new Qrcode model instance
    var qrcodeObj = new Qrcode(qrcode);

    // Save the Qrcode
    qrcodeObj.save(function () {
      // Try deleting Qrcode
      request(app).delete('/api/qrcodes/' + qrcodeObj._id)
        .expect(403)
        .end(function (qrcodeDeleteErr, qrcodeDeleteRes) {
          // Set message assertion
          (qrcodeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Qrcode error error
          done(qrcodeDeleteErr);
        });

    });
  });

  it('should be able to get a single Qrcode that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Qrcode
          agent.post('/api/qrcodes')
            .send(qrcode)
            .expect(200)
            .end(function (qrcodeSaveErr, qrcodeSaveRes) {
              // Handle Qrcode save error
              if (qrcodeSaveErr) {
                return done(qrcodeSaveErr);
              }

              // Set assertions on new Qrcode
              (qrcodeSaveRes.body.table).should.equal(qrcode.table);
              should.exist(qrcodeSaveRes.body.user);
              should.equal(qrcodeSaveRes.body.user._id, orphanId);

              // force the Qrcode to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Qrcode
                    agent.get('/api/qrcodes/' + qrcodeSaveRes.body._id)
                      .expect(200)
                      .end(function (qrcodeInfoErr, qrcodeInfoRes) {
                        // Handle Qrcode error
                        if (qrcodeInfoErr) {
                          return done(qrcodeInfoErr);
                        }

                        // Set assertions
                        (qrcodeInfoRes.body._id).should.equal(qrcodeSaveRes.body._id);
                        (qrcodeInfoRes.body.table).should.equal(qrcode.table);
                        should.equal(qrcodeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Qrcode.remove().exec(done);
    });
  });
});
