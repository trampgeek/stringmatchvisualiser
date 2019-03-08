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
// A simplified Boyer Moore implementation, using only the bad-character
// heuristic.
define([], function () {
    var ALPHABET_LEN = 256;
    function ord(c) {
        // Returns ASCII code for c
        return c.charCodeAt(0);
    }

    // Bad character table: last[c] contains the distance from the end of the
    // pattern of the last occurrence of c for each character c in the alphabet.
    // If c does not occur in pat, last[c] = pat.length.
    function bad_character_table(pat) {
        var i, m = pat.length;
        shift = new Array(ALPHABET_LEN).fill(m);
        for (i = 0; i < m; i++) {
            shift[ord(pat[i])] = m - i - 1;
        }
        return shift;
    }

    function simpleBoyerMoore(pattern, text) {
        var i,
            j,
            comparisons = [],
            matches = [],
            m = pattern.length,
            shift = bad_character_table(pattern),
            equal = function(pos, j) {
                    comparisons.push([pos, j]);
                    return text[pos] == pattern[j];
            };

        i = m - 1;
        while (i < text.length) {
            j = m - 1;
            while (j >= 0 && equal(i, j)) {
                i -= 1;
                j -= 1;
            }
            if (j < 0) {
                matches.push(comparisons.length - 1);
                i += m + 1;
            } else {
                i += Math.max(m - j, shift[ord(text[i])]);
            }
        }

        return { comparisons: comparisons, matches: matches};
    }

    return simpleBoyerMoore;
});
