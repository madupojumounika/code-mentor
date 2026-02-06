import fs from "fs";
import { exec } from "child_process";

const TMP_FILE = "./tmp/temp.py";

export const runPython = (code, testCases) =>
  new Promise(resolve => {
    const results = [];

    const wrappedCode = `
import json, sys

${code}

try:
    args = json.loads(sys.argv[1])
    res = solution(*args)
    if res is None:
        print("Runtime Error")
    else:
        print(json.dumps(res))
except:
    print("Runtime Error")
`;

    fs.writeFileSync(TMP_FILE, wrappedCode);

    let i = 0;
    const runNext = () => {
      if (i === testCases.length) return resolve(results);

      const tc = testCases[i++];
      exec(`python "${TMP_FILE}" '${tc.input}'`, (_, stdout) => {
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
