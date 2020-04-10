        /**
         * Функция сравнивает строки с учётом числовых значений в них
         * Например, для "a100b", "a11b" вернёт 1, что соответствует "a100b" > "a11b"
         * Третьим параметром может быть передано регулярное выражение для поиска чисел
         * по умолчанию - ищет беззнаковые десятичные целые
         *
         * Совместима с методом sort массива
         */
        function hybridComparator(a, b, number_pattern){
            if(a instanceof RegExp){
                return function(x,y){
                    hybridComparator(x, y, a);
                }
            }
            function stringComparator(a, b){
                return a==b ? 0 : a>b ? 1 : -1;
            }
            function numberComparator(a, b){
                var d =+a-+b;
                return d && d / Math.abs(d);
            }
            //Если a>b - 1
            //Если a==b - 0
            //Если a<b - -1
            a = String(a);
            b = String(b);
            if(a==b) return 0;
            if(a=='') return -1;
            if(b=='') return 1;

            number_pattern = number_pattern || hybridComparator.unsigned_integer_pattern;

            var na = a.match(number_pattern);
            var sa = a.split(number_pattern);

            var nb = b.match(number_pattern);
            var sb = b.split(number_pattern);

            var la = na.length;
            var lb = nb.length;

            //Если одна строка начинается с числа, а другая - нет, то нет смысла в сложном сравнеии
			if(!sa[0] && sb[0]) return stringComparator(na[0], sb[0]);
            if(sa[0] && !sb[0]) return stringComparator(sa[0], nb[0]);

			//Внутри исходной строки, нечисловой элемент предшествует числовому того же индекса
            var i=0;
            var ret = 0;
            while(i<la && i<lb){
                //Сначала сравниваем нечисловой элемент
				//Если они равны - сравниваем следующий за ним числовой элемент как число
				//Если они тоже равны - дополнительно сравниваем их как строки, на случай различия в формате числа.
				ret = stringComparator(sa[i],sb[i]) || numberComparator(na[i],nb[i]) || stringComparator(na[i],nb[i]);
                //Если ret ненулевой - возвращаем его
                if(ret) return ret;
                //Если нет - идём дальше
                ++i;
            }
            //Кончились числовые значения, осталось одно строковое
            ret = stringComparator(sa[i],sb[i]);
            if(ret) return ret;
			//Если одна из строк оказалась левой подстрокой другой, то меньше та, которая короче
            return numberComparator(la, lb);
        };

        hybridComparator.float_pattern = /[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi;
        hybridComparator.unsigned_float_pattern = /\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi;
        hybridComparator.unsigned_integer_pattern = /\d+/g;
        hybridComparator.integer_pattern = /[+-]?\d+/g;
		
module.exports = hybridComparator;