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

// The KMP module.
define([], function () {
    function kmp(pattern, text) {
        var b = new Array(pattern.length + 1).fill(0),
            i = 0,
            j = 1,
            bj = 0,
            comparisons = [],
            matches = [],
            equal = function (textIndex, patIndex) {
                comparisons.push([textIndex, patIndex]);
                return text[textIndex] == pattern[patIndex];
            };

        b[0] = -1;
        b[1] = 0;

        while (j < pattern.length) {
            while (bj >= 0 && (pattern[j] != pattern[bj])) {
                 bj = b[bj];
            }
            j += 1;
            bj += 1;
            b[j] = bj;
        }

        j = 0;
        while (i < text.length) {
            while (j >= 0 && !equal(i, j)) {
                j = b[j];
            }
            i += 1;
            j += 1;
            if (j == pattern.length) {
                // Match found.
                matches.push(comparisons.length - 1);
                j = b[j];
            }
        }
        return { comparisons: comparisons, matches: matches};
    }

    return kmp;
});
