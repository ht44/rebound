'use strict';
let shooter = false;
let offense = [];
let defense = [];
const payload = {
  bench: new Array()
}

const response = {
  data: [
    {x: 450, y: 400, prob: 8},
    {x: 150, y: 150, prob: 1},
    {x: 150, y: 50, prob: 2},
    {x: 110, y: 330, prob: 9},
    {x: 400, y: 50, prob: 3},
    {x: 100, y: 50, prob: 4},
    {x: 190, y: 70, prob: 7},
    {x: 140, y: 230, prob: 5},
    {x: 370, y: 20, prob: 9.9},
    {x: 260, y: 180, prob: 6}
  ]
}
const rgbValues = [
  'rgb(0, 229, 200)',
  'rgb(19, 206, 182)',
  'rgb(38, 183, 164)',
  'rgb(57, 160, 147)',
  'rgb(76, 137, 129)',
  'rgb(95, 114, 112)',
  'rgb(114, 91, 94)',
  'rgb(133, 68, 76)',
  'rgb(152, 45, 59)',
  'rgb(171, 22, 41)'
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
                // .style('background-image', 'url(http://robslink.com/SAS/democd54/nba_court_dimensions.jpg)')
                // .style('background-size', 'cover')
                .attr('width', 500)
                .attr('height',  470)
                .style('border', '3px outset grey')
                .style('box-shadow', '4px 6px 33px 0px rgba(0,0,0,0.75)')
                .on('click', placeOffender)
                .on('contextmenu', placeDefender);

const hoop = court.append('circle')
                  .attr('cx', 250)
                  .attr('cy', 416.5)
                  .attr('r', 7.5)
                  .attr('stroke', 'yellow');


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
  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://10.8.81.4:9099/predict');
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        let response = JSON.parse(xhr.response);
        offense.forEach((offender, i) => {
          offender.property('probability', response[offender.attr('id')].probability);
        });

        defense.forEach((defender, i) => {
          defender.property('probability', response[defender.attr('id')].probability);
        });

        offense.concat(defense)
        .sort((a, b) => a.property('probability') - b.property('probability'))
        .forEach((man, index) => {
          man.transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr('fill', rgbValues[index])
          .attr('cx', response[man.attr('id')].newx * 10)
          .attr('cy', response[man.attr('id')].newy * 10)
        });
      }
    }
  }
  xhr.send(JSON.stringify(payload));
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
