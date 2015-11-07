/**
 * betsol-ng-repository - Repository constructor for Angular.js
 * @version v0.0.2
 * @link https://github.com/betsol/ng-repository
 * @license MIT
 *
 * @author Slava Fomin II <s.fomin@betsol.ru>
 */
(function (window, angular) {

  'use strict';

  angular.module('betsol.repository', ['betsol.networking'])
    .factory('Repository', ['$q', 'request', function ($q, request) {
      return function Repository (url, options) {

        var defaultOptions = {
          modelize: false,
          responseTraverser: function (response) {
            return response;
          }
        };
        options = angular.extend({}, defaultOptions, options);

        // Normalizing specified URL.
        url = normalizeUrl(url);

        var instance = {};

        instance.find = function (query, count, offset, sortParams) {
          query = query || {};
          if (count > 0) {
            query.count = count;
          }
          if (offset >= 0) {
            query.offset = offset;
          }
          if (sortParams) {
            query.sort = querifySortParams(sortParams);
          }
          return request
            .get(url, query)
            .then(listEntitiesResponseModelizer)
          ;
        };

        instance.findOneById = function (id, query) {
          return request
            .get(urlWithId(url, id), query)
            .then(singleEntityResponseModelizer)
          ;
        };

        instance.create = function (entity) {
          return request
            .post(url, null, entity)
            .then(singleEntityResponseModelizer)
          ;
        };

        instance.update = function (id, entity) {
          return request
            .put(urlWithId(url, id), null, getEntityData(entity))
            .then(singleEntityResponseModelizer)
          ;
        };

        instance.save = function (entity) {
          if (entity.id) {
            var id = entity.id;
            delete entity.id;
            return this.update(id, entity);
          } else {
            return this.create(entity);
          }
        };

        instance.delete = function (id) {
          return request.delete(urlWithId(url, id));
        };

        instance.modelize = modelizeEntity;

        return instance;


        function getEntityData (entity) {
          var data = {};
          angular.forEach(entity, function (value, key) {
            if ('function' === typeof value) {
              return;
            }
            if ('$' == key.charAt(0)) {
              return;
            }
            data[key] = value;
          });
          return data;
        }

        function modelizeEntity (entity) {
          if (options.modelize) {
            defaultModelizer(entity);
            if ('function' === typeof options.modelize) {
              options.modelize(entity);
            }
          }
        }

        function defaultModelizer (entity) {


          // Maintaining copy of original entity in a sub-property for comparison.
          entity.$master = angular.copy(entity);

          /**
           * Returns true, if entity was altered.
           *
           * @returns {boolean}
           */
          entity.isChanged = function () {
            return !angular.equals(entity, entity.$master);
          };

          /**
           * Returns subset of entity properties, that were changed and it's ID.
           *
           * @returns {Object}
           */
          entity.getChangedData = function () {
            var changedData = {};
            var data = getEntityData(this);
            angular.forEach(this.$master, function (masterValue, property) {
              var value = data[property];
              if (!angular.equals(masterValue, value)) {
                changedData[property] = value;
              }
            });
            return changedData;
          };

          /**
           * Saves entity if required.
           */
          entity.save = function () {
            if (this.isChanged()) {
              var data = this.getChangedData(entity);
              if (entity.id) {
                data.id = entity.id;
              }
              return instance.save(data);
            } else {
              return $q.resolve();
            }
          };

        }

        function singleEntityResponseModelizer (response) {
          var entity = options.responseTraverser(response);
          modelizeEntity(entity);
          return response;
        }

        function listEntitiesResponseModelizer (response) {
          var entities = options.responseTraverser(response);
          angular.forEach(entities, function (entity) {
            modelizeEntity(entity);
          });
          return response;
        }

      };
    }])
  ;


  /**
   * Normalizes specified URL.
   *
   * @param {string} url
   *
   * @returns {string}
   */
  function normalizeUrl (url) {
    // Making sure slash is present in the end.
    if ('/' != url.substr(-1, 1)) {
      url += '/';
    }
    return url;
  }

  /**
   * Returns proper URL for entity with specified ID.
   *
   * @param {string} url
   * @param {int} id
   *
   * @returns {string}
   */
  function urlWithId (url, id) {
    // We are expecting URL to be already normalized here.
    return url + id;
  }

  function querifySortParams (sortParams) {
    var parts = [];
    angular.forEach(sortParams, function (dir, field) {
      parts.push(('asc' == dir ? '+' : '-') + field);
    });
    return parts.join(',');
  }

})(window, angular);
