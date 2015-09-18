describe('Repository', function () {

  //==============//
  // INITIALIZING //
  //==============//

  beforeEach(module('betsol.repository'));

  var Repository;
  beforeEach(inject(function (_Repository_) {
    Repository = _Repository_;
  }));


  //=========//
  // TESTING //
  //=========//

  it('constructor should be present', function () {
    expect(Repository).to.be.a('function');
  });

  it('creates valid instance', function () {

    var repository = new Repository('users');

    expect(repository.find).to.be.a('function');
    expect(repository.findOneById).to.be.a('function');
    expect(repository.create).to.be.a('function');
    expect(repository.update).to.be.a('function');
    expect(repository.save).to.be.a('function');
    expect(repository.delete).to.be.a('function');

  });

  testRepositoryWithUrl('users');
  testRepositoryWithUrl('users/');


  function testRepositoryWithUrl (url) {

    describe('method generates valid request (' + url + '):', function () {

      var $httpBackend;
      var repository;

      beforeEach(inject(function (_$httpBackend_) {
        repository = new Repository(url);
        $httpBackend = _$httpBackend_;
      }));

      it('find()', function () {
        repository
          .find({}, 10, 30)
          .then(function (response) {
            expect(response).to.be.an('object');
            expect(response.data).to.be.an('array');
            expect(response.data.length).to.equal(2);
            expect(response.data[0].id).to.equal(112);
            expect(response.data[1].id).to.equal(117);
          })
        ;
        $httpBackend
          .expectGET('users/?count=10&offset=30')
          .respond(200, {
            data: [
              {id: 112},
              {id: 117}
            ]
          })
        ;
        $httpBackend.flush();
      });

      it('findOneById()', function () {
        repository
          .findOneById(117)
          .then(function (response) {
            expect(response).to.be.an('object');
            expect(response.data).to.be.an('object');
            expect(response.data.id).to.equal(117);
            expect(response.data.name).to.equal('John');
          })
        ;
        $httpBackend
          .expectGET('users/117')
          .respond(200, {
            data: {
              id: 117,
              name: 'John'
            }
          })
        ;
        $httpBackend.flush();
      });

      it('create()', function () {
        repository
          .create({
            name: 'John'
          })
          .then(function (response) {
            expect(response).to.be.an('object');
            expect(response.data).to.be.an('object');
            expect(response.data.id).to.equal(117);
            expect(response.data.name).to.equal('John');
          })
        ;
        $httpBackend
          .expectPOST('users/')
          .respond(200, {
            data: {
              id: 117,
              name: 'John'
            }
          })
        ;
        $httpBackend.flush();
      });

      it('update()', function () {
        repository
          .update(117, {
            name: 'Jane'
          })
          .then(function (response) {
            expect(response).to.be.an('object');
            expect(response.data).to.be.an('object');
            expect(response.data.id).to.equal(117);
            expect(response.data.name).to.equal('Jane');
          })
        ;
        $httpBackend
          .expectPUT('users/117')
          .respond(200, {
            data: {
              id: 117,
              name: 'Jane'
            }
          })
        ;
        $httpBackend.flush();
      });

      it('save(): create', function () {
        repository
          .save({
            name: 'John'
          })
          .then(function (response) {
            expect(response).to.be.an('object');
            expect(response.data).to.be.an('object');
            expect(response.data.id).to.equal(117);
            expect(response.data.name).to.equal('John');
          })
        ;
        $httpBackend
          .expectPOST('users/')
          .respond(200, {
            data: {
              id: 117,
              name: 'John'
            }
          })
        ;
        $httpBackend.flush();
      });

      it('save(): update', function () {
        repository
          .save({
            id: 117,
            name: 'Jane'
          })
          .then(function (response) {
            expect(response).to.be.an('object');
            expect(response.data).to.be.an('object');
            expect(response.data.id).to.equal(117);
            expect(response.data.name).to.equal('Jane');
          })
        ;
        $httpBackend
          .expectPUT('users/117')
          .respond(200, {
            data: {
              id: 117,
              name: 'Jane'
            }
          })
        ;
        $httpBackend.flush();
      });

      it('delete()', function () {
        repository
          .delete(117)
        ;
        $httpBackend
          .expectDELETE('users/117')
          .respond(200, {
            data: null
          })
        ;
        $httpBackend.flush();
      });

      afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
      });

    });

  }

});
