Oware / Ouril
=============

* <em>Start an online</em> <b>Oware</b> <em>or</em> <b>Ouril</b> <em>session on</em> http://omerkel.github.io/Oware/html5/src/
* <em>runs in various browsers on</em>
    * <em>desktop systems like BSDs, Linux, Win, MacOS and</em>
    * <em>mobile platforms like Android, FirefoxOS, iOS.</em>

<b>Keywords, Categories</b> <em>Board Games, Games/Entertainment, Mobile, Abstract Game, Perfect-Information, 2-player Strategy Game, Mancala, Oware, Ouril</em>

This is an implementation of the two-player abstract perfect-information
strategy board games Oware and Ouril for HTML5/Javascript/CSS platform.

<b>Oware</b> (in <em>Akan</em> language) - a traditional game from Ghana, Africa,
is a <em>Mancala (Manquala)</em> game.

<b>Ouril</b> (aka <em>Uril, Ouri, Oril</em>) as played in the Republic of
Cabo Verde has slightly different rules compared towards Oware. Ouril is
popular in Portuguese influenced countries, too, due to former
Portuguese colonialism adopting parts of African culture.

| <img width="100%" ondragstart="return false;" alt="Playing Oware on Android tablet, own work, Oliver Merkel, Creative Commons License, This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License." src="http://omerkel.github.io/Oware/res/oware_android_tablet.jpg" /> | <img width="100%" ondragstart="return false;" alt="Screenshot of Oware session on Android mobile phone, own work, Oliver Merkel, Creative Commons License, This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License." src="http://omerkel.github.io/Oware/res/oware_android_acer_cm_s500_140421.jpg" /> |
| --- | --- |
| <i>Playing Oware on Android tablet<br />Own work, Oliver Merkel,<br /><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://omerkel.github.io/Oware/res/cc-by-nc-sa-40-88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.</i> | <i>Screenshot of Oware session on Android mobile phone<br />Own work, Oliver Merkel,<br /><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://omerkel.github.io/Oware/res/cc-by-nc-sa-40-88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.</i> |

| <img width="100%" ondragstart="return false;" alt="Playing Oware on IPad, own work, Oliver Merkel, Creative Commons License, This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License." src="http://omerkel.github.io/Oware/res/Oware-playing_Ouril_on_IPad.jpg" /> |
| --- |
| <i>Playing Oware on IPad<br />Own work, Oliver Merkel,<br /><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://omerkel.github.io/Oware/res/cc-by-nc-sa-40-88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.</i> |

There is a wide ranged class of games called <em>Mancala (Manquala)</em> games.
Often the term <em>Sowing Games</em> is used, too.

The term <em>Mancala (also Manqala, Mankala)</em> is derived from the Arabic
term <b>naqalah</b> with its meaning <b>to move</b> an object. These class of
games are well known worldwide. Nonetheless rules, structure of fields
on board and even number of players strongly varies from game to game
depending on geographic location, language and culture. Such that
eventually the same game plus rules set could be found under a
different name, too. Still the origin seem to be quite clear for
specific types at least.

As a common aspect of these <em>Mancala</em> games the basic rules set
on each player's turn is quite equal. A turn usually is performed by
picking up the whole amount of <em>tokens</em> available on a chosen
<em>container</em> on board first. Then this picked up set of mostly
one single sort of game <em>tokens</em> is <em>distributed</em> following a
<em>path</em> on board formed by such <em>containers</em> holding the <em>tokens</em>.

<em>Distribution</em> on a player's turn is called <em>sowing</em>. Thus
these corresponding games are known as <em>Sowing Games</em>, too.

These <em>containers</em> are often named <em>fields</em>,
<em>trou</em> (in <em>French</em>), <em>pits</em>, <em>holes</em>, <em>depressions</em>,
<em>houses</em> or <em>bowls</em>. Some games come with different types
of such containers. Mostly an additional non standard type
of container is just used for holding tokens representing the
current player's score. The score is reflected by the amount
of tokens contained. These larger size bowls might be named
<em>stores</em> or simply <em>Mancalas</em>. If such stores do not exist
then tokens might simply be scored by removal from game play
staying offboard for the rest of the game.

Typically the <em>tokens</em> are represented by some game <em>pieces</em>
like <em>seeds</em>, <em>beads</em>, <em>beans</em>, <em>nuts</em>, <em>stones</em>, <em>cowry shells</em>, or
any sort of <em>counters</em>. Most Mancala games use undifferentiated <em>tokens</em>.

In case of a <em>fixed sowing path</em> the bowls can be indentified or
ordered by a simple <em>index numbering</em>. You might find terminology like
a player's <em>side</em> or <em>ranks</em> or <em>rows</em> belonging to a player. In that case
the player is allowed to start his turns by picking up all <em>tokens</em> from
any non empty bowl being controlled by himself.

The rules currently realized in this software project are commonly
known as Oware, Awari, Wari, Aw&eacute;l&eacute;, Awal&eacute;,
Aual&eacute;, Ay&ograve; depending on the geographic origin,
culture and language spoken (Ghana and C&ocirc;te d'Ivoire
(Akan / Yoruba), Nigeria, Cabo Verde, plus other regions).

Additionally the options menu allows modification of the
application behavior so Ouril (also known as <em>Uril, Ouri, Oril</em>)
can be played.

These rules will be described inside the Oware application as well.

### Oware Rules

#### Game Components

This Oware implementation uses a game board with 12 bowls in
total - consisting of 2 rows having 6 bowls each. Initially
each bowl holds 4 Bonduc seeds.

| <img height="370" ondragstart="return false;" alt="Initial board position in Oware, own work, Oliver Merkel, Creative Commons License, This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License." src="http://omerkel.github.io/Oware/res/board_initial.jpg" /> |
| --- |
| <i>Initial board position in Oware, 12 bowls containing 4 Caesalpinia Bonduc seeds each, one player starts turns in lower row ranged from bowl 1 to bowl 6, other player starts turns in upper row ranged from bowl 7 to 12.<br />Own work, Oliver Merkel,<br /><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://omerkel.github.io/Oware/res/cc-by-nc-sa-40-88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.</i> |

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

A player will score (also called <em>harvesting</em>) on sowing the
last seed of his turn into an opponent's bowl holding 2 or 3 seeds
including the last one sown. This is done by taking these seeds
out of game play and scoring these. In case of previous direct
adjacent bowls (in clockwise direction) being opponent's bowls, too,
holding 2 or 3 seeds, these are taken away being scored as well.
Reaching any other bowl without any seed, just one seed or four
or more seeds will end the scoring even if any further
opponent's bowls are containing 2 or 3 seeds not being
directly adjacent.

Taking and scoring all remaining seeds of the opponent's row
completely at once is called a <em>Grand Slam</em>. Such a
<em>Grand Slam</em> is strictly forbidden in <em>Oware</em> 
and the player performing this action will lose immediately
even if the player gets the majority of total
seeds this way. Thus after each scoring at least one seed
must be left over on the opponent's row. Ending a game with
a <em>Grand Slam</em> is a forbidden move.

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

If you are looking forward to getting a typical <b>Oware game</b> (<em>Ghana</em>)
then the chance is quite high that the board shall be made of
<b>Sese (Esese, Osese) wood</b> carved manually. Such handcrafted Oware sets
are available in simple travel editions made of two similar half boards
that can be folded to hold the game tokens securely then. Often these
boards come along with decorative crafted and carved traditional themed
patterns or Akan cultural motifs.

Please be aware and respect that motifs might include <em>Adinkra</em>
symbols with partly religious meanings or background. Popular is the
use of <em>Adinkra</em> symbol <em>Gye Nyame</em> that
could translate to <em>Except God (I fear none)</em> (supremacy of God) or
<em>Nyame Ye Ohene</em> (meaning <em>God is King</em>),
<em>Akoben</em> (representing a <em>War horn</em>, symbol of valor),
<em>Sankofa</em> (meaning that it is <em>acceptable to retry</em> or
to <em>learn from the past</em> or <em>go back and get anything
you might have forgotten</em>, this sign of wisdom is often
misinterpreted as being a heart or love symbol).

| <img width="640" ondragstart="return false;" alt="Folded Oware set with traditional ancient African pattern, Own image, Oliver Merkel, Creative Commons License, This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License." src="http://omerkel.github.io/Oware/html5/src/img/folded_oware_set.jpg" /> |
| --- |
| <i>Folded Oware set with traditional ancient African pattern<br />Own image, Oliver Merkel,<br /><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://omerkel.github.io/Oware/res/cc-by-nc-sa-40-88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.</i> |

Typical tokens could be <em>nickernuts</em>. These are tropical
seeds of a shrub called <b>Bonduc</b> (Latin, botanical: <em>Caesalpinia bonduc</em>).
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

With given rules as presented here today's name of the game is <em>Oware</em>.
Oware is an <em>Akan</em> culture term. Commonly reported Oware is
related to <em>Opoku Ware I.</em> (* 1700; &dagger; 1750), a former monarch
of the <em>Ashanti</em>(<em>Asantehene</em>).

In <em>Akan</em> language <em>ware</em> means <em>to be married</em>. Various
sources exist telling legends about couples playing the game Oware
endlessly - finally marrying to continue playing.
### Ouril Rules
<em>Ouril</em> has slightly different rules compared towards Oware.

Picking up <em>single seeds</em> from own bowls is allowed only as long as none other
own bowl is holding more than single seeds.

A <em>Grand Slam</em> is allowed under certain conditions:

* The player performing a <em>Grand Slam</em> must take another turn skipping the
  opponent's turn.
* In this following turn the move must be chosen so that afterwards the opponent's row
  will hold one seed at least. If this is not possible at all then the players harvest
  the remaining seeds on their own rows.
* As an exception a <em>Grand Slam</em> is allowed without additional moves, too,
  if this way the player gets the majority of total harvested seeds winning the game.

### Contributors / Authors

<table>
  <tr>
    <td><p>Oliver Merkel,<br /><a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This image is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.    
    </p>
    </td>
    <td><img height="265" ondragstart="return false;" alt="Oliver Merkel, Creative Commons License, This image is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License." src="html5/src/img/oliver_lion.jpg" /></td>
  </tr>
</table>

_All logos, brands, and trademarks mentioned belong to their respective owners._
