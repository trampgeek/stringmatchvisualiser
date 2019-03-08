// The Naive string find function module.
// In this algorithm the text index i is given by shift + j.
define([], function() {
    function naive(pattern, text) {
            var n = text.length,
                m = pattern.length,
                comparisons = [],
                matches = [],
                shift, j,
                equal = function (textIndex, patIndex) {
                    comparisons.push([textIndex, patIndex]);
                    return text[textIndex] == pattern[patIndex];
                };

            for (shift = 0; shift <= n - m; shift++) {
                j = 0;
                while (j < m && equal(shift + j, j)) {
                    j += 1;
                }
                if (j ==  m) {
                    matches.push(comparisons.length - 1);
                }
            }
            return { comparisons: comparisons, matches: matches};
        }

    return naive;
});
