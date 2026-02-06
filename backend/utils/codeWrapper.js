import fs from "fs";
import path from "path";
import { exec } from "child_process";
import os from "os";

const TEMP_DIR = path.join(os.tmpdir(), "leetcode_runner");
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const runCommand = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, { timeout: 8000 }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout.trim());
    });
  });

const normalize = (v) =>
  String(v)
    .replace(/\s+/g, "")
    .replace(/\n/g, "")
    .trim();

/* JAVA ARG BUILDER */
const toJavaArg = (arg) => {
  if (Array.isArray(arg)) {
    // 2D array
    if (Array.isArray(arg[0])) {
      return `new int[][]{${arg
        .map(r => `{${r.join(",")}}`)
        .join(",")}}`;
    }
    // 1D array
    return `new int[]{${arg.join(",")}}`;
  }
  if (typeof arg === "string") return `"${arg}"`;
  if (typeof arg === "boolean") return arg;
  return arg;
};

/* MAIN */
export const runCode = async ({ language, code, testCases }, callback) => {
  const results = [];

  for (const tc of testCases) {
    const { input, output: expected } = tc;

    try {
      let actualOutput = "";

      /* JAVASCRIPT */
      if (language === "javascript") {
        const file = path.join(TEMP_DIR, "solution.js");

        const wrapped = `
${code}
const args = ${input};
const res = solution(...args);
console.log(
  typeof res === "object" ? JSON.stringify(res) : String(res)
);
`;
        fs.writeFileSync(file, wrapped, "utf-8");
        actualOutput = await runCommand(`node "${file}"`);
      }

      /*PYTHON */
      else if (language === "python") {
        const file = path.join(TEMP_DIR, "solution.py");

        const wrapped = `
import json
${code}
args = json.loads('${input}')
res = solution(*args)
print(json.dumps(res) if isinstance(res,(list,dict)) else res)
`;
        fs.writeFileSync(file, wrapped, "utf-8");
        actualOutput = await runCommand(`python "${file}"`);
      }

      /* JAVA */
      else if (language === "java") {
        const solutionFile = path.join(TEMP_DIR, "Solution.java");
        const mainFile = path.join(TEMP_DIR, "Main.java");

        // Write Solution.java
        fs.writeFileSync(
          solutionFile,
          `
import java.util.*;
${code}
`,
          "utf-8"
        );

        const parsed = JSON.parse(input);
        const javaArgs = parsed.map(toJavaArg).join(", ");

        // Write Main.java
        fs.writeFileSync(
          mainFile,
          `
import java.util.*;
public class Main {
  public static void main(String[] args) {
    Object res = Solution.solution(${javaArgs});
    if (res instanceof int[])
      System.out.print(Arrays.toString((int[]) res));
    else if (res instanceof int[][])
      System.out.print(Arrays.deepToString((int[][]) res));
    else
      System.out.print(res);
  }
}
`,
          "utf-8"
        );

        await runCommand(`javac "${solutionFile}" "${mainFile}"`);
        actualOutput = await runCommand(`java -cp "${TEMP_DIR}" Main`);
      }

      /* RESULT*/
      const passed =
        normalize(actualOutput) === normalize(expected);

      results.push({
        input,
        expected,
        output: actualOutput,
        passed,
      });

    } catch (err) {
      results.push({
        input,
        expected,
        output: String(err),
        passed: false,
      });
    }
  }

  callback(results);
};
