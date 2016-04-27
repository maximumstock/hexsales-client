'use strict';

var chartFlags = [
  // {x: Date.parse('2014-12-09'), text: '<a target="_blank" href="#/articles/Set 002 Booster Pack">Shattered Destiny Launch</a>', title: 'SD Launch'},
  {x: Date.parse('2015-03-10'), text: '<a target="_blank" href="https://www.hextcg.com/hex-update-arena-opens-march-10th">Arena Launch</a>', title: 'Arena Launch'},
  {x: Date.parse('2015-07-21'), text: '<a target="_blank" href="#/articles/Set 003 Booster Pack">Armies of Myth</a>', title: 'AoM Launch'},
  {x: Date.parse('2016-01-29'), text: '<a target="_blank" href="https://www.hextcg.com/hex-update-entraths-alive">PvE Campaign Launch</a>', title: 'PvE Campaign Launch'},
	{x: Date.parse('2016-04-26'), text: '<a target="_blank" href="https://www.hextcg.com/primal-dawn-is-now-live">Primal Dawn Launch</a>', title: 'PD Launch'}
];

var chartFlagSeries = {
  type: 'flags',
  name: 'Events',
  color: '#333333',
  shape: 'squarepin',
  y: -40,
  data: chartFlags,
  showInLegend: false
};
