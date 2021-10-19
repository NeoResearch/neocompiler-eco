## neocompiler-eco tests

This folder intends to include testing for libraries which are part of neocompiler-eco project.

For now, `./make-test.sh` will execute:

- `npm install` to get `jest`, `puppeteer` and `http-server`
- `npm run serve` inside `nohup` to host testing on `http://localhost:8080/tests/index_local.html`
- run tests on `lib-neocompiler.test.js`

Currently, the testing is about few helpers and `csbiginteger` external library, written in C++/WASM.

## More testing

Feel free to suggest more testing, we need that!

## Known issues

Note that `dist/` folder is replicated on `tests/` and root `/`.
This is because of wasm loader of `csbiginteger`... must fix that to prevent duplication.

