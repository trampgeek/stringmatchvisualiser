/*
    Copyright (C) 2019  Richard Lobb

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version. See <https://www.gnu.org/licenses/>

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 */

// The module defining the different string search algorithms.
// Each algorithm is a function that takes the pattern and the search text
// as parameters and returns a list of 2-element lists [i, j], being the
// indices into the text and pattern respectively of any character comparisons
// performed in executing the algorithm.
// The module defines an object with two attributes: names (a list of
// (function, externalName) pairs for all the implemented search functions) and
// run (a function that is called to run a specific module).

define(['naive', 'kmp', 'simpleboyermoore', 'boyermoore'], function (f_naive, f_kmp, f_simplebm, f_bm) {
    var algorithms = {
        naive: function(pattern, text) {
            return f_naive(pattern, text);
        },

        // Knuth Morris Pratt
        kmp: function(pattern, text) {
            return f_kmp(pattern, text);
        },

        simpleboyermoore: function(pattern, text) {
            return f_simplebm(pattern, text);
        },

        boyermoore: function(pattern, text) {
            return f_bm(pattern, text);
        }
    };

    return {
        list: [
            ['naive', "Naive"],
            ['kmp', "KMP"],
            ['simpleboyermoore', 'Boyer-Moore-Horspool'],
            ['boyermoore', "Full Boyer-Moore"]],
        run: function (algorithm_name, pattern, text) {
            return algorithms[algorithm_name](pattern, text);
        }
    };
});
