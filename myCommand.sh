if ps ax | grep -v grep | grep "node darshit-example.js">/dev/null ; then echo "Running"; else echo "Not Running"; fi