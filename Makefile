test:
	node tests/transforms/video-tweet-to-buffer-tests.js
	node tests/transforms/buffer-to-git-tests.js

pushall:
	git push origin gh-pages

lint:
	eslint .

