// 植入切片
let hurtori = angular.element(document.getElementsByClassName('monthgift-btn')).scope().hurtReceive
angular.element(document.getElementsByClassName('monthgift-btn')).scope().hurtReceive=function(){console.log('lalalla');hurtori();}
angular.element(document.getElementsByClassName('monthgift-btn')).scope().hurtReceive()