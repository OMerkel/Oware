Oware
=====

**Oware** (in _Akan_ language) - a traditional game from Ghana, Africa, is a _Mancala (Manquala)_ game.

The term _Mancala (also Manqala, Mankala)_ is derived from the Arabic term **naqalah** with its meaning **to move** an object. These class of games are well known worldwide. Nonetheless rules, structure of fields and even number of players varies from game to game.

Common aspect of these _Mancala_ games is that a set of mostly one single sort of game _tokens_ is _distributed_ by some ruleset following a _path_ from a field formed by _containers_ holding the _tokens_ on each player's turn.

_Distribution_ on a player's turn is called _sowing_. Thus these corresponding games are known as _Sowing Games_, too.

The _containers_ are often referred to being named _trou_ (in _French_), _pits_, _holes_, _depressions_, _houses_ or _bowls_.
Some games come with different types of such containers. Mostly an additional non standard type of container is just for holding tokens representing the current player's score being larger in size then. These larger size holes might be named _stores_ or simply _Mancalas_. If such stores do not exist then tokens might simply be removed from game play staying offboard for the rest of the game.

Typically the _tokens_ are represented by some game _pieces_ like _seeds_, _beads_, _beans_, _nuts_, _stones_, _cowry shells_, any sort of _counters_. Most Mancala games use undifferentiated _tokens_.

In case of a _fixed sowing path_ the bowls can be indentified or ordered by a simple _index numbering_. If specific bowls or better the tokens inside these bowls belong to a player depending on the current game board situation then you might find terminology like a player's _side_ or _ranks_ or _rows_ belonging to a player.

The rules realized in this software project currently follow these commonly known as Oware, Awari, Wari, Awélé, Awalé, Aualé, Ayò depending on the geographic origin and language spoken (Ghana, Yoruba, Nigeria, Côte d'Ivoire, Cabo Verde, plus other regions). Anyway the rules will be described inside the Oware application as well.

### Oware Rules

This Oware implementation uses a game board with 12 bowls in total - consisting of 2 rows having 6 bowls each. Initially each bowl holds 4 beads (Bonduc seeds).

Players' turn alternates between the two players. The player starts own sowing turns from a non empty bowl of his choice in the row next to his own side. Still he will sow beads on the other player's row, too. Sowing starts with exactly one bead per bowl following the consecutive bowls in counter clockwise direction. In case the sowing will reach the starting bowl of the turn again then this bowl is skipped each time. Such that this bowl will remain empty in the end of this player's turn.

A player will score (also called _harvesting_) on sowing the last bead of his turn into an opponent's bowl holding 2 or 3 beads including the last bead sown. This is done by taking these beads out of game play and scoring these. In case the previous adjacent directly following bowls (in clockwise direction) being opponent's bowls, too, and holding 2 or 3 beads these are taken away being scored as well. Reaching any other bowl without any bead, just one bead or four or more beads will end the scoring even if there are following opponent's bowls left containing 2 or 3 beads not being directly adjacent.

Taking and scoring all remaining beads of the opponent's row completely at once is strictly forbidden and the player will lose immediately. Even if the player gets the majority of total beads this way the player will lose immediately. Thus after scoring at least one bead must be left over on the opponent's row.

Assumed the opponent ends his turn removing the last bead on his row by himself: The opponent's move is totally valid and game continues. In such a case then a player is not allowed to end his turn without a remaining bead for the opponent's turn if avoidable. Such that the player is forced to prefer any move that gives at least one bead being sown in an opponent's bowl then. In case this is not possible the game ends and the player with the higher score wins.

By mutual agreement players can end the game, too. In that case each player scores the remaining beads on the own row. The player scoring higher wins.

Which means that the game could be a draw.

### Typical Oware Game Material

If you are looking forward to getting a typical **Oware game** (_Ghana_) then the chance is quite high that the board shall be made of dark nearly black **Sese (Esese, Osese) wood** carved manually. Such handcrafted Oware sets are available in simple travel editions made of two similar half boards that can be folded to hold the game tokens securely then. Often these boards come along with crafted and carved traditional themed patterns or motifs. Typical tokens could be _nickernuts_. These are tropical seeds of a shrub called **Bonduc** (Latin, botanical: _Caesalpinia bonduc_). Bonduc seeds are widely used for traditional African jewellery due to it's clay alike precious look and can be found as a medical ingredient as well. Such that there is a good chance of getting a spare set of Bonduc seeds if for some reason yours get incomplete.

The more puristic travel edition could be to simply form some pits on a sandy beach and use any type of tokens you prefer of course. This solution is surely quite traditional, too.

Surely some priceless unique or antique Oware sets up to the size of a whole table can be found. Watch out and find some of these gems using your preferred web search engine.

