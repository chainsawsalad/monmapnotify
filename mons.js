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

            console.log('Pokemon `%s` despawns in %s minutes', pokemonKey, (despawnMillis - (+new Date())) / 1000 / 60, pokemon);

            var notification = new Notification(name + ((+pokemon.attack) + (+pokemon.defence) + (+pokemon.stamina) === 45 ? ' 100%' : '') + ' - L' + pokemon.level + ' - ' + pokemon.attack + '/' + pokemon.defence + '/' + pokemon.stamina, {
                icon: 'https://cdn.skeptical.cf/pokehunter/images/pokemon/theartificial/' + pokemon.pokemon_id + '.png',
                body: 'Despawn at ' + despawn.getHours() + ':' + formatMinutes(despawn.getMinutes()),
                tag: pokemonKey,
                requireInteraction: true
            });
            var pid = setTimeout(function () {
                console.log('Cleaning up notification: `' + pokemonKey + '`');
                delete notificationTracker[pokemonKey];
                notification.close();
            }, despawnMillis + 15000 - (+new Date()));
            var closeNotification = function () {
                console.log('Dismissing pokemon `%s`', pokemonKey);
                /* clearTimeout(pid); */
                /* pid = null; */
                /* delete notificationTracker[pokemonKey]; */
            };

            notification.onclick = function (event) {
                console.log('Clicking pokemon `%s`', pokemonKey);
                event.preventDefault();
                window.open('https://www.google.com/maps?q=' + pokemon.lat + ',' + pokemon.lng);
            };
            notification.onclose = closeNotification;

            notificationTracker[pokemonKey] = notification;
        }
    }

    var gymWatch = {
        '42.355472,-71.066417': 'Soldiers and Sailors Monument', /* verified */
        '42.35605,-71.064867': 'Tadpole Playground Archway and Frog Statue', /* verified */
        '42.356045,-71.061453': 'DTX Sprint Store', /* verified */
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
        '42.353557,-71.054499': 'Os Gemeos Mural',
        '42.352364,-71.057433': 'John F Fitzgerald Expressway Plaque', /* verified */
        '42.354716,-71.047467': 'Ship Silhouettes', /* verified */
    };

    function processRaid(raid) {
        var pokemonId = raid.pokemon_id;
        var startMillis = parseInt(raid.raid_start + '000', 10);
        var gymKey = raid.lat + ',' + raid.lng;
        var raidKey = gymKey + ':' + startMillis + ':' + pokemonId;

        if (gymWatch[gymKey] && !notificationTracker[raidKey]) {
            var start = new Date(startMillis);
            var endMillis = parseInt(raid.raid_end + '000', 10);
            var end = new Date(endMillis);
            var nowMillis = +new Date();
            var notificationIcon = null;
            var notificationBody;
            var overMillis;

            if (pokemonId === '0' && startMillis >= nowMillis) {
                console.log('Raid spawned %s', raidKey);
                overMillis = startMillis;
                notificationIcon = 'http://www.pngall.com/wp-content/uploads/2016/04/' + raid.level + '-Number-PNG-180x180.png';
                notificationBody = 'Start at ' + start.getHours() + ':' + formatMinutes(start.getMinutes());
            } else if (pokemonId !== '0' && endMillis >= nowMillis) {
                console.log('Raid started %s', raidKey);
                overMillis = endMillis;
                notificationIcon = 'https://cdn.skeptical.cf/pokehunter/images/pokemon/theartificial/' + pokemonId + '.png';
                notificationBody = getPokemonNameFromId(pokemonId) + ' (' + raid.level + ') ends at ' + end.getHours() + ':' + formatMinutes(end.getMinutes());
            } else {
                return;
            }

            console.log('Raid `%s` ends in %s minutes', raidKey, (overMillis - nowMillis) / 1000 / 60, raid);

            var notification = new Notification(gymWatch[gymKey], {
                icon: notificationIcon,
                body: notificationBody,
                tag: raidKey,
                requireInteraction: true
            });
            var pid = setTimeout(function () {
                console.log('Cleaning up notification: `' + raidKey + '`');
                delete notificationTracker[raidKey];
                notification.close();
            }, overMillis - nowMillis);
            var closeNotification = function () {
                console.log('Dismissing raid `%s`', raidKey);
                /* clearTimeout(pid); */
                /* pid = null; */
                /* delete notificationTracker[raidKey]; */
            };

            notification.onclick = function (event) {
                console.log('Clicking raid `%s`', raidKey);
                event.preventDefault();
                window.open('https://www.google.com/maps?q=' + raid.lat + ',' + raid.lng);
            };
            notification.onclose = closeNotification;

            notificationTracker[raidKey] = notification;
        }
    }

    window.notificationTracker = {};
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
