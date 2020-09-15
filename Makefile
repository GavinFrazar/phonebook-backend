rebuild-ui: clean build-ui
	cp -r ../phonebook/build .

clean:
	rm -rf build

build-ui:
	cd ../phonebook && npm run build --prod

deploy: rebuild-ui
	git add . && git commit -m "Deploy build" --allow-empty && git push heroku HEAD:master --force && git reset HEAD~1 --soft

.PHONY: rebuild-ui clean build-ui deploy
