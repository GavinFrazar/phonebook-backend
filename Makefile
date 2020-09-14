rebuild-ui: clean build-ui
	cp -r ../phonebook/build .

clean:
	rm -rf build

build-ui:
	cd ../phonebook && npm run build --prod

.PHONY: rebuild-ui clean build-ui
