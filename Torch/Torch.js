// Github:   https://github.com/shdwjk/Roll20API/blob/master/Torch/Torch.js
// By:       The Aaron, Arcane Scriptomancer
// Contact:  https://app.roll20.net/users/104025/the-aaron
// Updated By: FredVaugeois (https://github.com/FredVaugeois)

const Torch = (() => { // eslint-disable-line no-unused-vars

    const version = '0.8.14';
    const lastUpdate = 1565053382;
    const schemaVersion = 0.1;
	const flickerURL = 'https://s3.amazonaws.com/files.d20.io/images/4277467/iQYjFOsYC5JsuOPUCI9RGA/thumb.png?1401938659';
	const flickerPeriod = 400;
	const flickerDeltaLocation = 2;
	const flickerDeltaRadius = 0.1;

    const ch = (c) => {
        const entities = {
            '<' : 'lt',
            '>' : 'gt',
            "'" : '#39',
            '@' : '#64',
            '{' : '#123',
            '|' : '#124',
            '}' : '#125',
            '[' : '#91',
            ']' : '#93',
            '"' : 'quot',
            '*' : 'ast',
            '/' : 'sol',
            ' ' : 'nbsp'
        };

        if( entities.hasOwnProperty(c) ){
            return `&${entities[c]};`;
        }
        return '';
    };

	const showHelp = (who) => {
        sendChat('',
            '/w "'+who+'" '+
    '<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">'+
        '<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">'+
            'Torch v'+version+
        '</div>'+
        '<div style="padding-left:10px;margin-bottom:3px;">'+
            '<p>Torch provides commands for managing dynamic lighting.  Supplying a first argument of <b>help</b> to any of the commands displays this help message, as will calling !torch or !snuff with nothing supplied or selected.</p>'+
            '<p>Torch now supports <b><i>Jack Taylor</i></b> inspired flickering lights.  Flicker lights are only active on pages where a player is (GMs, drag yourself to other pages if you don'+ch("'")+'t want to move the party.) and are persisted in the state.  Flicker lights can be used in addition to regular lights as they are implemented on a separate invisible token that follows the nomal token.</p>'+
        '</div>'+
        '<b>Commands</b>'+
        '<div style="padding-left:10px;">'+
            '<b><span style="font-family: serif;">!torch '+ch('[')+ch('<')+'Radius'+ch('>')+' '+ch('[')+ch('<')+'Dim Start'+ch('>')+' '+ch('[')+ch('<')+'Token ID'+ch('>')+' ... '+ch(']')+ch(']')+ch(']')+'</span></b>'+
            '<div style="padding-left: 10px;padding-right:20px">'+
                '<p>Sets the light for the selected/supplied tokens.  Only GMs can supply token ids to adjust.</p>'+
                '<p><b>Note:</b> If you are using multiple '+ch('@')+ch('{')+'target'+ch('|')+'token_id'+ch('}')+' calls in a macro, and need to adjust light on fewer than the supplied number of arguments, simply select the same token several times.  The duplicates will be removed.</p>'+
                '<ul>'+
                    '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'+
                        '<b><span style="font-family: serif;">'+ch('<')+'Radius'+ch('>')+'</span></b> '+ch('-')+' The radius that the light extends to. (Default: 40)'+
                    '</li> '+
                    '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'+
                        '<b><span style="font-family: serif;">'+ch('<')+'Dim Start'+ch('>')+'</span></b> '+ch('-')+' The radius at which the light begins to dim. (Default: Half of Radius )'+
                    '</li> '+
                    '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'+
                        '<b><span style="font-family: serif;">'+ch('<')+'Token ID'+ch('>')+'</span></b> '+ch('-')+' A Token ID, usually supplied with something like '+ch('@')+ch('{')+'target'+ch('|')+'Target 1'+ch('|')+'token_id'+ch('}')+'.'+
                    '</li> '+
                '</ul>'+
            '</div>'+
            '<b><span style="font-family: serif;">!snuff '+ch('[')+ch('<')+'Token ID'+ch('>')+' ... '+ch(']')+'</span></b>'+
            '<div style="padding-left: 10px;padding-right:20px">'+
                '<p>Turns off light for the selected/supplied tokens. Only GMs can supply token ids to adjust.</p>'+
                '<p><b>Note:</b> If you are using multiple '+ch('@')+ch('{')+'target'+ch('|')+'token_id'+ch('}')+' calls in a macro, and need to adjust light on fewer than the supplied number of arguments, simply select the same token several times.  The duplicates will be removed.</p>'+
                '<ul>'+
                    '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'+
                        '<b><span style="font-family: serif;">'+ch('<')+'Token ID'+ch('>')+'</span></b> '+ch('-')+' A Token ID, usually supplied with something like '+ch('@')+ch('{')+'target'+ch('|')+'Target 1'+ch('|')+'token_id'+ch('}')+'.'+
                    '</li> '+
                '</ul>'+
            '</div>'+
            '<b><span style="font-family: serif;">!flicker-on '+ch('[')+ch('<')+'Radius'+ch('>')+' '+ch('[')+ch('<')+'Dim Start'+ch('>')+' '+ch('[')+ch('<')+'Token ID'+ch('>')+' ... '+ch(']')+ch(']')+ch(']')+'</span></b>'+
            '<div style="padding-left: 10px;padding-right:20px">'+
                '<p>Behaves identically to !torch, save that it creates a flickering light.</p>'+
            '</div>'+
            '<b><span style="font-family: serif;">!flicker-off '+ch('[')+ch('<')+'Token ID'+ch('>')+' ... '+ch(']')+'</span></b>'+
            '<div style="padding-left: 10px;padding-right:20px">'+
                '<p>Behaves identically to !snuff, save that it affects the flickering light.</p>'+
            '</div>'+
            '<b><span style="font-family: serif;">!daytime '+ch('[')+ch('<')+'Token ID'+ch('>')+ch(']')+'</span></b>'+
            '<div style="padding-left: 10px;padding-right:20px">'+
                '<p>Turns off dynamic lighting for the current player page, or the page of the selected/supplied token.</p>'+
                '<ul>'+
                    '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'+
                        '<b><span style="font-family: serif;">'+ch('<')+'Token ID'+ch('>')+'</span></b> '+ch('-')+' A Token ID, usually supplied with something like '+ch('@')+ch('{')+'target'+ch('|')+'Target 1'+ch('|')+'token_id'+ch('}')+'.'+
                    '</li> '+
                '</ul>'+
            '</div>'+
            '<b><span style="font-family: serif;">!nighttime '+ch('[')+ch('<')+'Token ID'+ch('>')+ch(']')+'</span></b>'+
            '<div style="padding-left: 10px;padding-right:20px">'+
                '<p>Turns on dynamic lighting for the current player page, or the page of the selected/supplied token.</p>'+
                '<ul>'+
                    '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'+
                        '<b><span style="font-family: serif;">'+ch('<')+'Token ID'+ch('>')+'</span></b> '+ch('-')+' A Token ID, usually supplied with something like '+ch('@')+ch('{')+'target'+ch('|')+'Target 1'+ch('|')+'token_id'+ch('}')+'.'+
                    '</li> '+
                '</ul>'+
            '</div>'+
            '<b><span style="font-family: serif;">!global-light '+ch('[')+ch('<')+'Token ID'+ch('>')+ch(']')+'</span></b>'+
            '<div style="padding-left: 10px;padding-right:20px">'+
                '<p>Toggles Global Illumination for the current player page, or the page of the selected/supplied token.</p>'+
                '<ul>'+
                    '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'+
                        '<b><span style="font-family: serif;">'+ch('<')+'Token ID'+ch('>')+'</span></b> '+ch('-')+' A Token ID, usually supplied with something like '+ch('@')+ch('{')+'target'+ch('|')+'Target 1'+ch('|')+'token_id'+ch('}')+'.'+
                    '</li> '+
                '</ul>'+
            '</div>'+
        '</div>'+
    '</div>'
            );
    };
	const setFlicker = (o,r,d) => {
		let found = _.findWhere(state.Torch.flickers, {parent: o.id});
		let fobj;

		if( found ) {
			fobj = getObj('graphic',found.id);
			if(fobj) {
				fobj.set({
                    layer: 'walls',
					showname: false,
					aura1_radius: '',
					showplayers_aura1: false,
					light_radius: r,
					light_dimradius: d,
				});
			} else {
				delete state.Torch.flickers[found.id];
			}
		} 
		
		if(!fobj) {
			// new flicker
			fobj =createObj('graphic',{
				imgsrc: flickerURL,
				subtype: 'token',
				name: 'Flicker',
				pageid: o.get('pageid'),
				width: 70,
				height: 70,
				top: o.get('top'),
				left: o.get('left'),
				layer: 'walls',
				light_radius: r,
				light_dimradius: d,

			});
		}
		toBack(fobj);
		state.Torch.flickers[fobj.id]={
			id: fobj.id,
			parent: o.id,
			active: true,
			page: o.get('pageid'),
			light_radius: r,
			light_dimradius: d,

		};
	};

	const clearFlicker = (fid) => {
		const f = getObj('graphic',fid);
        if(f) {
            f.remove();
        }
		delete state.Torch.flickers[fid];
	};
	
	const handleInput = (msg) => {
		let radius, dim_radius, page, objs=[];

		if (msg.type !== "api") {
			return;
		}
		let whoChar = (getObj('player', msg.playerid));
        let who = whoChar.get('_displayname');

		let args = msg.content.split(" ");
		switch(args[0]) {
			case '!torch':
				if((args[1]||'').match(/^(--)?help$/) || ( !_.has(msg,'selected') && args.length < 5)) {
					showHelp(who);
					return;
				}
                radius = parseInt(args[2]) || 30;
                dim_radius = ( (undefined === args[3] || '-' === args[3]) ? (radius*2) : parseInt(args[3]) );
                sendChat('', '/w "' + who + '" Activating player\'s light.');

                objs = _.chain(args)
                    .rest(4)
                    .uniq()
                    .map(function(t){
                        return getObj('graphic',t);
                    })
                    .filter(()=>playerIsGM(msg.playerid))
                    .reject(_.isUndefined)
                    .value();

                _.each(_.union(objs,_.map(msg.selected,function (o) {
                    return getObj(o._type,o._id);
                })), function(o){
                    o.set({
                        emits_bright_light: true,
                        bright_light_distance: radius,
                        emits_low_light: true,
                        low_light_distance: dim_radius,
                    });
				});
				break;

            case '!snuff':
				if((args[1]||'').match(/^(--)?help$/) || ( !_.has(msg,'selected') && args.length < 2)) {
					showHelp(who);
					return;
				}
                sendChat('', '/w "' + who + '" Snuffing player\'s light.');
				if(playerIsGM(msg.playerid)) {
					_.chain(args)
						.rest(1)
						.uniq()
						.map(function(t){
							return getObj('graphic',t);
						})
						.reject(_.isUndefined)
						.each(function(t) {
							t.set({
                                emits_bright_light: false,
                                emits_low_light: false,
							});
						});
				}
				_.each(msg.selected,function (o) {
                    getObj(o._type,o._id).set({
                        emits_bright_light: false,
                        emits_low_light: false,
                    });
                });
                break;

			case '!daytime':
				if((args[1]||'').match(/^(--)?help$/) ) {
					showHelp(who);
					return;
				}
				if(playerIsGM(msg.playerid)) {
                    page = getObj('page', whoChar.get('lastpage'));

					if(page) {
						page.set({
							showlighting: false
						});
						sendChat('','/w gm It is now <b>Daytime</b> on '+page.get('name')+'!');
					}
				}
				break;

			case '!nighttime':
				if((args[1]||'').match(/^(--)?help$/) ) {
					showHelp(who);
					return;
				}
				if(playerIsGM(msg.playerid)) {
                    page = getObj('page', whoChar.get('lastpage'));

					if(page) {
						page.set({
							showlighting: true
						});
						sendChat('','/w gm It is now <b>Nighttime</b> on '+page.get('name')+'!');
					}
				}
				break;

			case '!global-light':
				if((args[1]||'').match(/^(--)?help$/) ) {
					showHelp(who);
					return;
				}
				if(playerIsGM(msg.playerid)) {
                    page = getObj('page', whoChar.get('lastpage'));

					if(page) {
						page.set({
							lightglobalillum: !(page.get('lightglobalillum'))
						});
						sendChat('','/w gm Global Illumination is now '+(page.get('lightglobalillum')?'<span style="font-weight:bold;color:#090;">ON</span>':'<span style="font-weight:bold;color:#900;">OFF</span>' )+' on page <b>'+page.get('name')+'</b>!');
					}
				}
				break;

			case '!flicker-on':
				if((args[1]||'').match(/^(--)?help$/) || ( !_.has(msg,'selected') && args.length < 5)) {
					showHelp(who);
					return;
				}
                radius = parseInt(args[1],10) || 40;
                dim_radius = ( (undefined === args[2] || '-' === args[2]) ? (radius*2) : parseInt(args[2],10) );

                objs=_.chain(args)
                    .rest(4)
                    .uniq()
                    .filter(()=>playerIsGM(msg.playerid))
                    .map(function(t){
                        return getObj('graphic',t);
                    })
                    .reject(_.isUndefined)
                    .value();

                _.each(_.union(objs,_.map(msg.selected,function (o) {
                    return getObj(o._type,o._id);
                })), function(o){
					setFlicker(o, radius, dim_radius);
				});

				break;

			case '!flicker-off':
				if((args[1]||'').match(/^(--)?help$/) || ( !_.has(msg,'selected') && args.length < 2)) {
					showHelp(who);
					return;
				}
                
				if(playerIsGM(msg.playerid)) {
					objs=_.chain(args)
						.rest(1)
						.uniq()
						.value();
				}
                objs=_.union(objs,_.pluck(msg.selected,'_id'));
				_.each(state.Torch.flickers, function(f) {
					if( _.contains(objs, f.parent)) {
						clearFlicker(f.id);
					}
				});
				break;

		}
	};

    const getActivePages = () => [...new Set([
        Campaign().get('playerpageid'),
        ...Object.values(Campaign().get('playerspecificpages')),
        ...findObjs({
                type: 'player',
                online: true
            })
            .filter((p)=>playerIsGM(p.id))
            .map((p)=>p.get('lastpage'))
        ])
    ];

	const animateFlicker = () => {
		let pages = getActivePages();

		_.chain(state.Torch.flickers)
			.where({active:true})
			.filter(function(o){
				return _.contains(pages,o.page);
			})
			.each(function(fdata){
				let o = getObj('graphic',fdata.parent),
					f = getObj('graphic',fdata.id),
					dx, dy, dr, da;

				if(!o) {
					clearFlicker(fdata.id);
				} else {
					if(!f) {
						delete state.Torch.flickers[fdata.id];
					} else {
						dx = randomInteger(2 * flickerDeltaLocation)-flickerDeltaLocation;
						dy = randomInteger(2 * flickerDeltaLocation)-flickerDeltaLocation;
						dr = randomInteger(2 * (fdata.light_radius*flickerDeltaRadius)) - (fdata.light_radius*flickerDeltaRadius);
						f.set({
							top: o.get('top')+dy,
							left: o.get('left')+dx,
							light_radius: fdata.light_radius+dr,
                            rotation: o.get('rotation')
						});
					}
				}
			});
	};

	const handleTokenDelete = (obj) => {
		let found = _.findWhere(state.Torch.flickers, {parent: obj.id});

		if(found) {
			clearFlicker(found.id);
		} else {
			found = _.findWhere(state.Torch.flickers, {id: obj.id});
			if(found) {
				delete state.Torch.flickers[obj.id];
			}
		}
	};

	const checkInstall = () => {
        log('-=> Torch v'+version+' <=-  ['+(new Date(lastUpdate*1000))+']');

        if( ! _.has(state,'Torch') || state.Torch.version !== schemaVersion) {
            log('  > Updating Schema to v'+schemaVersion+' <');
            /* Default Settings stored in the state. */
            state.Torch = {
				version: schemaVersion,
				flickers: {}
			};
		}

		setInterval(animateFlicker,flickerPeriod);
	};

	const registerEventHandlers = () => {
		on('chat:message', handleInput);
		on('destroy:graphic', handleTokenDelete);
	};

    on("ready",() => {
        checkInstall();
        registerEventHandlers();
    });

	return { };
})();
