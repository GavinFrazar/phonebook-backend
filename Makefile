rebuild-ui: clean build-ui
	cp -r ../phonebook/build .

clean:
	rm -rf build

build-ui:
	cd ../phonebook && npm run build --prod

deploy:
	cp -r . ~/projects/web/phonebook-backend

.PHONY: rebuild-ui clean build-ui deploy
