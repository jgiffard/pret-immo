var simulateur = angular.module('simulateur', []);

simulateur.controller('MainCtrl', ['$scope', function ($scope) {

    $scope.pret = {
        //Valeurs par defaut
        capital: 100000,
        duree: 20,
        tauxInteret: 4.5,
        tauxAssurance: 2.5,
        mensualite:0,
        coutTotal:0
    };

    $scope.mensualites = [];

    //Mise à jour des résultats
    $scope.calculPret = function () {
        if($scope.formulaire && $scope.formulaire.$valid){
            $scope.calculMensualite();
            $scope.calculCoutTotal();
            $scope.calculEcheancier();
        }
    }

    // Montant à payer chaque mois
    $scope.calculMensualite = function () {
        var txIntParEch = $scope.pret.tauxInteret/100/12,
            coutAssurParMois = $scope.pret.capital*$scope.pret.tauxAssurance/100/12;

        //Si le taux d'intérêt est null
        if(txIntParEch === 0){
            $scope.pret.mensualite = ($scope.pret.capital/$scope.pret.duree/12 + coutAssurParMois);
        }
        else {
            $scope.pret.mensualite = ($scope.pret.capital*txIntParEch/(1 - Math.pow(1 + txIntParEch, -$scope.pret.duree*12)) + coutAssurParMois).toFixed(2);
        }
    };

    // Coût total à payer
    $scope.calculCoutTotal = function () {
        $scope.pret.coutTotal = ($scope.pret.mensualite * $scope.pret.duree * 12 - $scope.pret.capital).toFixed(2);
        // $scope.pret.mensualite =  $scope.pret.mensualite.toFixed(2);
    };

    //Répartition du montant à payer par mois
    $scope.calculEcheancier = function () {
        $scope.mensualites = [];
        var capitalRestant = $scope.pret.capital,
            interets,
            pretPrincipal,
            txIntParEch = $scope.pret.tauxInteret/100/12,
            coutAssurParMois = $scope.pret.capital*$scope.pret.tauxAssurance/100/12,
            i=0;
        // Pour chaque mensualité
        for(i = 0 ; i < $scope.pret.duree*12; i++){

            interets = capitalRestant * txIntParEch;
            pretPrincipal = $scope.pret.mensualite - coutAssurParMois - interets;
            capitalRestant = capitalRestant - pretPrincipal;

            $scope.mensualites.push({
                interets: interets.toFixed(2),
                pretPrincipal: pretPrincipal.toFixed(2),
                capitalRestant: capitalRestant.toFixed(2),
                assurance: coutAssurParMois.toFixed(2)   
            });
        }
    };
    $scope.$watch('$viewContentLoaded', function(){
        $scope.calculPret();//FIXME
    });
}]);

//Convertion des valeurs des champs inputs en float
simulateur.directive('input', function () {
    return {
        restrict: 'E',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            ctrl.$parsers.push(function (value) {
                return parseFloat(value || '');
            });
        }
    };
});
