Oware
=====

* _Start an online_ __Oware__ _session on_ http://omerkel.github.io/Oware/html5/src/
* _runs in various browsers on_
    * _desktop systems like BSDs, Linux, Win, MacOS and_
    * _mobile platforms like Android, FirefoxOS, iOS._

__Keywords, Categories__ _Board Games, Games/Entertainment, Mobile, Abstract Game, Perfect-Information, 2-player Strategy Game_

This is the two player abstract perfect-information strategy board game Oware for HTML5/Javascript/CSS platform.

**Oware** (in _Akan_ language) - a traditional game from Ghana, Africa,
is a _Mancala (Manquala)_ game.

| <img height="370" ondragstart="return false;" alt="Playing Oware on Android tablet, own work, Oliver Merkel, Creative Commons License, This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License." src="http://omerkel.github.io/Oware/res/oware_android_tablet.jpg" /> |
| --- |
| <i>Playing Oware on Android tablet<br />Own work, Oliver Merkel,<br /><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.</i> |

There is a wide ranged class of games called _Mancala (Manquala)_ games.
Often the term _Sowing Games_ is used, too.

The term _Mancala (also Manqala, Mankala)_ is derived from the Arabic
term **naqalah** with its meaning **to move** an object. These class of
games are well known worldwide. Nonetheless rules, structure of fields
on board and even number of players strongly varies from game to game
depending on geographic location, language and culture. Such that
eventually the same game plus rules set could be found under a
different name, too. Still the origin seem to be quite clear for
specific types at least.

As a common aspect of these _Mancala_ games the basic rules set
on each player's turn is quite equal. A turn usually is performed by
picking up the whole amount of _tokens_ available on a chosen
_container_ on board first. Then this picked up set of mostly
one single sort of game _tokens_ is _distributed_ following a
_path_ on board formed by such _containers_ holding the _tokens_.

_Distribution_ on a player's turn is called _sowing_. Thus
these corresponding games are known as _Sowing Games_, too.

The _containers_ are often being named _fields_,
_trou_ (in _French_), _pits_, _holes_, _depressions_,
_houses_ or _bowls_. Some games come with different types
of such containers. Mostly an additional non standard type
of container is just used for holding tokens representing the
current player's score. The score is reflected by the amount
of tokens contained. These larger size bowls might be named
_stores_ or simply _Mancalas_. If such stores do not exist
then tokens might simply be scored by removal from game play
staying offboard for the rest of the game.

Typically the _tokens_ are represented by some game _pieces_
like _seeds_, _beads_, _beans_, _nuts_, _stones_, _cowry shells_, or
any sort of _counters_. Most Mancala games use undifferentiated _tokens_.

In case of a _fixed sowing path_ the bowls can be indentified or
ordered by a simple _index numbering_. You might find terminology like
a player's _side_ or _ranks_ or _rows_ belonging to a player. In that case
the player is allowed to start his turns by picking up all _tokens_ from
any non empty bowl being controlled by himself.

The rules currently realized in this software project are commonly
known as Oware, Awari, Wari, Awélé, Awalé, Aualé, Ayò depending
on the geographic origin, culture and language spoken (Ghana and
Côte d'Ivoire (Akan / Yoruba), Nigeria, Cabo Verde, plus other regions).
These rules will be described inside the Oware application as well.

### Oware Rules

#### Game Components

This Oware implementation uses a game board with 12 bowls in
total - consisting of 2 rows having 6 bowls each. Initially
each bowl holds 4 Bonduc seeds.

| <img height="370" ondragstart="return false;" alt="Initial board position in Oware, own work, Oliver Merkel, Creative Commons License, This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License." src="http://omerkel.github.io/Oware/res/board_initial.jpg" /> |
| --- |
| <i>Initial board position in Oware, 12 bowls containing 4 Caesalpinia Bonduc seeds each, one player starts turns in lower row ranged from bowl 1 to bowl 6, other player starts turns in upper row ranged from bowl 7 to 12.<br />Own work, Oliver Merkel,<br /><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.</i> |

#### Objective

Objective of the game is to get a higher score than the opponent.
This is done by harvesting more seeds than the opponent.
The harvested seeds represent the score.

#### Turn Sequence

Players' turn alternates between the two players. A player's turn
consists of the following phases

1. Picking Up Seeds, then
2. Sowing, followed by
3. Harvesting.

#### Picking Up Seeds

The player starts own sowing turns from any non empty bowl of
his choice in the row next to his own side. The whole content
of the bowl is picked up leaving the bowl empty.

#### Sowing

Direction of game play is counter clockwise here in a circular
sowing path. If reaching bowl 12 then continue on bowl 1 if
necessary. The sowing starts adjacent towards the selected bowl
in counter clockwise direction now. Although the seeds were
picked up from an own bowl sowing is performed on all bowls.
Such that the other player's row is included, too, interacting
with the opponent's side of the board.

Sowing is performed with exactly one seed per bowl following
the consecutive bowls in counter clockwise direction.
In case the sowing will reach the chosen starting bowl of
the turn again then this bowl is skipped each time. Such that
this bowl will remain empty in the end of this player's turn.

#### Harvesting

A player will score (also called _harvesting_) on sowing the last
seed of his turn into an opponent's bowl holding 2 or 3 seeds
including the last one sown. This is done by taking these seeds
out of game play and scoring these. In case of previous direct
adjacent bowls (in clockwise direction) being opponent's bowls, too,
holding 2 or 3 seeds, these are taken away being scored as well.
Reaching any other bowl without any seed, just one seed or four
or more seeds will end the scoring even if any further
opponent's bowls are containing 2 or 3 seeds not being
directly adjacent.

Taking and scoring all remaining seeds of the opponent's row
completely at once is strictly forbidden and the player will
lose immediately. Even if the player gets the majority of total
seeds this way the player will lose immediately. Thus after
scoring at least one seed must be left over on the opponent's row.

Assumed the opponent ends his turn removing the last seed on his row
by himself: The opponent's move is totally valid and game continues.
In such a case then a player is not allowed to end his turn without a
remaining seed for the opponent's turn if avoidable. Such that the
player is forced to prefer any move that gives at least one seed
being sown in an opponent's bowl then. In case this is not possible
the game ends, the remaining seeds on board will not be scored and
the player with the higher score wins.

By mutual agreement players can end the game, too, at any time.
In that case each player scores the remaining seeds on the own row.
The player scoring higher wins.

Such that the game could end as a draw on equal scores.

### Typical Oware Game Material

If you are looking forward to getting a typical **Oware game** (_Ghana_)
then the chance is quite high that the board shall be made of
**Sese (Esese, Osese) wood** carved manually. Such handcrafted Oware sets
are available in simple travel editions made of two similar half boards
that can be folded to hold the game tokens securely then. Often these
boards come along with decorative crafted and carved traditional themed
patterns or Akan cultural motifs. These could typically include Adinkra
symbols like the popular Gye Nyame or Nyame Ye Ohene with religious
character, too.

| <img width="640" ondragstart="return false;" alt="Folded Oware set with traditional ancient African pattern, Own image, Oliver Merkel, Creative Commons License, This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License." src="http://omerkel.github.io/Oware/html5/src/img/folded_oware_set.jpg" /> |
| --- |
| <i>Folded Oware set with traditional ancient African pattern<br />Own image, Oliver Merkel,<br /><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.</i> |

Typical tokens could be _nickernuts_. These are tropical
seeds of a shrub called **Bonduc** (Latin, botanical: _Caesalpinia bonduc_).
Bonduc seeds are widely used for traditional African jewellery due to it's
clay alike precious look and can be found as a medical ingredient as well.
Such that there is a good chance of getting a spare set of Bonduc seeds
if for some reason yours get incomplete.

The more puristic travel edition could simply be formed by some pits on a
sandy beach using any type of tokens you prefer of course. This solution
is quite traditional, too.

Surely some priceless unique or antique Oware sets can be found up to the
size of a whole table. Watch out and find some of these gems using
your preferred web search engine.

### Oware and its Origin

Today's name of the game as presented here with given rules is <i>Oware</i>.
Oware is an <i>Akan</i> culture term. Commonly reported Oware is
related to <i>Opoku Ware I.</i> (* 1700; &dagger; 1750), a former monarch
of the <i>Ashanti</i>(<i>Asantehene</i>).

In <i>Akan</i> language <i>ware</i> means <i>to be married</i>. Various
sources exist telling legends about couples playing the game Oware
endlessly - finally marrying to continue playing.
