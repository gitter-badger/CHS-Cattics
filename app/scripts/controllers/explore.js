'use strict';

angular.module('catticsApp')
  .controller('ExploreCtrl', function ($scope, $routeParams, $location, Restangular) {
    var exploreWhat = $routeParams.what;

    // Pagination
    var page = parseInt($location.search().page) || 1;
    Restangular.all('explore').get(exploreWhat, {count: true}).then(function(pages) {
      pages = parseInt(pages);

      $scope.paginationPages = Array.apply(null, {length: pages}).map(function(e, i) {
        return i+1;
      });

      $scope.isNextDisabled = function() {
        return page === pages;
      };
    });

    $scope.isPreviousDisabled = function() {
      return page === 1;
    };

    $scope.isPageActive = function(checkPage) {
      return checkPage === page;
    };

    $scope.goPrevPage = function() {
      if (!$scope.isPreviousDisabled()) {
        $location.search('page', page-1);
      }
    };

    $scope.goNextPage = function() {
      if (!$scope.isNextDisabled()) {
        $location.search('page', page+1);
      }
    };

    $scope.goPage = function(pg) {
      $location.search('page', pg);
    };

    // API
    Restangular.one('explore').getList(exploreWhat, {page: page}).then(function(res) {
      var rows = [];

      res.forEach(function(p) {
        var ownerType = p.ownerType.toLowerCase();
        var owner = p.owner[ownerType];

        if (ownerType === 'cat') {
          p.rating = p.hearts;
          //p.imgLink = '/cat/' + owner._id + '/photo/' + p._id;
          p.titleLink = '/cat/' + owner._id;
          p.imgLink = p.titleLink;
          p.icon = 'fa-heart';
        } else {
          p.rating = owner.meta.followers.length;
          p.imgLink = '/owner/' + owner._id;
          p.titleLink = p.imgLink;
          p.icon = 'hidden';
        }

        p.title = owner.info.name;
      });

      for (var i = 0; i < 5; i++) {
        rows.push(res.slice(i*4, i*4+4));
      }

      $scope.data = rows;
    });
  });
