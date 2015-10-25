(function (window, angular) {

  'use strict';

  angular.module('betsol.repository', ['betsol.networking'])
    .factory('Repository', function ($q, request) {
      return function Repository (url, options) {

        var defaultOptions = {
          modelize: function () {},
          responseTraverser: function (response) {
            return response;
          }
        };
        options = angular.extend({}, defaultOptions, options);

        // Normalizing specified URL.
        url = normalizeUrl(url);

        return {
          find: function (query, count, offset, sortParams) {
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
              .then(listEntitiesModelizer)
            ;
          },
          findOneById: function (id, query) {
            return request
              .get(urlWithId(url, id), query)
              .then(singleEntityModelizer)
            ;
          },
          create: function (entity) {
            return request
              .post(url, null, entity)
              .then(singleEntityModelizer)
            ;
          },
          update: function (id, entity) {
            return request
              .put(urlWithId(url, id), null, entity)
              .then(singleEntityModelizer)
            ;
          },
          save: function (entity) {
            if (entity.id) {
              var id = entity.id;
              delete entity.id;
              return this.update(id, entity);
            } else {
              return this.create(entity);
            }
          },
          'delete': function (id) {
            return request.delete(urlWithId(url, id));
          }
        };


        function singleEntityModelizer (response) {
          var entity = options.responseTraverser(response);
          options.modelize(entity);
          return response;
        }

        function listEntitiesModelizer (response) {
          var entities = options.responseTraverser(response);
          angular.forEach(entities, function (entity) {
            options.modelize(entity);
          });
          return response;
        }

      };
    })
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
