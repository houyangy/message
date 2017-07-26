angular.module("services",[])
.factory("todoData",function(){
   return localStorage.todo?JSON.parse(localStorage.todo):[];
})