'use strict';

function getFlagSeries() {

	var chartFlags = [
		// {x: Date.parse('2014-12-09'), text: '<a target="_blank" href="#/articles/Set 002 Booster Pack">Shattered Destiny Launch</a>', title: 'SD Launch'},
		{
			x: Date.parse('2015-03-10'),
			text: '<a target="_blank" href="https://www.hextcg.com/hex-update-arena-opens-march-10th">Frostring Arena Launch</a>',
			title: 'Frostring Arena Launch'
		}, {
			x: Date.parse('2015-07-21'),
			text: '<a target="_blank" href="#/articles/Set 003 Booster Pack">Armies of Myth</a>',
			title: 'Set 3'
		}, {
			x: Date.parse('2016-01-29'),
			text: '<a target="_blank" href="https://www.hextcg.com/hex-update-entraths-alive">PvE Campaign Launch</a>',
			title: 'PvE Campaign Launch'
		}, {
			x: Date.parse('2016-04-26'),
			text: '<a target="_blank" href="https://www.hextcg.com/primal-dawn-is-now-live">Primal Dawn Launch</a>',
			title: 'Set 4'
		}, {
			x: Date.parse('2016-07-05'),
			text: '<a target="_blank" href="https://www.hextcg.com/ladder-patch-notes">Ladder Launch</a>',
			title: 'Ladder Launch'
		}, {
			x: Date.parse('2016-07-27'),
			text: '<a target="_blank" href="https://www.hextcg.com/deck-drilldown-blood-sapphire-control/">Deck Article - Blood Sapphire Control</a>',
			title: 'Deck Article'
		}, {
			x: Date.parse('2016-07-29'),
			text: '<a target="_blank" href="https://www.hextcg.com/set-and-gem-rotation/">Set & Gem Rotation Announcement</a>',
			title: 'Meta'
		}, {
			x: Date.parse('2016-08-02'),
			text: '<a target="_blank" href="https://www.hextcg.com/herofall-is-coming">Set 5 Herofall Announcement</a>',
			title: 'Set 5'
		}, {
			x: Date.parse('2016-08-12'),
			text: '<a target="_blank" href="https://www.hextcg.com/primordial-knowledge-making-banks/">Deck Article - Making Banks</a>',
			title: 'Deck Article'
		}, {
			x: Date.parse('2016-09-02'),
			text: '<a target="_blank" href="https://www.hextcg.com/season-2-is-here/">Ladder - Season 2</a>',
			title: 'Season 2'
		}, {
			x: Date.parse('2016-09-07'),
			text: '<a target="_blank" href="https://www.hextcg.com/herofall-is-now-live/">Herofall Launch</a>',
			title: 'Set 5'
		}, {
			x: Date.parse('2017-02-21'),
			text: '<a target="_blank" href="https://www.hextcg.com/de/hex-press-release-2017/">Publisher Change</a>',
			title: 'HXE Press Release'
		}, {
			x: Date.parse('2017-02-21'),
			text: '<a target="_blank" href="https://www.hextcg.com/de/cory-jones-open-letter/">Cory Jones Open Letter</a>',
			title: 'Cory Jones Open Letter'
		}, {
			x: Date.parse('2017-02-28'),
			text: '<a target="_blank" href="https://www.hextcg.com/de/scars-of-war-patch-notes/">Scars of War Launch</a>',
			title: 'Set 6'
		}, {
			x: Date.parse('2017-02-28'),
			text: '<a target="_blank" href="https://www.hextcg.com/de/2017-ladder-season-2/">2017 Ladder Season 2</a>',
			title: '2017 Ladder Season 2'
		}


	];

	var chartFlagSeries = {
		type: 'flags',
		name: 'Events',
		color: '#333333',
		shape: 'squarepin',
		y: 24,
		data: chartFlags,
		showInLegend: false
	};

	return chartFlagSeries;

}
