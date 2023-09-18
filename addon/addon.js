#!/usr/bin/env node
const { addonBuilder, serveHTTP } = require('../src')

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
builder.defineStreamHandler(function(args) {
	if (args.type === 'movie') {
		const stream = { 
			externalUrl: `https://vidsrc.to/embed/movie/${args.id}`,
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
