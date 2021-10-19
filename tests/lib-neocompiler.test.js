jest.setTimeout(30000);
//
// index_local.html tests
//
describe('Compilation', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8080/tests/index_local.html');
  });

// --------------------

test('test_utils_hexToBytes', async () => {
  await test_utils_hexToBytes();
}); // test

async function test_utils_hexToBytes() {
  await delay(100);
  const output1 = await page.evaluate(
    () => csBigIntegerLib.hexToBytes("00010203")
  );
  expect(output1).toEqual([0,1,2,3]);    

  const output2 = await page.evaluate(
    () => csBigIntegerLib.hexToBytes("0x030201")
  );
  expect(output2).toEqual([3,2,1]);    
}

// --------------------



// --------------------
// --------------------

}); // describe

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}