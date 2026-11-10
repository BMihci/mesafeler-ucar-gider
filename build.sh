cd "$(dirname "$0")/src"
python3 -c "import sys;h=open('p1_head.html').read();g=open('gh.css').read();i=h.rindex('</style>');sys.stdout.write(h[:i]+g+h[i:])" > /tmp/_head.html; cat /tmp/_head.html p2_body.html p3_core.js p4_art.js p4b_items.js p4c_ui.js p5a_game.js p5c_saga.js p5d_economy.js p5b_systems.js p6_tail.html > ../index.html
cd ..; sed -n '/^<script>/,/^<\/script>/p' index.html | sed '1d;$d' > /tmp/_game.js && node --check /tmp/_game.js && echo SYNTAX_OK
