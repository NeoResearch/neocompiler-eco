jest.setTimeout(30000);
describe('Compilation', () => {
  beforeAll(async () => {
    await page.goto('https://neocompiler.io/#!/ecolab/compilers');
  });

  test('compile 2.9.3', async () => {
    const compilerSelection = await page.$("#compilers_versions-selection-box")
    await compilerSelection.select('docker-mono-neo-compiler:2.9.3');
    await testCompilation();
  });

  test('compile latest', async () => {
    await testCompilation();
  });

});

async function testCompilation(){
    await expect(page).toClick("#compilebtn");
    await delay(10000);
    const output = await page.$eval("#codeavm", n => n.value)
    expect(output).not.toBe("");
}

function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}
