#!/usr/bin/env node
const { addonBuilder, serveHTTP } = require('../src');
const puppeteer = require('puppeteer');
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const builder = new addonBuilder({
	id: 'org.vidsrc.addon',
	version: '1.0.0',
	name: 'Vidsrc',
	catalogs: [],
	resources: ['stream'],
	types: ['movie','series'],
	idPrefixes: [ "tt" ]
})

// takes function(type, id, cb)
builder.defineStreamHandler(async function(args) {
	if (args.type === 'movie') {

		// const response = await fetch(`https://vidsrc.to/embed/movie/${args.id}`);
		// const data = await response.text();
		// console.log(data);

		(async () => {
			const browser = await puppeteer.launch();
			const pages = await browser.pages();
		  
			await pages[0].goto(`https://vidsrc.to/embed/movie/${args.id}`);
		  
			// example: get innerHTML of an element
			// const someContent = await page.$eval('#selector', el => el.innerHTML);
		  
			// Use Promise.all to wait for two actions (navigation and click)
			// await Promise.all([
			//   page.waitForNavigation(), // wait for navigation to happen
			//   page.click('a.some-link'), // click link to cause navigation
			// ]);
		  
			// another example, this time using the evaluate function to return innerText of body
			// const moreContent = await page.evaluate(() => document.body.innerText);
		  
			// click another button
			// await pages[0].click('#btn-play');
			// await pages[0].waitForSelector('loading', {hidden: true});
			// await pages[0].waitForNavigation();

			// another example, this time using the evaluate function to return innerText of body
			// const moreHTML = await pages[0].evaluate(() => document.body.innerHTML);
			// console.log(moreHTML);
			// await pages[0].screenshot({"path": "sc.png", "type": "png"});

			// setTimeout(async () => {
			// 	let src = await pages[0].$eval("player", n => n.getAttribute("src"))
			// 	console.log(src);
			// 	await browser.close();
			//   }, 1000)
		  
			// close brower when we are done
			await browser.close();
		  })();

		const stream = { 
			externalUrl: `https://vidsrc.to/embed/movie/${args.id}`,
			androidTvUrl: `intent://vidsrc.to/embed/movie/${args.id}#Intent;launchFlags=0x00800000;scheme=https;end`,
			behaviorHints: {
				notWebReady: true
			}
	 }
		return Promise.resolve({ streams: [stream] })
	} else if (args.type === 'series'){
		const arguments = args.id.split(":");
		const imdbId = arguments[0];
		const season = arguments[1];
		const episode = arguments[2];
		const stream = { 
			externalUrl: `https://vidsrc.to/embed/tv/${imdbId}/${season}/${episode}`,
			androidTvUrl: `intent://vidsrc.to/embed/tv/${imdbId}/${season}/${episode}#Intent;launchFlags=0x00800000;scheme=https;end`,
			behaviorHints: {
				notWebReady: true
			} 
		}
		return Promise.resolve({ streams: [stream] })
	} else {
		// otherwise return no streams
		return Promise.resolve({ streams: [] })
	}
})

serveHTTP(builder.getInterface(), { port: process.env.PORT || 43001 })
