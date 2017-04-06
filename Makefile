test:
	node tests/transforms/video-tweet-to-buffer-tests.js

pushall:
	git push origin gh-pages

lint:
	eslint .

