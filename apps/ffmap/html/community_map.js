var FFCommunityMapWidget = function( options, map_options, link )
{

	function getPopupHTML( props )
	{
		var iconBaseUrl = "http://weimarnetz.de/ffmap/icons/";

		// ---

		function createInfoLine( test, text )
		{
			return test ? text + '</br>' : '';
		}

		function createIconLink( test, url, icon, text )
		{
			text = text ? text : '';

			return ! test ? '' : '<a href="' + url + '"><img src="' + iconBaseUrl + icon + '" width="30px" style="margin-right: 15px;"/>' + text + '</a>';
		}

		function addIfMissingHttp( url, addThis )
		{
			addThis = addThis ? addThis : 'http://';

            return ! url ? null : ( url.match( /^http([s]?):\/\/.*/ ) ? "" : addThis ) + url;
		}

		// ---

		var html = '';
		//        console.log(props)
		if ( props.name )
		{
			if ( props.url )
			{
				html += '<b><a href="' + addIfMissingHttp( props.url ) + '" target="_window">'+ props.name + '</a></b><br/>';
			}
		}

		html += createInfoLine( props.metacommunity, props.metacommunity );
		html += createInfoLine( props.city, props.city );
		html += createInfoLine( props.nodes, '<br/>Zug&auml;nge: ' + props.nodes );
		// html += createIconLink( props.phone, props.phone, 'icon_telefon.png', props.phone );
		html += createInfoLine( props.phone, '<br/>&#9990; ' + props.phone );

		html += '<br/>';

		html += createIconLink( props.email, 'mailto:' + props.email, 'icon_email.png' );
		html += createIconLink( props.facebook, props.facebook, 'icon_facebook.png' );
		html += createIconLink( props.twitter, addIfMissingHttp( props.twitter, 'https://twitter.com/' ), 'icon_twitter.png' );
		html += createIconLink( props.irc, 'irc:' + props.irc, 'icon_irc.png' );
		html += createIconLink( props.jabber, 'xmpp:' + props.jabber, 'icon_jabber.png' );
		html += createIconLink( props.identica, 'identica:' + props.identicy, 'icon_identica.png' );
		html += createIconLink( props.googleplus, props.googleplus, 'icon_googleplus.png' );

		return html;
	}


	var defaultOptions =
		{
			divId: 'map',
			geoJSONUrl: 'http://weimarnetz.de/ffmap/ffMap.json',
			getPopupHTML: getPopupHTML,
			fitBounds: [[46.5, 4.0], [55.5, 15.9]],
			zoom: 5,
			center: [51.5, 10.5],
			tileUrl: 'https://ssl_tiles.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
			tileOptions: {
				key: '3249f584dd674d399238a99850abcbae',
				styleId: 102828,
				zoom: 1,
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>'
			}
		};

	var options = L.extend( defaultOptions, options );

	// ---

	var widget = {};
	widget.map = L.map(options['divId'], map_options);
	widget.tiles = L.tileLayer(options['tileUrl'], options['tileOptions']).addTo(widget.map);
	//widget.map.fitBounds(options['fitBounds']);
	widget.map.setView(options['center'],options['zoom']);

	var clusters = L.markerClusterGroup( { spiderfyOnMaxZoom: false, showCoverageOnHover: false, maxClusterRadius: 40 } );
	widget.map.addLayer(clusters);

	$.getJSON( options['geoJSONUrl'],
		function( geojson )
		{
			var geoJsonLayer = L.geoJson(
				geojson,
				{
					onEachFeature: function( feature, layer )
						{
							layer.bindPopup(options['getPopupHTML'](feature.properties), { minWidth: 210 });
						},
					pointToLayer: function( feature, latlng )
						{
							var marker = L.circleMarker( latlng,
								{
									//title: feature.properties.name,
									//riseOnHover: true
									stroke: true,
									weight: 10,
									opacity: 0.3,
									color: '#009ee0',
									fill: true,
									fillColor: '#009ee0',
									fillOpacity: 0.7
								}
							);

							return marker;
						}
				}
			).addTo( clusters );

			console.log(geoJsonLayer);
		}
	);

	return widget;
}
