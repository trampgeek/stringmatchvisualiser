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

    // Bad character table: last[c] contains the index in pat of the
    // last occurrence within pat of each character c in the alphabet.
    // If c does not occur in pat, last[c] = pat.length.
    function bad_character_table(pat) {
        var i, last;
        last = new Array(ALPHABET_LEN).fill(pat.length);

        for (i = 0; i < pat.length - 1; i++) {
            last[ord(pat[i])] = i;
        }
        return last;
    }

    function simpleBoyerMoore(pattern, text) {
        var i = 0, j, c, shift;
            comparisons = [],
            matches = [],
            m = pattern.length,
            last = bad_character_table(pattern),
            equal = function(i, j) {
                    comparisons.push([i, j]);
                    return text[i] == pattern[j];
            };

        while (i <= text.length - m) {
            j = m - 1;
            while (j >= 0 && equal(i + j, j)) {
                j -= 1;
            }
            if (j < 0) {
                matches.push(comparisons.length - 1);
                i += 1;
            } else {
                c = text[i + j];
                shift = j - last[ord(c)];
                i += Math.max(1, shift);
            }
        }

        return { comparisons: comparisons, matches: matches};
    }

    return simpleBoyerMoore;
});
