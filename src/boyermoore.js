/*  A full implementation of boyer moore, translated from the C version at
    http:wiki.dreamrunner.org/public_html/Algorithms/TheoryOfAlgorithms/Boyer-Moore_string_search_algorithm.html
    The python version at that site is buggy.
    This implementation works only for ASCII strings.
*/

define([], function () {
    var ALPHABET_LEN = 256;
    function ord(c) {
        return c.charCodeAt(0);
    }

    // delta1 table: delta1[c] contains the distance between the last
    // character of pat and the rightmost occurrence of c in pat.
    // If c does not occur in pat, then delta1[c] = patlen.
    // If c is at string[i] and c != pat[patlen-1], we can
    // safely shift i over by delta1[c], which is the minimum distance
    // needed to shift pat forward to get string[i] lined up
    // with some character in pat.
    // this algorithm runs in alphabet_len+patlen time.
    function make_delta1(pat) {
        var i, delta1;
        delta1 = new Array(ALPHABET_LEN).fill(pat.length);

        for (i=0; i < pat.length - 1; i++) {
            delta1[ord(pat[i])] = pat.length - 1 - i;
        }
        return delta1;
    }

    // true if the suffix of word starting from word[pos] is a prefix
    // of word
    function is_prefix(word, pos) {
        var suffixlen = word.length - pos;
        for (var i = 0; i < suffixlen; i++) {
            if (word[i] != word[pos+i]) {
                return 0;
            }
        }
        return 1;
    }

    // length of the longest suffix of word ending on word[pos].
    // suffix_length("dddbcabc", 4) = 2
    function suffix_length(word, pos) {
        // increment suffix length i to the first mismatch or beginning
        // of the word
        for (var i = 0; (word[pos - i] == word[word.length - 1 - i]) && (i < pos); i++) {
        }
        return i;
    }

    // delta2 table: given a mismatch at pat[pos], we want to align
    // with the next possible full match could be based on what we
    // know about pat[pos+1] to pat[patlen-1].
    //
    // In case 1:
    // pat[pos+1] to pat[patlen-1] does not occur elsewhere in pat,
    // the next plausible match starts at or after the mismatch.
    // If, within the substring pat[pos+1 .. patlen-1], lies a prefix
    // of pat, the next plausible match is here (if there are multiple
    // prefixes in the substring, pick the longest). Otherwise, the
    // next plausible match starts past the character aligned with
    // pat[patlen-1].
    //
    // In case 2:
    // pat[pos+1] to pat[patlen-1] does occur elsewhere in pat. The
    // mismatch tells us that we are not looking at the end of a match.
    // We may, however, be looking at the middle of a match.
    //
    // The first loop, which takes care of case 1, is analogous to
    // the KMP table, adapted for a 'backwards' scan order with the
    // additional restriction that the substrings it considers as
    // potential prefixes are all suffixes. In the worst case scenario
    // pat consists of the same letter repeated, so every suffix is
    // a prefix. This loop alone is not sufficient, however:
    // Suppose that pat is "ABYXCDBYX", and text is ".....ABYXCDEYX".
    // We will match X, Y, and find B != E. There is no prefix of pat
    // in the suffix "YX", so the first loop tells us to skip forward
    // by 9 characters.
    // Although superficially similar to the KMP table, the KMP table
    // relies on information about the beginning of the partial match
    // that the BM algorithm does not have.
    //
    // The second loop addresses case 2. Since suffix_length may not be
    // unique, we want to take the minimum value, which will tell us
    // how far away the closest potential match is.
    function make_delta2(pat) {
        var delta2 = new Array(pat.length).fill(0),
            p,
            slen,
            last_prefix_index = pat.length - 1;

        // first loop
        for (p = pat.length - 1; p >= 0; p--) {
            if (is_prefix(pat, p + 1)) {
                last_prefix_index = p + 1;
            }
            delta2[p] = last_prefix_index + (pat.length - 1 - p);
        }

        // second loop
        for (p = 0; p < pat.length - 1; p++) {
            slen = suffix_length(pat, p);
            if (pat[p - slen] != pat[pat.length - 1 - slen]) {
                delta2[pat.length - 1 - slen] = pat.length-1 - p + slen;
            }
        }
        return delta2;
    }

    function boyer_moore (pat, text) {
        var i, j, delta1, delta2, comparisons, matches;

        function equal(i, j) {
            comparisons.push([i, j]);
            return text[i] == pat[j];
        }

        delta1 = make_delta1(pat);
        delta2 = make_delta2(pat);
        comparisons = [];
        matches = [];

        // The empty pattern must be considered specially
        if (pat.length === 0) {
            return [0];
        }

        i = pat.length - 1;
        while (i < text.length) {
            j = pat.length - 1;
            while (j >= 0 && equal(i, j)) {
                --i;
                --j;
            }
            if (j < 0) {
                matches.push(comparisons.length - 1);
                i += pat.length + 1;
            } else {
                i += Math.max(delta1[ord(text[i])], delta2[j]);
            }
        }
        return { comparisons: comparisons, matches: matches};
    }

    return boyer_moore;
});




