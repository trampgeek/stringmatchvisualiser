// A full implementation of boyer moore, translated from the Python version at
// http://wiki.dreamrunner.org/public_html/Algorithms/TheoryOfAlgorithms/Boyer-Moore_string_search_algorithm.html
// However it only works for purely alphabetic chars.
define([], function () {

    function alphabet_index(c) {
        // Returns the index of the given character in the English alphabet, counting from 0.
        return c.toLowerCase().charCodeAt(0) - 97; // 'a' is ASCII character 97
    }

    function match_length(S, idx1, idx2) {
        //  Returns the length of the match of the substrings of S beginning at idx1 and idx2.
        var match_count = 0;
        if (idx1 == idx2) {
            return S.length - idx1;
        }

        while (idx1 < S.length && idx2 < S.length && S[idx1] == S[idx2]) {
            match_count += 1;
            idx1 += 1;
            idx2 += 1;
        }
        return match_count;
    }

    function fundamental_preprocess(S) {
        // Returns Z, the Fundamental Preprocessing of S. Z[i] is the length of the substring
        // beginning at i which is also a prefix of S. This pre-processing is done in O(n) time,
        // where n is the length of S.
        var z, i, l, r, k, a, b;
        if (S.length == 0) { // Handles case of empty string
            return [];
        }
        if (S.length == 1) { // Handles case of single-character string
            return [1];
        }
        z = new Array(S.length).fill(0);
        z[0] = S.length;
        z[1] = match_length(S, 0, 1);
        for (i = 2; i < 1 + z[1]; i++) {
            // Optimization from exercise 1-5
            z[i] = z[1]-i+1;
        }
        // Defines lower and upper limits of z-box
        l = 0;
        r = 0;
        for (i = 2 + z[1]; i < S.length; i++) {
            if (i <= r) { // i falls within existing z-box
                k = i-l;
                b = z[k];
                a = r-i+1;
                if (b < a) { // b ends within existing z-box
                    z[i] = b;
                } else { // b ends at or after the end of the z-box, we need to do an explicit match to the right of the z-box
                    z[i] = a+match_length(S, a, r+1);
                    l = i;
                    r = i+z[i]-1;
                }
            } else { // i does not reside within existing z-box
                z[i] = match_length(S, 0, i);
                if (z[i] > 0) {
                    l = i;
                    r = i+z[i]-1;
                }
            }
        }
        return z;
    }

    function bad_character_table(S) {
        /*
        Generates R for S, which is an array indexed by the position of some character c in the
        English alphabet. At that index in R is an array of length |S|+1, specifying for each
        index i in S (plus the index after S) the next location of character c encountered when
        traversing S from right to left starting at i. This is used for a constant-time lookup
        for the bad character rule in the Boyer-Moore string search algorithm, although it has
        a much larger size than non-constant-time solutions.
        */
        var a, c, i, j, R, alpha;
        if (S.length == 0) {
            return new Array(26).fill([]);
        }
        R = new Array(26);
        for (i = 0; i < 26; i++) R[i] = [-1];
        alpha = new Array(26).fill(-1);
        for (i = 0; i < S.length; i++) {
            c = S[i];
            alpha[alphabet_index(c)] = i;
            for (j = 0; j < alpha.length; j++) {
                a = alpha[j];
                R[j].push(a);
            }
        }
        return R;
    }

    function good_suffix_table(S) {
        /*
        Generates L for S, an array used in the implementation of the strong good suffix rule.
        L[i] = k, the largest position in S such that S[i:] (the suffix of S starting at i) matches
        a suffix of S[:k] (a substring in S ending at k). Used in Boyer-Moore, L gives an amount to
        shift P relative to T such that no instances of P in T are skipped and a suffix of P[:L[i]]
        matches the substring of T matched by a suffix of P in the previous match attempt.
        Specifically, if the mismatch took place at position i-1 in P, the shift magnitude is given
        by the equation P.length - L[i]. In the case that L[i] = -1, the full shift table is used.
        Since only proper suffixes matter, L[0] = -1.
        */
        var L, S_rev, N, i, j;
        L = new Array(S.length).fill(-1);
        S_rev = S.split('').reverse().join('');
        N = fundamental_preprocess(S_rev);
        N.reverse();
        for (j = 0; j < S.length-1; j++) {
            i = S.length - N[j];
            if (i != S.length) {
                L[i] = j;
            }
        }
        return L;
    }

    function full_shift_table(S) {
        /*
        Generates F for S, an array used in a special case of the good suffix rule in the Boyer-Moore
        string search algorithm. F[i] is the length of the longest suffix of S[i:] that is also a
        prefix of S. In the cases it is used, the shift magnitude of the pattern P relative to the
        text T is P.length - F[i] for a mismatch occurring at i-1.
        */
        var n = S.length,
            F = new Array(n).fill(0),
            Z = fundamental_preprocess(S).reverse(),
            longest = 0,
            i, j, zv;
        for (i = 0; i < Z.length; i++) {
            zv = Z[i];
            if (zv == i+1) {
                longest = Math.max(zv, longest);
            }
            F[(n - i - 1) % n] = longest;
        }
        return F;
    }

    function string_search(P, T) {
        /*
        Implementation of the Boyer-Moore string search algorithm. This finds all occurrences of P
        in T, and incorporates numerous ways of pre-processing the pattern to determine the optimal
        amount to shift the string and skip comparisons. In practice it runs in O(m) (and even
        sublinear) time, where m is the length of T. This implementation performs a case-insensitive
        search on ASCII alphabetic characters, spaces not included.
        */
        // Modified to return a list of (i,j) pairs at which character
        // comparisons took place in the main search.
        var matches, R, L, F, k, i, h, previous_k, shift, char_shift,
            suffix_shift, comparisons,
            equal = function(i, j) {
                comparisons.push([i, j]);
                return T[i] == P[j];
            };

        if (P.length == 0 || T.length == 0 || T.length < P.length) {
            return [];
        }

        matches = [];
        comparisons = [];

        // Preprocessing
        R = bad_character_table(P);
        L = good_suffix_table(P);
        F = full_shift_table(P);

        k = P.length - 1;      // Represents alignment of end of P relative to T
        previous_k = -1;       // Represents alignment in previous phase (Galil's rule)
        while (k < T.length) {
            i = P.length - 1;  // Character to compare in P
            h = k ;          // Character to compare in T
            while (i >= 0 && h > previous_k && equal(h, i)) {   // Matches starting from end of P
                i -= 1;
                h -= 1;
            }
            if (i == -1 || h == previous_k) {  // Match has been found (Galil's rule)
                matches.push(comparisons.length - 1);
                if (P.length > 1) {
                    k += P.length-F[1];
                } else {
                    k += 1;
                }
            } else {   // No match, shift by max of bad character and good suffix rules
                char_shift = i - R[alphabet_index(T[h])][i];
                if (i+1 == P.length) {   // Mismatch happened on first attempt
                    suffix_shift = 1;
                } else if (L[i+1] == -1) {  // Matched suffix does not appear anywhere in P
                    suffix_shift = P.length - F[i+1];
                } else {              // Matched suffix appears in P
                    suffix_shift = P.length - L[i+1];
                }
                shift = Math.max(char_shift, suffix_shift);
                if (shift >= i + 1) {
                    previous_k = k;
                }
                k += shift;
            }
        }
        return { comparisons: comparisons, matches: matches};
    }

    // Main body here - it returns the string_search function.

    return string_search;
});

