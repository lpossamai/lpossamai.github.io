.PHONY: help serve check clean

PORT ?= 8080
PYTHON ?= python3

help:
	@printf "Available targets:\n"
	@printf "  make serve       Start a local webserver on http://127.0.0.1:%s\n" "$(PORT)"
	@printf "  make check       Run lightweight static checks\n"
	@printf "  make clean       Remove local browser/test artifacts\n"
	@printf "\nOptions:\n"
	@printf "  PORT=3000        Override the default server port\n"

serve:
	@printf "Serving http://127.0.0.1:%s\n" "$(PORT)"
	$(PYTHON) -m http.server $(PORT)

check:
	node --check terminal.js
	$(PYTHON) -c 'from html.parser import HTMLParser; from pathlib import Path; p = HTMLParser(); p.feed(Path("index.html").read_text()); print("html parser: ok")'

clean:
	rm -rf .playwright-cli output
