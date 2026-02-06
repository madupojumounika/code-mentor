import fs from "fs";
import { exec } from "child_process";

const TMP_FILE = "./tmp/temp.js";

export const runJS = (code, testCases) =>
  new Promise(resolve => {
    const results = [];

    const wrappedCode = `
${code}

const input = JSON.parse(process.argv[2]);
try {
  const result = solution(...input);
  if (typeof result === "undefined") {
    console.log("Runtime Error");
  } else {
    console.log(JSON.stringify(result));
  }
} catch (e) {
  console.log("Runtime Error");
}
`;

    fs.writeFileSync(TMP_FILE, wrappedCode);

    let i = 0;
    const runNext = () => {
      if (i === testCases.length) return resolve(results);

      const tc = testCases[i++];
      exec(`node "${TMP_FILE}" '${tc.input}'`, (_, stdout) => {
        results.push({
          input: tc.input,
          expected: tc.output,
          output: stdout.trim()
        });
        runNext();
      });
    };

    runNext();
  });
