var tradeApplication = angular.module("tradeApplication",["ngRoute","ngResource","ui.grid","ui.grid.grouping"]);

tradeApplication.config(function($routeProvider){
    $routeProvider
        .when("/",
            {
                templateUrl : "pages/trades.htm",
                controller : "tradesController"
            }
        )
        .when("/trades",
            {
                templateUrl : "pages/trades.htm",
                controller : "tradesController"
            }
        )
});

tradeApplication.service('tradesService', function($resource){
  var tradesToDisplay = [];
  this.getTrades = function(){
    var resource = $resource("http://localhost:8081/tradingApp/rest/trades",
                             {callback: "JSON_CALLBACK"},
                             {getTrades: {
                                 method: "JSONP",
                                 isArray: true
                             }
                    }
                  );  
     resource.getTrades().$promise.then(
        function( trades ) {
            angular.forEach(trades, function (item) {
                tradesToDisplay.push(item);
            });
        },
        function( error ) {
            console.log(error);
        }
    );
   return tradesToDisplay;
 }
       
});


tradeApplication.controller('tradesController',['$scope','tradesService','uiGridGroupingConstants', function($scope,tradesService,uiGridGroupingConstants){
    
    $scope.gridOptions = {
        treeRowHeaderAlwaysVisible: false,
        data: tradesService.getTrades(),
        columnDefs: [
            {name:'ID', field: 'TxnId'},
            {name:'Symbol', field:'Symbol',grouping: { groupPriority: 0 } },
            {name:'Action', field:'Action', grouping: { groupPriority: 1 }},
            {name:'Quantity', field:'Quantity'},
            {name:'Price', field:'Price'},
            {name:'Market Value', field:'MarketValue'},
            {name:'P/L', field:'profitLossRatio'}
        ],
        onRegisterApi: function( gridApi ) {
            $scope.gridApi = gridApi;
            $scope.gridApi.grid.registerDataChangeCallback(function() {
                $scope.gridApi.treeBase.expandAllRows();
            });
        }
    };
    
    $scope.expandAll = function(){
        $scope.gridApi.treeBase.expandAllRows();
    };

    $scope.toggleRow = function( rowNum ){
        $scope.gridApi.treeBase.toggleRowTreeState($scope.gridApi.grid.renderContainers.body.visibleRowCache[rowNum]);
    };

        
}]);


