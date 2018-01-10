Notification.requestPermission(function () {
    alert('ok!');

    function formatMinutes(minutes) {
        if (minutes < 10) {
            return '0' + minutes;
        }
        return minutes;
    }

    function getPokemonNameFromId(pokemonId) {
        if (typeof window.getPokemonName === 'function') {
            return window.getPokemonName({
                id: pokemonId
            });
        }
        return pokemonId;
    }

    function processSpawn(pokemon) {
        var pokemonKey = pokemon.pokemon_id + pokemon.attack + pokemon.defence + pokemon.stamina + pokemon.despawn;
        if (!notificationTracker[pokemonKey] && (+pokemon.attack) + (+pokemon.defence) + (+pokemon.stamina) > 42) {
            console.log('Pokemon', pokemon);
            var name = getPokemonNameFromId(pokemon.pokemon_id);
            var despawnMillis = parseInt(pokemon.despawn + '000', 10);
            var despawn = new Date(despawnMillis);
            var notification = new Notification(name + ((+pokemon.attack) + (+pokemon.defence) + (+pokemon.stamina) === 45 ? ' 100%' : '') + ' - L' + pokemon.level + ' - ' + pokemon.attack + '/' + pokemon.defence + '/' + pokemon.stamina, {
                icon: 'https://cdn.skeptical.cf/pokehunter/images/pokemon/theartificial/' + pokemon.pokemon_id + '.png',
                body: 'Despawn at ' + despawn.getHours() + ':' + formatMinutes(despawn.getMinutes()),
                tag: pokemonKey,
                requireInteraction: true
            });
            var pid = setTimeout(function () {
                notification.close();
                closeNotification();
                delete notificationTracker[pokemonKey];
            }, despawnMillis + 15000 - (+new Date()));
            var closeNotification = function () {
                clearTimeout(pid);
                pid = null;
            };

            notification.onclick = function () {
                window.open('https://www.google.com/maps?q=' + pokemon.lat + ',' + pokemon.lng);
            };
            notification.onclose = closeNotification;

            notificationTracker[pokemonKey] = notification;
        }
    }

    var raidWatch = {
        '42.355472,-71.066417': 'Soldiers and Sailors Monument', /* verified */
        '42.35605,-71.064867': 'Tadpole Playground Archway and Frog Statue', /* verified */
        '42.356045,-71.061453': 'DTX Sprint Store',
        '42.354665,-71.069458': 'Children Frolicking Fountain in Boston Public Garden', /* verified */
        '42.353813,-71.071089': 'George Washington Statue', /* verified */
        '42.352584,-71.068654': 'Thomas Cass Statue', /* verified */
        '42.343297,-71.122486': 'Coolidge Corner Sprint Store', /* verified */
        '42.351199,-71.07275': 'Back Bay Sprint Store', /* verified */
        '42.342014,-71.08618': 'Symphony Starbucks', /* verified */
        '42.35722,-71.073752': 'Hatch Shell', /* verified */
        '42.356132,-71.07489': 'Esplanade Playplace', /* verified */
        '42.374493,-71.12017': 'Harvard Square Starbucks', /* verified */
        '42.388381,-71.118494': 'Porter Square Sprint Store', /* verified */
        '42.364216,-71.15699': 'Arsenal Mall Starbucks', /* verified */
    };

    function processRaid(raid) {
        var gymKey = raid.lat + ',' + raid.lng;
        if (raidWatch[gymKey] && !notificationTracker[gymKey]) {
            var startMillis = parseInt(raid.raid_start + '000', 10);
            var start = new Date(startMillis);
            var endMillis = parseInt(raid.raid_end + '000', 10);
            var end = new Date(endMillis);
            var nowMillis = +new Date();
            var notificationIcon = null;
            var notificationBody;
            var overMillis;

            if (raid.pokemon_id === '0' && startMillis >= nowMillis) {
                overMillis = startMillis;
                notificationIcon = 'http://www.pngall.com/wp-content/uploads/2016/04/' + raid.level + '-Number-PNG-180x180.png';
                notificationBody = 'Start at ' + start.getHours() + ':' + formatMinutes(start.getMinutes());
            } else if (raid.pokemon_id !== '0' && endMillis >= nowMillis) {
                overMillis = endMillis;
                notificationIcon = 'https://cdn.skeptical.cf/pokehunter/images/pokemon/theartificial/' + raid.pokemon_id + '.png';
                notificationBody = getPokemonNameFromId(raid.pokemon_id) + ' (' + raid.level + ') ends at ' + end.getHours() + ':' + formatMinutes(end.getMinutes());
            } else {
                return;
            }

            console.log('Raid', raid);

            var notification = new Notification(raidWatch[gymKey], {
                icon: notificationIcon,
                body: notificationBody,
                tag: gymKey,
                requireInteraction: true
            });
            var pid = setTimeout(function () {
                notification.close();
                closeNotification();
                delete notificationTracker[gymKey];
            }, overMillis - (+new Date()));
            var closeNotification = function () {
                clearTimeout(pid);
                pid = null;
            };

            notification.onclick = function () {
                window.open('https://www.google.com/maps?q=' + raid.lat + ',' + raid.lng);
            };
            notification.onclose = closeNotification;

            notificationTracker[gymKey] = notification;
        }
    }

    var notificationTracker = {};
    $(document).ajaxSuccess(function (e, rawData, request) {
        var response = rawData.responseJSON;
        console.log('Processing...', response);
        if (response.pokemons) {
            response.pokemons.forEach(processSpawn);
        } else if (response.raids) {
            response.raids.forEach(processRaid);
        }
        console.log('Complete.');
    });

    if (typeof window.reloadPokemons === 'function') {
        window.inserted = 0; /* used to fetch all the current mons */
        window.reloadPokemons();
    }
});
