include config.mk

SSHCMD = ssh $(USER)@$(SERVER)
PRIVSSHCMD = ssh $(PRIVUSER)@$(SERVER)
APPDIR = /opt/$(PROJECTNAME)
HOMEDIR = $(shell pwd)

test:
	node tests/transforms/video-tweet-to-buffer-tests.js
	node tests/transforms/buffer-to-git-tests.js

pushall: update-server
	git push origin gh-pages

lint:
	eslint .

update-server: sync restart-service

initial-setup: initial-sync install-service start-service

initial-sync:
	$(PRIVSSHCMD) "sudo mkdir -p $(APPDIR) && sudo chown $(USER):$(GROUP) $(APPDIR)"
	make sync

sync:
	rsync -a $(HOMEDIR) $(USER)@$(SERVER):/opt/ --exclude node_modules/ --exclude data/
	$(SSHCMD) "cd $(APPDIR) && npm install"

install-service:
	$(PRIVSSHCMD) "cp $(APPDIR)/$(PROJECTNAME).service /etc/systemd/system && \
	systemctl enable $(PROJECTNAME)"

start-service:
	$(PRIVSSHCMD) "service $(PROJECTNAME) start"

restart-service:
	$(PRIVSSHCMD) "service $(PROJECTNAME) restart"

stop-service:
	$(PRIVSSHCMD) "service $(PROJECTNAME) stop"

check-status:
	$(SSHCMD) "systemctl status $(PROJECTNAME)"

check-log:
	$(SSHCMD) "journalctl -r -u $(PROJECTNAME)" | more
