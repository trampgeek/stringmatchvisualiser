// The Naive string find function module.
define([], function() {
    function naive(pattern, text) {
            var n = text.length,
                m = pattern.length,
                comparisons = [],
                matches = [],
                i, j,
                equal = function (textIndex, patIndex) {
                    comparisons.push([textIndex, patIndex]);
                    return text[textIndex] == pattern[patIndex];
                };

            for (i = 0; i <= n - m; i++) {
                j = 0;
                while (j < m && equal(i + j, j)) {
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
