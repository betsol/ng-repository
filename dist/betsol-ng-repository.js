/**
 * betsol-ng-repository - Repository constructor for Angular.js
 * @version v0.0.0
 * @link https://github.com/betsol/ng-repository
 * @license MIT
 *
 * @author Slava Fomin II <s.fomin@betsol.ru>
 */
(function (window, angular) {

  'use strict';

  angular.module('betsol.repository', ['betsol.networking'])
    .factory('Repository', ['$q', 'request', function ($q, request) {
      return function Repository (url) {

        // Normalizing specified URL.
        url = normalizeUrl(url);

        return {
          find: function (query, count, offset) {
            query = query || {};
            if (count > 0) {
              query.count = count;
            }
            if (offset >= 0) {
              query.offset = offset;
            }
            return request.get(url, query);
          },
          findOneById: function (id, query) {
            return request.get(urlWithId(url, id), query);
          },
          create: function (entity) {
            return request.post(url, null, entity);
          },
          update: function (id, entity) {
            return request.put(urlWithId(url, id), null, entity);
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

})(window, angular);
