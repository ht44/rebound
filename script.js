'use strict';
let shooter = false;
let offense = [];
let defense = [];
const payload = {
  bench: new Array()
}

const response = [
  {newx: 45, newy: 40, probability: 8},
  {newx: 15, newy: 15, probability: 1},
  {newx: 15, newy: 5, probability: 2},
  {newx: 11, newy: 33, probability: 9},
  {newx: 40, newy: 5, probability: 3},
  {newx: 10, newy: 5, probability: 4},
  {newx: 19, newy: 7, probability: 7},
  {newx: 14, newy: 23, probability: 5},
  {newx: 37, newy: 2, probability: 9.9},
  {newx: 26, newy: 18, probability: 6}
];

const rgbValues = [
  'rgb(255, 0, 0)',
  'rgb(255, 128, 0)',
  'rgb(255, 255, 0)',
  'rgb(128, 255, 0)',
  'rgb(0, 255, 0)',
  'rgb(0, 255, 128)',
  'rgb(0, 255, 255)',
  'rgb(0, 128, 255)',
  'rgb(0, 0, 255)',
  'rgb(127, 0, 255)'
];

class Player {
  constructor(x, y, isOffense, isShooter) {
    this.x = x;
    this.y = y;
    this.isOffense = isOffense;
    this.isShooter = isShooter;
  }
}

const trigger = document.getElementById('run');
const clear = document.getElementById('clear');
const container = document.getElementById('container');
const court = d3.select('#container')
                .append('svg')
                // .style('background-image', 'url(svgs/ultimate.svg), url(images/5965362680_1e541c0e95.jpg)')
                .style('background-image', 'url(svgs/ultimate.svg)')
                .style('background-size', 'cover')
                .style('background-color', 'rgb(47, 71, 62)')
                .attr('width', 500)
                .attr('height',  470)
                .style('border', '3px outset grey')
                .style('box-shadow', '4px 6px 33px 0px rgba(0,0,0,0.75)')
                // .style('box-shadow', '2px 2px 23px 7px rgba(0,0,0,0.75)')
                .on('click', placeOffender)
                .on('contextmenu', placeDefender);

// const hoop = court.append('circle')
//                   .attr('cx', 250)
//                   .attr('cy', 416.5)
//                   .attr('r', 7.5)
//                   .attr('stroke', 'yellow');


trigger.addEventListener('click', logPayload);
clear.addEventListener('click', restore);

// implementation /////////////////////////////////////////////////////////////

function placeOffender() {

  let xy = d3.mouse(this);

  if (offense.length < 5) {
    let player = court.append('circle')
                      .attr('class', 'player')
                      .attr('cx', xy[0])
                      .attr('cy', xy[1])
                      .attr('r', 15)
                      .attr('fill', 'white')
                      .attr('stroke', 'black')
                      .attr('stroke-width', '3');

    offense.push(player)
    payload.bench.push(new Player(
      (xy[0] / 10),(xy[1] / 10), true, false
    ));
    offense[offense.length - 1].attr('id', payload.bench.length - 1);

  }

  if ((window.event.shiftKey && !shooter) ||
      (offense.length === 5 && !shooter)) {
    offense[offense.length - 1].attr('fill', 'green')
                               .attr('stroke', 'gold')
    payload.bench[payload.bench.length - 1].isShooter = true;
    shooter = true;
  }
//
}

function placeDefender() {
  d3.event.preventDefault();
  let xy = d3.mouse(this);
  if (defense.length < 5) {
    let player = court.append('circle')
                      .attr('class', 'player')
                      .attr('cx', xy[0])
                      .attr('cy', xy[1])
                      .attr('r', 15)
                      .attr('fill', 'black')
                      .attr('stroke', 'white')
                      .attr('stroke-width', '3');

    defense.push(player);
    payload.bench.push(new Player(
      (xy[0] / 10), (xy[1] / 10), false, false
    ));
    defense[defense.length - 1].attr('id', payload.bench.length - 1);

  }
}

function logPayload() {
  // let xhr = new XMLHttpRequest();
  // xhr.open('POST', 'http://10.8.81.4:9099/predict');
  // xhr.onreadystatechange = () => {
  //   if (xhr.readyState == 4) {
  //     console.log(xhr.response);
  //     if (xhr.status == 200) {
  //       let response = JSON.parse(xhr.response);
        offense.forEach((offender, i) => {
          offender.property('probability', response[offender.attr('id')].probability);
        });

        defense.forEach((defender, i) => {
          defender.property('probability', response[defender.attr('id')].probability);
        });

        offense.concat(defense)
        .sort((a, b) => a.property('probability') - b.property('probability'))
        .forEach((man, index) => {
          // let val = man.property('probability') * 255;
          // let newColor = `rgb(${val}, , 0)`;
          man.transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr('fill', rgbValues[index])
          .attr('cx', response[man.attr('id')].newx * 10)
          .attr('cy', response[man.attr('id')].newy * 10)
        });
  //     }
  //   }
  // }
  // xhr.send(JSON.stringify(payload));
  // console.log(JSON.stringify(payload));
}

function restore() {
  offense = [];
  defense = [];
  payload.bench = [];
  shooter = false;
  court.selectAll('circle.player').remove();
}
//
