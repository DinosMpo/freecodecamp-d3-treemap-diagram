import { useState, useEffect } from 'react'
import './App.css'
import * as d3 from "d3";

function App() {
  const [data, setData] = useState('');
  const [load, setLoad] = useState(false);

  const w = 1000;
  const h = 600;

  useEffect(() => {
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
      .then(res => res.json())
      .then((d) => setData(d))
      .then(() => setLoad(true))
  }, [0]);

  useEffect(() => {
    if (load) {
      const colors = ['#1C1832', '#9E999D', '#F2259C', '#347EB4',
        '#08ACB6', '#91BB91', '#BCD32F', '#75EDB8',
        "#89EE4B", '#AD4FE8', '#D5AB61', '#BC3B3A',
        '#F6A1F9', '#87ABBB', '#412433', '#56B870',
        '#FDAB41', '#64624F'];

      const categories = data.children.map(d => d.name);

      const colorScale = d3.scaleOrdinal()
        .domain(categories)
        .range(colors);

      const svg = d3.select("#chart")
        .append("svg")
        .attr("id", "mySvg")
        .attr("width", w)
        .attr("height", h);

      const hierarchy = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

      const treemap = d3.treemap()
        .size([1000, 600])
        .padding(2);

      const root = treemap(hierarchy);

      const game = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", d => "translate(" + d.x0 + ", " + d.y0 + ")");

      game.append("rect")
        .attr("class", "tile")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("fill", d => colorScale(d.data.category))
        .on("mousemove", (e, d) => {
          console.log(d.data);
          d3.select("#tooltip")
            .style("display", "inline")
            .attr("data-value", d.data.value)
            .style("left", e.offsetX + 15 + "px")
            .style("top", e.offsetY - 5 + "px")
            .html(() => {
              return `<div id="info">
                        <div>Name: ${d.data.name}</div>
                        <div>Category: ${d.data.category}</div>
                        <div>Value: ${d.data.value}</div>
              </div>`;
            });
        })
        .on("mouseout", (e, d) => {
          d3.select("#tooltip")
            .style("display", "none")
        });

      game.append("text")
        .attr("class", "tile-text")
        .attr("x", 5)
        .attr("y", 18)
        .text(d => d.data.name)
        .attr("font-size", "10px");

      //legends code

      let legendsCategories = root.leaves().map((d) => {
        return d.data.category;
      });

      legendsCategories = [...new Set(legendsCategories)];

      //prepei kapws na upologisw poses kathgories 8a exw ana sthlh
      const legend = d3.select("#chart")
        .append("svg")
        .attr("id", "legend")
        .attr("width", 550)
        .attr("height", 155)

      legend.selectAll("g")
        .data(legendsCategories)
        .enter()
        .append("g")
        .attr('transform', (d, i) => {
          let x;
          let y = 25;
          if (i <= 5) {
            x = 100;
          } else if (i > 5 && i <= 11) {
            x = 275;
          } else if (i > 11 && i <= 17) {
            x = 450;
          }
          return 'translate(' + x + ',' + y * ((i + 1) % 6 === 0 ? 6 : (i + 1) % 6) + ')';
        })
        .append("text")
        .text(d => d);

      legend.selectAll("rect")
        .data(legendsCategories)
        .enter()
        .append("rect")
        .attr("class", "legend-item")
        .attr("width", 15)
        .attr("height", 15)
        .attr("x", (d, i) => {
          let x;
          if (i <= 5) {
            x = 75;
          } else if (i > 5 && i <= 11) {
            x = 250;
          } else if (i > 11 && i <= 17) {
            x = 425;
          }
          return x;
        })
        .attr("y", (d, i) => {
          let y = 25;
          // return y * ((i + 1) % 6 === 0 ? 6 : (i + 1) % 6);
          return (y * (i % 6)) + 12;
        })
        .attr("fill", d => colorScale(d));
    }
  }, [load]);

  // console.log("data", data);

  return load ? (
    <div id="App">
      <div id="title">{data.name}</div>
      <div id="description"></div>
      <div id="chart">
        <div id="tooltip"></div>
      </div>
      <div>
        Created by <a href="https://github.com/DinosMpo/freecodecamp-d3-treemap-diagram" target="_blank" rel="noreferrer">DinosMpo</a>
      </div>
    </div>
  )
    :
    (
      <div>
        Loading....
      </div>
    )
}

export default App
