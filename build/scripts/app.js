// Если библиотека не может работать без jquery
// Подключаем jquery с помощью expose-loader (expose?функция!)
// Функции добавленные, через expose будут доступны в глобальном scoupe
// import 'expose?$!expose?jQuery!jquery/dist/jquery.min.js';

import $ from 'jquery/dist/jquery.min.js';

$(document).ready(function(){

});
