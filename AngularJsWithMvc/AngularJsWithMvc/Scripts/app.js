var app = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.grouping', 'ui.grid.moveColumns','ui.grid.saveState']);

app.controller('MainCtrl', ['$scope','$http','$filter','uiGridConstants', '$interval', 'uiGridGroupingConstants','$timeout' ,'$window', function ($scope, $http,$filter, uiGridConstants ,$interval, uiGridGroupingConstants,$timeout,$window) {
    
    $scope.myDefs = [
            {"name":"ID","visible":false,"width":"5%","enableFiltering":true,"sort":{} },
            { "name": "FirstName", "visible": true, "width": "16%","enableFiltering":true,"sort": {} },
            { "name": "LastName", "visible": true, "width": "16%","enableFiltering":true,"sort": {} },
            { "name": "Age", "visible": true, "width": "10%","enableFiltering": true,"sort": {} },
            { "name": "Employed", "visible": true, "width": "20%","enableFiltering": true,"sort": {} },
            { "name": "Company", "visible": true, "width": "16%","enableFiltering": true,"sort": {} }
        ]

    $scope.gridOptions = {

        paginationPageSizes: [1, 5, 10, 20],
        paginationPageSize: 10,
        data: $scope.myData,
        showGridFooter: true,
        showColumnFooter: false,
        enableFiltering: true,
        enableGridMenu: true,
        enablePinning: true,
        enableColumnResize: true,
        enableColumnReordering: true,
        enableSorting: true,
        columnDefs:$scope.myDefs,
        onRegisterApi: function (gridApi) {

            $http.get("/Grids/GetGridCustomizationValues").then(function (response) {
                $scope.defaultBehaviour = response.data;
                $http.get("/People/GetPeople").then(function (response) {
                    $scope.gridOptions.data = response.data;
                });
            });
            $scope.gridApi = gridApi;
            $scope.columnArrayForGroupBy = [];
            $scope.columnArrayForSort = [];

            $timeout(function () {

                $http.get("/Grids/GetGridColumnState").then(function (response) {

                    $scope.temp1 = response.data;
                    $scope.tempArray = [];
                    var len = $scope.myDefs.length;
                    $scope.gridOptions.columnDefs = []; 
                    angular.forEach($scope.temp1, function (value, index) {
                        if (index < len) {
                            var tempObject1 = JSON.stringify(eval('(' + $scope.temp1.split(']},')[index] + "]}" + ')'));
                            $scope.tempObject2 = {};
                            $scope.tempObject2 = JSON.parse(tempObject1);
                            $scope.gridOptions.columnDefs.push($scope.tempObject2);
                        }
                    });
                    //angular.forEach($scope.gridOptions.columnDefs, function (value, index) {

                    //    $scope.gridOptions.columnDefs[index].enableFiltering = true;
                    //    console.log($scope.gridOptions.columnDefs[index].enableFiltering);
                    //});
                    //for (var i = 0, j = $scope.gridOptions[$index].columnDefs.length; i < j; i += 1) {
                    //    $scope.gridOptions[$index].columnDefs[i].enableFiltering = true;
                    //}

                    angular.forEach($scope.gridOptions.columnDefs, function (value, index) {
                        $scope.columnArrayForSort.push(value.name);
                    });

                    angular.forEach($scope.columnNames, function (value, index) {
                        $scope.columnArrayForGroupBy.push(value.name.split(" ").join(""));
                    }); 

                    if ($scope.defaultBehaviour[0]) {
                        if ($scope.defaultBehaviour[0].GroupBy) {
                            var indexToCheck = $scope.columnArrayForGroupBy.indexOf($scope.defaultBehaviour[0].GroupBy);
                            console.log(indexToCheck);
                            if (indexToCheck >= 0) {
                                $scope.gridApi.grouping.groupColumn($scope.defaultBehaviour[0].GroupBy);
                                $scope.columnNames[indexToCheck].checked = true;
                            }
                        }

                        if ($scope.defaultBehaviour[0].SortBy && $scope.defaultBehaviour[0].Direction) {
                            var indexToSort = $scope.columnArrayForSort.indexOf($scope.defaultBehaviour[0].SortBy);
                            if (indexToSort >= 0) {
                                $scope.gridApi.grid.sortColumn($scope.gridOptions.columnDefs[indexToSort], $scope.defaultBehaviour[0].Direction, true);
                                console.log(indexToSort);
                            }
                        }
                    }

                });

                //angular.forEach($scope.defaultBehaviour[0].GroupBy, function (value, index) {

                //    $scope.gridApi.grouping.groupColumn($scope.defaultBehaviour[0].GroupBy[index]);
                //    var indexToCheck = $scope.columnArray.indexOf($scope.defaultBehaviour[0].GroupBy[index]);
                //    if (indexToCheck >= 0) {
                //        $scope.columnNames[indexToCheck].checked = true;
                //    }
                //});

                //angular.forEach($scope.defaultBehaviour[0].SortBy, function (value, index) {

                //    var indexToSort = $scope.columnArray.indexOf($scope.defaultBehaviour[0].SortBy[index]);
                //    if (indexToSort >= 0) {
                //        $scope.gridApi.grid.sortColumn($scope.gridOptions.columnDefs[indexToSort], $scope.defaultBehaviour[0].direction[index], true);
                //    }

                //});
            });
        }
        //columnDefs: [
        //    {"name":"ID","visible":false,"width":"5%","sort":{}},
        //    { "name": "FirstName", "visible": true, "width": "16%", "sort": {} },
        //    { "name": "LastName", "visible": true, "width": "16%", "sort": {} },
        //    { "name": "Age", "visible": true, "width": "10%", "sort": {} },
        //    { "name": "Employed", "visible": true, "width": "20%", "sort": {} },
        //    { "name": "Company", "visible": true, "width": "16%", "sort": {} }
        //]
    };


    $scope.clearAll = function () {
        $scope.gridApi.grouping.clearGrouping();
        $scope.selectedColumns = $filter('filter')($scope.columnNames, { checked: true });
        angular.forEach($scope.selectedColumns, function (value, index) {
            value.checked = false;
        });
        $scope.gridApi.core.clearAllFilters();
        $scope.gridApi.selection.clearSelectedRows();
        $scope.selectedItems = {};
        $scope.selectedId = [];
        $scope.selectedIdFromServer = [];
    };

    $scope.getSelectedRows = function () {
        $scope.selectedItems = $scope.gridApi.selection.getSelectedRows();
        $scope.selectedId = [];
        angular.forEach($scope.selectedItems, function (value, index) {
            $scope.selectedId.push($scope.selectedItems[index].ID);
        })
        var jsonData = angular.toJson($scope.selectedId);
        $http({
            method: 'POST',
            url: '/People/SelectedPeople',
            data: { id: jsonData },
            headers: { 'Content-Type': 'application/json' }
        }).then(function(response){
            $scope.selectedIdFromServer = response.data;
        });
    };

    $scope.columnNames = [{ 'name': 'First Name' }, { 'name': 'Last Name' }, { 'name': 'Company' },{'name':'Employed'},
        { 'name': 'Age' }];

    $scope.changeGrouping = function () {
        $scope.gridApi.grouping.clearGrouping();
        $scope.selectedColumns = $filter('filter')($scope.columnNames, { checked: true });
        angular.forEach($scope.selectedColumns, function (value, index) {
            $scope.gridApi.grouping.groupColumn(value.name.split(" ").join(""));
        });
    };

    $scope.saveColumnState = function () {

        $scope.state = $scope.gridApi.saveState.save();
        $scope.columnState = "";
        angular.forEach($scope.state.columns, function (value, index) {
            $scope.state.columns[index].sort = {};
            //delete $scope.state.columns[index].filters;
            $scope.columnState += angular.toJson($scope.state.columns[index])+",";
        });
        $http({
            method: 'POST',
            url: '/Grids/SetGridColumnState',   
            data: { columnState: $scope.columnState },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
        });
    };

}]);