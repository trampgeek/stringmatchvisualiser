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

// The module that plots the graphs for the String Search Visualiser.
// Uses Plotly, which must be loaded by the html.
//

define([], function() {
    var currentPlotted = false;
    function plot(searchRec) {
        var xs = [],
            ys = [],
            i, p,
            maxx = 0,
            maxy = 0;

        for(i = 0; i < searchRec.comparisons.length; i++) {
            p = searchRec.comparisons[i];
            xs.push(p[0]);
            ys.push(p[1]);
            maxx = Math.max(maxx, p[0]);
            maxy = Math.max(maxy, p[1]);
        }

        Plotly.newPlot("comparisonsplot", [{x: xs, y: ys, mode: 'lines+markers'}],
            { xaxis: { title: "i", dtick: 1, range: [-0.2, maxx + 0.2] },
              yaxis: { title: "j", dtick: 1, range: [-0.5, maxy + 0.5] },
              showlegend: false,
              height: 300,
              margin: {
                   l: 60,
                   r: 30,
                   b: 60,
                   t: 10,
                   pad: 10
                },
            },
            { displayModeBar: false, staticPlot: true}
        );

        // Overwrite points at which matches occurred with a star
        if (searchRec.matches.length > 0) {
            xs = [];
            ys = [];
            for(i = 0; i < searchRec.matches.length; i++) {
                p = searchRec.comparisons[searchRec.matches[i]];
                xs.push(p[0]);
                ys.push(p[1]);
            }

            Plotly.addTraces("comparisonsplot", [
                {x : xs,
                 y: ys,
                 mode: 'markers',
                 marker: {
                     symbol: 'star',
                     color: 'rgb(255,215,0)',
                     size: 15,
                     line: {
                         color: 'grey',
                         width: 1,
                     },
                   }
                }]);
        }

        currentPlotted = false;
    }

    function showCurrent(p) {
        if (currentPlotted) {
            Plotly.deleteTraces("comparisonsplot", -1);
        }
        currentPlotted = true;
        Plotly.addTraces("comparisonsplot", [
            {x: [p[0]],
             y: [p[1]],
             mode:'markers',
             marker: {
                 symbol: "circle-open",
                 color: 'red',
                 line: {
                     width: 4
                 },
                 size: 20
             },
             }]);
    }


    return {
        plot: plot,
        showCurrent: showCurrent,
    };
});
