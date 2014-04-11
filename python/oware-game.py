#
# Copyright 2014 Oliver Merkel. All Rights Reserved.
# MIT Licensed.
#
# @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
#

from string import Template

svgTemplate = Template("""<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->
<!--
Logos and trademarks belong to their respective owners.

All source code also including code parts written in HMTL, Javascript, CSS, Python is under MIT License.

  The MIT License (MIT)

  Copyright (c) 2014 Oliver Merkel

  @author Oliver Merkel, &lt;Merkel(dot)Oliver(at)web(dot)de&gt;

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the &quot;Software&quot;), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

If not otherwise stated all game graphics (indepedend of its format) are licensed under

  Creative Commons License: Images are licensed under a
  Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
  
  * http://creativecommons.org/licenses/by-nc-sa/4.0/deed.en_US
-->
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="100%"
   height="100%"
   viewBox="0 0 1200 676"
   id="svg2"
   version="1.1"
   inkscape:version="0.48.4 r9939"
   sodipodi:docname="oware-game.svg">
  <title
     id="title3060">Oware</title>
  <defs
     id="defs4" />
  <sodipodi:namedview
     id="base"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageopacity="0.0"
     inkscape:pageshadow="2"
     inkscape:zoom="1.64"
     inkscape:cx="361.97183"
     inkscape:cy="349.49919"
     inkscape:document-units="px"
     inkscape:current-layer="layer1"
     showgrid="false"
     inkscape:window-width="1440"
     inkscape:window-height="844"
     inkscape:window-x="-4"
     inkscape:window-y="-4"
     inkscape:window-maximized="1" />
  <metadata
     id="metadata7">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title>Oware</dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1">
    <image
       y="0"
       x="0"
       id="board"
       xlink:href="board01.png"
       height="676"
       width="1200" />
    <g
       id="scores"
       transform="translate(610,325)">
      <g
         id="scoresouth"
         transform="translate(300,250)">
        <image
           sodipodi:absref="C:\community\oware\html5\src\img\\bonduc01-256.png"
           xlink:href="bonduc01-256.png"
           width="34"
           height="30"
           id="scoresouthbead" />
        <text
           sodipodi:linespacing="125%"
           id="scoresouthvalue"
           x="50"
           y="36"
           style="font-size:64px;font-style:normal;font-weight:bold;
             line-height:125%;letter-spacing:0px;word-spacing:0px;
             fill:#ffcc00;fill-opacity:1;stroke:none;
             font-family:Arial, Helvetica, sans-serif;
             -inkscape-font-specification:Sans Bold"
           xml:space="preserve">0</text>
      </g>
      <g
         transform="matrix(-1,0,0,-1,-300,-250)"
         id="scorenorth">
        <image
           sodipodi:absref="C:\community\oware\html5\src\img\\bonduc01-256.png"
           xlink:href="bonduc01-256.png"
           id="scorenorthbead"
           height="30"
           width="34" />
        <text
           sodipodi:linespacing="125%"
           id="scorenorthvalue"
           x="50"
           y="36"
           style="font-size:64px;font-style:normal;font-weight:bold;
             line-height:125%;letter-spacing:0px;word-spacing:0px;
             fill:#ffcc00;fill-opacity:1;stroke:none;
             font-family:Arial, Helvetica, sans-serif;
             -inkscape-font-specification:Sans Bold"
           xml:space="preserve">0</text>
      </g>
    </g>
${svgBoard}
  </g>
</svg>""")

bowlTemplate = Template("""      <g
         id="bowl${bowl}"
         transform="translate(${x},${y}) scale(0.57)">
${svgBonduc}${svgMoreBonduc}      </g>
""")

bonducTemplate = Template("""        <image
           width="300"
           height="287"
           xlink:href="trou-bonduc${bonduc}.png"
           id="bowl${bowl}bonduc${bonduc}"
           visibility="${visibility}"
           x="0"
           y="0" />
""")

moreBonducTemplate = Template("""        <g
           id="bowl${bowl}bonduc15plus"
           transform="translate(150,150)">
          <text
             transform="translate(-150,100)"
             sodipodi:linespacing="125%"
             id="bowl${bowl}bonduc15plus1text"
             style="font-size:72px;font-style:normal;font-weight:bold;
               line-height:125%;letter-spacing:0px;word-spacing:0px;
               fill:#ffcc00;fill-opacity:1;
               font-family:Arial, Helvetica, sans-serif;
               -inkscape-font-specification:Sans Bold"
             xml:space="preserve">16</text>
          <text
             transform="matrix(-1,0,0,-1,150,-100)"
             sodipodi:linespacing="125%"
             id="bowl${bowl}bonduc15plus2text"
             style="font-size:72px;font-style:normal;font-weight:bold;
               line-height:125%;letter-spacing:0px;word-spacing:0px;
               fill:#ffcc00;fill-opacity:1;
               font-family:Arial, Helvetica, sans-serif;
               -inkscape-font-specification:Sans Bold"
             xml:space="preserve">16</text>
        </g>
""")

rowTemplate = Template("""    <g
       id="${player}">
${svgBowls}    </g>""")

playerData = [
  ('playersouth', [ ( '00',  80, 334 ), ( '01', 256, 336 ),
                    ( '02', 433, 338 ), ( '03', 614, 336 ),
                    ( '04', 796, 340 ), ( '05', 976, 342 ), ] ),
  ('playernorth', [ ( '11',  79, 148 ), ( '10', 258, 150 ),
                    ( '09', 438, 154 ), ( '08', 618, 155 ),
                    ( '07', 800, 158 ), ( '06', 982, 160 ), ] ),
]

svgBoard = ''
for player, bowlsCoordinates in playerData:
  svgBowls = ''
  for bowl, x, y in bowlsCoordinates:
    svgBonduc = ''
    for n in range(16):
      bonduc = ('0' + str(n))[-2:]
      visibility = 'visible' if 0==n or 4==n else 'hidden'
      svgBonduc += bonducTemplate.substitute(bowl=bowl, bonduc=bonduc, visibility=visibility)
    svgMoreBonduc = moreBonducTemplate.substitute(bowl=bowl)
    svgBowls += bowlTemplate.substitute(bowl=bowl, x=x, y=y,
      svgBonduc=svgBonduc, svgMoreBonduc=svgMoreBonduc)
  svgBoard += rowTemplate.substitute(player=player, svgBowls=svgBowls)
svg = svgTemplate.substitute(svgBoard=svgBoard)
print(svg)

